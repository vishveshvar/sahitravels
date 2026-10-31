/**
 * Fleet Statistics Configuration
 *
 * PLACEHOLDER NOTICE:
 * baseDate, kmPerSecond and liveTotalUrl are placeholders to be confirmed by the owner.
 */
export interface FleetStats {
  baseKm: number;
  baseDate: string;
  kmPerSecond: number;
  nextMilestoneKm: number;
  liveTotalUrl: string | null;
}

export const FLEET_STATS: FleetStats = {
  // Total kilometres confirmed by the owner, as of baseDate. PLACEHOLDER: owner to confirm.
  baseKm: 2000000,
  // The moment baseKm was accurate. PLACEHOLDER: owner to confirm.
  baseDate: "2026-10-31T00:00:00+05:30",
  // Average kilometres added per second, derived from 20,00,000 km over 26 years (about 0.00244).
  // Keep this consistent with the published history figure. Replace it with the real rate from trip records.
  kmPerSecond: 0.00244,
  nextMilestoneKm: 2500000,
  // OPTIONAL. Leave as null until the owner provides a trip-total endpoint.
  // If set, the page fetches the running total every 60 seconds and continues counting from that value.
  liveTotalUrl: null
};
