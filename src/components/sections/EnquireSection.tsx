import BookingWizard from "../booking/BookingWizard";
import { CONTACT_DETAILS } from "@/data/contact";

export default function EnquireSection() {
  return (
    <section
      className="enquire sec"
      id="enquire"
      data-nila="Tell me where you’re going. Sending opens Whats·pp with your details."
      data-nila-pose="wave"
    >
      <div className="wrap enquire__grid">
        <div className="enquire__intro">
          <p className="eyebrow">Plan a trip</p>
          <h2 className="h2" data-split>
            Tell us where <span className="serif-i">you’re going.</span>
          </h2>
          <p className="lede">
            Share what you know. Our team will call you back to confirm the details and the final fare.
          </p>
        </div>

        <div className="enquire__form-wrap">
          <BookingWizard />
        </div>

        <div className="enquire__contact-wrap">
          <ul className="contact-list">
            <li>
              <span className="mono">Call</span>
              <a data-contact="phone" href={CONTACT_DETAILS.phone.telLink}>
                {CONTACT_DETAILS.phone.display}
              </a>
            </li>
            <li>
              <span className="mono">Whats·pp</span>
              <a data-contact="whatsapp" href={CONTACT_DETAILS.whatsapp.link} target="_blank" rel="noopener">
                {CONTACT_DETAILS.whatsapp.label}
              </a>
            </li>
            <li>
              <span className="mono">Email</span>
              <a data-contact="email" href={CONTACT_DETAILS.email.mailtoLink}>
                {CONTACT_DETAILS.email.address}
              </a>
            </li>
            <li>
              <span className="mono">Website</span>
              <a data-contact="website" href={CONTACT_DETAILS.website.url} target="_blank" rel="noopener">
                {CONTACT_DETAILS.website.display}
              </a>
            </li>
            <li>
              <span className="mono">Address</span>
              <span>
                <strong>{CONTACT_DETAILS.address.city}:</strong> {CONTACT_DETAILS.address.full}
              </span>
            </li>
            <li>
              <span className="mono">Offices</span>
              <span>
                {CONTACT_DETAILS.offices.join(" · ")}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
