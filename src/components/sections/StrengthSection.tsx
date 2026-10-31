"use client";

import StrengthDashboard from "@/components/StrengthDashboard/StrengthDashboard";

export default function StrengthSection() {
  return (
    <section
      className="strength sec"
      id="strength"
      data-nila="20 lakh kilometres since 2000. That’s a lot of road!"
      data-nila-pose="cheer"
    >
      <div className="wrap">
        <p className="eyebrow">Our strength</p>
        <p className="lede">
          Kilometres of safe, dependable travel and transportation since 2000.
        </p>
        <StrengthDashboard />
      </div>
    </section>
  );
}
