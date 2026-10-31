import { NextRequest, NextResponse } from "next/server";
import { SERVER_FARE_RATES, mapVehicleToFareCategory } from "@/server/data/fareRates";
import { getFallbackRouteDistance } from "@/server/data/routes";

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tripType,
      from,
      to,
      travelDate,
      returnDate,
      timeSlot,
      vehicleId,
      vehicleCategory,
    } = body;

    const fromName = typeof from === "string" ? from.trim() : from?.name?.trim() || "";
    const toName = typeof to === "string" ? to.trim() : to?.name?.trim() || "";
    const fromCountry = typeof from === "object" ? from?.countryCode || "IN" : "IN";
    const toCountry = typeof to === "object" ? to?.countryCode || "IN" : "IN";

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

    // Rule 2.b: If both places in India and in same city (same normalized name, or distance < 5 km)
    const normFromName = fromName.toLowerCase().replace(/ airport.*$/i, "").trim();
    const normToName = toName.toLowerCase().replace(/ airport.*$/i, "").trim();
    let straightLineDist: number | null = null;
    if (typeof from === "object" && typeof to === "object" && from.lat && to.lat) {
      straightLineDist = haversineDistanceKm(from.lat, from.lng, to.lat, to.lng);
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

    // Rule 2.c: Road distance routing with fallback
    let distance: number | null = null;
    let distanceSource = "fallback";

    // Attempt routing provider if coordinates available
    if (typeof from === "object" && typeof to === "object" && from.lat && from.lng && to.lat && to.lng) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 1600);
        const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=false`;
        const osrmRes = await fetch(osrmUrl, { signal: controller.signal });
        clearTimeout(timeout);
        if (osrmRes.ok) {
          const osrmData = await osrmRes.json();
          if (osrmData?.routes?.[0]?.distance) {
            distance = Math.round(osrmData.routes[0].distance / 1000);
            distanceSource = "osrm";
          }
        }
      } catch {
        // Fallback to table
      }
    }

    // If OSRM didn't resolve or was not used, use the fallback table
    const fallbackDist = getFallbackRouteDistance(fromName, toName);
    if (fallbackDist !== null) {
      distance = fallbackDist;
      distanceSource = "table";
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

    // Rule 2.d: Totals
    const isRoundTrip = tripType === "Round trip";
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

    const totalKm = isRoundTrip ? distance * 2 : distance;
    const billableKm = Math.max(totalKm, rate.minKmPerDay * days);

    const distanceCharge = billableKm * rate.ratePerKm;
    const driverBatta = rate.driverBattaPerDay * days;

    const isNight = isNightSlot(timeSlot);
    let nights = 0;
    let nightAllowance = 0;
    if (isNight) {
      nights = Math.max(1, days - 1);
      nightAllowance = rate.nightAllowancePerNight * nights;
    }

    const total = Math.round(distanceCharge + driverBatta + nightAllowance);

    return NextResponse.json({
      type: "calculated",
      total,
      distance,
      distanceText: `About ${distance} km by road`,
      distanceSource,
      totalKm,
      billableKm,
      days,
      nights,
      categoryKey,
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
