import { NextRequest, NextResponse } from "next/server";
import { PLACE_ALIASES, PlaceItem } from "@/data/placeAliases";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const rawQ = searchParams.get("q") || "";
  const query = rawQ.trim().toLowerCase();

  if (query.length < 2) {
    return NextResponse.json([]);
  }

  // 1. Match against local place aliases
  const groupA: PlaceItem[] = []; // Name starts with query
  const groupB: PlaceItem[] = []; // Alias starts with query
  const groupC: PlaceItem[] = []; // Name or alias contains query

  for (const place of PLACE_ALIASES) {
    const nameLower = place.name.toLowerCase();
    const aliasesLower = place.aliases.map((a) => a.toLowerCase());

    if (nameLower.startsWith(query)) {
      groupA.push(place);
    } else if (aliasesLower.some((a) => a.startsWith(query))) {
      groupB.push(place);
    } else if (
      nameLower.includes(query) ||
      aliasesLower.some((a) => a.includes(query))
    ) {
      groupC.push(place);
    }
  }

  const sortAlpha = (a: PlaceItem, b: PlaceItem) => a.name.localeCompare(b.name);
  groupA.sort(sortAlpha);
  groupB.sort(sortAlpha);
  groupC.sort(sortAlpha);

  const localMatches: PlaceItem[] = [...groupA, ...groupB, ...groupC];

  // 2. Fetch from worldwide geocoding provider (Photon / OpenStreetMap API) with 1.8s timeout
  let externalMatches: PlaceItem[] = [];
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1800);

    const geoRes = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=10`,
      {
        signal: controller.signal,
        headers: {
          "User-Agent": "SahiTravels-BookingApp/1.0",
        },
      }
    );
    clearTimeout(timeout);

    if (geoRes.ok) {
      const data = await geoRes.json();
      if (Array.isArray(data?.features)) {
        externalMatches = data.features
          .map((f: Record<string, unknown>, idx: number) => {
            const props = (f.properties as Record<string, string | undefined>) || {};
            const geometry = f.geometry as { coordinates?: [number, number] } | undefined;
            const coords = geometry?.coordinates || [0, 0];
            const name = props.name || props.city || "";
            if (!name) return null;

            const region = props.state || props.county || props.district || props.city || "";
            const country = props.country || "";
            const countryCode = (props.countrycode || "XX").toUpperCase();
            const osmType = props.osm_value || props.type || "locality";
            const placeType =
              osmType === "aerodrome" || osmType === "airport"
                ? "airport"
                : osmType === "city" || osmType === "town"
                ? "city"
                : "locality";

            return {
              id: `geo-${props.osm_id || idx}-${name}`,
              name,
              region,
              country,
              countryCode,
              type: placeType,
              lat: coords[1] || 0,
              lng: coords[0] || 0,
              aliases: [name.toLowerCase()],
            } as PlaceItem;
          })
          .filter(Boolean);
      }
    }
  } catch {
    // If external geocoder fails or times out, proceed seamlessly with local database
  }

  // 3. Merge and deduplicate by place id or name + country
  const seen = new Set<string>();
  const merged: PlaceItem[] = [];

  for (const item of [...localMatches, ...externalMatches]) {
    const key = `${item.name.toLowerCase()}|${item.country.toLowerCase()}`;
    if (!seen.has(key) && !seen.has(item.id)) {
      seen.add(key);
      seen.add(item.id);
      merged.push(item);
    }
    if (merged.length >= 8) break;
  }

  return NextResponse.json(merged);
}
