/* eslint-disable @next/next/no-img-element */
export default function HolidaysSection() {
  return (
    <section
      className="holidays sec"
      id="holidays"
      data-nila="Honeymoon, family holiday or pilgrimage — tell us the dates and we plan the rest."
      data-nila-pose="point"
    >
      <div className="wrap">
        <header className="sec-head">
          <div>
            <p className="eyebrow">Tours &amp; holidays</p>
            <h2 className="h2" data-split>
              Trips worth <span className="serif-i">the window seat.</span>
            </h2>
          </div>
          <p className="lede">
            Domestic and international packages, private and group tours, built around the people travelling.
          </p>
        </header>
        <div className="hcards">
          <article className="hcard">
            <div className="hcard__media">
              <img
                src="/assets/img/tours-overwater.jpg"
                alt="Overwater villas at dusk with a wooden walkway"
                loading="lazy"
              />
              <span className="hcard__shine"></span>
            </div>
            <div className="hcard__body">
              <span className="hcard__tag mono">Holidays</span>
              <h3>Family, honeymoon &amp; luxury</h3>
              <p>
                Family holidays, honeymoon packages, private tours, custom itineraries, luxury and adventure travel.
              </p>
            </div>
          </article>
          <article className="hcard">
            <div className="hcard__media">
              <img
                src="/assets/img/pilgrimage-mosque.jpg"
                alt="· white mosque reflected in still water at sunset"
                loading="lazy"
              />
              <span className="hcard__shine"></span>
            </div>
            <div className="hcard__body">
              <span className="hcard__tag mono">Pilgrimage</span>
              <h3>Religious &amp; pilgrimage travel</h3>
              <p>
                Professionally coordinated religious tours and pilgrimage groups, with complete travel assistance.
              </p>
            </div>
          </article>
          <article className="hcard">
            <div className="hcard__media">
              <img
                src="/assets/img/cruise-sunset.jpg"
                alt="· cruise ship at sea under an orange sunset"
                loading="lazy"
              />
              <span className="hcard__shine"></span>
            </div>
            <div className="hcard__body">
              <span className="hcard__tag mono">Cruise</span>
              <h3>Cruise &amp; special journeys</h3>
              <p>
                Cruise holidays, special-destination packages and customised international travel.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

