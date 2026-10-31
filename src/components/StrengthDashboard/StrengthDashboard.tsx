"use client";

import { useState, useSyncExternalStore } from "react";
import Counter from "@/components/Counter/Counter";
import { FLEET_STATS } from "@/config/fleetStats";
import { useLiveKm } from "@/hooks/useLiveKm";
import "./StrengthDashboard.css";

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener?.("change", callback);
  return () => mq.removeEventListener?.("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export default function StrengthDashboard() {
  const [unit, setUnit] = useState<"km" | "mi">("km");
  const isReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
  const kmNow = useLiveKm();

  const displayValue =
    unit === "km" ? kmNow : Math.round(kmNow * 0.621371 * 10) / 10;

  const progressPercent = Math.min(
    100,
    (kmNow / FLEET_STATS.nextMilestoneKm) * 100
  );
  const percentFormatted = progressPercent.toFixed(1);

  // Label matches data source: "Live" if liveTotalUrl is set, otherwise "Live estimate"
  const liveLabel = FLEET_STATS.liveTotalUrl ? "Live" : "Live estimate";

  return (
    <div className="dash__card">
      {/* Static screen reader sentence for the card */}
      <p className="sr-only">
        Estimated kilometres travelled since 2000, updated live.
      </p>

      {/* Top row */}
      <div className="dash__top">
        <span className="dash__label">Kilometres travelled</span>
        <div className="dash__meta">
          <div className="dash__live" aria-hidden="true">
            <span className="dash__live-dot" />
            <span className="dash__live-text">{liveLabel}</span>
          </div>
          <div
            className="dash__toggle"
            role="group"
            aria-label="Distance unit"
          >
            <button
              type="button"
              className={`dash__toggle-btn ${unit === "km" ? "is-active" : ""}`}
              aria-pressed={unit === "km"}
              onClick={() => setUnit("km")}
            >
              km
            </button>
            <span className="dash__toggle-sep" aria-hidden="true">
              |
            </span>
            <button
              type="button"
              className={`dash__toggle-btn ${unit === "mi" ? "is-active" : ""}`}
              aria-pressed={unit === "mi"}
              onClick={() => setUnit("mi")}
            >
              mi
            </button>
          </div>
        </div>
      </div>

      {/* Counter Figure */}
      <div className="dash__figure" aria-live="off">
        <Counter
          value={displayValue}
          locale="en-IN"
          decimals={1}
          fontSize="clamp(3.5rem, 10vw, 7.5rem)"
          fontWeight={600}
          textColor="var(--color-plum)"
          duration={isReducedMotion ? 0.05 : 0.5}
          bounce={isReducedMotion ? 0 : 0.08}
          stagger={0.02}
          motionBlur={true}
          intro={true}
          tabular={true}
          suffix={<span className="dash__unit">{unit}</span>}
        />
      </div>

      {/* Progress bar toward next milestone */}
      <div
        className="dash__progress-track"
        role="progressbar"
        aria-label="Progress toward next milestone"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Number(percentFormatted)}
      >
        <div
          className="dash__progress-fill"
          style={{ width: `${percentFormatted}%` }}
        />
      </div>

      {/* Milestone line in small text */}
      <p className="dash__milestone">
        {percentFormatted}% of 25 lakh km
      </p>

      {/* Divider in rose, then facts row */}
      <hr className="dash__divider" />
      <dl className="facts">
        <div>
          <dt>Established</dt>
          <dd>2000</dd>
        </div>
        <div>
          <dt>Travellers served</dt>
          <dd>10,000+</dd>
        </div>
      </dl>
    </div>
  );
}
