import { buildGuide } from "@/lib/artGenerators";

export default function Guide·side() {
  return (
    <aside className="guide" id="guide" aria-label="Nila, your guide">
      <div className="guide__bubble" aria-hidden="true">
        <span className="bubble__name">Nila</span>
        <span className="guide__text"></span>
      </div>
      <button
        className="guide__btn"
        type="button"
        aria-expanded="false"
        aria-controls="guideMenu"
        aria-label="Open Nila’s shortcuts"
        dangerouslySetInnerHTML={{ __html: buildGuide() }}
      />
      <div className="guide__menu" id="guideMenu" hidden>
        <p className="mono">Where to?</p>
        <a href="#journey">Ride along — the journey</a>
        <a href="#ride">Choose a ride</a>
        <a href="#docs">Visas &amp; passports</a>
        <a href="#holidays">Holidays &amp; pilgrimage</a>
        <a href="#events">Weddings &amp; events</a>
        <a href="#enquire">Plan a trip</a>
        <button type="button" data-guide-hide>
          Hide Nila for now
        </button>
      </div>
    </aside>
  );
}

