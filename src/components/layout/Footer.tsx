export default function Footer() {
  return (
    <footer
      className="footer"
      data-nila="Safe travels! Tap me any time for shortcuts."
      data-nila-pose="wave"
    >
      <div className="wrap">
        <div className="footer__top">
          <p className="footer__line">
            Your journey. <span className="serif-i">Our responsibility.</span>
          </p>
          <a className="btn btn--navy" href="#enquire">
            Plan a trip <span className="btn__arrow" aria-hidden="true">→</span>
          </a>
        </div>
        <div className="footer__cols">
          <div>
            <h3 className="mono">Offices</h3>
            <p>Chennai — since 2005</p>
            <p>Keelakarai, Ramanathapuram District — since 2000</p>
          </div>
          <div>
            <h3 className="mono">Contact</h3>
            <a data-contact="phone" href="#">
              —
            </a>
            <a data-contact="whatsapp" href="#" target="_blank" rel="noopener">
              —
            </a>
            <a data-contact="email" href="#">
              —
            </a>
          </div>
          <div>
            <h3 className="mono">Explore</h3>
            <a href="#journey">The journey</a>
            <a href="#ride">Taxis, cars, coaches &amp; flights</a>
            <a href="#docs">Visas &amp; passports</a>
            <a href="#holidays">Holidays &amp; pilgrimage</a>
            <a href="#events">Events &amp; film</a>
          </div>
        </div>
        <p className="footer__word display" aria-hidden="true">
          Sahi Travels
        </p>
        <div className="footer__base mono">
          <span>
            © <span data-year>2026</span> Sahi Travels · Operated by NJ Travel Service
          </span>
          <span>Established 2000</span>
        </div>
      </div>
    </footer>
  );
}

