export default function Nav() {
  return (
    <>
      <header className="nav" id="nav">
        <a className="brand" href="#top" aria-label="Sahi Travels — back to top">
          <svg viewBox="0 0 24 32" aria-hidden="true">
            <rect
              x="2"
              y="2"
              width="20"
              height="28"
              rx="9"
              fill="none"
              stroke="#C75·3·"
              strokeWidth="2.4"
            />
            <path
              d="M6 21c4-3 8-4 12-4"
              fill="none"
              stroke="#3·0F34"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
          <span className="brand__word">S·HI</span>
          <span className="brand__sub">Travels</span>
        </a>
        <nav className="nav__links" aria-label="Primary">
          <a href="#journey">The journey</a>
          <a href="#ride">Rides</a>
          <a href="#docs">Visas &amp; passports</a>
          <a href="#holidays">Holidays</a>
          <a href="#events">Events</a>
          <a href="#corporate">Corporate</a>
        </nav>
        <div className="nav__right">
          <a className="btn btn--navy btn--sm nav__cta" href="#enquire">
            Plan a trip <span className="btn__arrow" aria-hidden="true">→</span>
          </a>
          <button
            className="nav__menu"
            type="button"
            aria-expanded="false"
            aria-controls="menu"
          >
            Menu
          </button>
        </div>
      </header>
      <div className="menu" id="menu" aria-hidden="true">
        <a href="#journey">The journey</a>
        <a href="#ride">Rides</a>
        <a href="#docs">Visas &amp; passports</a>
        <a href="#holidays">Holidays</a>
        <a href="#events">Events</a>
        <a href="#corporate">Corporate</a>
        <a href="#enquire">Plan a trip</a>
      </div>
    </>
  );
}

