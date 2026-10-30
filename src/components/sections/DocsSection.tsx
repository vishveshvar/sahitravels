import { buildPassport } from "@/lib/artGenerators";

export default function DocsSection() {
  return (
    <section
      className="docs sec"
      id="docs"
      data-nila="Press the button and I’ll stamp my passport. Visas and renewals are our job."
      data-nila-pose="point"
    >
      <div className="wrap docs__grid">
        <div className="passport">
          <div
            id="passport"
            dangerouslySetInnerHTML={{ __html: buildPassport() }}
          />
          <div className="passport__controls">
            <button className="btn btn--navy" type="button" id="stampBtn">
              Stamp the passport <span className="btn__arrow" aria-hidden="true">→</span>
            </button>
            <span className="passport__count mono" id="stampCount">
              0 of 6 stamps
            </span>
          </div>
          <p className="passport__msg" id="stampMsg" role="status" aria-live="polite"></p>
        </div>
        <div>
          <p className="eyebrow">Before you fly</p>
          <h2 className="h2" data-split>
            The paperwork, <span className="serif-i">sorted.</span>
          </h2>
          <ul className="doclist">
            <li>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <rect x="5" y="3" width="14" height="18" rx="2" />
                <circle cx="12" cy="10" r="3" />
                <path d="M8.5 16.5h7" />
              </svg>
              <div>
                <h3>Visa services</h3>
                <p>
                  Tourist, visit, business and student visas. Family and group
                  applications, documents and appointments.
                </p>
              </div>
            </li>
            <li>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M6 3h10l3 3v15H6z" />
                <path d="M9 10h7M9 14h7M9 18h4" />
              </svg>
              <div>
                <h3>Passport services</h3>
                <p>
                  New passports, renewals and reissues, corrections and
                  applications.
                </p>
              </div>
            </li>
            <li>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M9 3h6v5l3 2v3H6v-3l3-2z" />
                <path d="M5 17h14v4H5z" />
              </svg>
              <div>
                <h3>Certificate attestation</h3>
                <p>
                  Educational, marriage and birth certificates, commercial
                  documents, embassy and MOF·-related attestation.
                </p>
              </div>
            </li>
            <li>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <circle cx="8" cy="12" r="4.5" />
                <path d="M14 8h7l-2-2M21 16h-7l2 2" />
              </svg>
              <div>
                <h3>Foreign exchange</h3>
                <p>
                  Travel-related currency exchange for eligible customers and
                  transactions.
                </p>
              </div>
            </li>
            <li>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />
              </svg>
              <div>
                <h3>Travel insurance</h3>
                <p>
                  Domestic and international cover for individuals, families
                  and groups.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

