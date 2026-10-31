export interface ServerFareRate {
  category: string;
  ratePerKm: number;
  driverBattaPerDay: number;
  nightAllowancePerNight: number;
  minKmPerDay: number;
}

export const SERVER_FARE_RATES: Record<string, ServerFareRate> = {
  Hatchback: {
    category: "Hatchback",
    ratePerKm: 12,
    driverBattaPerDay: 500,
    nightAllowancePerNight: 200,
    minKmPerDay: 250,
  },
  Sedan: {
    category: "Sedan",
    ratePerKm: 14,
    driverBattaPerDay: 500,
    nightAllowancePerNight: 200,
    minKmPerDay: 250,
  },
  SUV: {
    category: "SUV",
    ratePerKm: 17,
    driverBattaPerDay: 600,
    nightAllowancePerNight: 250,
    minKmPerDay: 250,
  },
  "Premium SUV": {
    category: "Premium SUV",
    ratePerKm: 21,
    driverBattaPerDay: 700,
    nightAllowancePerNight: 300,
    minKmPerDay: 250,
  },
  "Tempo Traveller": {
    category: "Tempo Traveller",
    ratePerKm: 24,
    driverBattaPerDay: 800,
    nightAllowancePerNight: 350,
    minKmPerDay: 250,
  },
  "Luxury Van": {
    category: "Luxury Van",
    ratePerKm: 40,
    driverBattaPerDay: 1000,
    nightAllowancePerNight: 400,
    minKmPerDay: 250,
  },
  Luxury: {
    category: "Luxury",
    ratePerKm: 86,
    driverBattaPerDay: 1500,
    nightAllowancePerNight: 500,
    minKmPerDay: 250,
  },
};

/**
 * Maps vehicle id or name to fare category per Step 6.2.f:
 * - Swift -> Hatchback
 * - Etios, Aura -> Sedan
 * - Ertiga, XL6, Marazzo -> SUV
 * - Innova Crysta, Innova Hycross, Toyota Innova -> Premium SUV
 * - 12/14 seater AC van -> Tempo Traveller
 * - 12/17 seater luxury van -> Luxury Van
 * - BMW 5 Series, Mercedes-Benz E-Class, Audi A6 -> Luxury
 */
export function mapVehicleToFareCategory(vehicleIdOrName: string): string {
  const norm = (vehicleIdOrName || "").toLowerCase();
  if (norm.includes("swift")) return "Hatchback";
  if (norm.includes("etios") || norm.includes("aura") || norm === "sedan") return "Sedan";
  if (norm.includes("ertiga") || norm.includes("xl6") || norm.includes("marazzo") || norm === "suv") return "SUV";
  if (norm.includes("crysta") || norm.includes("hycross") || norm.includes("innova") || norm === "premium suv") return "Premium SUV";
  if (norm.includes("van14") || norm.includes("14") || norm.includes("tempo") || norm.includes("traveller")) return "Tempo Traveller";
  if (norm.includes("urbania") || norm.includes("van") || norm === "luxury van") return "Luxury Van";
  if (norm.includes("bmw") || norm.includes("mercedes") || norm.includes("audi") || norm === "luxury") return "Luxury";
  return "Sedan";
}

