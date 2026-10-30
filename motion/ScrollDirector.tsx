"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BEAT_ORDER, BEATS, emit, target } from "@/scene/store";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * GSAP owns everything scroll-linked. It never touches the DOM: it only moves the
 * scene's target pose between the beats, one section at a time.
 */
export default function ScrollDirector() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      Object.assign(target, BEATS.hero);
      BEAT_ORDER.slice(1).forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        gsap.to(target, {
          ...BEATS[id],
          ease: "none",
          immediateRender: false,
          scrollTrigger: { trigger: el, start: "top bottom", end: "top 25%", scrub: 0.6 },
        });
      });
    });

    // Reduced motion: no scrubbing. Each section snaps the core to a still pose.
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
