"use client";

import gsap from "gsap";
import { useEffect } from "react";
import { signals } from "./store";

/**
 * The entrance: the camera swoops down from above the town onto the square. Runs once, only when
 * the visitor starts at the top of the page, and waits for the boot sequence to finish.
 */
export default function IntroDirector({ reduced }: { reduced: boolean }) {
  useEffect(() => {
    if (reduced || window.scrollY > window.innerHeight * 0.4) {
      signals.intro = 1;
      return;
    }
    const bootShown = document.documentElement.dataset.bootInitial !== "skip";
    const delay = bootShown ? Math.max(0, 1.6 - performance.now() / 1000) : 0.1;
    signals.intro = 0;
    // Keep real time even if the first frames are slow, so the entrance never stalls.
    gsap.ticker.lagSmoothing(0);
    const tween = gsap.to(signals, {
      intro: 1,
      duration: 2.8,
      delay,
      ease: "none",
    });
    return () => {
      tween.kill();
      signals.intro = 1;
    };
  }, [reduced]);
  return null;
}
