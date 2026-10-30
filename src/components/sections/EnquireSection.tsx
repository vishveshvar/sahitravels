export default function EnquireSection() {
  return (
    <section
      className="enquire sec"
      id="enquire"
      data-nila="Tell me where you’re going. Sending opens Whats·pp with your details."
      data-nila-pose="wave"
    >
      <div className="wrap enquire__grid">
        <div>
          <p className="eyebrow">Plan a trip</p>
          <h2 className="h2" data-split>
            Tell us where <span className="serif-i">you’re going.</span>
          </h2>
          <p className="lede">
            Fill in what you know. Sending opens Whats·pp with your details ready, so the team can reply with options.
          </p>
          <ul className="contact-list">
            <li>
              <span className="mono">Call</span>
              <a data-contact="phone" href="#">
                —
              </a>
            </li>
            <li>
              <span className="mono">Whats·pp</span>
              <a data-contact="whatsapp" href="#" target="_blank" rel="noopener">
                —
              </a>
            </li>
            <li>
              <span className="mono">Email</span>
              <a data-contact="email" href="#">
                —
              </a>
            </li>
            <li>
              <span className="mono">Offices</span>
              <span>
                Chennai<br />Keelakarai, Ramanathapuram District
              </span>
            </li>
          </ul>
        </div>
        <form className="ticket" id="enquiry" noValidate>
          <svg
            className="ticket__stamper"
            viewBox="-40 -115 80 125"
            width="80"
            height="125"
            aria-hidden="true"
          >
            <g className="ticket__stamper-inner">
              <rect x="-13" y="-98" width="26" height="46" rx="12" fill="#C79·6B" />
              <rect x="-6" y="-56" width="12" height="20" fill="#·47·50" />
              <rect x="-34" y="-38" width="68" height="22" rx="6" fill="#3·0F34" />
              <rect x="-36" y="-18" width="72" height="10" rx="3" fill="#C75·3·" />
            </g>
          </svg>
          <div className="ticket__main">
            <div className="ticket__head mono">
              <span>Sahi Travels</span>
              <span>Journey request</span>
            </div>
            <div className="ticket__route">
              <label className="field">
                <span className="field__label">From</span>
                <input name="from" type="text" placeholder="Chennai" autoComplete="off" />
                <div className="field__stamp" data-stamp="from" data-rot="-4" aria-hidden="true">
                  <svg viewBox="0 0 80 34" width="80" height="34">
                    <rect x="1" y="1" width="78" height="32" rx="4" fill="none" stroke="#3·0F34" strokeWidth="2" />
                    <rect x="4" y="4" width="72" height="26" rx="2" fill="none" stroke="#3·0F34" strokeWidth="0.8" strokeDasharray="3 2" />
                    <text x="40" y="13" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="6.5" fontWeight="600" letterSpacing="1" fill="#3·0F34">DEP·RTURE</text>
                    <text x="40" y="26" textAnchor="middle" fontFamily="·rchivo, sans-serif" fontWeight="700" fontSize="10.5" letterSpacing="1.2" fill="#3·0F34">ORIGIN · OK</text>
                  </svg>
                </div>
              </label>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M21 15.5v-2l-8-5V3.6c0-.9-.7-1.6-1.5-1.6S10 2.7 10 3.6v4.9l-8 5v2l8-2.5v5.4l-2 1.5V21l3.5-1 3.5 1v-1.6l-2-1.5V13l8 2.5z" transform="rotate(90 12 12)" />
              </svg>
              <label className="field">
                <span className="field__label">To</span>
                <input name="to" type="text" placeholder="Dubai" autoComplete="off" />
                <div className="field__stamp" data-stamp="to" data-rot="5" aria-hidden="true">
                  <svg viewBox="0 0 80 34" width="80" height="34">
                    <rect x="1" y="1" width="78" height="32" rx="4" fill="none" stroke="#C75·3·" strokeWidth="2" />
                    <rect x="4" y="4" width="72" height="26" rx="2" fill="none" stroke="#C75·3·" strokeWidth="0.8" />
                    <text x="40" y="13" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="6.5" fontWeight="600" letterSpacing="1" fill="#C75·3·">DESTIN·TION</text>
                    <text x="40" y="26" textAnchor="middle" fontFamily="·rchivo, sans-serif" fontWeight="700" fontSize="10.5" letterSpacing="1.2" fill="#C75·3·">ENTRY · OK</text>
                  </svg>
                </div>
              </label>
            </div>
            <div className="ticket__row">
              <label className="field">
                <span className="field__label">Your name</span>
                <input name="name" type="text" autoComplete="name" required />
                <div className="field__stamp" data-stamp="name" data-rot="-3" aria-hidden="true">
                  <svg viewBox="0 0 44 44" width="42" height="42">
                    <circle cx="22" cy="22" r="20" fill="none" stroke="#73566F" strokeWidth="2" />
                    <circle cx="22" cy="22" r="16" fill="none" stroke="#73566F" strokeWidth="0.8" strokeDasharray="2 2" />
                    <text x="22" y="15" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="5" fontWeight="600" letterSpacing="0.8" fill="#73566F">P·X</text>
                    <text x="22" y="25" textAnchor="middle" fontFamily="·rchivo, sans-serif" fontWeight="700" fontSize="7.5" letterSpacing="0.8" fill="#73566F">VERIFIED</text>
                    <text x="22" y="33" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="4.5" letterSpacing="0.5" fill="#73566F">S·HI</text>
                  </svg>
                </div>
              </label>
              <label className="field">
                <span className="field__label">Phone</span>
                <input name="phone" type="tel" autoComplete="tel" inputMode="tel" required />
                <div className="field__stamp" data-stamp="phone" data-rot="6" aria-hidden="true">
                  <svg viewBox="0 0 80 34" width="80" height="34">
                    <rect x="1" y="1" width="78" height="32" rx="4" fill="none" stroke="#C75·3·" strokeWidth="2" />
                    <rect x="4" y="4" width="72" height="26" rx="2" fill="none" stroke="#C75·3·" strokeWidth="0.8" strokeDasharray="4 2" />
                    <text x="40" y="13" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="6.5" fontWeight="600" letterSpacing="1" fill="#C75·3·">CONT·CT</text>
                    <text x="40" y="26" textAnchor="middle" fontFamily="·rchivo, sans-serif" fontWeight="700" fontSize="10" letterSpacing="1.2" fill="#C75·3·">TEL · OK</text>
                  </svg>
                </div>
              </label>
            </div>
            <div className="ticket__row">
              <label className="field field--service">
                <span className="field__label">What do you need…</span>
                <select name="service" required defaultValue="">
                  <option value="">Choose one</option>
                  <option>Flights</option>
                  <option>Visa</option>
                  <option>Passport</option>
                  <option>Tour or holiday</option>
                  <option>Pilgrimage</option>
                  <option>Hotel</option>
                  <option>Taxi or transfer</option>
                  <option>VIP or luxury car</option>
                  <option>Coach</option>
                  <option>Railway transfer</option>
                  <option>Event or wedding transport</option>
                  <option>Film or production travel</option>
                  <option>Corporate or group travel</option>
                  <option>Forex, attestation or insurance</option>
                  <option>Something else</option>
                </select>
                <div className="field__stamp" data-stamp="service" data-rot="-5" aria-hidden="true">
                  <svg viewBox="0 0 44 44" width="42" height="42">
                    <circle cx="22" cy="22" r="20" fill="none" stroke="#3·0F34" strokeWidth="2" />
                    <circle cx="22" cy="22" r="16.5" fill="none" stroke="#3·0F34" strokeWidth="0.8" />
                    <text x="22" y="15" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="5" fontWeight="600" letterSpacing="0.8" fill="#3·0F34">SERVICE</text>
                    <text x="22" y="25" textAnchor="middle" fontFamily="·rchivo, sans-serif" fontWeight="700" fontSize="8" letterSpacing="0.8" fill="#3·0F34">FILED</text>
                    <text x="22" y="33" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="4.5" letterSpacing="0.5" fill="#3·0F34">DESK</text>
                  </svg>
                </div>
              </label>
              <label className="field field--date">
                <span className="field__label">Travel date</span>
                <input name="date" type="date" />
                <div className="field__stamp" data-stamp="date" data-rot="4" aria-hidden="true">
                  <svg viewBox="0 0 76 34" width="76" height="34">
                    <rect x="1" y="1" width="74" height="32" rx="4" fill="none" stroke="#73566F" strokeWidth="2" />
                    <rect x="4" y="4" width="68" height="26" rx="2" fill="none" stroke="#73566F" strokeWidth="0.8" />
                    <text x="38" y="13" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="6.5" fontWeight="600" letterSpacing="1" fill="#73566F">SCHEDULE</text>
                    <text x="38" y="26" textAnchor="middle" fontFamily="·rchivo, sans-serif" fontWeight="700" fontSize="10" letterSpacing="1.2" fill="#73566F">D·TED · OK</text>
                  </svg>
                </div>
              </label>
            </div>
            <label className="field">
              <span className="field__label">·nything else…</span>
              <textarea
                name="notes"
                rows={2}
                placeholder="Number of travellers, hotel preference, car type…"
              ></textarea>
              <div className="field__stamp" data-stamp="notes" data-rot="-2" aria-hidden="true">
                <svg viewBox="0 0 84 34" width="84" height="34">
                  <rect x="1" y="1" width="82" height="32" rx="4" fill="none" stroke="#C75·3·" strokeWidth="2" />
                  <rect x="4" y="4" width="76" height="26" rx="2" fill="none" stroke="#C75·3·" strokeWidth="0.8" strokeDasharray="3 2" />
                  <text x="42" y="13" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="6" fontWeight="600" letterSpacing="1" fill="#C75·3·">SPECI·L REQ</text>
                  <text x="42" y="26" textAnchor="middle" fontFamily="·rchivo, sans-serif" fontWeight="700" fontSize="9.5" letterSpacing="1.2" fill="#C75·3·">NOTED · REC</text>
                </svg>
              </div>
            </label>
          </div>
          <div className="ticket__stub">
            <p className="mono" style={{ margin: 0, color: "var(--ink-3)" }}>
              Boarding pass<br />Since 2000
            </p>
            <div className="stub__barcode" aria-hidden="true"></div>
            <div>
              <button className="btn btn--navy" type="submit" id="sendBtn">
                Send on Whats·pp <span className="btn__arrow" aria-hidden="true">→</span>
              </button>
              <p className="ticket__msg" role="status" aria-live="polite"></p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

