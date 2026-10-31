"use client";

import Words from "@/components/Words";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { moments } from "@/content/moments";
import SectionLabel from "./SectionLabel";

const TAPES = ["bg-lime", "bg-pink", "bg-sun", "bg-violet", "bg-mint"];
const sorted = [...moments].sort((a, b) => a.when - b.when);
const PIN = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

/**
 * A photo timeline. On wide screens the section pins while you scroll: the strip of polaroids
 * slides sideways, a pink line fills along the track, and the mascot's face rides the line,
 * bringing each photo into focus as it passes. Elsewhere it is a simple list (phones) or a
 * swipeable row (reduced motion).
 */
export default function Moments() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const rider = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia(PIN);
    let raf = 0;
    const items = () => Array.from(list.current?.children ?? []) as HTMLElement[];

    const update = () => {
      raf = 0;
      const s = section.current;
      const t = track.current;
      if (!s || !t) return;
      if (!mq.matches) {
        t.style.transform = "";
        items().forEach((el) => el.removeAttribute("data-on"));
        return;
      }
      const r = s.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight)));
      const travel = Math.max(0, t.scrollWidth - t.parentElement!.clientWidth);
      t.style.transform = `translate3d(${-p * travel}px,0,0)`;
      const head = p * t.scrollWidth; // where the rider is, in track coordinates
      if (fill.current) fill.current.style.width = `${head}px`;
      if (rider.current) rider.current.style.transform = `translate3d(${head}px,0,0) translateX(-50%)`;
      // A photo comes into focus once the rider is close to it.
      items().forEach((el) => {
        const centre = el.offsetLeft + el.offsetWidth / 2;
        el.toggleAttribute("data-on", head > centre - el.offsetWidth * 0.9);
      });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    mq.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      mq.removeEventListener("change", schedule);
    };
  }, []);

  return (
    <section ref={section} id="moments" aria-labelledby="moments-title" className="moments-pin" style={{ ["--n" as string]: sorted.length }}>
      <div className="moments-stage edge flex flex-col">
        <SectionLabel n={2}>Moments</SectionLabel>
        <div className="grid gap-4 pb-8 pt-12 lg:grid-cols-[1fr_auto] lg:items-end lg:pb-4 lg:pt-8">
          <h2 id="moments-title" className="t-h1 split" data-reveal>
            <Words text="Places I’ve been." />
          </h2>
          <p className="voice-sm muted max-w-[44ch]" data-reveal>
            Hackathons, an internship, a patent — the moments behind the work, oldest first.
          </p>
        </div>

        <div className="moments-window relative lg:flex-1">
          {/* Everything that slides: the photos, and the line they hang from. */}
          <div ref={track} className="relative lg:h-full lg:w-max">
            <ol ref={list} className="grid gap-12 pb-16 lg:flex lg:h-full lg:items-end lg:gap-16 lg:pb-12 lg:pl-[8vw] lg:pr-[30vw]">
              {sorted.map((m, i) => (
                <li key={m.title} className="moment grid justify-items-center gap-4 lg:shrink-0" style={{ ["--rot" as string]: `${i % 2 ? 2.5 : -2.5}deg`, ["--y" as string]: i % 2 ? "-36px" : "0px" }}>
                  <figure data-cursor="View" className="moment-card relative w-[min(360px,86vw)] lg:w-[min(420px,30vw)] rounded-[20px] border-[1.5px] border-ink bg-card p-3 pb-5" data-reveal>
                    <span aria-hidden="true" className={`absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rotate-[-3deg] border-[1.5px] border-ink/40 opacity-90 ${TAPES[i % TAPES.length]}`} />
                    <div className={`relative aspect-[4/3] overflow-hidden rounded-[12px] border-[1.5px] border-ink ${m.fit === "contain" ? "bg-card" : "bg-line"}`}>
                      <Image src={m.image.src} alt={m.image.alt} fill sizes="(min-width: 1024px) 420px, 86vw" className={m.fit === "contain" ? "object-contain p-1" : "object-cover"} />
                    </div>
                    <figcaption className="grid gap-2 px-1 pt-4">
                      <p className="t-label flex items-center gap-1.5">
                        <svg viewBox="0 0 12 16" className="h-3.5 w-3 shrink-0" aria-hidden="true"><path d="M6 0a6 6 0 0 1 6 6c0 4.5-6 10-6 10S0 10.5 0 6a6 6 0 0 1 6-6Zm0 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" fill="#c93a63" /></svg>
                        {m.place}
                      </p>
                      <p className="t-h2 !text-[24px]">{m.title}</p>
                      {m.caption && <p className="text-[15px] leading-snug text-muted">{m.caption}</p>}
                    </figcaption>
                  </figure>
                  {/* Date pin, sitting on the line */}
                  <p className="t-label relative z-[1] rounded-full border-[1.5px] border-ink bg-sun px-3 py-1.5">{m.date}</p>
                </li>
              ))}
            </ol>
            {/* The line, its pink fill and the rider; only shown in the pinned layout. */}
            <div aria-hidden="true" className="moments-line pointer-events-none absolute inset-x-0 bottom-[calc(3rem+16px)] hidden h-0">
              <div className="absolute inset-x-0 top-0 border-t-[2px] border-dashed border-ink/40" />
              <div ref={fill} className="absolute left-0 top-0 h-[4px] -translate-y-1/2 rounded-full bg-pink-deep" style={{ width: 0 }} />
              <div ref={rider} className="absolute left-0 top-0 mt-[8px] h-11 w-11 overflow-hidden rounded-full border-[2px] border-ink bg-sun">
                <Image src="/images/mascot-face.webp" alt="" width={112} height={112} className="h-full w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
