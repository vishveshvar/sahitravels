export interface Vehicle {
  id: string;
  name: string;
  category: "economy" | "mpv" | "group" | "luxury";
  seats: string;
  image: string;
  avifImage?: string;
  alt: string;
  chips: string[];
  speech: string;
  flip: boolean;
}

export const CATEGORIES = [
  { id: "economy", label: "Economy" },
  { id: "mpv", label: "MPV" },
  { id: "group", label: "Group" },
  { id: "luxury", label: "Luxury" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export const FLEET: Vehicle[] = [
  {
    id: "swift",
    name: "Maruti Swift",
    category: "economy",
    seats: "5 seats",
    image: "/assets/img/fleet/swift.webp",
    avifImage: "/assets/img/fleet/swift.avif",
    alt: "Maruti Swift on a blush studio backdrop",
    chips: ["Airport", "City"],
    speech: "Quick city hops or an airport run? The Swift is ready.",
    flip: true,
  },
  {
    id: "etios",
    name: "Toyota Etios",
    category: "economy",
    seats: "4 seats",
    image: "/assets/img/fleet/etios.webp",
    avifImage: "/assets/img/fleet/etios.avif",
    alt: "Toyota Etios on a blush studio backdrop",
    chips: ["Airport", "City"],
    speech: "Comfortable, reliable and roomy for four passengers.",
    flip: false,
  },
  {
    id: "aura",
    name: "Hyundai Aura",
    category: "economy",
    seats: "4 seats",
    image: "/assets/img/fleet/aura.webp",
    avifImage: "/assets/img/fleet/aura.avif",
    alt: "Hyundai Aura on a blush studio backdrop",
    chips: ["Airport", "City"],
    speech: "Smooth city rides and neat boot space for luggage.",
    flip: false,
  },
  {
    id: "ertiga",
    name: "Maruti Ertiga",
    category: "mpv",
    seats: "7 seats",
    image: "/assets/img/fleet/ertiga.webp",
    avifImage: "/assets/img/fleet/ertiga.avif",
    alt: "Maruti Ertiga on a blush studio backdrop",
    chips: ["Family", "Outstation"],
    speech: "Family trip or a team outing? Room for everyone.",
    flip: true,
  },
  {
    id: "xl6",
    name: "Maruti XL6",
    category: "mpv",
    seats: "6 seats",
    image: "/assets/img/fleet/xl6.webp",
    avifImage: "/assets/img/fleet/xl6.avif",
    alt: "Maruti XL6 on a blush studio backdrop",
    chips: ["Family", "Outstation"],
    speech: "Captain seats in the middle make every highway mile easy.",
    flip: false,
  },
  {
    id: "marazzo",
    name: "Mahindra Marazzo",
    category: "mpv",
    seats: "7 seats",
    image: "/assets/img/fleet/marazzo.webp",
    avifImage: "/assets/img/fleet/marazzo.avif",
    alt: "Mahindra Marazzo on a blush studio backdrop",
    chips: ["Family", "Outstation"],
    speech: "Quiet cabin, roof-mounted AC and space for the whole family.",
    flip: true,
  },
  {
    id: "innova-crysta",
    name: "Toyota Innova Crysta",
    category: "mpv",
    seats: "7 seats",
    image: "/assets/img/fleet/innova-crysta.webp",
    avifImage: "/assets/img/fleet/innova-crysta.avif",
    alt: "Toyota Innova Crysta on a blush studio backdrop",
    chips: ["Family", "Outstation"],
    speech: "The highway king — plush ride, reclining seats, and effortless power.",
    flip: true,
  },
  {
    id: "toyota-innova",
    name: "Toyota Innova",
    category: "mpv",
    seats: "7 seats",
    image: "/assets/img/fleet/toyota-innova.webp",
    avifImage: "/assets/img/fleet/toyota-innova.avif",
    alt: "Toyota Innova on a blush studio backdrop",
    chips: ["Family", "Outstation"],
    speech: "Comfortable seating for seven on longer journeys.",
    flip: true,
  },
  {
    id: "van14",
    name: "12/14 Seater AC Van",
    category: "group",
    seats: "14 seats",
    image: "/assets/img/fleet/van14.webp",
    avifImage: "/assets/img/fleet/van14.avif",
    alt: "12/14 Seater AC Van on a blush studio backdrop",
    chips: ["Group", "Tour"],
    speech: "Travelling as a group? Everyone and their luggage fits comfortably.",
    flip: false,
  },
  {
    id: "bmw",
    name: "BMW 5 Series",
    category: "luxury",
    seats: "5 seats",
    image: "/assets/img/fleet/bmw.webp",
    avifImage: "/assets/img/fleet/bmw.avif",
    alt: "BMW 5 Series on a blush studio backdrop",
    chips: ["VIP", "Corporate"],
    speech: "Arriving somewhere special? Executive comfort, refined and swift.",
    flip: false,
  },
  {
    id: "mercedes",
    name: "Mercedes-Benz E-Class",
    category: "luxury",
    seats: "5 seats",
    image: "/assets/img/fleet/mercedes.webp",
    avifImage: "/assets/img/fleet/mercedes.avif",
    alt: "Mercedes-Benz E-Class on a blush studio backdrop",
    chips: ["VIP", "Corporate"],
    speech: "Pure luxury and prestige for VIP transfers and celebrations.",
    flip: false,
  },
  {
    id: "audi",
    name: "Audi A6",
    category: "luxury",
    seats: "5 seats",
    image: "/assets/img/fleet/audi.webp",
    avifImage: "/assets/img/fleet/audi.avif",
    alt: "Audi A6 on a blush studio backdrop",
    chips: ["VIP", "Corporate"],
    speech: "Understated luxury with cutting-edge executive refinement.",
    flip: false,
  },
];

