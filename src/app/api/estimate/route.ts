import { NextRequest, NextResponse } from "next/server";
import { SERVER_FARE_RATES, mapVehicleToFareCategory } from "@/server/data/fareRates";
import { getFallbackRouteDistance } from "@/server/data/routes";
import { PLACE_ALIASES } from "@/data/placeAliases";

const NIGHT_SLOTS = ["6–9 PM", "9 PM–12 AM", "12–4 AM"];

function isNightSlot(slot: string): boolean {
  if (!slot) return false;
  const norm = slot.replace("–", "-").trim();
  return NIGHT_SLOTS.some((ns) => ns.replace("–", "-") === norm);
}

function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number | null {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

interface Coords {
  lat: number;
  lng: number;
}

function resolvePlaceCoords(
  place: unknown,
  placeName: string,
  extraCoords?: unknown
): Coords | null {
  if (Array.isArray(extraCoords) && extraCoords.length >= 2) {
    const [c1, c2] = extraCoords;
    if (typeof c1 === "number" && typeof c2 === "number") {
      // In GeoJSON / OSRM convention [lng, lat]
      if (c1 > 40 && c2 <= 40) return { lng: c1, lat: c2 };
      // In [lat, lng] convention
      if (c2 > 40 && c1 <= 40) return { lng: c2, lat: c1 };
      return { lng: c1, lat: c2 };
    }
  }

  if (
    place &&
    typeof place === "object" &&
    "lat" in place &&
    "lng" in place &&
    typeof (place as Coords).lat === "number" &&
    typeof (place as Coords).lng === "number" &&
    (place as Coords).lat !== 0 &&
    (place as Coords).lng !== 0
  ) {
    return { lat: (place as Coords).lat, lng: (place as Coords).lng };
  }

  const query = (placeName || "").toLowerCase().trim();
  if (!query) return null;

  // Search local place database
  const match = PLACE_ALIASES.find((p) => {
    const pName = p.name.toLowerCase();
    const pId = p.id.toLowerCase();
    if (query === pName || query === pId) return true;
    if (p.aliases.some((a) => query === a.toLowerCase())) return true;
    if (query.includes(pName) || pName.includes(query)) return true;
    return false;
  });

  if (match && match.lat && match.lng) {
    return { lat: match.lat, lng: match.lng };
  }

  return null;
}

async function fetchOsrmDistance(
  fromLng: number,
  fromLat: number,
  toLng: number,
  toLat: number
): Promise<number | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=false`;
    const res = await fetch(osrmUrl, {
      signal: controller.signal,
      headers: { "User-Agent": "SahiTravels-BookingApp/1.0" },
    });
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      if (data?.routes?.[0]?.distance) {
        return Math.round(data.routes[0].distance / 1000);
      }
    }
  } catch {
    // Graceful fallback
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tripType,
      from,
      to,
      pickup,
      drop,
      fromCoords: bodyFromCoords,
      toCoords: bodyToCoords,
      pickupCoords,
      dropCoords,
      travelDate,
      returnDate,
      timeSlot,
      vehicleId,
      vehicleCategory,
    } = body;

    const fromInput = from ?? pickup;
    const toInput = to ?? drop;

    const fromName = typeof fromInput === "string" ? fromInput.trim() : fromInput?.name?.trim() || "";
    const toName = typeof toInput === "string" ? toInput.trim() : toInput?.name?.trim() || "";
    const fromCountry = typeof fromInput === "object" ? fromInput?.countryCode || "IN" : "IN";
    const toCountry = typeof toInput === "object" ? toInput?.countryCode || "IN" : "IN";

    if (!fromName || !toName) {
      return NextResponse.json({
        type: "team-to-confirm",
        message: "Our team will calculate the exact fare for this route and contact you.",
        indicative: true,
      });
    }

    // Rule 2.a: If either place is outside India (country code not "IN")
    if (fromCountry !== "IN" || toCountry !== "IN") {
      return NextResponse.json({
        type: "team-to-confirm",
        message: "Our team will quote international trips.",
        indicative: true,
      });
    }

    // Resolve coordinates for accurate road routing
    const fromCoords = resolvePlaceCoords(fromInput, fromName, bodyFromCoords ?? pickupCoords);
    const toCoords = resolvePlaceCoords(toInput, toName, bodyToCoords ?? dropCoords);

    // Rule 2.b: If both places in India and in same city (same normalized name, or distance < 5 km)
    const normFromName = fromName.toLowerCase().replace(/ airport.*$/i, "").trim();
    const normToName = toName.toLowerCase().replace(/ airport.*$/i, "").trim();
    let straightLineDist: number | null = null;
    if (fromCoords && toCoords) {
      straightLineDist = haversineDistanceKm(fromCoords.lat, fromCoords.lng, toCoords.lat, toCoords.lng);
    }

    if (
      normFromName === normToName ||
      (straightLineDist !== null && straightLineDist < 5)
    ) {
      return NextResponse.json({
        type: "local",
        message: "Local trips are priced by package. Our team will confirm.",
        indicative: true,
      });
    }

    // Rule 2.c: Actual road distance routing via OSRM with fallback
    let distance: number | null = null; // Outbound distance
    let returnDistance: number | null = null; // Return distance for round trips
    let distanceSource = "fallback";

    const tripTypeNorm = (tripType || "").toString().toLowerCase().trim();
    const isRoundTrip =
      tripTypeNorm === "round trip" ||
      tripTypeNorm === "round" ||
      tripTypeNorm === "round-trip" ||
      tripTypeNorm === "roundtrip";

    // Attempt real road routing when coordinates available
    if (fromCoords && toCoords) {
      distance = await fetchOsrmDistance(fromCoords.lng, fromCoords.lat, toCoords.lng, toCoords.lat);
      if (distance !== null) {
        distanceSource = "osrm";
        if (isRoundTrip) {
          // Calculate return road distance if route differs
          const retDist = await fetchOsrmDistance(toCoords.lng, toCoords.lat, fromCoords.lng, fromCoords.lat);
          returnDistance = retDist !== null ? retDist : distance;
        }
      }
    }

    // If OSRM didn't resolve or was unavailable, use fallback table
    if (distance === null) {
      const fallbackDist = getFallbackRouteDistance(fromName, toName);
      if (fallbackDist !== null) {
        distance = fallbackDist;
        returnDistance = isRoundTrip ? fallbackDist : null;
        distanceSource = "table";
      }
    }

    if (!distance) {
      return NextResponse.json({
        type: "team-to-confirm",
        message: "Our team will calculate the exact fare for this route and contact you.",
        indicative: true,
      });
    }

    // Category mapping
    const categoryKey = mapVehicleToFareCategory(vehicleCategory || vehicleId || "Sedan");
    const rate = SERVER_FARE_RATES[categoryKey] || SERVER_FARE_RATES["Sedan"];

    // Rule 2.d: Pricing calculations
    let days = 1;
    if (isRoundTrip) {
      if (travelDate && returnDate) {
        const d1 = new Date(travelDate + "T00:00:00");
        const d2 = new Date(returnDate + "T00:00:00");
        const diffTime = d2.getTime() - d1.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        days = Math.max(1, (diffDays >= 0 ? diffDays : 0) + 1);
      } else {
        days = 1;
      }
    }

    const totalKm = isRoundTrip
      ? distance + (returnDistance ?? distance)
      : distance;
    // Strictly follow required fare formula:
    // Total Distance = Outbound Distance + Return Distance
    // Distance Charge = Total Distance × Applicable Vehicle Rate Per Kilometer
    // Estimated Total = Distance Charge
    // Do not include driver batta/allowance or artificial minKmPerDay multipliers in the displayed estimate
    const billableKm = totalKm;
    const distanceCharge = Math.round(totalKm * rate.ratePerKm);
    const driverBatta = rate.driverBattaPerDay * days;

    const isNight = isNightSlot(timeSlot);
    let nights = 0;
    let nightAllowance = 0;
    if (isNight) {
      nights = Math.max(1, days - 1);
      nightAllowance = rate.nightAllowancePerNight * nights;
    }

    // Displayed estimate total is based strictly on the applicable distance charge
    const total = distanceCharge;

    const distanceText = isRoundTrip
      ? `About ${totalKm} km road trip (${distance} km outbound + ${returnDistance ?? distance} km return)`
      : `About ${distance} km by road`;

    return NextResponse.json({
      type: "calculated",
      total,
      estimatedFare: total,
      tripType: isRoundTrip ? "round" : "one-way",
      distance,
      distanceKm: distance,
      returnDistance: isRoundTrip ? returnDistance : undefined,
      returnDistanceKm: isRoundTrip ? returnDistance : undefined,
      distanceText,
      distanceSource,
      totalKm,
      billableKm,
      days,
      nights,
      categoryKey,
      ratePerKm: rate.ratePerKm,
      distanceCharge,
      driverBatta,
      nightAllowance,
      indicative: true,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to calculate estimate";
    return NextResponse.json(
      { type: "error", message: errorMsg },
      { status: 500 }
    );
  }
}
