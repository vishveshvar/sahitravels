export interface Place {
  name: string;
  region: string;
  keywords: string[];
  type: "city" | "airport" | "international";
}

export const PLACES: Place[] = [
  {
    name: "Chennai",
    region: "Tamil Nadu",
    keywords: ["madras", "chennai airport", "tambaram", "t nagar", "guindy"],
    type: "city",
  },
  {
    name: "Bengaluru",
    region: "Karnataka",
    keywords: ["bangalore", "bengaluru airport", "whitefield", "electronic city"],
    type: "city",
  },
  {
    name: "Trichy",
    region: "Tamil Nadu",
    keywords: ["tiruchirappalli", "trichy airport"],
    type: "city",
  },
  {
    name: "Madurai",
    region: "Tamil Nadu",
    keywords: ["madurai airport", "meenakshi amman"],
    type: "city",
  },
  {
    name: "Coimbatore",
    region: "Tamil Nadu",
    keywords: ["coimbatore airport", "kovai"],
    type: "city",
  },
  {
    name: "Pondicherry",
    region: "Puducherry",
    keywords: ["puducherry", "auroville"],
    type: "city",
  },
  {
    name: "Tirupati",
    region: "Andhra Pradesh",
    keywords: ["tirupati airport", "tirumala"],
    type: "city",
  },
  {
    name: "Hyderabad",
    region: "Telangana",
    keywords: ["hyderabad airport", "secunderabad"],
    type: "city",
  },
  {
    name: "Kochi",
    region: "Kerala",
    keywords: ["cochin", "kochi airport", "ernakulam"],
    type: "city",
  },
  {
    name: "Mysuru",
    region: "Karnataka",
    keywords: ["mysore"],
    type: "city",
  },
  {
    name: "Dubai",
    region: "United Arab Emirates",
    keywords: ["dxb", "uae", "dubai airport"],
    type: "international",
  },
  {
    name: "Bangkok",
    region: "Thailand",
    keywords: ["bkk", "suvarnabhumi", "don mueang"],
    type: "international",
  },
  {
    name: "Brunei",
    region: "Brunei",
    keywords: ["bandar seri begawan", "bwk"],
    type: "international",
  },
];

export function searchPlaces(rawQuery: string): Place[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];

  const groupA: Place[] = []; // Name starts with query
  const groupB: Place[] = []; // Keyword starts with query
  const groupC: Place[] = []; // Name or keyword contains query

  for (const place of PLACES) {
    const nameLower = place.name.toLowerCase();
    const keywordsLower = place.keywords.map((k) => k.toLowerCase());

    if (nameLower.startsWith(query)) {
      groupA.push(place);
    } else if (keywordsLower.some((k) => k.startsWith(query))) {
      groupB.push(place);
    } else if (
      nameLower.includes(query) ||
      keywordsLower.some((k) => k.includes(query))
    ) {
      groupC.push(place);
    }
  }

  const sortAlphabetical = (a: Place, b: Place) => a.name.localeCompare(b.name);
  groupA.sort(sortAlphabetical);
  groupB.sort(sortAlphabetical);
  groupC.sort(sortAlphabetical);

  return [...groupA, ...groupB, ...groupC].slice(0, 6);
}

export function findPlaceByName(name: string): Place | undefined {
  const q = name.trim().toLowerCase();
  if (!q) return undefined;
  return PLACES.find(
    (p) =>
      p.name.toLowerCase() === q ||
      p.keywords.some((k) => k.toLowerCase() === q)
  );
}

