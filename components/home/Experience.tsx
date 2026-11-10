"use client";

import { useEffect, useRef } from "react";
import Words from "@/components/Words";
import { lensTags } from "@/content/lens";
import { profile } from "@/content/profile";
import { timeline } from "@/content/timeline";
import { Filler, Milestone, Scene, type SceneKind } from "./RoadScenery";
import SectionLabel from "./SectionLabel";

// Oldest first: the road starts where I started and the car drives down to where I am now.
const entries = [...timeline].sort((a, b) => (a.span?.[0] ?? 0) - (b.span?.[0] ?? 0));
const START = entries[0]?.span?.[0] ?? 2021;
const COMPANIES = new Set(entries.filter((t) => t.kind === "Work" || t.kind === "Internship").map((t) => t.org)).size;
const TONES = ["bg-violet", "bg-mint", "bg-sun", "bg-lime", "bg-pink"];
const pad = (n: number) => String(n).padStart(2, "0");

const stops = entries.map((t, i) => {
  const ongoing = !!t.span && t.span[1] === null;
  const current = ongoing && t.kind === "Work";
  const next = entries[i + 1];
  const internshipsBefore = entries.slice(0, i).filter((e) => e.kind === "Internship").length;
  const scene: SceneKind =
    t.kind === "Independent"
      ? "home"
      : t.kind === "Freelance"
        ? "store"
        : t.kind === "Education"
          ? "campus"
          : t.kind === "Work"
            ? "warehouse"
            : internshipsBefore === 0
              ? "cones"
              : "servers";
  const badge =
    i === 0
      ? "First commit"
      : current
        ? "You are here"
        : t.kind === "Education"
          ? "Degree"
          : t.kind === "Freelance"
            ? "Side quest"
            : t.kind === "Internship" && next?.org === t.org
              ? "Got the offer"
              : t.kind === "Internship"
                ? "Level up"
                : null;
  return {
    t,
    n: pad(i + 1),
    current,
    status: current ? "◐ Driving" : ongoing ? "↻ Still running" : "Passed ✓",
    scene,
    badge,
    year: t.span?.[0] ?? START,
    tone: TONES[i % TONES.length],
  };
});

/**
 * Experience as a road trip. A road winds down the page through every stop; as you scroll, a car
 * drives along it, a pink route draws in behind, and each exit sign springs up as the car reaches it.
 * The road is built from the measured positions of the stops, so cards can be any height. Phones get
 * a straight road down the left edge. Reduced motion parks the car at the current stop.
 */
