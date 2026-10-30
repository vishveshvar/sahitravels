import AccordionGallery from "@/components/AccordionGallery/AccordionGallery";

const items = [
  {
    image: "/assets/img/Corporate travel.png",
    label: "Corporate travel management",
    link: "#",
    alt: "Business travellers walking through an airport terminal",
  },
  {
    image: "/assets/img/Group travel.png",
    label: "Group travel",
    link: "#",
    alt: "Students boarding a coach outside a university campus",
  },
  {
    image: "/assets/img/B2B travel services.png",
    label: "B2B travel services",
    link: "#",
    alt: "Two professionals shaking hands across a desk",
  },
];

export default function CorporateSection() {
  return (
    <section
      className="corp sec"
      id="corporate"
      data-nila="Booking for a team, a college trip or as an agent? We have desks for each."
      data-nila-pose="point"
    >
      <div className="wrap">
        <header className="sec-head">
          <div>
            <p className="eyebrow">Corporate, group &amp; B2B</p>
            <h2 className="h2" data-split>
              Travel desks for teams <span className="serif-i">and the trade.</span>
            </h2>
          </div>
        </header>

        <div className="travel-desks-gallery">
          <AccordionGallery
            items={items}
            defaultIndex={0}
            accentColor="#C75A3A"
            overlayColor="#3A2A34"
            textColor="#FFFFFF"
            grayscale={true}
            showLabels={true}
            trigger="hover"
            orientation="horizontal"
            height={520}
            gap={12}
            radius={24}
            expandRatio={0.6}
            duration={0.6}
            ease="power3.out"
            parallax={0.5}
            tilt={6}
            stagger={0.06}
          />
        </div>

        <div className="travel-desks-details">
          <div className="travel-desks-col">
            <span className="travel-desks-label">01 / 03</span>
            <h3 className="travel-desks-title">Corporate travel management</h3>
            <p className="travel-desks-desc">
              Corporate flights, employee and business travel, hotels, airport transfers, executive cars, conference and event transport.
            </p>
          </div>
          <div className="travel-desks-col">
            <span className="travel-desks-label">02 / 03</span>
            <h3 className="travel-desks-title">Group travel</h3>
            <p className="travel-desks-desc">
              Family and corporate groups, school and college trips, associations — group flights, hotels, transport and custom packages.
            </p>
          </div>
          <div className="travel-desks-col">
            <span className="travel-desks-label">03 / 03</span>
            <h3 className="travel-desks-title">B2B travel services</h3>
            <p className="travel-desks-desc">
              B2B flight ticketing and group fares, hotel and transport B2B, tour packages, travel-agent support and wholesale solutions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
