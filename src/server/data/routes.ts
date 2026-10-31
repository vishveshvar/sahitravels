// Approximate road distances. Verify before launch.

export const FALLBACK_ROUTES: Record<string, number> = {
  "Bengaluru–Chennai": 350,
  "Chennai–Pondicherry": 160,
  "Chennai–Trichy": 330,
  "Chennai–Madurai": 460,
  "Chennai–Coimbatore": 505,
  "Chennai–Tirupati": 140,
};

export function getFallbackRouteDistance(placeA: string, placeB: string): number | null {
  const normA = (placeA || "").trim();
  const normB = (placeB || "").trim();
  if (!normA || !normB) return null;

  // Normalize city names (e.g. "Tiruchirappalli" -> "Trichy", "Puducherry" -> "Pondicherry")
  const cleanName = (n: string) => {
    const l = n.toLowerCase();
    if (l.includes("chennai") || l.includes("madras")) return "Chennai";
    if (l.includes("bengaluru") || l.includes("bangalore")) return "Bengaluru";
    if (l.includes("trichy") || l.includes("tiruchirappalli") || l.includes("tiruchi")) return "Trichy";
    if (l.includes("pondicherry") || l.includes("puducherry")) return "Pondicherry";
    if (l.includes("madurai")) return "Madurai";
    if (l.includes("coimbatore") || l.includes("kovai")) return "Coimbatore";
    if (l.includes("tirupati")) return "Tirupati";
    return n;
  };

  const a = cleanName(normA);
  const b = cleanName(normB);

  const sorted = [a, b].sort((x, y) => x.localeCompare(y, undefined, { sensitivity: "base" }));
  const targetKey = `${sorted[0]}-${sorted[1]}`.toLowerCase().replace("–", "-");

  for (const [routeKey, dist] of Object.entries(FALLBACK_ROUTES)) {
    const k = routeKey.toLowerCase().replace("–", "-");
    if (k === targetKey) {
      return dist;
    }
  }

  return null;
}

