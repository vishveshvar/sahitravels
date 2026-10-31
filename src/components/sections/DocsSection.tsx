/* eslint-disable @next/next/no-img-element */
"use client";

import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack/ScrollStack";
import { buildGuide } from "@/lib/artGenerators";

export default function DocsSection() {
  return (
    <section
      className="docs sec"
      id="docs"
      data-nila-hide
    >
      <div className="wrap docs__grid">
        <div className="docs__head">
          <p className="eyebrow">Before you fly</p>
          <h2 className="h2" data-split>
            The paperwork, <span className="serif-i">sorted.</span>
          </h2>
          <div className="docs__nila">
            <div
              className="docs__mascot"
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: buildGuide() }}
            />
            <div className="bubble docs__bubble" aria-hidden="true">
              <span className="bubble__name">Nila</span>
              <span className="docs__speech">
                Visas, renewals, attestation, and insurance. The paperwork is sorted with us.
              </span>
            </div>
          </div>
        </div>

        <ScrollStack
          useWindowScroll={true}
          smoothScroll={false}
          snap={false}
          stackPosition={120}
          itemDistance={60}
          itemStackDistance={26}
          itemScale={0.04}
          baseScale={0.9}
          dimAmount={0.15}
          blurAmount={0}
          tiltAmount={0}
          rotationAmount={0}
          holdDistance={40}
        >
          <ScrollStackItem itemClassName="paperwork-card">
            <img
              src="/assets/img/visa-services.png"
              alt="Traveller documents and passport prepared for visa services"
              className="paperwork-card__img"
              loading="lazy"
              decoding="async"
              width={2400}
              height={1792}
            />
            <div className="paperwork-card__body">
              <h3 className="paperwork-card__title">Visa services</h3>
              <p className="paperwork-card__text">
                Tourist, visit, business and student visas. Family and group
                applications, documents and appointments.
              </p>
            </div>
          </ScrollStackItem>

          <ScrollStackItem itemClassName="paperwork-card">
            <img
              src="/assets/img/passport-services.png"
              alt="Official passport documents ready for passport renewals and services"
              className="paperwork-card__img"
              loading="lazy"
              decoding="async"
              width={2400}
              height={1792}
            />
            <div className="paperwork-card__body">
              <h3 className="paperwork-card__title">Passport services</h3>
              <p className="paperwork-card__text">
                New passports, renewals and reissues, corrections and
                applications.
              </p>
            </div>
          </ScrollStackItem>

          <ScrollStackItem itemClassName="paperwork-card">
            <img
              src="/assets/img/certificate-attestation.png"
              alt="Certified educational and official document for certificate attestation"
              className="paperwork-card__img"
              loading="lazy"
              decoding="async"
              width={2400}
              height={1792}
            />
            <div className="paperwork-card__body">
              <h3 className="paperwork-card__title">Certificate attestation</h3>
              <p className="paperwork-card__text">
                Educational, marriage and birth certificates, commercial
                documents, embassy and MOFA-related attestation.
              </p>
            </div>
          </ScrollStackItem>

          <ScrollStackItem itemClassName="paperwork-card">
            <img
              src="/assets/img/travel insurance.png"
              alt="Travel insurance coverage for domestic and international trips"
              className="paperwork-card__img"
              loading="lazy"
              decoding="async"
              width={2400}
              height={1792}
            />
            <div className="paperwork-card__body">
              <h3 className="paperwork-card__title">Travel insurance</h3>
              <p className="paperwork-card__text">
                Domestic and international travel insurance.
              </p>
            </div>
          </ScrollStackItem>
        </ScrollStack>
      </div>
    </section>
  );
}
