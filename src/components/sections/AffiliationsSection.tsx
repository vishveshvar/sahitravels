"use client";

import Image from "next/image";

interface Affiliation {
  id: string;
  code: string;
  name: string;
  logo: string;
  width: number;
  height: number;
  description: string;
}

const AFFILIATIONS: Affiliation[] = [
  {
    id: "ttdc",
    code: "TTDC",
    name: "Tamil Nadu Tourism Development Corporation",
    logo: "/assets/img/TTDCLogo.png",
    width: 512,
    height: 404,
    description:
      "Official state tourism partner ensuring verified itineraries, certified drivers, and authentic cultural tourism excellence.",
  },
  {
    id: "taai",
    code: "TAAI",
    name: "Travel Agents Association of India",
    logo: "/assets/img/taailogo.png",
    width: 250,
    height: 160,
    description:
      "India's premier travel agency association, guaranteeing the highest ethical standards, verified consumer trust, and industry compliance.",
  },
  {
    id: "iata",
    code: "IATA",
    name: "International Air Transport Association",
    logo: "/assets/img/iata-logo.png",
    width: 400,
    height: 260,
    description:
      "Global airline accreditation providing direct airline ticketing authority, worldwide inventory access, and seamless international flights.",
  },
];

export default function AffiliationsSection() {
  return (
    <section
      className="affiliations-sec"
      id="affiliations"
      aria-label="Authorized Travel Affiliations"
    >
      <div className="wrap">
        <header className="affiliations-sec__head">
          <p className="eyebrow">OUR AUTHORIZED TRAVEL AFFILIATIONS</p>
          <h2 className="affiliations-sec__title">
            Recognized. Connected. <span className="serif-i">Trusted.</span>
          </h2>
          <p className="affiliations-sec__subtitle">
            Your journey deserves the assurance of trusted travel industry affiliations. Sahi Travels is connected with respected organizations that reflect our commitment to reliable travel services, professional standards, and seamless experiences.
          </p>
        </header>

        <div className="affiliations-grid" role="list">
          {AFFILIATIONS.map((item) => (
            <article key={item.id} className="affiliation-card" role="listitem">
              <div className="affiliation-card__media">
                <Image
                  src={item.logo}
                  alt={`${item.name} (${item.code}) logo`}
                  width={item.width}
                  height={item.height}
                  className="affiliation-card__img"
                  priority={false}
                />
              </div>
              <div className="affiliation-card__badge mono">{item.code}</div>
              <h3 className="affiliation-card__name">{item.name}</h3>
              <p className="affiliation-card__desc">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

