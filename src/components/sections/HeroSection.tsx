"use client";

import { buildHero } from "@/lib/artGenerators";

export default function HeroSection() {
  const heroArtHtml = `
    <div class="bubble hero__bubble" aria-hidden="true"><span class="bubble__name">Nila · Sahi Travels</span><span class="hero__say">Hi, I’m Nila. Scroll down and ride along with me — taxi, flight, train, coach and car.</span></div>
    ${buildHero()}
  `;

  return (
    <section className="hero" id="top" data-nila-hide>
      <div className="wrap hero__grid">
        <div className="hero__copy">
          <p className="eyebrow">CHENNAI’S COMPLETE TRAVEL &amp; FLEET SOLUTIONS — EVERYTHING UNDER ONE ROOF</p>
          <h1>
            <span className="hero__l1" data-split>Your reliable</span>
            <span className="hero__l2" data-split>travel partner.</span>
          </h1>
          <p className="lede">
            From domestic &amp; international flights, hassle-free visa processing, and curated hotel stays, to luxury cars, Tempo Travellers, and premium coaches. Whether you’re organizing a high-profile corporate event, a grand wedding, a film production shoot, or a relaxed family vacation, we handle every detail with absolute precision and 24/7 dedicated support.
          </p>
          <div className="hero__ctas">
            <a className="btn btn--navy" href="#journey">
              Ride along with Nila <span className="btn__arrow" aria-hidden="true">→</span>
            </a>
            <a className="btn btn--line" href="#enquire">
              Plan a trip
            </a>
          </div>
        </div>
        <div
          className="hero__art"
          id="heroArt"
          dangerouslySetInnerHTML={{ __html: heroArtHtml }}
        />
      </div>
    </section>
  );
}
