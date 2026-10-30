"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BEAT_ORDER, BEATS, emit, target } from "@/scene/store";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * GSAP owns everything scroll-linked. It never touches the DOM: as each section scrolls in, it
 * moves the camera's target from one place in the world to the next.
 */
export default function ScrollDirector() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      Object.assign(target, BEATS.hero);
      // Tweens are created in scroll order so each one starts from where the previous one ended.
      BEAT_ORDER.forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el || i === 0) return;
        gsap.to(target, {
          ...BEATS[id],
          ease: "none",
          immediateRender: false,
          scrollTrigger: { trigger: el, start: "top bottom", end: "top 25%", scrub: 0.6 },
        });
      });
      // While the Systems list scrolls by, the camera walks down the street, kiosk by kiosk.
      target.street = 0;
      const street = document.getElementById("systems");
      if (street) {
        gsap.to(target, {
          street: 1,
          ease: "none",
          immediateRender: false,
          scrollTrigger: { trigger: street, start: "top 25%", end: "bottom bottom", scrub: 0.6 },
        });
      }
    });

    // Reduced motion: no flying. Each section cuts straight to its place.
    mm.add("(prefers-reduced-motion: reduce)", () => {
      BEAT_ORDER.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (!self.isActive) return;
            Object.assign(target, BEATS[id]);
            emit();
          },
        });
      });
    });
  });

  return null;
}