export default function Experience() {
  const box = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const car = useRef<SVGGElement>(null);
  const chip = useRef<HTMLDivElement>(null);
  const chipText = useRef<HTMLSpanElement>(null);
  const odo = useRef<HTMLDivElement>(null);

  // Odometer: years on the road, from the first stop to today (read on the client, so it never goes stale).
  useEffect(() => {
    const o = odo.current;
    if (!o) return;
    const d = new Date();
    const now = d.getFullYear() + (d.getMonth() + (d.getDate() - 1) / 31) / 12;
    const value = Math.min(99.99, Math.max(0, now - START)).toFixed(2).padStart(5, "0");
    o.querySelectorAll<HTMLElement>("[data-digit]").forEach((col) => {
      col.style.setProperty("--n", value[Number(col.dataset.digit)]);
    });
    const sr = o.querySelector("[data-sr]");
    if (sr) sr.textContent = `${Number(value)} years on the road`;
  }, []);

  useEffect(() => {
    const b = box.current;
    const s = svg.current;
    const c = car.current;
    const ch = chip.current;
    const chT = chipText.current;
    if (!b || !s || !c || !ch || !chT) return;
    const roads = Array.from(s.querySelectorAll<SVGPathElement>("[data-road]"));
    const trail = s.querySelector<SVGPathElement>("[data-trail]");
    if (!trail) return;
    const lampEls = Array.from(s.querySelectorAll<SVGGElement>("[data-lamp]"));
    const lg = window.matchMedia("(min-width: 1024px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    let W = 0;
    let L = 0;
    let wide = false;
    let startY = 0;
    let parkY = 0;
    let raf = 0;
    let label = "";
    let chipW = 0;
    // The road's length at evenly spaced points along it, with the y at each. The road only ever
    // runs downward, so y rises with length and a target height is found by binary search.
    let ys = new Float64Array(0);
    let ls = new Float64Array(0);
    let rows: { li: HTMLElement; y: number; year: number; on: boolean }[] = [];
    let lamps: { el: SVGGElement; y: number; on: boolean }[] = [];
    let lastY = -1;
    let idle = 0;

    const build = () => {
      W = b.clientWidth;
      const H = b.offsetHeight;
      wide = lg.matches;
      rows = Array.from(b.querySelectorAll<HTMLElement>("[data-stop]")).map((li) => ({
        li,
        y: li.offsetTop + li.offsetHeight / 2,
        year: Number(li.dataset.year),
        on: li.hasAttribute("data-on"),
      }));
      if (!rows.length || !W) return;
      const mid = wide ? W / 2 : 26;
      // On wide screens the road swings well away from each card: right for cards on the left. Phones
      // get a gentle wiggle down the left edge.
      const swing = (i: number) => (wide ? W * (i % 2 === 0 ? 0.71 : 0.29) : mid + (i % 2 === 0 ? 7 : -7));
      const pts: [number, number][] = [[mid, 0], ...rows.map((r, i): [number, number] => [swing(i), r.y]), [mid, H]];
      let d = `M${pts[0][0]} ${pts[0][1]}`;
      for (let i = 1; i < pts.length; i++) {
        const [x0, y0] = pts[i - 1];
        const [x1, y1] = pts[i];
        // Long vertical handles give full, round S-bends; under the segment height the road still only runs downward.
        const k = (y1 - y0) * 0.62;
        d += ` C${x0} ${y0 + k} ${x1} ${y1 - k} ${x1} ${y1}`;
      }
      s.setAttribute("viewBox", `0 0 ${W} ${H}`);
      s.setAttribute("width", String(W));
      s.setAttribute("height", String(H));
      for (const p of roads) p.setAttribute("d", d);
      L = trail.getTotalLength();
      const n = Math.max(2, Math.ceil(L / 6));
      ys = new Float64Array(n + 1);
      ls = new Float64Array(n + 1);
      for (let i = 0; i <= n; i++) {
        ls[i] = (L * i) / n;
        ys[i] = trail.getPointAtLength(ls[i]).y;
      }
      trail.style.strokeDasharray = `${L} ${L}`;
      // Street lamps stand between stops, where the road crosses the middle, alternating sides.
      lamps = lampEls.map((el, i) => {
        const a = rows[i];
        const z = rows[i + 1];
        if (!wide || !a || !z) {
          el.style.display = "none";
          return { el, y: Infinity, on: false };
        }
        const y = (a.y + z.y) / 2;
        const l = lengthAt(y);
        const pt = trail.getPointAtLength(l);
        const ahead = trail.getPointAtLength(Math.min(L, l + 2));
        // Stand the lamp on the upper verge: step off the centre line along the road's normal,
        // on whichever side faces up the page, so the post never stands on the tarmac.
        let nx = -(ahead.y - pt.y);
        let ny = ahead.x - pt.x;
        const len = Math.hypot(nx, ny) || 1;
        if (ny > 0) {
          nx = -nx;
          ny = -ny;
        }
        const gap = 52;
        el.style.display = "";
        el.setAttribute("transform", `translate(${pt.x + (nx / len) * gap} ${pt.y + (ny / len) * gap})`);
        return { el, y, on: el.hasAttribute("data-on") };
      });
      startY = wide ? 72 : 44;
      parkY = rows[rows.length - 1].y;
      c.style.visibility = "visible";
    };

    function lengthAt(y: number) {
      let lo = 0;
      let hi = ys.length - 1;
      while (hi - lo > 1) {
        const m = (lo + hi) >> 1;
        if (ys[m] < y) lo = m;
        else hi = m;
      }
      const span = ys[hi] - ys[lo];
      return ls[lo] + (span > 0 ? ((y - ys[lo]) / span) * (ls[hi] - ls[lo]) : 0);
    }

    const update = () => {
      raf = 0;
      if (!L) return;
      const top = b.getBoundingClientRect().top;
      const y = still.matches ? parkY : Math.min(parkY, Math.max(startY, window.innerHeight * 0.55 - top));
      const l = lengthAt(y);
      const p = trail.getPointAtLength(l);
      const q = trail.getPointAtLength(Math.min(L, l + 2));
      const angle = q.y === p.y && q.x === p.x ? 0 : (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI - 90;
      c.setAttribute("transform", `translate(${p.x} ${p.y}) rotate(${angle}) scale(${wide ? 1 : 0.7})`);
      trail.style.strokeDashoffset = String(L - l);

      for (const m of lamps) {
        const on = y >= m.y;
        if (on !== m.on) {
          m.on = on;
          m.el.toggleAttribute("data-on", on);
        }
      }
      // While the car is moving it bobs and puffs exhaust; it settles a moment after scrolling stops.
      if (lastY >= 0 && Math.abs(y - lastY) > 0.5) {
        b.setAttribute("data-moving", "");
        clearTimeout(idle);
        idle = window.setTimeout(() => b.removeAttribute("data-moving"), 220);
      }
      lastY = y;
      for (const r of rows) {
        const on = y >= r.y - 40;
        if (on !== r.on) {
          r.on = on;
          r.li.toggleAttribute("data-on", on);
        }
      }

      // The year under the car, eased between the stops' start years; "Now" once it reaches the last.
      let text = "Now";
      if (y < parkY) {
        let i = 0;
        while (i < rows.length - 1 && rows[i + 1].y <= y) i++;
        const a = rows[i];
        const z = rows[i + 1];
        const year = !z || y <= a.y ? a.year : a.year + ((z.year - a.year) * (y - a.y)) / (z.y - a.y);
        text = String(Math.floor(year));
      }
      if (text !== label) {
        label = text;
        chT.textContent = text;
        chipW = ch.offsetWidth;
      }
      const dx = p.x > W / 2 ? -(chipW + 34) : 34;
      ch.style.transform = `translate(${p.x + dx}px, ${p.y - 15}px)`;
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onScroll = () => schedule();
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          window.addEventListener("scroll", onScroll, { passive: true });
          schedule();
        } else window.removeEventListener("scroll", onScroll);
      },
      { rootMargin: "50% 0px" },
    );
    const ro = new ResizeObserver(() => {
      build();
      schedule();
    });
    const onMotion = () => schedule();
    still.addEventListener("change", onMotion);
    build();
    update();
    io.observe(b);
    ro.observe(b);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(idle);
      io.disconnect();
      ro.disconnect();
      still.removeEventListener("change", onMotion);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section id="experience" aria-labelledby="experience-title" className="edge overflow-x-clip pb-6">
      <SectionLabel id="experience">Experience</SectionLabel>

      <div className="grid gap-10 pb-4 pt-16 lg:grid-cols-[1fr_auto] lg:items-start">
        <div className="grid gap-6">
          <p className="t-label" data-reveal>
            Experience · <span className="text-pink-deep">The road so far</span>
          </p>
          <h2 id="experience-title" className="t-display split" data-reveal>
            <span className="block">
              <Words text="Miles" />
            </span>
            <span className="block pl-[0.5em]">
              <Words text="travelled" />
              <span aria-hidden="true" className="ml-[0.04em] inline-block h-[0.14em] w-[0.14em] bg-pink-deep" />
            </span>
          </h2>
          <p className="voice-sm muted ink-in max-w-[46ch]" data-reveal>
            Building since 2021: my own products first, then freelance Android, a B.Tech in AI and ML, internships at Bluestock and Moglix, and now software engineer at Moglix.
          </p>
        </div>

        <div className="grid justify-items-start gap-5 lg:justify-items-end lg:pt-6">
          <div ref={odo} className="odo w-[min(100%,330px)] rotate-[1.5deg] rounded-[20px] border-[1.5px] border-ink bg-ink p-5 text-card shadow-[6px_6px_0_0_var(--color-pink-deep)]" data-reveal>
            <span data-sr className="sr-only" />
            <div className="t-micro flex justify-between gap-4 opacity-80" aria-hidden="true">
              <span>Odometer</span>
              <span>Since {Math.floor(START)}</span>
            </div>
            <div className="my-3.5 flex items-end gap-1.5" aria-hidden="true">
              {"00.00".split("").map((ch, i) =>
                ch === "." ? (
                  <span key={i} className="pb-1 font-display text-[28px] leading-none">.</span>
                ) : (
                  <span key={i} className={`h-12 w-10 overflow-hidden rounded-md border-[1.5px] ${i === 4 ? "border-pink-deep bg-pink-deep text-[#121016]" : "border-[#3a3447] bg-[#1d1a24] text-[#f2eefb]"}`}>
                    <span data-digit={i} className="odo-col block" style={{ ["--i" as string]: i }}>
                      {Array.from({ length: 10 }, (_, d) => (
                        <span key={d} className="block h-[45px] text-center font-display text-[30px] leading-[45px]">{d}</span>
                      ))}
                    </span>
                  </span>
                ),
              )}
              <span className="t-label pb-1 pl-1 normal-case opacity-80">yrs</span>
            </div>
            <div className="t-micro flex justify-between gap-4" aria-hidden="true">
              <span>
                {entries.length} stops · {COMPANIES} companies
              </span>
              <span className="flex items-center gap-1.5 text-pink">
                <span className="dot pulse !h-1.5 !w-1.5 !bg-pink" /> On the road
              </span>
            </div>
          </div>
          <a href={profile.resume} className="t-label border-b-[1.5px] border-ink pb-1 hover:text-blue">
            Download résumé ↓
          </a>
        </div>
      </div>

      <div ref={box} className="road relative mx-auto max-w-[1440px]">
        {/* The road, its centre line and the route drawn behind the car. Built on the client from the stops' positions. */}
        <svg ref={svg} aria-hidden="true" className="pointer-events-none absolute left-0 top-0 overflow-visible">
          <path data-road className="road-edge" />
          <path data-road className="road-tar" />
          <path data-road className="road-side" />
          <path data-road className="road-inner" />
          <path data-road className="road-dash" />
          <path data-road data-trail className="road-trail" />
          {stops.slice(1).map((s) => (
            <g key={s.n} data-lamp className="road-lamp" style={{ display: "none" }}>
              <ellipse cx="0" cy="2" rx="16" ry="4" className="road-lamp-pool" />
              <path d="M0 0 V-64 Q0 -72 10 -72 H20" className="road-lamp-post" />
              <path d="M14 -72 H30 L26 -66 H18 Z" className="road-lamp-head" />
              <circle cx="22" cy="-63" r="4" className="road-lamp-bulb" />
            </g>
          ))}
          <g ref={car} style={{ visibility: "hidden" }}>
            <g className="road-car">
              {/* Exhaust, out of the back (the car faces down, +y). */}
              <circle cx="-6" cy="-30" r="5" className="road-puff" style={{ ["--d" as string]: "0ms" }} />
              <circle cx="5" cy="-31" r="4" className="road-puff" style={{ ["--d" as string]: "200ms" }} />
              <circle cx="0" cy="-30" r="4.5" className="road-puff" style={{ ["--d" as string]: "400ms" }} />
              {/* Headlight beams */}
              <path d="M-11 26 L-22 62 H-2 Z M11 26 L2 62 H22 Z" className="road-car-beam" />
              <rect x="-12" y="-21" width="30" height="52" rx="11" className="road-car-shadow" />
              <rect x="-19" y="-17" width="5" height="10" rx="2" className="road-car-tyre" />
              <rect x="14" y="-17" width="5" height="10" rx="2" className="road-car-tyre" />
              <rect x="-19" y="9" width="5" height="10" rx="2" className="road-car-tyre" />
              <rect x="14" y="9" width="5" height="10" rx="2" className="road-car-tyre" />
              <rect x="-15" y="-26" width="30" height="52" rx="11" className="road-car-body" />
              <rect x="-3" y="-26" width="6" height="52" className="road-car-stripe" />
              <rect x="-11" y="4" width="22" height="12" rx="3.5" className="road-car-glass" />
              <rect x="-10" y="-19" width="20" height="8" rx="3" className="road-car-glass" />
              <rect x="-11" y="-9" width="22" height="11" rx="2" className="road-car-roof" />
              <path d="M-15 6 L-19 4 M15 6 L19 4" className="road-car-mirror" />
              <circle cx="-9" cy="24" r="2.6" className="road-car-light" />
              <circle cx="9" cy="24" r="2.6" className="road-car-light" />
              <rect x="-12" y="-27" width="5" height="2.5" rx="1" className="road-car-tail" />
              <rect x="7" y="-27" width="5" height="2.5" rx="1" className="road-car-tail" />
            </g>
          </g>
        </svg>

        {/* Start line */}
        <div className="relative h-24 lg:h-40" aria-hidden="true">
          <div className="absolute left-[60px] top-5 flex items-center gap-3 lg:left-[calc(50%+64px)] lg:top-12">
            <span className="checker h-8 w-12 border-[1.5px] border-ink" />
            <span className="t-label">Start · {Math.floor(START)}</span>
          </div>
        </div>

        <ol className="grid gap-12 lg:gap-0">
          {stops.map((s, i) => {
            const left = i % 2 === 0;
            const { t } = s;
            return (
              <li
                key={`${t.org}-${t.title}`}
                data-stop
                data-year={s.year}
                className={`road-stop relative grid pl-[60px] lg:min-h-[560px] lg:grid-cols-2 lg:items-center lg:pl-0 ${left ? "stop-left" : "stop-right"}`}
              >
                <div className={`stop-tilt relative lg:row-start-1 lg:w-[80%] ${left ? "lg:col-start-1 lg:justify-self-start" : "lg:col-start-2 lg:justify-self-end"}`} style={{ ["--rot" as string]: left ? "-0.8deg" : "1deg" }}>
                  <article className="stop-card relative" data-reveal>
                    <span aria-hidden="true" className={`stop-sheet absolute inset-0 rounded-[22px] border-[1.5px] border-ink ${s.current ? "bg-ink" : s.tone}`} />
                    <div className={`stop-front relative grid gap-4 rounded-[22px] border-[1.5px] border-ink p-6 md:p-7 ${s.current ? "bg-pink" : "bg-card"}`}>
                      {s.badge && (
                        <span className={`t-label absolute -top-4 right-5 rotate-[3deg] rounded-full border-[1.5px] border-ink px-3.5 py-2 ${s.current ? "bg-ink text-lime" : "bg-sun text-[#121016]"}`}>
                          ★ {s.badge}
                        </span>
                      )}
                      <div className="t-micro flex items-center justify-between gap-3 border-b-[1.5px] border-ink/25 pb-3 font-mono tracking-[0.16em]">
                        <span>
                          Stop {s.n}
                          <span className="lg:hidden"> · Exit {s.n}</span>
                        </span>
                        <span className={`stop-status rounded-full border-[1.5px] px-2 py-0.5 ${s.current ? "border-ink bg-ink text-lime" : "border-ink/30"}`}>{s.status}</span>
                      </div>
                      <div className="grid gap-1.5">
                        <h3 className="t-h2 md:text-[32px]">{t.title}</h3>
                        <p className={`t-label font-mono tracking-[0.12em] ${s.current ? "" : "text-pink-deep"}`}>
                          {t.org}
                          {t.org !== t.kind && <span> · {t.kind}</span>} · {t.period}
                        </p>
                      </div>
                      <ul className="grid gap-1.5 text-[15.5px] leading-snug">
                        {t.points.map((p) => (
                          <li key={p} className="grid grid-cols-[20px_1fr]" data-lens-tags={lensTags(p)}>
                            <span aria-hidden="true" className={s.current ? "" : "text-pink-deep"}>→</span>
                            {p}
                          </li>
                        ))}
                      </ul>
                      {t.tags && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="t-micro mr-1 font-mono tracking-[0.14em] opacity-60">Picked up</span>
                          <ul className="contents" aria-label="Technologies">
                            {t.tags.map((tag) => (
                              <li key={tag} className="t-micro rounded-full border-[1.5px] border-ink px-2.5 py-1">
                                {tag}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </article>
                </div>

                {/* Roadside: the exit sign by the road, scenery out towards the edge. Wide screens only. */}
                <div aria-hidden="true" className={`relative hidden h-full lg:row-start-1 lg:block ${left ? "lg:col-start-2" : "lg:col-start-1"}`}>
                  <div className={`road-filler absolute top-6 ${left ? "right-[3%]" : "left-[3%]"}`}>
                    <Filler i={i} />
                  </div>
                  <div className={`road-milestone absolute top-10 ${left ? "right-[calc(3%+220px)]" : "left-[calc(3%+220px)]"} xl:top-16`}>
                    <Milestone year={s.year} />
                  </div>
                  <div className={`exit-sign absolute top-1/2 w-[min(240px,46%)] -translate-y-[60%] ${left ? "left-[52%]" : "right-[52%]"}`}>
                    <div className="exit-face relative rounded-[14px] border-[1.5px] border-ink bg-ink px-5 pb-4 pt-3.5 text-card">
                      <span aria-hidden="true" className="absolute right-4 top-2.5 font-display text-[26px] leading-none text-pink">{left ? "↘" : "↙"}</span>
                      <span className={`exit-no t-micro inline-block rounded-[5px] px-2 py-1 font-mono tracking-[0.14em] text-[#121016] ${s.tone}`}>Exit {s.n}</span>
                      <p className="mt-2 font-display text-[clamp(26px,2.5vw,38px)] uppercase leading-[0.95]">{t.org}</p>
                      <p className="t-micro mt-2 font-mono tracking-[0.16em] opacity-75">
                        {Math.floor(s.year)} · {s.current ? "Now" : t.kind}
                      </p>
                    </div>
                    <div className="flex justify-between px-[18%]">
                      <span className="h-10 w-[1.5px] bg-ink" />
                      <span className="h-10 w-[1.5px] bg-ink" />
                    </div>
                  </div>
                  <div className={`road-scene absolute bottom-3 w-[min(220px,42%)] ${left ? "right-0" : "left-0"}`}>
                    <Scene kind={s.scene} />
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Where the road runs on: it fades out past the current stop. */}
        <div className="relative h-[300px] lg:h-[380px]">
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 z-[1] h-[85%] bg-linear-to-b from-transparent to-paper" />
          <div className="absolute left-[60px] top-28 z-[2] flex flex-wrap items-center gap-3 lg:left-[calc(50%+70px)] lg:top-36">
            <span className="t-micro rounded-full border-[1.5px] border-dashed border-ink bg-paper px-3.5 py-2 font-mono tracking-[0.16em]">To be continued…</span>
            <a href="#contact" className="btn-pill rotate-[-2deg]">
              Next exit → ?
            </a>
          </div>
        </div>

        {/* The year under the car. */}
        <div ref={chip} aria-hidden="true" className="road-chip t-micro pointer-events-none absolute left-0 top-0 z-[3] hidden items-center gap-1.5 rounded-full border-[1.5px] border-ink bg-sun px-3 py-1.5 font-mono tracking-[0.14em] text-[#121016] lg:flex">
          ◐ <span ref={chipText}>{Math.floor(START)}</span>
        </div>
      </div>
    </section>
  );
}
