"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BEAT_ORDER, BEATS, emit, SUB_BEATS, target } from "@/scene/store";

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
      // Tweens are created in scroll order so each one starts from where the previous one ended.
      BEAT_ORDER.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el && i > 0) {
          gsap.to(target, {
            ...BEATS[id],
            ease: "none",
            immediateRender: false,
            scrollTrigger: { trigger: el, start: "top bottom", end: "top 25%", scrub: 0.6 },
          });
        }
        const sub = SUB_BEATS[id];
        const subEl = sub && document.getElementById(sub.id);
        if (sub && subEl) {
          gsap.to(target, {
            ...sub.pose,
            ease: "none",
            immediateRender: false,
            scrollTrigger: { trigger: subEl, start: "top 85%", end: "top 35%", scrub: 0.6 },
          });
        }
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
        const sub = SUB_BEATS[id];
        const subEl = sub && document.getElementById(sub.id);
        if (sub && subEl) {
          ScrollTrigger.create({
            trigger: subEl,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => {
              if (!self.isActive) return;
              Object.assign(target, BEATS[id], sub.pose);
              emit();
            },
          });
        }
      });
    });
  });

  return null;
}
