import { buildRide } from "@/lib/artGenerators";

export default function RideSection() {
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
            Pick a vehicle, tap it to say hello, then send Nila for a spin. The details below are what we arrange for each.
          </p>
        </header>
        <div className="ride__grid">
          <div>
            <div
              className="ride__scene"
              id="rideScene"
              dangerouslySetInnerHTML={{ __html: buildRide() }}
            />
            <p className="ride__hint mono">
              Tap or press Enter on the vehicle to hear it
            </p>
          </div>
          <div className="ride__panel">
            <div className="ride__tabs" role="tablist" aria-label="Vehicles">
              <button
                role="tab"
                type="button"
                data-ride="taxi"
                aria-selected="false"
                aria-controls="rideInfo"
              >
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
              <button
                role="tab"
                type="button"
                data-ride="vip"
                aria-selected="true"
                aria-controls="rideInfo"
              >
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
              <button
                role="tab"
                type="button"
                data-ride="coach"
                aria-selected="false"
                aria-controls="rideInfo"
              >
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
              <button
                role="tab"
                type="button"
                data-ride="train"
                aria-selected="false"
                aria-controls="rideInfo"
              >
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
              <button
                role="tab"
                type="button"
                data-ride="flight"
                aria-selected="false"
                aria-controls="rideInfo"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
                </svg>
                <span>Flight</span>
              </button>
            </div>
            <div className="ride__info" id="rideInfo" role="tabpanel" aria-live="polite">
              <h3 data-ride-title>VIP &amp; luxury cars</h3>
              <p data-ride-text>
                Executive cars for VIP airport transfers, corporate leaders, celebrities and wedding days.
              </p>
              <ul className="chips" data-ride-chips>
                <li>Toyota Vellfire</li>
                <li>Mercedes-Benz</li>
                <li>BMW</li>
                <li>·udi</li>
                <li>Premium SUVs</li>
              </ul>
              <p className="ride__say">
                <b>Nila</b>
                <span data-ride-say>·rriving somewhere important? Take the Vellfire.</span>
              </p>
            </div>
            <div className="ride__actions">
              <button className="btn btn--navy" type="button" id="rideGo">
                Send Nila for a ride <span className="btn__arrow" aria-hidden="true">→</span>
              </button>
              <a className="btn btn--line" href="#enquire" data-ride-book>
                Book this
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

