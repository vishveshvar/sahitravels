/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef } from "react";
import { buildHero } from "@/lib/artGenerators";
import { playStamp } from "@/hooks/useSiteAnimations";

let hasIataStamped = false;

export default function HeroSection() {
  const stampRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stampEl = stampRef.current;
    if (!stampEl) return;

    if (hasIataStamped || stampEl.classList.contains("is-stamped")) {
      stampEl.classList.add("is-stamped");
      return;
    }

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      stampEl.classList.add("is-stamped");
      hasIataStamped = true;
      return;
    }

    const img = stampEl.querySelector<HTMLImageElement>("img");
    const trigger = () => {
      if (hasIataStamped) return;
      hasIataStamped = true;

      // Small delay of 300ms so the hero is rendered and visible first
      setTimeout(() => {
        playStamp(stampEl, {
          rotation: 0,
          initialRotationOffset: 8,
          scaleStart: 1.25,
          duration: 0.12,
          ease: "power2.out",
          finalOpacity: 1,
          onComplete: () => {
            stampEl.classList.add("is-stamped");
          },
        });
      }, 300);
    };

    if (img) {
      if (img.complete && img.naturalWidth > 0) {
        if (typeof img.decode === "function") {
          img.decode().then(trigger).catch(trigger);
        } else {
          trigger();
        }
      } else {
        img.addEventListener(
          "load",
          () => {
            if (typeof img.decode === "function") {
              img.decode().then(trigger).catch(trigger);
            } else {
              trigger();
            }
          },
          { once: true }
        );
        img.addEventListener("error", trigger, { once: true });
      }
    } else {
      trigger();
    }
  }, []);

  const heroArtHtml = `
    <div class="bubble hero__bubble" aria-hidden="true"><span class="bubble__name">Nila · Sahi Travels</span><span class="hero__say">Hi, I’m Nila. Scroll down and ride along with me — taxi, flight, train, coach and car.</span></div>
    ${buildHero()}
  `;

  return (
    <section className="hero" id="top" data-nila-hide>
      <div ref={stampRef} className="iata-stamp" aria-hidden="true">
        <img src="/assets/img/iata-logo.png" alt="" width={96} height={96} />
      </div>
      <div className="wrap hero__grid">
        <div className="hero__copy">
          <p className="eyebrow">Sahi Travels · Operated by NJ Travel Service · Since 2000</p>
          <h1>
            <span className="hero__l1" data-split>Your journey.</span>
            <span className="hero__l2" data-split>our responsibility.</span>
          </h1>
          <p className="lede">
            Flights, visas, hotels, taxis, luxury cars and coaches — arranged from one desk in Chennai, for families, companies, weddings and film crews.
          </p>
          <div className="hero__ctas">
            <a className="btn btn--navy" href="#journey">
              Ride along with Nila <span className="btn__arrow" aria-hidden="true">→</span>
            </a>
            <a className="btn btn--line" href="#enquire">
              Plan a trip
            </a>
          </div>
        </div>
        <div
          className="hero__art"
          id="heroArt"
          dangerouslySetInnerHTML={{ __html: heroArtHtml }}
        />
      </div>
    </section>
  );
}
