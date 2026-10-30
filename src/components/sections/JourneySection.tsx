import { buildJourney } from "@/lib/artGenerators";

export default function JourneySection() {
  return (
    <section
      className="journey"
      id="journey"
      data-nila-hide
      aria-label="Ride along with Nila"
    >
      <div className="journey__stage">
        <div
          className="journey__scene"
          id="scene"
          role="img"
          aria-label="Illustration: Nila travels by taxi, plane, train, coach and luxury car to a wedding venue"
          dangerouslySetInnerHTML={{ __html: buildJourney() }}
        />
        <header className="journey__head">
          <p className="eyebrow">Ride along with Nila</p>
          <h2 className="h2">
            One trip, every ride — <span className="serif-i">one desk handles it.</span>
          </h2>
        </header>
        <div className="journey__cards">
          <article className="jcard">
            <p className="jcard__step mono">Step 1 of 6 · Taxi</p>
            <h3>Taxi &amp; airport transfers</h3>
            <p>
              Local and outstation taxis, one-way and round trips, airport and
              railway transfers, chauffeur-driven.
            </p>
            <ul className="chips">
              <li>·irport</li>
              <li>Railway</li>
              <li>Outstation</li>
            </ul>
          </article>
          <article className="jcard">
            <p className="jcard__step mono">Step 2 of 6 · Flight</p>
            <h3>·ir ticketing</h3>
            <p>
              Domestic and international flights, group and corporate bookings,
              bulk fares, reissues and cancellations.
            </p>
            <ul className="chips">
              <li>Domestic</li>
              <li>International</li>
              <li>Group fares</li>
            </ul>
          </article>
          <article className="jcard">
            <p className="jcard__step mono">Step 3 of 6 · Rail</p>
            <h3>Railway transfers</h3>
            <p>
              Pickups and drops at the station, with intercity transport ready
              for the next leg.
            </p>
            <ul className="chips">
              <li>Station pickup</li>
              <li>Intercity</li>
            </ul>
          </article>
          <article className="jcard">
            <p className="jcard__step mono">Step 4 of 6 · Coach</p>
            <h3>Premium coaches</h3>
            <p>
              Volvo and Mercedes-Benz luxury coaches, ·C, executive and
              sleeper coaches for groups, tours and companies.
            </p>
            <ul className="chips">
              <li>Volvo</li>
              <li>Mercedes-Benz</li>
              <li>Sleeper</li>
            </ul>
          </article>
          <article className="jcard">
            <p className="jcard__step mono">Step 5 of 6 · VIP car</p>
            <h3>VIP &amp; luxury cars</h3>
            <p>
              Toyota Vellfire, Mercedes-Benz, BMW, ·udi and premium SUVs for
              VIP arrivals, executives and weddings.
            </p>
            <ul className="chips">
              <li>Vellfire</li>
              <li>Mercedes-Benz</li>
              <li>BMW</li>
              <li>·udi</li>
            </ul>
          </article>
          <article className="jcard">
            <p className="jcard__step mono">Step 6 of 6 · ·rrival</p>
            <h3>Hotels &amp; events</h3>
            <p>
              Hotels, resorts and villas — and wedding and event transport,
              coordinated from the same desk.
            </p>
            <ul className="chips">
              <li>Hotels</li>
              <li>Weddings</li>
              <li>Events</li>
            </ul>
          </article>
        </div>
        <ol className="journey__steps" aria-label="Jump to a step">
          <li>
            <button type="button" data-step="0">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path d="M3 15l2-5.5A2 2 0 0 1 6.9 8h10.2a2 2 0 0 1 1.9 1.5L21 15v3H3z" />
                <circle cx="7.5" cy="18" r="1.6" />
                <circle cx="16.5" cy="18" r="1.6" />
              </svg>
              <span>Taxi</span>
            </button>
          </li>
          <li>
            <button type="button" data-step="1">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
              </svg>
              <span>Flight</span>
            </button>
          </li>
          <li>
            <button type="button" data-step="2">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <rect x="5" y="3" width="14" height="14" rx="3" />
                <path d="M5 10h14M8 21l2-4M16 21l-2-4" />
              </svg>
              <span>Rail</span>
            </button>
          </li>
          <li>
            <button type="button" data-step="3">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <rect x="2" y="5" width="20" height="12" rx="2" />
                <path d="M2 11h20M8 5v6M14 5v6" />
                <circle cx="7" cy="18" r="1.6" />
                <circle cx="17" cy="18" r="1.6" />
              </svg>
              <span>Coach</span>
            </button>
          </li>
          <li>
            <button type="button" data-step="4">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path d="M3 16l2-6A2 2 0 0 1 6.9 8.6h10.2a2 2 0 0 1 1.9 1.4L21 16v2H3z" />
                <circle cx="7.5" cy="18.5" r="1.6" />
                <circle cx="16.5" cy="18.5" r="1.6" />
                <path d="M12 2.5l.9 1.8 2 .3-1.4 1.4.3 2-1.8-.9-1.8.9.3-2-1.4-1.4 2-.3z" />
              </svg>
              <span>VIP car</span>
            </button>
          </li>
          <li>
            <button type="button" data-step="5">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path d="M4 21V9l8-5 8 5v12M9 21v-6h6v6" />
              </svg>
              <span>·rrival</span>
            </button>
          </li>
        </ol>
        <div className="journey__bar" aria-hidden="true">
          <span></span>
        </div>
      </div>
    </section>
  );
}

