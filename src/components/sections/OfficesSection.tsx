"use client";

import LogoLoop from "@/components/LogoLoop/LogoLoop";
import { officeItems } from "@/data/offices";

export default function OfficesSection() {
  return (
    <section className="offices-sec" aria-label="Our offices">
      <div className="wrap">
        <p className="eyebrow">OUR OFFICES</p>
      </div>
      <LogoLoop
        logos={officeItems}
        speed={70}
        direction="left"
        logoHeight={56}
        gap={72}
        fadeOut={true}
        fadeOutWidth={0.1}
        labels="none"
        draggable={true}
        intro={true}
        ariaLabel="Our offices"
        className="offices-loop"
      />
    </section>
  );
}

