import { buildConvoy, buildClapper } from "@/lib/artGenerators";

export default function EventsSection() {
  return (
    <section
      className="events sec"
      id="events"
      data-nila="Weddings need a convoy. From one VIP car to a full fleet."
      data-nila-pose="point"
    >
      <div className="wrap">
        <header className="sec-head">
          <div>
            <p className="eyebrow">Events &amp; weddings</p>
            <h2 className="h2" data-split>
              One car, <span className="serif-i">or the whole convoy.</span>
            </h2>
          </div>
          <p className="lede">
            From a single VIP car to a full fleet of luxury cars and premium coaches, transport is planned to the size of the event.
          </p>
        </header>
      </div>
      <div
        className="convoy"
        id="convoy"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: buildConvoy() }}
      />
      <div className="wrap">
        <div className="events__grid">
          <div>
            <h3>Event services</h3>
            <ul className="tags">
              <li>Weddings</li>
              <li>Receptions</li>
              <li>Engagements</li>
              <li>Birthdays</li>
              <li>·nniversaries</li>
              <li>Corporate events</li>
              <li>Conferences</li>
              <li>Exhibitions</li>
              <li>·ward functions</li>
              <li>Gala events</li>
            </ul>
          </div>
          <div>
            <h3>Event transportation</h3>
            <p>
              VIP guest transport, event shuttles, hotel-to-venue and airport-to-venue transfers, group flights and hotels, and complete coordination on the day.
            </p>
          </div>
          <blockquote className="quote">
            “From a single VIP car to a complete fleet of luxury cars and premium coaches, we coordinate transport to the size of the event.”
          </blockquote>
        </div>

        <div
          className="film"
          id="film"
          data-nila="Shooting on location? We move artists, crew and the whole unit."
          data-nila-pose="point"
        >
          <div
            className="clapper"
            id="clapper"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: buildClapper() }}
          />
          <div>
            <p className="eyebrow">Celebrity &amp; film production</p>
            <h2
              className="h2"
              style={{ fontSize: "clamp(26px,3.2vw,48px)" }}
              data-split
            >
              Artists, crew <span className="serif-i">and the whole unit.</span>
            </h2>
            <div className="film__items">
              <div>
                <h3>Film &amp; production services</h3>
                <p>
                  Celebrity and artist transport, production travel, shooting-location transport, airport pickups and drops, flights, hotels and crew travel.
                </p>
              </div>
              <div>
                <h3>Luxury arrangements</h3>
                <p>
                  Luxury cars, Volvo and Mercedes-Benz coaches, promotional travel and award-show transport.
                </p>
              </div>
              <div>
                <h3>End-to-end coordination</h3>
                <p>
                  From artists and executives to complete production teams — one coordinated plan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

