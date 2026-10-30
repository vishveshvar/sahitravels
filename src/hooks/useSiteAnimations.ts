import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import Lenis from "lenis";

declare global {
  interface Window {
    __nilaReady?: boolean;
    __guide?: { react: (pose: string, t: string) => void };
    gsap?: typeof gsap;
    ScrollTrigger?: typeof ScrollTrigger;
    MotionPathPlugin?: typeof MotionPathPlugin;
  }
}

export function useSiteAnimations() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    window.gsap = gsap;
    window.ScrollTrigger = ScrollTrigger;

    const CONTACT = {
      phoneDisplay: "+91 00000 00000",
      phoneDial: "+910000000000",
      whatsapp: "910000000000",
      email: "hello@example.com",
    };

    const $ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document): T | null =>
      c.querySelector<T>(s);
    const $$ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document): T[] =>
      Array.from(c.querySelectorAll<T>(s));

    const root = document.documentElement;
    root.classList.add("js");

    const safe = (name: string, fn: () => void) => {
      try {
        return fn();
      } catch (err) {
        console.error("[" + name + "]", err);
      }
    };

    /* ------------------------------------------------------------------
       Contact details + enquiry form
       ------------------------------------------------------------------ */
    $$<HTMLAnchorElement>("[data-contact]").forEach((a) => {
      const k = a.dataset.contact;
      if (k === "phone") {
        a.textContent = CONTACT.phoneDisplay;
        a.href = "tel:" + CONTACT.phoneDial;
      }
      if (k === "whatsapp") {
        a.textContent = "Message on WhatsApp";
        a.href = "https://wa.me/" + CONTACT.whatsapp;
      }
      if (k === "email") {
        a.textContent = CONTACT.email;
        a.href = "mailto:" + CONTACT.email;
      }
    });

    $$("[data-year]").forEach((el) => {
      el.textContent = String(new Date().getFullYear());
    });

    const form = $<HTMLFormElement>("#enquiry");
    const formMsg = form ? $(".ticket__msg", form) : null;
    let onSent = () => {};

    const handleFormSubmit = (e: SubmitEvent) => {
      e.preventDefault();
      if (!form || !formMsg) return;
      const d = Object.fromEntries(new FormData(form)) as Record<string, string>;
      const missing = ["name", "phone", "service"].filter((n) => {
        const empty = !String(d[n] || "").trim();
        const fieldEl = form.elements.namedItem(n) as HTMLElement | null;
        fieldEl?.closest(".field")?.classList.toggle("is-invalid", empty);
        return empty;
      });
      if (missing.length) {
        const words: Record<string, string> = {
          name: "your name",
          phone: "a phone number",
          service: "what you need",
        };
        formMsg.textContent = "Add " + missing.map((m) => words[m]).join(", ") + " so we can reply.";
        formMsg.classList.add("is-error");
        (form.elements.namedItem(missing[0]) as HTMLElement | null)?.focus();
        return;
      }
      formMsg.classList.remove("is-error");
      const lines = [
        "Hello Sahi Travels, I would like help with: " + d.service,
        "Name: " + d.name,
        "Phone: " + d.phone,
        d.from || d.to ? "Route: " + (d.from || "—") + " → " + (d.to || "—") : "",
        d.date ? "Travel date: " + d.date : "",
        d.notes ? "Notes: " + d.notes : "",
      ].filter(Boolean);
      window.open(
        "https://wa.me/" + CONTACT.whatsapp + "?text=" + encodeURIComponent(lines.join("\n")),
        "_blank",
        "noopener"
      );
      formMsg.textContent = "WhatsApp opened in a new tab with your request.";
      onSent();
    };

    const handleFormInput = (e: Event) => {
      const target = e.target as HTMLElement;
      const f = target.closest(".field");
      if (f && (target as HTMLInputElement).value?.trim()) f.classList.remove("is-invalid");
    };

    if (form) {
      form.addEventListener("submit", (e: Event) => handleFormSubmit(e as SubmitEvent));
      form.addEventListener("input", handleFormInput);
    }

    // mobile menu
    const menu = $("#menu");
    const menuBtn = $<HTMLButtonElement>(".nav__menu");
    let lenis: Lenis | null = null;

    const setMenu = (open: boolean) => {
      if (!menu || !menuBtn) return;
      menu.classList.toggle("is-open", open);
      menu.setAttribute("aria-hidden", String(!open));
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.textContent = open ? "Close" : "Menu";
      if (lenis) {
        if (open) lenis.stop();
        else lenis.start();
      }
    };

    const onMenuBtnClick = () => {
      if (!menu) return;
      setMenu(!menu.classList.contains("is-open"));
    };

    menuBtn?.addEventListener("click", onMenuBtnClick);

    const onMenuLinkClick = () => setMenu(false);
    if (menu) {
      $$("a", menu).forEach((a) => a.addEventListener("click", onMenuLinkClick));
    }

    const onEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    document.addEventListener("keydown", onEscapeKey);

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isWide = () => window.innerWidth >= 900;
    const deg = (dist: number, r: number) => ((dist / (2 * Math.PI * r)) * 360);

    /* ==================================================================
       Rig — puppet controls for every Nila on the page
       ================================================================== */
    class Rig {
      p: Record<string, SVGGraphicsElement | null> = {};
      lq?: { h: (v: number) => void; x: (v: number) => void; y: (v: number) => void };
      wv?: gsap.core.Timeline;
      wt?: gsap.core.Timeline;
      pointing = false;

      constructor(scope: Element) {
        const P = this.p;
        [
          "root",
          "upper",
          "head",
          "eyes",
          "mouth",
          "mouthO",
          "armR",
          "foreR",
          "armL",
          "foreL",
          "legL",
          "legR",
          "braid",
          "case",
        ].forEach((k) => {
          P[k] = scope.querySelector<SVGGraphicsElement>(".n-" + k);
        });
        const pivot = (el: SVGGraphicsElement | null, x: number, y: number) => {
          if (!el) return;
          try {
            const b = el.getBBox();
            gsap.set(el, { transformOrigin: `${x - b.x}px ${y - b.y}px` });
          } catch {
            // ignore BBox errors during prerender or hidden state
          }
        };
        pivot(P.head, 85, 92);
        pivot(P.eyes, 85, 58.5);
        pivot(P.armR, 60, 110);
        pivot(P.foreR, 54, 156);
        pivot(P.armL, 110, 110);
        pivot(P.foreL, 118, 154);
        pivot(P.legL, 75, 196);
        pivot(P.legR, 95, 196);
        pivot(P.braid, 101, 66);
        pivot(P.mouthO, 85, 72.6);
        pivot(P.root, 85, 356);
      }

      idle() {
        const P = this.p;
        if (P.upper) gsap.to(P.upper, { y: -1.4, duration: 1.7, repeat: -1, yoyo: true, ease: "sine.inOut" });
        if (P.braid) gsap.to(P.braid, { rotation: 2.5, duration: 2.3, repeat: -1, yoyo: true, ease: "sine.inOut" });
        const blink = () => {
          if (P.eyes) {
            gsap.to(P.eyes, { scaleY: 0.12, duration: 0.07, repeat: 1, yoyo: true, ease: "power1.inOut" });
          }
          gsap.delayedCall(gsap.utils.random(2.4, 5.2), blink);
        };
        gsap.delayedCall(1.4, blink);
        return this;
      }

      look(nx: number, ny: number) {
        const P = this.p;
        if (!this.lq && P.head && P.eyes) {
          this.lq = {
            h: gsap.quickTo(P.head, "rotation", { duration: 0.7, ease: "power3" }),
            x: gsap.quickTo(P.eyes, "x", { duration: 0.4, ease: "power3" }),
            y: gsap.quickTo(P.eyes, "y", { duration: 0.4, ease: "power3" }),
          };
        }
        if (this.lq) {
          this.lq.h(nx * 7);
          this.lq.x(nx * 1.8);
          this.lq.y(ny * 1.3);
        }
      }

      wave(n = 3) {
        const P = this.p;
        if (!P.armR || !P.foreR) return;
        if (this.wv && this.wv.isActive()) return this.wv;
        this.wv = gsap
          .timeline()
          .to(P.armR, { rotation: 148, duration: 0.38, ease: "back.out(1.8)" })
          .to(P.foreR, { rotation: -26, duration: 0.16, repeat: n * 2 - 1, yoyo: true, ease: "sine.inOut" })
          .to(P.foreR, { rotation: 0, duration: 0.15 })
          .to(P.armR, { rotation: this.pointing ? 78 : 0, duration: 0.45, ease: "power2.inOut" });
        return this.wv;
      }

      talk(sec = 1.6) {
        const P = this.p;
        const tl = gsap.timeline();
        if (!P.mouth || !P.mouthO) return tl;
        const n = Math.max(2, Math.round(sec / 0.14));
        tl.set(P.mouth, { opacity: 0 });
        for (let i = 0; i < n; i++) {
          tl.to(
            P.mouthO,
            { opacity: i % 2 ? 0.25 : 1, scaleY: i % 2 ? 0.45 : gsap.utils.random(0.75, 1.1), duration: 0.07 },
            i * 0.14
          );
        }
        tl.to(P.mouthO, { opacity: 0, duration: 0.08 }).set(P.mouth, { opacity: 1 });
        return tl;
      }

      happy(sec = 1.2) {
        const P = this.p;
        if (!P.mouth || !P.mouthO) return gsap.timeline();
        return gsap
          .timeline()
          .set(P.mouth, { opacity: 0 })
          .to(P.mouthO, { opacity: 1, scaleY: 1.15, duration: 0.12 })
          .to(P.mouthO, { opacity: 0, duration: 0.15 }, sec)
          .set(P.mouth, { opacity: 1 });
      }

      jump() {
        const P = this.p;
        if (!P.root) return gsap.timeline();
        return gsap
          .timeline()
          .to(P.root, { scaleY: 0.93, scaleX: 1.05, duration: 0.1, ease: "power1.out" })
          .to(P.root, { y: -34, scaleY: 1.04, scaleX: 0.97, duration: 0.26, ease: "power2.out" })
          .to(P.root, { y: 0, scaleY: 1, scaleX: 1, duration: 0.45, ease: "bounce.out" });
      }

      walk(on = true) {
        const P = this.p;
        if (this.wt) {
          this.wt.kill();
          this.wt = undefined;
        }
        if (!on) {
          if (P.legL && P.legR) gsap.to([P.legL, P.legR], { rotation: 0, duration: 0.2 });
          if (P.root) gsap.to(P.root, { y: 0, duration: 0.2 });
          return;
        }
        this.wt = gsap
          .timeline({ repeat: -1 })
          .to(P.legL, { rotation: 9, duration: 0.22, ease: "sine.inOut" }, 0)
          .to(P.legR, { rotation: -9, duration: 0.22, ease: "sine.inOut" }, 0)
          .to(P.root, { y: -3, duration: 0.11, yoyo: true, repeat: 1, ease: "sine.out" }, 0)
          .to(P.legL, { rotation: -9, duration: 0.22, ease: "sine.inOut" }, 0.22)
          .to(P.legR, { rotation: 9, duration: 0.22, ease: "sine.inOut" }, 0.22)
          .to(P.root, { y: -3, duration: 0.11, yoyo: true, repeat: 1, ease: "sine.out" }, 0.22);
      }

      point(on = true) {
        const P = this.p;
        this.pointing = on;
        if (P.armR) gsap.to(P.armR, { rotation: on ? 78 : 0, duration: 0.55, ease: "back.out(1.6)" });
        if (P.foreR) gsap.to(P.foreR, { rotation: on ? -12 : 0, duration: 0.55 });
      }
    }

    interface TweenedElement extends HTMLElement {
      _tw?: gsap.core.Tween;
    }

    function typeInto(el: HTMLElement | null, text: string) {
      if (!el) return;
      const tel = el as TweenedElement;
      if (tel._tw) tel._tw.kill();
      const o = { n: 0 };
      tel.textContent = "";
      tel._tw = gsap.to(o, {
        n: text.length,
        duration: Math.min(1.5, text.length * 0.022),
        ease: "none",
        onUpdate: () => {
          tel.textContent = text.slice(0, Math.round(o.n));
        },
      });
    }

    // word splitter for headings
    function splitWords(el: Element) {
      if (el.querySelector(".wi")) return;
      const out = document.createDocumentFragment();
      Array.from(el.childNodes).forEach((node) => {
        if (node.nodeType === 3) {
          (node.textContent || "").split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              out.appendChild(document.createTextNode(" "));
              return;
            }
            const w = document.createElement("span");
            w.className = "w";
            const i = document.createElement("span");
            i.className = "wi";
            i.textContent = part;
            w.appendChild(i);
            out.appendChild(w);
          });
        } else if (node.nodeType === 1) {
          if ((node as Element).tagName !== "BR") splitWords(node as Element);
          out.appendChild(node);
        }
      });
      el.innerHTML = "";
      el.appendChild(out);
    }
    $$("[data-split]").forEach(splitWords);

    /* ---------- smooth scroll ---------- */
    if (!reduce) {
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      lenis.on("scroll", () => ScrollTrigger.update());
      const tickerCallback = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);
    }

    const scrollToTarget = (target: string | number | HTMLElement) => {
      let targetEl: HTMLElement | null = null;
      if (typeof target === "string") {
        if (target === "#top" || target === "#") {
          if (lenis) lenis.scrollTo(0, { duration: 1.5, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
          else window.scrollTo(0, 0);
          return;
        }
        targetEl = $(target);
      } else if (typeof target === "object" && target !== null && "nodeType" in target) {
        targetEl = target as HTMLElement;
      } else if (typeof target === "number") {
        if (lenis) lenis.scrollTo(target, { duration: 1.5, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
        else window.scrollTo(0, target);
        return;
      }

      if (!targetEl) return;

      ScrollTrigger.refresh();
      if (lenis) {
        lenis.scrollTo(targetEl, {
          duration: 1.5,
          easing: (t: number) => 1 - Math.pow(1 - t, 4),
        });
      } else {
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    };

    const anchorLinks = $$<HTMLAnchorElement>('a[href^="#"]');
    const handleAnchorClick = (e: MouseEvent) => {
      const a = (e.currentTarget as HTMLAnchorElement);
      const id = a.getAttribute("href");
      if (!id || id.length < 2) return;
      const t = $(id);
      if (!t) return;
      e.preventDefault();
      scrollToTarget(id === "#top" ? 0 : t);
    };
    anchorLinks.forEach((a) => a.addEventListener("click", handleAnchorClick));

    // Handle initial hash navigation after layout settles
    if (window.location.hash) {
      const initialTarget = $(window.location.hash);
      if (initialTarget) {
        setTimeout(() => {
          ScrollTrigger.refresh();
          scrollToTarget(initialTarget);
        }, 150);
        setTimeout(() => {
          ScrollTrigger.refresh();
          scrollToTarget(initialTarget);
        }, 600);
      }
    }

    const nav = $("#nav");
    if (nav) {
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          if (!menu?.classList.contains("is-open")) {
            nav.classList.toggle("nav--hidden", self.direction === 1 && self.scroll() > window.innerHeight * 0.7);
          }
        },
      });
    }

    const rigs: { rig: Rig; el: Element }[] = [];
    let pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const onPointerMove = (e: PointerEvent) => {
      pointer = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    /* ==================================================================
       HERO — Nila walks in, waves and follows the cursor
       ================================================================== */
    safe("hero", () => {
      const svg = $("#heroArt svg");
      if (!svg) return;
      const hn = $(".h-nila", svg);
      if (!hn) return;
      const rig = new Rig(hn).idle();
      rigs.push({ rig, el: hn });
      const bubble = $(".hero__bubble");
      const say = $<HTMLElement>(".hero__say");
      const lines = [
        "Since 2000, we have covered more than 20 lakh kilometres.",
        "Need a visa as well? The same desk handles it.",
        "Weddings? I can bring the whole convoy.",
        "Scroll down — the taxi is waiting.",
      ];
      let li = 0;
      hn.addEventListener("click", () => {
        rig.jump();
        rig.happy(1);
        typeInto(say, lines[li++ % lines.length]);
      });
      hn.addEventListener("mouseenter", () => rig.wave(2));

      // plane on its arc + drifting clouds
      if (MotionPathPlugin && !reduce) {
        gsap
          .timeline({ repeat: -1, repeatDelay: 1.5 })
          .fromTo(".h-plane", { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0)
          .to(
            ".h-plane",
            {
              motionPath: {
                path: "#h-path",
                align: "#h-path",
                alignOrigin: [0.5, 0.5],
                autoRotate: true,
              },
              duration: 9,
              ease: "none",
            },
            0
          )
          .to(".h-plane", { opacity: 0, duration: 0.6 }, 8.4);
      } else {
        gsap.set(".h-plane", { opacity: 0 });
      }

      if (!reduce) {
        $$(".h-cloud", svg).forEach((c, i) =>
          gsap.to(c, {
            x: "-=" + (60 + i * 18),
            duration: 9 + i * 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          })
        );
      }

      const words = $$(".hero h1 .wi");
      const others = $$(".hero__copy .eyebrow, .hero__copy .lede, .hero__ctas, .hero__meta");
      if (reduce) {
        gsap.set(bubble, { autoAlpha: 1 });
        return;
      }
      gsap.set(words, { yPercent: 115 });
      gsap.set(others, { y: 24, autoAlpha: 0 });
      if (nav) gsap.set(nav, { y: -20, autoAlpha: 0 });
      gsap.set(hn, { x: 560 });
      const text = say ? say.textContent || "" : "";
      const intro = gsap.timeline({ delay: 0.25 });
      intro
        .to(nav, { y: 0, autoAlpha: 1, duration: 1, ease: "expo.out" }, 0)
        .to(words, { yPercent: 0, duration: 1.3, stagger: 0.07, ease: "expo.out" }, 0.1)
        .to(others, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.08, ease: "expo.out" }, 0.45)
        .add(() => rig.walk(true), 0.2)
        .to(hn, { x: 170, duration: 1.7, ease: "power2.out" }, 0.2)
        .add(() => {
          rig.walk(false);
          rig.wave(3);
          rig.talk(2.2);
        }, 1.8)
        .fromTo(
          bubble,
          { autoAlpha: 0, scale: 0.85, y: 12, transformOrigin: "90% 100%" },
          { autoAlpha: 1, scale: 1, y: 0, duration: 0.55, ease: "back.out(2)" },
          1.85
        )
        .add(() => typeInto(say, text), 1.9);
    });

    /* ==================================================================
       JOURNEY — one scrubbed timeline: taxi → flight → rail → coach → VIP car → venue
       ================================================================== */
    safe("journey", () => {
      const section = $("#journey");
      const svg = $("#scene svg");
      if (!section || !svg) return;

      const near = $("#jNear", svg),
        mid = $("#jMid", svg),
        far = $("#jFar", svg),
        alt = $("#jAlt", svg),
        cruise = $("#jCruise", svg);
      const taxi = $("#jTaxi", svg),
        plane = $("#jPlane", svg),
        body = $(".plane-body", plane || svg),
        porthole = $(".porthole", plane || svg),
        stairs = $("#jStairs", svg),
        train = $("#jTrain", svg),
        coach = $("#jCoach", svg),
        mpv = $("#jMpv", svg),
        nila = $("#jNila", svg);
      const petals = $$("#jPetals ellipse", svg);
      if (!nila) return;
      const jr = new Rig(nila);
      const cards = $$(".jcard", section);
      const steps = $$<HTMLButtonElement>(".journey__steps button", section);
      const bar = $(".journey__bar span", section);

      // phones: frame the action instead of the whole panorama
      const fitScene = () => {
        if (isWide()) {
          svg.setAttribute("viewBox", "0 0 1600 900");
          svg.setAttribute("preserveAspectRatio", "xMidYMax slice");
        } else {
          svg.setAttribute("viewBox", "340 160 1000 740");
          svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        }
      };
      fitScene();
      window.addEventListener("resize", fitScene);

      const cam = { x: 0, y: 0 };
      const applyCam = () => {
        if (near) gsap.set(near, { x: -cam.x, y: cam.y });
        if (mid) gsap.set(mid, { x: -cam.x * 0.5, y: cam.y * 0.8 });
        if (far) gsap.set(far, { x: -cam.x * 0.12, y: cam.y * 0.25 });
      };
      if (taxi) gsap.set(taxi, { x: 800, y: 790 });
      if (plane && stairs) gsap.set([plane, stairs], { x: 3620, y: 800 });
      if (body) gsap.set(body, { transformOrigin: "50% 60%" });
      if (porthole) gsap.set(porthole, { autoAlpha: 0, scale: 0, transformOrigin: "30% 100%" });
      if (train) gsap.set(train, { x: -1500, y: 700 });
      if (coach) gsap.set(coach, { x: -700, y: 790 });
      if (mpv) gsap.set(mpv, { x: -500, y: 790 });
      gsap.set(nila, { x: 600, y: 800, autoAlpha: 0, transformOrigin: "50% 100%" });
      if (cruise) gsap.set(cruise, { x: 1800 });
      gsap.set($$(".wheel", svg), { transformOrigin: "50% 50%" });
      gsap.set($$(".mini-hand", svg), { transformOrigin: "0% 100%" });
      applyCam();

      if (!reduce && far) {
        gsap.to($(".far-clouds", svg), { x: -260, duration: 40, repeat: -1, yoyo: true, ease: "sine.inOut" });
      }

      if (reduce) {
        section.classList.add("is-static");
        gsap.set(cards, { autoAlpha: 1 });
        return;
      }

      const STAGES = [0, 2.3, 7.2, 8.6, 10.0, 11.3];
      gsap.set(cards, { autoAlpha: 0, y: 16 });
      if (cards[0]) gsap.set(cards[0], { autoAlpha: 1, y: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + Math.round(window.innerHeight * 8.5),
          pin: true,
          scrub: 1,
          refreshPriority: 1,
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          const t = tl.time();
          let idx = 0;
          STAGES.forEach((s, i) => {
            if (t >= s - 0.01) idx = i;
          });
          steps.forEach((b, i) => b.classList.toggle("is-on", i === idx));
          if (bar) gsap.set(bar, { scaleX: tl.progress() });
        },
      });

      const camX = (x: number, dur: number, at: number, ease = "none") =>
        tl.to(cam, { x, duration: dur, ease, onUpdate: applyCam }, at);
      const camY = (y: number, dur: number, at: number, ease = "power1.inOut") =>
        tl.to(cam, { y, duration: dur, ease, onUpdate: applyCam }, at);
      const spin = (g: Element | null, d: number, dur: number, at: number, ease = "none") => {
        if (!g) return;
        tl.to($$(".wheel", g), { rotation: "+=" + d, duration: dur, ease }, at);
      };
      const wave = (hand: Element | null, at: number, n = 5) => {
        if (!hand) return;
        tl.to(hand, { rotation: -32, duration: 0.1, repeat: n, yoyo: true, ease: "sine.inOut" }, at);
      };
      const walkLegs = (at: number, dur: number) => {
        const n = Math.max(1, Math.round(dur / 0.15)) * 2 - 1;
        if (jr.p.legL) tl.to(jr.p.legL, { rotation: 10, duration: dur / (n + 1), repeat: n, yoyo: true, ease: "sine.inOut" }, at);
        if (jr.p.legR) tl.to(jr.p.legR, { rotation: -10, duration: dur / (n + 1), repeat: n, yoyo: true, ease: "sine.inOut" }, at);
      };

      // 1 · taxi through the city
      camX(1900, 1.6, 0);
      if (plane && stairs) tl.to([plane, stairs], { x: 1720, duration: 1.6 }, 0);
      spin(taxi, deg(1900, 21), 1.6, 0);
      wave($("#jTaxi .mini-hand", svg), 0.4, 7);
      camX(2500, 0.6, 1.6, "power2.out");
      if (plane && stairs) tl.to([plane, stairs], { x: 1120, duration: 0.6, ease: "power2.out" }, 1.6);
      if (taxi) tl.to(taxi, { x: 640, duration: 0.6, ease: "power2.out" }, 1.6);
      spin(taxi, deg(440, 21), 0.6, 1.6, "power2.out");

      // 2 · out of the taxi, up the stairs, into the plane
      tl.to($("#jTaxi .mini-wrap", svg), { autoAlpha: 0, duration: 0.08 }, 2.3);
      tl.to(nila, { autoAlpha: 1, duration: 0.15 }, 2.3);
      tl.to(nila, { x: 1236, duration: 0.9 }, 2.45);
      walkLegs(2.45, 0.9);
      tl.to(nila, { x: 1320, y: 740, duration: 0.3 }, 3.35);
      walkLegs(3.35, 0.3);
      tl.to(nila, { autoAlpha: 0, scale: 0.85, duration: 0.1 }, 3.66);
      if (plane) tl.to($(".door", plane), { opacity: 1, duration: 0.1 }, 3.78);
      if (stairs) tl.to(stairs, { x: "-=90", autoAlpha: 0, duration: 0.22 }, 3.8);

      // takeoff
      camX(3700, 1, 4.0, "power2.in");
      if (taxi) tl.to(taxi, { x: "-=1200", duration: 1, ease: "power2.in" }, 4.0);
      if (plane) tl.to(plane, { x: 900, duration: 1, ease: "power1.inOut" }, 4.0);
      if (body) tl.to(body, { rotation: -9, duration: 0.4, ease: "power1.inOut" }, 4.55);
      if (plane) tl.to(plane, { y: 690, duration: 0.4, ease: "power1.in" }, 4.6);
      if (plane) tl.to($(".gear", plane), { scaleY: 0, transformOrigin: "50% 0%", duration: 0.15 }, 4.95);

      // climb
      camY(900, 1, 4.95);
      if (taxi) tl.to(taxi, { y: 790 + 900, duration: 1, ease: "power1.inOut" }, 4.95);
      camX(4300, 1, 5.0);
      if (plane) tl.to(plane, { y: 430, duration: 1, ease: "power1.inOut" }, 4.95);
      if (body) tl.to(body, { rotation: -3, duration: 0.8 }, 5.1);
      if (alt) tl.to(alt, { opacity: 0.55, duration: 1 }, 4.95);
      if (taxi) tl.to(taxi, { autoAlpha: 0, duration: 0.05 }, 5.9);

      // cruise — Nila waves from her window
      if (cruise) tl.to(cruise, { x: -2800, duration: 1.7 }, 5.4);
      if (body) tl.to(body, { rotation: 0, duration: 0.4 }, 5.95);
      if (porthole) tl.to(porthole, { autoAlpha: 1, scale: 1, duration: 0.25, ease: "back.out(2)" }, 5.95);
      wave($(".porthole .mini-hand", plane || svg), 6.2, 5);
      if (porthole) tl.to(porthole, { autoAlpha: 0, scale: 0, duration: 0.18 }, 6.72);
      camX(5200, 0.01, 6.92);

      // descent; the ground returns with the railway
      if (plane) tl.to(plane, { x: 1950, y: 300, duration: 0.8, ease: "power1.in" }, 6.95);
      if (body) tl.to(body, { rotation: -6, duration: 0.6 }, 6.95);
      camY(0, 0.8, 6.95);
      camX(5800, 0.8, 6.95);
      if (alt) tl.to(alt, { opacity: 0, duration: 0.8 }, 6.95);

      // 3 · train
      if (train) tl.to(train, { x: 1200, duration: 0.9, ease: "power2.out" }, 7.25);
      spin(train, deg(3300, 11), 0.9, 7.25, "power2.out");
      camX(7400, 1.2, 7.75);
      spin(train, deg(1600, 11), 1.2, 7.75);
      wave($("#jTrain .mini-hand", svg), 7.9, 9);

      // 4 · coach takes over on the road
      if (coach) tl.to(coach, { x: 800, duration: 0.8, ease: "power2.out" }, 8.55);
      spin(coach, deg(2200, 27), 0.8, 8.55, "power2.out");
      if (train) tl.to(train, { x: 3300, duration: 0.75, ease: "power2.in" }, 8.75);
      spin(train, deg(3000, 11), 0.75, 8.75, "power2.in");
      camX(8300, 1, 8.95);
      spin(coach, deg(900, 27), 1, 9.35);
      wave($("#jCoach .mini-hand", svg), 9.0, 7);

      // 5 · VIP car to the venue
      if (coach) tl.to(coach, { x: 2200, duration: 0.65, ease: "power2.in" }, 9.95);
      spin(coach, deg(2200, 27), 0.65, 9.95, "power2.in");
      if (mpv) tl.to(mpv, { x: 800, duration: 0.7, ease: "power2.out" }, 10.05);
      spin(mpv, deg(2100, 23), 0.7, 10.05, "power2.out");
      camX(9100, 0.75, 9.95);
      camX(9500, 0.6, 10.7, "power2.out");
      if (mpv) tl.to(mpv, { x: 680, duration: 0.6, ease: "power2.out" }, 10.7);
      spin(mpv, deg(280, 23), 0.6, 10.7, "power2.out");

      // 6 · arrival — Nila steps out and walks under the flower arch
      tl.to($("#jMpv .mini-wrap", svg), { autoAlpha: 0, duration: 0.08 }, 11.3);
      tl.to(nila, { x: 650, y: 800, scale: 1, duration: 0.01 }, 11.28);
      tl.to(nila, { autoAlpha: 1, duration: 0.15 }, 11.32);
      tl.to(nila, { x: 1060, y: 728, scale: 0.9, duration: 0.6 }, 11.45);
      walkLegs(11.45, 0.6);
      if (jr.p.armR) tl.to(jr.p.armR, { rotation: 148, duration: 0.15 }, 12.05);
      if (jr.p.foreR) tl.to(jr.p.foreR, { rotation: -26, duration: 0.1, repeat: 5, yoyo: true }, 12.2);
      tl.to(petals, { y: "+=880", x: "random(-70, 70)", rotation: "random(-300, 300)", duration: 1.2, stagger: 0.015 }, 11.3);
      tl.to({}, { duration: 0.4 }, 12.6);

      // caption cards
      STAGES.forEach((t, i) => {
        if (!i) return;
        if (cards[i - 1]) tl.to(cards[i - 1], { autoAlpha: 0, y: -14, duration: 0.12 }, t - 0.12);
        if (cards[i]) tl.to(cards[i], { autoAlpha: 1, y: 0, duration: 0.15 }, t);
      });

      // stepper jumps along the scroll range
      steps.forEach((b, i) =>
        b.addEventListener("click", () => {
          const st = tl.scrollTrigger;
          if (!st) return;
          const pos = st.start + ((STAGES[i] + (i ? 0.25 : 0)) / tl.duration()) * (st.end - st.start);
          scrollToTarget(pos);
        })
      );
    });

    /* ==================================================================
       RIDE — choose a vehicle, honk it, send Nila for a spin
       ================================================================== */
    safe("ride", () => {
      const svg = $("#rideScene svg");
      if (!svg) return;
      const nilaG = $("#rNila", svg);
      if (!nilaG) return;
      const rig = new Rig(nilaG).idle();
      rigs.push({ rig, el: nilaG });
      const honk = $("#rHonk", svg);
      const honkText = honk ? $("text", honk) : null;
      gsap.set($$(".wheel", svg), { transformOrigin: "50% 50%" });
      gsap.set($$(".mini-hand", svg), { transformOrigin: "0% 100%" });
      gsap.set($$(".mini-wrap", svg), { autoAlpha: 0 });
      gsap.set($(".porthole", svg), { autoAlpha: 0 });
      gsap.set($(".door", svg), { opacity: 1 });

      const fit = () => svg.setAttribute("viewBox", isWide() ? "0 0 1200 520" : "360 0 840 520");
      fit();
      window.addEventListener("resize", fit);

      if (!reduce) {
        $$(".rc", svg).forEach((c, i) =>
          gsap.to(c, {
            x: "+=" + (40 + i * 30),
            duration: 10 + i * 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          })
        );
      }

      const HOME = { x: 1030, y: 478 };
      gsap.set(nilaG, HOME);

      interface RideDef {
        g: Element | null;
        x: number;
        y: number;
        door: number;
        r: number;
        h: number;
        name: string;
        text: string;
        chips: string[];
        honk: string;
        say: string;
        book: string;
        rail?: boolean;
        air?: boolean;
      }

      const RIDES: Record<string, RideDef> = {
        taxi: {
          g: $("#rTaxi", svg),
          x: 600,
          y: 472,
          door: -46,
          r: 24,
          h: 120,
          name: "Taxi & transfers",
          text: "Local and outstation taxis, one-way and round trips, airport and railway transfers, and chauffeur-driven cars between cities.",
          chips: ["Airport", "Railway", "Outstation", "Intercity"],
          honk: "Beep beep!",
          say: "Airport run or an outstation trip? Hop in.",
          book: "Taxi or transfer",
        },
        vip: {
          g: $("#rMpv", svg),
          x: 600,
          y: 472,
          door: -39,
          r: 26.5,
          h: 140,
          name: "VIP & luxury cars",
          text: "Executive cars for VIP airport transfers, corporate leaders, celebrities and wedding days.",
          chips: ["Toyota Vellfire", "Mercedes-Benz", "BMW", "Audi", "Premium SUVs"],
          honk: "Vroom!",
          say: "Arriving somewhere important? Take the Vellfire.",
          book: "VIP or luxury car",
        },
        coach: {
          g: $("#rCoach", svg),
          x: 600,
          y: 472,
          door: 204,
          r: 25.6,
          h: 167,
          name: "Premium coaches",
          text: "Volvo and Mercedes-Benz luxury coaches, premium AC, executive and sleeper coaches for groups, companies, weddings and airport runs.",
          chips: ["Volvo", "Mercedes-Benz", "Premium AC", "Sleeper"],
          honk: "Honk honk!",
          say: "Travelling as a group? Everyone fits.",
          book: "Coach",
        },
        train: {
          g: $("#rTrain", svg),
          x: 960,
          y: 372,
          door: -285,
          r: 8.25,
          h: 110,
          rail: true,
          name: "Railway transfers",
          text: "Pickups and drops at the station, with a taxi, luxury car or coach ready for the onward leg.",
          chips: ["Station pickup", "Station drop", "Onward transport"],
          honk: "Toot toot!",
          say: "Arriving by train? A car can be waiting outside the station.",
          book: "Railway transfer",
        },
        flight: {
          g: $("#rPlane", svg),
          x: 560,
          y: 250,
          door: 146,
          r: 6,
          h: 142,
          air: true,
          name: "Air ticketing",
          text: "Domestic and international flights, group and corporate bookings, special bulk fares, reissues and cancellations.",
          chips: ["Domestic", "International", "Group fares", "Reissues"],
          honk: "Whoosh!",
          say: "Domestic or international — we book both.",
          book: "Flights",
        },
      };

      Object.values(RIDES).forEach((s) => {
        if (s.g) gsap.set(s.g, { x: s.rail ? -1500 : -500, y: s.air ? 120 : s.y, autoAlpha: 0 });
      });

      let current = "vip";
      let busy = false;
      let bob: gsap.core.Tween | null = null;
      const tabs = $$<HTMLButtonElement>('.ride__tabs [role="tab"]');
      const info = {
        title: $("[data-ride-title]"),
        text: $("[data-ride-text]"),
        chips: $("[data-ride-chips]"),
        say: $("[data-ride-say]"),
        book: $<HTMLElement>("[data-ride-book]"),
      };
      const goBtn = $<HTMLButtonElement>("#rideGo");

      const bobPlane = (s: RideDef) => {
        if (bob) bob.kill();
        if (s.g) bob = gsap.to(s.g, { y: s.y - 10, duration: 1.6, repeat: -1, yoyo: true, ease: "sine.inOut" });
      };

      const enter = (key: string, toGround = false) => {
        const s = RIDES[key];
        if (!s || !s.g) return gsap.timeline();
        if (s.air) {
          const ty = toGround ? 472 : s.y;
          return gsap
            .timeline()
            .add(() => gsap.set(s.g, { x: -500, y: 110, autoAlpha: 1 }), 0)
            .to(s.g, { x: s.x, y: ty, duration: 1.5, ease: "power3.out" }, 0)
            .add(() => {
              if (!toGround) bobPlane(s);
            });
        }
        const from = s.rail ? -1500 : -460;
        const dur = s.rail ? 1.5 : 1.15;
        const tl = gsap
          .timeline()
          .add(() => gsap.set(s.g, { x: from, y: s.y, autoAlpha: 1 }), 0)
          .to(s.g, { x: s.x, duration: dur, ease: "power3.out" }, 0)
          .to($$(".wheel", s.g), { rotation: "+=" + deg(s.x - from, s.r), duration: dur, ease: "power3.out" }, 0);
        if (!s.rail) {
          tl.to(s.g, { rotation: -1.2, transformOrigin: "50% 100%", duration: 0.14, yoyo: true, repeat: 1, ease: "sine.inOut" }, dur - 0.2);
        }
        return tl;
      };

      const exit = (key: string) => {
        const s = RIDES[key];
        if (!s || !s.g) return gsap.timeline();
        if (bob && s.air) {
          bob.kill();
          bob = null;
        }
        if (s.air) {
          return gsap
            .timeline()
            .to(s.g, { x: 1700, y: -120, duration: 1.2, ease: "power2.in" })
            .to($(".plane-body", s.g), { rotation: -8, duration: 0.5 }, 0)
            .set($(".plane-body", s.g), { rotation: 0 })
            .set(s.g, { autoAlpha: 0 });
        }
        const to = s.rail ? 2900 : 1750;
        return gsap
          .timeline()
          .to(s.g, { x: to, duration: s.rail ? 1.2 : 0.95, ease: "power2.in" }, 0)
          .to($$(".wheel", s.g), { rotation: "+=" + deg(to - s.x, s.r), duration: s.rail ? 1.2 : 0.95, ease: "power2.in" }, 0)
          .set(s.g, { autoAlpha: 0 });
      };

      const showInfo = (key: string) => {
        const s = RIDES[key];
        if (!s) return;
        gsap.to("#rideInfo", {
          autoAlpha: 0,
          y: 8,
          duration: 0.18,
          onComplete: () => {
            if (info.title) info.title.textContent = s.name;
            if (info.text) info.text.textContent = s.text;
            if (info.chips) info.chips.innerHTML = s.chips.map((c) => `<li>${c}</li>`).join("");
            if (info.say) info.say.textContent = s.say;
            if (info.book) info.book.dataset.service = s.book;
            gsap.to("#rideInfo", { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" });
          },
        });
      };

      info.book?.addEventListener("click", () => {
        if (info.book?.dataset.service && form) {
          const serviceSelect = form.elements.namedItem("service") as HTMLSelectElement | null;
          if (serviceSelect) {
            serviceSelect.value = info.book.dataset.service;
            serviceSelect.dispatchEvent(new Event("change", { bubbles: true }));
          }
        }
      });

      const select = (key: string) => {
        if (busy || key === current) return;
        busy = true;
        tabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.ride === key)));
        showInfo(key);
        const prev = current;
        current = key;
        gsap
          .timeline({
            onComplete: () => {
              busy = false;
              rig.wave(2);
              rig.talk(1.4);
            },
          })
          .add(exit(prev), 0)
          .add(enter(key), 0.45);
      };

      tabs.forEach((t) =>
        t.addEventListener("click", () => {
          if (t.dataset.ride) select(t.dataset.ride);
        })
      );

      const rideTabsContainer = $(".ride__tabs");
      rideTabsContainer?.addEventListener("keydown", ((e: KeyboardEvent) => {
        if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
        const i = tabs.findIndex((t) => t.dataset.ride === current);
        const n = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
        n.focus();
        if (n.dataset.ride) select(n.dataset.ride);
      }) as EventListener);

      const doHonk = (key: string) => {
        const s = RIDES[key];
        if (busy || !s || !s.g || !honk || !honkText) return;
        honkText.textContent = s.honk;
        const y = (s.air ? (gsap.getProperty(s.g, "y") as number) : s.y) - s.h - 24;
        gsap.killTweensOf(honk);
        gsap
          .timeline()
          .set(honk, { x: s.x + (s.rail ? -200 : 0), y, scale: 0.4, opacity: 0, transformOrigin: "50% 100%" })
          .to(honk, { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2.4)" })
          .to(honk, { opacity: 0, y: y - 16, duration: 0.3 }, 1.2);
        if (!s.air) {
          gsap.fromTo(s.g, { y: s.y }, { y: s.y - 7, duration: 0.1, yoyo: true, repeat: 3, ease: "sine.inOut" });
        } else {
          gsap.to($(".plane-body", s.g), { rotation: -6, duration: 0.2, yoyo: true, repeat: 1 });
        }
        gsap.fromTo($$(".hl", s.g), { opacity: 1 }, { opacity: 0.2, duration: 0.1, repeat: 5, yoyo: true });
        rig.jump();
        rig.happy(0.9);
      };

      Object.entries(RIDES).forEach(([key, s]) => {
        if (!s.g) return;
        s.g.addEventListener("click", () => {
          if (key === current) doHonk(key);
        });
        s.g.addEventListener("keydown", (e: Event) => {
          const ke = e as KeyboardEvent;
          if ((ke.key === "Enter" || ke.key === " ") && key === current) {
            ke.preventDefault();
            doHonk(key);
          }
        });
      });

      // Send Nila for a ride
      goBtn?.addEventListener("click", () => {
        if (busy || !goBtn) return;
        busy = true;
        goBtn.disabled = true;
        const s = RIDES[current];
        if (!s || !s.g) return;
        const mini = s.air ? $(".porthole", s.g) : $(".mini-wrap", s.g);
        const doorX = s.x + s.door;
        const tl = gsap.timeline({
          onComplete: () => {
            busy = false;
            goBtn.disabled = false;
          },
        });
        if (s.air) {
          if (bob) {
            bob.kill();
            bob = null;
          }
          tl.to(s.g, { y: 472, duration: 1, ease: "power2.inOut" });
        }
        tl.add(() => rig.walk(true))
          .to(nilaG, {
            x: doorX,
            y: s.rail ? 384 : HOME.y,
            scale: s.rail ? 0.82 : 1,
            duration: Math.abs(HOME.x - doorX) / 330,
            ease: "power1.inOut",
          })
          .add(() => rig.walk(false))
          .to(nilaG, { autoAlpha: 0, scale: "-=0.15", duration: 0.2 })
          .to(mini, { autoAlpha: 1, duration: 0.2 })
          .add(() => {
            if (!s.air && mini) gsap.to($(".mini-hand", mini), { rotation: -32, duration: 0.12, repeat: 9, yoyo: true });
          })
          .add(exit(current), "+=0.2")
          .add(() => {
            gsap.set(mini, { autoAlpha: 1 });
            if (s.air && mini) gsap.to($(".mini-hand", mini), { rotation: -32, duration: 0.12, repeat: 9, yoyo: true });
          })
          .add(enter(current, true), "+=0.5")
          .to(mini, { autoAlpha: 0, duration: 0.2 }, "+=0.15")
          .set(nilaG, { x: doorX, autoAlpha: 1, scale: s.rail ? 0.82 : 1 })
          .add(() => rig.walk(true))
          .to(nilaG, { x: HOME.x, y: HOME.y, scale: 1, duration: Math.abs(HOME.x - doorX) / 330, ease: "power1.inOut" })
          .add(() => {
            rig.walk(false);
            rig.wave(3);
            rig.talk(1.4);
            if (info.say) info.say.textContent = "Back already! Pick another ride.";
          });
        if (s.air) {
          tl.add(() => {
            gsap.to(s.g, { y: s.y, duration: 1.2, ease: "power2.inOut", onComplete: () => bobPlane(s) });
          });
        }
      });

      // first vehicle arrives when the section is reached
      ScrollTrigger.create({
        trigger: "#ride",
        start: "top 70%",
        once: true,
        onEnter: () => {
          busy = true;
          enter("vip").eventCallback("onComplete", () => {
            busy = false;
            rig.wave(2);
          });
        },
      });
    });

    /* ==================================================================
       DOCUMENTS — stamp the passport
       ================================================================== */
    safe("docs", () => {
      const svg = $("#passport svg");
      if (!svg) return;
      const stamps = $$<SVGGraphicsElement>(".stamp", svg);
      const stamper = $(".stamper", svg);
      const pp = $(".pp", svg);
      const btn = $<HTMLButtonElement>("#stampBtn");
      const count = $("#stampCount");
      const msg = $("#stampMsg");
      let i = 0;
      let busy = false;

      btn?.addEventListener("click", () => {
        if (busy) return;
        if (i >= stamps.length) {
          gsap.to(stamps, { opacity: 0, duration: 0.3, stagger: 0.04 });
          i = 0;
          if (count) count.textContent = "0 of 6 stamps";
          if (msg) msg.textContent = "";
          if (btn.firstChild) btn.firstChild.textContent = "Stamp the passport ";
          return;
        }
        busy = true;
        const st = stamps[i];
        const x = +(st.dataset.x || 0);
        const y = +(st.dataset.y || 0);
        const r = +(st.dataset.rot || 0);
        gsap
          .timeline({
            onComplete: () => {
              busy = false;
            },
          })
          .set(stamper, { x, y: y - 130, opacity: 1 })
          .to(stamper, { y: y + 6, duration: 0.26, ease: "power3.in" })
          .fromTo(
            st,
            { opacity: 0, scale: 1.25, rotation: r - 8, x, y },
            { opacity: 0.92, scale: 1, rotation: r, duration: 0.12, ease: "power2.out" }
          )
          .to(pp, { y: 3, duration: 0.06, yoyo: true, repeat: 1 }, "<")
          .to(stamper, { y: y - 140, duration: 0.38, ease: "power2.out" }, "+=0.06")
          .to(stamper, { opacity: 0, duration: 0.2 });
        i++;
        if (count) count.textContent = i + " of 6 stamps";
        if (i === stamps.length) {
          if (msg) msg.textContent = "Pages full? We handle passport renewals and reissues too.";
          if (btn.firstChild) btn.firstChild.textContent = "Start a fresh passport ";
          if (window.__guide) window.__guide.react("cheer", "Six stamps! Time for a renewal — we do those too.");
        }
      });
    });

    /* ==================================================================
       HOLIDAYS — cards tilt toward the pointer
       ================================================================== */
    safe("holidays", () => {
      if (!window.matchMedia("(hover: hover)").matches || reduce) return;
      $$<HTMLElement>(".hcard").forEach((card) => {
        gsap.set(card, { transformPerspective: 1100 });
        const rx = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3" });
        const ry = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3" });
        card.addEventListener("pointermove", (e: PointerEvent) => {
          const b = card.getBoundingClientRect();
          const px = (e.clientX - b.left) / b.width;
          const py = (e.clientY - b.top) / b.height;
          ry((px - 0.5) * 9);
          rx(-(py - 0.5) * 9);
          card.style.setProperty("--mx", px * 100 + "%");
          card.style.setProperty("--my", py * 100 + "%");
        });
        card.addEventListener("pointerleave", () => {
          rx(0);
          ry(0);
        });
      });
    });

    /* ==================================================================
       EVENTS — the convoy drives past as you scroll; the clapper claps
       ================================================================== */
    safe("events", () => {
      const svg = $("#convoy svg");
      if (!svg) return;
      gsap.set($$(".garland", svg), { opacity: 1 });
      gsap.set($$(".mini-wrap", svg), { autoAlpha: 0 });
      gsap.set($("#convoy .mini-wrap", svg), { autoAlpha: 1 });
      const g = $("#convoyG", svg);
      const wheels = $$(".wheel", svg);
      gsap.set(wheels, { transformOrigin: "50% 50%" });
      if (reduce) {
        if (g) gsap.set(g, { x: 1200 });
      } else {
        gsap
          .timeline({ scrollTrigger: { trigger: "#convoy", start: "top bottom", end: "bottom top", scrub: 1 } })
          .fromTo(g, { x: -260 }, { x: 3300, ease: "none", duration: 1 }, 0)
          .to(wheels, { rotation: "+=" + deg(3560, 22), ease: "none", duration: 1 }, 0);
      }

      const stick = $("#clapper .clap-stick");
      if (stick) gsap.set(stick, { transformOrigin: "2% 100%" });
      const clap = () =>
        gsap
          .timeline()
          .to(stick, { rotation: -24, duration: 0.3, ease: "power2.out" })
          .to(stick, { rotation: 0, duration: 0.14, ease: "power4.in" })
          .to("#clapper svg", { y: 4, duration: 0.05, yoyo: true, repeat: 1 });
      ScrollTrigger.create({ trigger: "#clapper", start: "top 75%", once: true, onEnter: clap });
      const clapperEl = $("#clapper");
      clapperEl?.addEventListener("click", clap);
      clapperEl?.addEventListener("mouseenter", clap);
    });

    /* ==================================================================
       STRENGTH — odometer rolls to 20,00,000 km
       ================================================================== */
    safe("odometer", () => {
      const el = $<HTMLElement>("[data-odo]");
      if (!el) return;
      const target = +(el.dataset.odo || 0);
      const digits = String(target).length;
      const sep = new Set<number>();
      for (let pos = 3; pos < digits; pos += 2) sep.add(digits - pos);
      el.innerHTML = "";
      const strips: HTMLElement[] = [];
      for (let i = 0; i < digits; i++) {
        if (sep.has(i)) el.insertAdjacentHTML("beforeend", '<span class="odo__sep">,</span>');
        const col = document.createElement("span");
        col.className = "odo__col";
        const strip = document.createElement("span");
        strip.className = "odo__strip";
        strip.innerHTML = "01234567890"
          .split("")
          .map((n) => `<span>${n}</span>`)
          .join("");
        col.appendChild(strip);
        el.appendChild(col);
        strips.push(strip);
      }
      const o = { v: reduce ? target : 0 };
      const render = () =>
        strips.forEach((strip, idx) => {
          const place = digits - 1 - idx;
          const p = o.v / Math.pow(10, place);
          let pos: number;
          if (place === 0) pos = p % 10;
          else {
            const d = Math.floor(p) % 10;
            const f = p - Math.floor(p);
            pos = d + (f > 0.9 ? (f - 0.9) / 0.1 : 0);
          }
          strip.style.transform = `translate3d(0, ${-(pos / 11) * 100}%, 0)`;
        });
      render();
      if (!reduce) {
        gsap.to(o, {
          v: target,
          duration: 3,
          ease: "power3.out",
          onUpdate: render,
          scrollTrigger: { trigger: el, start: "top 82%", once: true },
        });
      }
    });

    /* ==================================================================
       Shared reveals
       ================================================================== */
    safe("reveals", () => {
      if (reduce) return;

      // Word split reveal for headings
      $$("[data-split]").forEach((el) => {
        if (el.closest(".hero")) return;
        gsap.fromTo(
          $$(".wi", el),
          { yPercent: 115 },
          {
            yPercent: 0,
            duration: 1.2,
            stagger: 0.06,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          }
        );
      });

      // Key content elements across sections
      const revealSelector =
        ".sec .eyebrow, .sec .lede, .trust__item, .doclist li, .hcard, .ccard, .events__grid > *, .film__items > div, .facts > div, .contact-list li";
      const revealEls = $$<HTMLElement>(revealSelector);

      revealEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // If element is already in view (e.g. top of page or hash target), keep it visible
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          gsap.set(el, { y: 0, autoAlpha: 1 });
          return;
        }

        gsap.fromTo(
          el,
          { y: 30, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: el,
              start: "top 96%",
              once: true,
            },
          }
        );
      });

      // Passport SVG booklet in #docs
      const passportEl = document.querySelector<HTMLElement>(".passport");
      const passportSvg = document.querySelector<SVGElement>(".passport svg");
      if (passportSvg) {
        const pRect = passportEl?.getBoundingClientRect();
        if (pRect && pRect.top < window.innerHeight && pRect.bottom > 0) {
          gsap.set(passportSvg, { autoAlpha: 1, y: 0, rotation: 0 });
        } else {
          gsap.fromTo(
            passportSvg,
            { rotation: -4, y: 40, autoAlpha: 0 },
            {
              rotation: 0,
              y: 0,
              autoAlpha: 1,
              duration: 1.2,
              ease: "expo.out",
              scrollTrigger: {
                trigger: passportEl || passportSvg,
                start: "top 92%",
                once: true,
              },
            }
          );
        }
      }

      // Boarding pass ticket form in #enquire
      const ticketEl = document.querySelector<HTMLElement>(".ticket");
      if (ticketEl) {
        const tRect = ticketEl.getBoundingClientRect();
        if (tRect.top < window.innerHeight && tRect.bottom > 0) {
          gsap.set(ticketEl, { autoAlpha: 1, y: 0, rotation: 0 });
        } else {
          gsap.fromTo(
            ticketEl,
            { y: 50, rotation: 1.5, autoAlpha: 0 },
            {
              y: 0,
              rotation: 0,
              autoAlpha: 1,
              duration: 1.2,
              ease: "expo.out",
              scrollTrigger: {
                trigger: ticketEl,
                start: "top 92%",
                once: true,
              },
            }
          );
        }
      }

      // IntersectionObserver safety net:
      // Guarantees that even if scroll positions shift or triggers are missed during fast scroll or hash jump,
      // all cards, illustrations, and ticket/passport elements are reliably revealed upon entering viewport.
      if (typeof IntersectionObserver !== "undefined") {
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const target = entry.target as HTMLElement;
                gsap.to(target, {
                  autoAlpha: 1,
                  y: 0,
                  rotation: 0,
                  duration: 0.8,
                  ease: "expo.out",
                  overwrite: "auto",
                });
                io.unobserve(target);
              }
            });
          },
          { rootMargin: "150px 0px" }
        );

        revealEls.forEach((el) => io.observe(el));
        if (passportSvg) io.observe(passportSvg);
        if (ticketEl) io.observe(ticketEl);
      }
    });

    /* ==================================================================
       ENQUIRY TICKET — physical stamps for completed fields
       ================================================================== */
    safe("ticketStamps", () => {
      if (!form) return;
      const stamper = $(".ticket__stamper", form);
      if (!stamper) return;

      const fieldStates: Record<string, { isStamped: boolean; lastStampedValue: string }> = {
        from: { isStamped: false, lastStampedValue: "" },
        to: { isStamped: false, lastStampedValue: "" },
        name: { isStamped: false, lastStampedValue: "" },
        phone: { isStamped: false, lastStampedValue: "" },
        service: { isStamped: false, lastStampedValue: "" },
        date: { isStamped: false, lastStampedValue: "" },
        notes: { isStamped: false, lastStampedValue: "" },
      };

      function validateField(name: string, val: string) {
        const v = (val || "").trim();
        if (name === "from" || name === "to") {
          return v.length >= 2;
        }
        if (name === "name") {
          return v.length >= 2 && /[a-zA-Z\u00C0-\u024F\u0900-\u0DFF]/.test(v);
        }
        if (name === "phone") {
          const digits = v.replace(/[\s\-\(\)\+\.]/g, "");
          if (!/^\d{8,15}$/.test(digits)) return false;
          if (/^(\d)\1+$/.test(digits)) return false;
          if (["12345678", "123456789", "1234567890", "0123456789"].includes(digits)) return false;
          return true;
        }
        if (name === "service") {
          return v !== "" && v !== "Choose one";
        }
        if (name === "date") {
          if (!v) return false;
          const parts = v.split("-");
          if (parts.length !== 3) return false;
          const d = new Date(v + "T00:00:00");
          if (isNaN(d.getTime())) return false;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return d >= today;
        }
        if (name === "notes") {
          return v.length >= 3;
        }
        return false;
      }

      const stampQueue: string[] = [];
      let isStamping = false;

      function queueStamp(fieldName: string) {
        if (!stampQueue.includes(fieldName)) {
          stampQueue.push(fieldName);
        }
        processStampQueue();
      }

      function processStampQueue() {
        if (isStamping || stampQueue.length === 0) return;
        const fieldName = stampQueue.shift()!;
        executeFieldStamp(fieldName, () => {
          isStamping = false;
          processStampQueue();
        });
      }

      function executeFieldStamp(name: string, onDone: () => void) {
        isStamping = true;
        const inputEl = form!.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
        const fieldEl = inputEl ? inputEl.closest(".field") : null;
        const stampEl = fieldEl ? fieldEl.querySelector<HTMLElement>(".field__stamp") : null;
        if (!inputEl || !fieldEl || !stampEl) {
          onDone();
          return;
        }

        const val = inputEl.value.trim();
        if (!validateField(name, val)) {
          onDone();
          return;
        }

        fieldStates[name].isStamped = true;
        fieldStates[name].lastStampedValue = val;

        const r = parseFloat(stampEl.dataset.rot || "0") || 0;

        if (reduce) {
          gsap.to(stampEl, { opacity: 0.92, scale: 1, rotation: r, duration: 0.15, onComplete: onDone });
          return;
        }

        const ticketRect = form!.getBoundingClientRect();
        const stampRect = stampEl.getBoundingClientRect();
        const targetX = stampRect.left + stampRect.width / 2 - ticketRect.left;
        const targetY = stampRect.top + stampRect.height / 2 - ticketRect.top;

        const tl = gsap.timeline({ onComplete: onDone });

        if ((gsap.getProperty(stampEl, "opacity") as number) > 0.05) {
          tl.to(stampEl, { opacity: 0.2, scale: 0.95, duration: 0.12 });
        }

        tl.set(stamper, { x: targetX, y: targetY - 130, opacity: 1, rotation: r * 0.3 })
          .to(stamper, { y: targetY + 6, rotation: 0, duration: 0.26, ease: "power3.in" })
          .fromTo(
            stampEl,
            { opacity: 0.15, scale: 1.25, rotation: r - 8 },
            { opacity: 0.92, scale: 1, rotation: r, duration: 0.12, ease: "power2.out" }
          )
          .to(fieldEl, { y: 2, duration: 0.06, yoyo: true, repeat: 1 }, "<")
          .to(stamper, { y: targetY - 140, duration: 0.38, ease: "power2.out" }, "+=0.06")
          .to(stamper, { opacity: 0, duration: 0.2 });
      }

      const debounceTimers: Record<string, NodeJS.Timeout> = {};

      function handleInput(name: string) {
        if (debounceTimers[name]) clearTimeout(debounceTimers[name]);
        const inputEl = form!.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
        if (!inputEl) return;
        const val = inputEl.value.trim();

        if (validateField(name, val)) {
          if (!fieldStates[name].isStamped || fieldStates[name].lastStampedValue !== val) {
            debounceTimers[name] = setTimeout(() => {
              queueStamp(name);
            }, 700);
          }
        } else if (fieldStates[name].isStamped) {
          debounceTimers[name] = setTimeout(() => {
            const currentVal = inputEl.value.trim();
            if (!validateField(name, currentVal) && fieldStates[name].isStamped) {
              fieldStates[name].isStamped = false;
              fieldStates[name].lastStampedValue = "";
              const stampEl = form!.querySelector(`[data-stamp="${name}"]`);
              if (stampEl) gsap.to(stampEl, { opacity: 0, scale: 0.9, duration: 0.25 });
            }
          }, 350);
        }
      }

      function handleBlurOrChange(name: string) {
        if (debounceTimers[name]) clearTimeout(debounceTimers[name]);
        const inputEl = form!.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
        if (!inputEl) return;
        const val = inputEl.value.trim();

        if (validateField(name, val)) {
          if (!fieldStates[name].isStamped || fieldStates[name].lastStampedValue !== val) {
            queueStamp(name);
          }
        } else if (fieldStates[name].isStamped) {
          fieldStates[name].isStamped = false;
          fieldStates[name].lastStampedValue = "";
          const stampEl = form!.querySelector(`[data-stamp="${name}"]`);
          if (stampEl) gsap.to(stampEl, { opacity: 0, scale: 0.9, duration: 0.25 });
        }
      }

      ["from", "to", "name", "phone", "notes"].forEach((name) => {
        const el = form!.elements.namedItem(name) as HTMLElement | null;
        if (!el) return;
        el.addEventListener("blur", () => handleBlurOrChange(name));
        el.addEventListener("change", () => handleBlurOrChange(name));
        el.addEventListener("input", () => handleInput(name));
      });

      ["service", "date"].forEach((name) => {
        const el = form!.elements.namedItem(name) as HTMLElement | null;
        if (!el) return;
        el.addEventListener("change", () => handleBlurOrChange(name));
        el.addEventListener("blur", () => handleBlurOrChange(name));
      });

      form.addEventListener("reset", () => {
        stampQueue.length = 0;
        isStamping = false;
        Object.keys(debounceTimers).forEach((k) => clearTimeout(debounceTimers[k]));
        gsap.killTweensOf(stamper);
        gsap.set(stamper, { opacity: 0 });
        Object.keys(fieldStates).forEach((name) => {
          fieldStates[name].isStamped = false;
          fieldStates[name].lastStampedValue = "";
          const stampEl = form!.querySelector(`[data-stamp="${name}"]`);
          if (stampEl) {
            gsap.killTweensOf(stampEl);
            gsap.to(stampEl, { opacity: 0, duration: 0.2 });
          }
        });
      });
    });

    /* ==================================================================
       GUIDE — Nila follows you down the page
       ================================================================== */
    safe("guide", () => {
      const el = $("#guide");
      if (!el) return;
      const btn = $(".guide__btn", el);
      const bubble = $(".guide__bubble", el);
      const text = $<HTMLElement>(".guide__text", el);
      const gmenu = $<HTMLElement>("#guideMenu");
      if (!btn || !bubble || !text || !gmenu) return;

      const rig = new Rig(btn).idle();
      rigs.push({ rig, el: btn });
      let shown = false;
      let dismissed = false;
      let current = "";

      const show = () => {
        if (shown || dismissed) return;
        shown = true;
        el.classList.add("is-on");
        gsap.fromTo(el, { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: "back.out(1.4)" });
        rig.wave(2);
      };

      const hide = () => {
        if (!shown) return;
        shown = false;
        el.classList.remove("is-on");
        gsap.to(el, { y: 60, autoAlpha: 0, duration: 0.4, ease: "power2.in" });
        closeMenu();
      };

      let tuck: gsap.core.Tween | null = null;
      const showBubble = () => {
        gsap.to(bubble, { scale: 1, autoAlpha: 1, duration: 0.35, ease: "back.out(2)", overwrite: true });
        if (tuck) tuck.kill();
        tuck = gsap.delayedCall(7, () =>
          gsap.to(bubble, { scale: 0.9, autoAlpha: 0, duration: 0.3, ease: "power2.in", overwrite: true })
        );
      };

      btn.addEventListener("mouseenter", showBubble);
      btn.addEventListener("focus", showBubble);

      const say = (t: string, pose?: string) => {
        if (!t || t === current) return;
        current = t;
        typeInto(text, t);
        rig.talk(Math.min(2.4, t.length * 0.035));
        gsap.set(bubble, { transformOrigin: "100% 100%", scale: 0.9 });
        showBubble();
        rig.point(pose === "point");
        if (pose === "cheer") {
          rig.jump();
          rig.wave(2);
        }
        if (pose === "wave") rig.wave(3);
      };

      const openMenu = () => {
        gmenu.hidden = false;
        btn.setAttribute("aria-expanded", "true");
        gsap.fromTo(gmenu, { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.3, ease: "power2.out" });
        rig.jump();
      };

      function closeMenu() {
        if (!gmenu || gmenu.hidden) return;
        gmenu.hidden = true;
        if (btn) btn.setAttribute("aria-expanded", "false");
      }

      btn.addEventListener("click", () => (gmenu.hidden ? openMenu() : closeMenu()));
      $$("a", gmenu).forEach((a) => a.addEventListener("click", closeMenu));
      $("[data-guide-hide]", gmenu)?.addEventListener("click", () => {
        closeMenu();
        hide();
        dismissed = true;
      });
      document.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Escape") closeMenu();
      });

      window.__guide = {
        react: (pose: string, t: string) => {
          current = "";
          say(t, pose);
        },
      };

      onSent = () => {
        window.__guide?.react("cheer", "Sent! WhatsApp is open in a new tab.");
        flyPaperPlane();
      };

      if (form) {
        form.addEventListener(
          "focusin",
          () => {
            if (shown) say("Where are we going? From and To are a good start.", "wave");
          },
          { once: true }
        );
      }

      $$<HTMLElement>("[data-nila], [data-nila-hide]").forEach((sec) => {
        ScrollTrigger.create({
          trigger: sec,
          start: "top 55%",
          end: "bottom 45%",
          onToggle: (self) => {
            if (!self.isActive) return;
            if (sec.hasAttribute("data-nila-hide")) hide();
            else {
              show();
              say(sec.dataset.nila || "", sec.dataset.nilaPose);
            }
          },
        });
      });
    });

    function flyPaperPlane() {
      if (reduce || !MotionPathPlugin) return;
      const sendBtn = $("#sendBtn");
      if (!sendBtn) return;
      const b = sendBtn.getBoundingClientRect();
      const p = document.createElement("div");
      p.className = "paperplane";
      p.innerHTML =
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 11.5L22 3l-6 18-4.5-7.5z"/><path d="M11.5 13.5L22 3" stroke="#C75A3A" stroke-width="1.2"/></svg>';
      document.body.appendChild(p);
      const x0 = b.left + b.width / 2 - 22;
      const y0 = b.top - 10;
      gsap.set(p, { x: x0, y: y0 });
      gsap.to(p, {
        motionPath: {
          path: [
            { x: x0, y: y0 },
            { x: x0 - 120, y: y0 - 160 },
            { x: x0 + 80, y: y0 - 300 },
            { x: window.innerWidth + 80, y: -80 },
          ],
          curviness: 1.4,
          autoRotate: 45,
        },
        duration: 2.2,
        ease: "power1.inOut",
        onComplete: () => p.remove(),
      });
    }

    /* ---------- everyone looks at the cursor ---------- */
    safe("look", () => {
      if (reduce) return;
      const lookTicker = () => {
        rigs.forEach(({ rig, el }) => {
          const r = el.getBoundingClientRect();
          if (r.bottom < 0 || r.top > window.innerHeight || !r.width) return;
          const hx = r.left + r.width * 0.5;
          const hy = r.top + r.height * 0.16;
          rig.look(
            gsap.utils.clamp(-1, 1, (pointer.x - hx) / 500),
            gsap.utils.clamp(-1, 1, (pointer.y - hy) / 400)
          );
        });
      };
      gsap.ticker.add(lookTicker);
    });

    const refreshST = () => ScrollTrigger.refresh();
    window.addEventListener("load", refreshST);
    window.addEventListener("resize", refreshST);
    $$<HTMLImageElement>("img").forEach((img) => {
      if (img.complete) return;
      img.addEventListener("load", refreshST, { once: true });
    });
    if (document.fonts) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
    setTimeout(refreshST, 250);
    setTimeout(refreshST, 800);
    window.__nilaReady = true;

    // Cleanup when component unmounts
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("keydown", onEscapeKey);
      window.removeEventListener("load", refreshST);
      window.removeEventListener("resize", refreshST);
      if (lenis) {
        lenis.destroy();
      }
      ScrollTrigger.getAll().forEach((st) => st.kill());
      gsap.globalTimeline.clear();
    };
  }, []);
}
