"use client";

import { useEffect, useRef, useState } from "react";
import { achievements } from "@/content/achievements";
import { publicSystems } from "@/content/systems";
import { timeline } from "@/content/timeline";

const KEY = "ramiz-splash";

// The boot log: each line appears once the counter passes its threshold. Counts come from the content.
const LOG = [
  { at: 8, text: "connecting to portfolio db" },
  { at: 30, text: `loading ${publicSystems.length} systems` },
  { at: 52, text: `loading ${timeline.length} roles` },
  { at: 72, text: `loading ${achievements.length} achievements` },
  { at: 92, text: "warming up the cursor" },
];

/**
 * Runs in <head> before first paint: the splash shows once per visit, never with reduced motion.
 * A failsafe lifts it after 7s in case the page's JavaScript never runs.
 */
export const splashScript = `try{var d=document.documentElement;if(!sessionStorage.getItem('${KEY}')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){d.dataset.splash='on';setTimeout(function(){if(d.dataset.splash==='on')d.dataset.splash='done'},7000)}}catch(e){}`;

/**
 * A short boot screen: the mascot pops in, a counter runs to 100 (holding at 90 until the page has
 * really finished loading), boot-log lines tick off, then a lime and an ink curtain sweep up to
 * reveal the hero, whose entrance animations start only then. Click or any key skips it.
 */
export default function Splash() {
  const [n, setN] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const done = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.splash !== "on") return;
    let loaded = document.readyState === "complete";
    const onLoad = () => (loaded = true);
    window.addEventListener("load", onLoad);
    const start = performance.now();
    let raf = 0;
    let shown = 0;

    const finish = () => {
      if (done.current) return;
      done.current = true;
      cancelAnimationFrame(raf);
      setN(100);
      setLeaving(true);
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      // Hand over to the hero once the curtains have cleared.
      window.setTimeout(() => {
        root.dataset.splash = "done";
      }, 900);
    };

    const tick = (now: number) => {
      const t = (now - start) / 1600;
      // Eases to 90 on its own; the last stretch waits for the real load event, but never past ~2s.
      if (t > 1.25) loaded = true;
      const target = loaded ? Math.min(100, 90 + (t - 1) * 60) : Math.min(90, 90 * (1 - Math.pow(1 - Math.min(t, 1), 3)));
      shown = Math.max(shown, Math.floor(target));
      setN(shown);
      if (shown >= 100) {
        window.setTimeout(finish, 250);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const skip = () => finish();
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
  }, []);

  return (
    <div className={`splash fixed inset-0 z-[500] ${leaving ? "splash-leaving" : ""}`} aria-hidden="true">
      {/* Curtains: ink on top, lime peeking below it as they sweep up */}
      <div className="splash-curtain splash-lime absolute inset-0 bg-lime" />
      <div className="splash-curtain splash-ink absolute inset-0 grid place-items-center bg-paper">
        <div className="splash-content grid w-[min(560px,88vw)] gap-8">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element -- shown before the page is interactive; a plain img loads soonest */}
            <img src="/images/mascot-face.webp" alt="" width={88} height={88} className="splash-face h-[72px] w-[72px] rounded-full border-[2px] border-ink bg-sun md:h-[88px] md:w-[88px]" />
            <div className="grid gap-1">
              <p className="t-h2">Mohammad Ramiz</p>
              <p className="t-label muted">Booting portfolio…</p>
            </div>
          </div>
          <div className="grid gap-4 md:flex md:items-end md:justify-between md:gap-6">
            <p className="font-display text-[clamp(96px,22vw,200px)] leading-[0.8] tabular-nums">
              {String(n).padStart(3, "0")}
            </p>
            <ul className="grid gap-1.5 pb-2 font-mono text-[12px] md:text-right md:text-[13px]">
              {LOG.map((l) => (
                <li key={l.text} className={`transition-opacity duration-300 ${n >= l.at ? "opacity-100" : "opacity-0"}`}>
                  <span className="muted">$ </span>
                  {l.text}… <span className="text-pink-deep">ok</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="h-2 overflow-hidden rounded-full border-[1.5px] border-ink">
            <div className="h-full rounded-full bg-pink-deep" style={{ width: `${n}%` }} />
          </div>
          <p className="t-micro muted">Click or press any key to skip</p>
        </div>
      </div>
    </div>
  );
}
