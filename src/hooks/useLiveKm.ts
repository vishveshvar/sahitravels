"use client";

import { useEffect, useState } from "react";
import { FLEET_STATS } from "@/config/fleetStats";

/**
 * Calculates current total kilometres with decimal precision from time elapsed since baseDate.
 * Calculation: kmNow = baseKm + elapsedSeconds × kmPerSecond,
 * where elapsedSeconds = (Date.now() − Date.parse(baseDate)) / 1000.
 * Round only to one decimal place for display: Math.round(kmNow × 10) / 10.
 */
function computeKmFromBase(baseKm: number, baseDateMs: number, kmPerSecond: number): number {
  const elapsedSeconds = Math.max(0, (Date.now() - baseDateMs) / 1000);
  const rawKm = baseKm + elapsedSeconds * kmPerSecond;
  return Math.round(rawKm * 10) / 10;
}

export function useLiveKm(): number {
  // Prerender-safe initial state (elapsed = 0)
  const [km, setKm] = useState<number>(() => FLEET_STATS.baseKm);

  useEffect(() => {
    let isMounted = true;
    let baseKm = FLEET_STATS.baseKm;
    let baseDateMs = Date.parse(FLEET_STATS.baseDate);

    // If liveTotalUrl is set: fetch on mount and every 60 seconds
    let fetchTimer: NodeJS.Timeout | null = null;
    const liveUrl = FLEET_STATS.liveTotalUrl;
    if (liveUrl) {
      const fetchLiveTotal = async () => {
        try {
          const res = await fetch(liveUrl);
          if (!res.ok) return;
          const data = await res.json();
          const total =
            typeof data === "number"
              ? data
              : (data.totalKm ?? data.km ?? data.total);
          if (typeof total === "number" && !isNaN(total)) {
            baseKm = total;
            baseDateMs = data.timestamp ? Date.parse(data.timestamp) : Date.now();
            if (isMounted) {
              setKm(computeKmFromBase(baseKm, baseDateMs, FLEET_STATS.kmPerSecond));
            }
          }
        } catch {
          // Handle fetch failure silently by keeping last good value
        }
      };

      fetchLiveTotal();
      fetchTimer = setInterval(fetchLiveTotal, 60000);
    }

    // Initial mount synchronization on requestAnimationFrame
    const rafId = requestAnimationFrame(() => {
      if (isMounted) {
        setKm(computeKmFromBase(baseKm, baseDateMs, FLEET_STATS.kmPerSecond));
      }
    });

    // Throttled timer updating at 10 updates per second (every 100 ms)
    const updateTimer = setInterval(() => {
      if (isMounted) {
        setKm(computeKmFromBase(baseKm, baseDateMs, FLEET_STATS.kmPerSecond));
      }
    }, 100);

    return () => {
      isMounted = false;
      cancelAnimationFrame(rafId);
      clearInterval(updateTimer);
      if (fetchTimer) clearInterval(fetchTimer);
    };
  }, []);

  return km;
}
