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
          <p className="eyebrow">Sahi Travels · Operated by NJ Travel Service · Since 2000</p>
          <h1>
            <span className="hero__l1" data-split>Your journey.</span>
            <span className="hero__l2" data-split>our responsibility.</span>
          </h1>
          <p className="lede">
            Flights, visas, hotels, taxis, luxury cars and coaches — arranged from one desk in Chennai, for families, companies, weddings and film crews.
          </p>
          <div className="hero__ctas">
            <a className="btn btn--navy" href="#journey">
              Ride along with Nila <span className="btn__arrow" aria-hidden="true">→</span>
            </a>
            <a className="btn btn--line" href="#enquire">
              Plan a trip
            </a>
          </div>
          <p className="hero__meta mono">
            <span><b>10,000+</b> travellers</span>
            <span><b>20 lakh+</b> km</span>
            <span><b>Chennai</b> · Keelakarai</span>
          </p>
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
