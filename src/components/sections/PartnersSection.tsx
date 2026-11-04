"use client";

import Image from "next/image";

interface Partner {
  name: string;
  logo: string;
  width: number;
  height: number;
}

const PARTNERS: Partner[] = [
  {
    name: "Eyelevels",
    logo: "/assets/img/eyelevel-logo.png",
    width: 1620,
    height: 1039,
  },
  {
    name: "NJ Macson",
    logo: "/assets/img/nj_macsonlogo.png",
    width: 589,
    height: 147,
  },
  {
    name: "Vilaasa Estates",
    logo: "/assets/img/visaalaesate.png",
    width: 240,
    height: 66,
  },
  {
    name: "Jawans",
    logo: "/assets/img/jawanlogo.png",
    width: 526,
    height: 272,
  },
];

export default function PartnersSection() {
  return (
    <section className="partners-sec" id="partners" aria-label="Authorized Travel Partners">
      <div className="wrap">
        <div className="partners-sec__head">
          <p className="eyebrow">AUTHORIZED TRAVEL PARTNERS</p>
          <h2 className="partners-sec__title">
            Trusted by organizations <span className="serif-i">across industries.</span>
          </h2>
        </div>
      </div>

      <div className="partner-marquee-wrap" aria-label="Authorized travel partner logos">
        <div className="partner-marquee-track">
          {[0, 1, 2].map((groupIndex) => (
            <div key={groupIndex} className="partner-marquee-group" aria-hidden={groupIndex > 0}>
              {PARTNERS.map((partner) => (
                <div key={`${groupIndex}-${partner.name}`} className="partner-card">
                  <div className="partner-card__logo-wrap">
                    <Image
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      width={partner.width}
                      height={partner.height}
                      className="partner-card__logo"
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

