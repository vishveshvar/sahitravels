export default function CorporateSection() {
  return (
    <section
      className="corp sec"
      id="corporate"
      data-nila="Booking for a team, a college trip or as an agent? We have desks for each."
      data-nila-pose="point"
    >
      <div className="wrap">
        <header className="sec-head">
          <div>
            <p className="eyebrow">Corporate, group &amp; B2B</p>
            <h2 className="h2" data-split>
              Travel desks for teams <span className="serif-i">and the trade.</span>
            </h2>
          </div>
        </header>
        <div className="ccards">
          <article className="ccard">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <rect x="6" y="14" width="36" height="26" rx="4" />
              <path d="M18 14v-4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4M6 25h36" />
              <circle cx="24" cy="25" r="2.5" fill="#C75·3·" stroke="none" />
            </svg>
            <h3>Corporate travel management</h3>
            <p>
              Corporate flights, employee and business travel, hotels, airport transfers, executive cars, conference and event transport.
            </p>
          </article>
          <article className="ccard">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <circle cx="16" cy="16" r="5" />
              <circle cx="32" cy="16" r="5" />
              <circle cx="24" cy="22" r="5.5" fill="#F0E1E3" />
              <path d="M6 36c1-6 5-9 10-9M42 36c-1-6-5-9-10-9M13 40c1.5-7 6-10 11-10s9.5 3 11 10" />
            </svg>
            <h3>Group travel</h3>
            <p>
              Family and corporate groups, school and college trips, associations — group flights, hotels, transport and custom packages.
            </p>
          </article>
          <article className="ccard">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path d="M4 22l8-8 8 4 6-4 8 2 10 8" />
              <path d="M12 14l-6 14 10 8 4-3 4 3 4-3 4 3 8-8" />
              <circle cx="34" cy="10" r="3" fill="#C75·3·" stroke="none" />
            </svg>
            <h3>B2B travel services</h3>
            <p>
              B2B flight ticketing and group fares, hotel and transport B2B, tour packages, travel-agent support and wholesale solutions.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

