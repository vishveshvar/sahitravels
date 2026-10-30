export default function StrengthSection() {
  return (
    <section
      className="strength sec"
      id="strength"
      data-nila="20 lakh kilometres since 2000. That’s a lot of road!"
      data-nila-pose="cheer"
    >
      <div className="wrap">
        <p className="eyebrow">Our strength</p>
        <p className="odo" aria-label="More than 20,00,000 kilometres covered">
          <span className="odo__digits" aria-hidden="true" data-odo="2000000">
            20,00,000
          </span>
          <span className="odo__unit" aria-hidden="true">
            km+
          </span>
        </p>
        <p className="lede">
          Kilometres of safe, dependable travel and transportation since 2000.
        </p>
        <dl className="facts">
          <div>
            <dt>Established</dt>
            <dd>2000</dd>
          </div>
          <div>
            <dt>Travellers served</dt>
            <dd>10,000+</dd>
          </div>
          <div>
            <dt>Offices</dt>
            <dd>Chennai · Keelakarai</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

