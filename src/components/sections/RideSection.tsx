"use client";

import { useEffect, useState, useRef } from "react";
import { FLEET } from "@/data/fleet";
import { useVehicleBooking } from "@/context/VehicleBookingContext";

export default function RideSection() {
  const { selectedVehicleId, setSelectedVehicleId, bookVehicleFromShowcase } = useVehicleBooking();
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Preload all 12 vehicle images and the stage backdrop when component mounts
  useEffect(() => {
    FLEET.forEach((v) => {
      const img = new Image();
      img.src = v.image;
    });
    const bg = new Image();
    bg.src = "/assets/img/stage-backdrop.webp";
  }, []);

  const currentIndex = FLEET.findIndex((v) => v.id === selectedVehicleId);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const currentVehicle = FLEET[safeIndex];

  const handlePrev = () => {
    const nextIdx = (safeIndex - 1 + FLEET.length) % FLEET.length;
    setSelectedVehicleId(FLEET[nextIdx].id);
  };

  const handleNext = () => {
    const nextIdx = (safeIndex + 1) % FLEET.length;
    setSelectedVehicleId(FLEET[nextIdx].id);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (diff > 40) {
      handlePrev();
    } else if (diff < -40) {
      handleNext();
    }
    setTouchStartX(null);
  };

  const positionCounter = `${String(safeIndex + 1).padStart(2, "0")} / ${String(FLEET.length).padStart(2, "0")}`;

  return (
    <section className="ride sec" id="ride" data-nila-hide>
      <div className="wrap">
        <header className="sec-head">
          <div>
            <p className="eyebrow">Choose your ride</p>
            <h2 className="h2" data-split>
              Five ways to move, <span className="serif-i">one desk to call.</span>
            </h2>
          </div>
          <p className="lede">
            Pick a vehicle, explore the studio stage, and find the right fit for your journey. The details below are what we arrange for each.
          </p>
        </header>

        <div className="ride__grid">
          {/* Left: Studio Stage with Crossfading Vehicle Cutouts */}
          <div>
            <div
              className="vehicle-stage"
              role="region"
              aria-label={`Vehicle stage: ${currentVehicle.name}`}
            >
              {/* Studio Backdrop */}
              <picture>
                <source srcSet="/assets/img/stage-backdrop.avif" type="image/avif" />
                <img
                  src="/assets/img/stage-backdrop.webp"
                  alt="Blush studio stage backdrop"
                  className="vehicle-stage__backdrop"
                  width={1600}
                  height={1067}
                  decoding="async"
                />
              </picture>

              {/* Shared Contact Shadow */}
              <div className="vehicle-stage__shadow" aria-hidden="true" />

              {/* All 12 Normalized Vehicle Cutouts Crossfaded */}
              {FLEET.map((v) => {
                const isActive = v.id === currentVehicle.id;
                return (
                  <picture key={v.id}>
                    {v.avifImage && <source srcSet={v.avifImage} type="image/avif" />}
                    <img
                      src={v.image}
                      alt={isActive ? v.alt : ""}
                      className={`vehicle-stage__car ${isActive ? "is-active" : "is-hidden"}`}
                      width={1600}
                      height={1067}
                      decoding="async"
                      aria-hidden={!isActive}
                    />
                  </picture>
                );
              })}
            </div>
          </div>

          {/* Right: Fleet Showcase Single Vehicle Card */}
          <div
            ref={panelRef}
            className="ride__panel showcase-card"
            tabIndex={0}
            role="region"
            aria-label="Fleet vehicle details"
            onKeyDown={handleKeyDown}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Top Navigation Row: Category Chip, Position Counter, Round Prev/Next Buttons */}
            <div className="showcase-card__nav">
              <div className="showcase-card__badge-row">
                <span className="showcase-card__category-chip">
                  {currentVehicle.category.toUpperCase()}
                </span>
                <span className="showcase-card__counter mono">
                  {positionCounter}
                </span>
              </div>

              <div className="showcase-card__buttons">
                <button
                  type="button"
                  className="showcase-card__round-btn"
                  onClick={handlePrev}
                  aria-label="Previous vehicle"
                >
                  ←
                </button>
                <button
                  type="button"
                  className="showcase-card__round-btn"
                  onClick={handleNext}
                  aria-label="Next vehicle"
                >
                  →
                </button>
              </div>
            </div>

            {/* 12 Clickable Dot Indicators */}
            <div
              className="showcase-dots"
              role="tablist"
              aria-label="Vehicle quick select"
            >
              {FLEET.map((v, idx) => {
                const isSelected = idx === safeIndex;
                return (
                  <button
                    key={v.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    aria-label={`Show ${v.name}`}
                    className={`showcase-dot ${isSelected ? "is-active" : ""}`}
                    onClick={() => setSelectedVehicleId(v.id)}
                  />
                );
              })}
            </div>

            {/* Vehicle Details (Crossfaded) */}
            <div
              key={currentVehicle.id}
              className="ride__info showcase-card__content"
              role="tabpanel"
              aria-live="polite"
            >
              <h3 className="showcase-card__title">
                {currentVehicle.name.toUpperCase()}
              </h3>
              <p className="showcase-card__seats mono">
                {currentVehicle.seats}
              </p>
              <p className="showcase-card__desc">
                {currentVehicle.seats} capacity, ideal for airport runs, city hops, and outstation trips.
              </p>

              {/* Tags / Chips */}
              <ul className="chips showcase-card__chips">
                {currentVehicle.chips.map((chip) => (
                  <li key={chip}>{chip}</li>
                ))}
              </ul>

              {/* Nila Note */}
              <p className="ride__say showcase-card__speech">
                <b>Nila</b>
                <span>{currentVehicle.speech}</span>
              </p>
            </div>

            {/* Actions: Book Button */}
            <div className="ride__actions showcase-card__actions">
              <button
                type="button"
                className="btn btn--navy showcase-card__book-btn"
                onClick={() => bookVehicleFromShowcase(currentVehicle.id)}
              >
                Book {currentVehicle.name}{" "}
                <span className="btn__arrow" aria-hidden="true">
                  →
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
