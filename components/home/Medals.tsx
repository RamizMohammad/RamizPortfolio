"use client";

import { useEffect, useRef } from "react";
import type { Achievement } from "@/content/achievements";

/** The medal face: the placing itself, shortened to fit (6th, F, SF, L1, ★). */
function face(status: string) {
  const place = status.match(/(\d+)(st|nd|rd|th)/i);
  if (place) return { big: place[1], small: place[2].toLowerCase() };
  if (/semi/i.test(status)) return { big: "SF", small: "" };
  if (/finalist/i.test(status)) return { big: "F", small: "" };
  const level = status.match(/level (\d+)/i);
  if (level) return { big: `L${level[1]}`, small: "" };
  return { big: "★", small: "" };
}

// Ribbon stripes: [base, stripe] per medal.
const RIBBONS = [
  ["#2f5bea", "#f47a9a"],
  ["#c93a63", "#ffcf3a"],
  ["#5fd3a4", "#121016"],
  ["#b9a6f5", "#2f5bea"],
  ["#ffcf3a", "#c93a63"],
  ["#121016", "#d4f25b"],
];
// Hackathon medals are gold; competition medals are silver. The metal marks the kind of event, not a rank.
const METAL = {
  gold: { rim: ["#8a5a00", "#ffe08a", "#b07a10", "#fff3c4", "#9c6a08"], face: ["#fff1b8", "#f2c14e", "#c48a14"], ink: "#5a3a00" },
  silver: { rim: ["#5d6470", "#f4f6fa", "#8a919c", "#ffffff", "#6b727d"], face: ["#ffffff", "#d5dae2", "#9aa2ae"], ink: "#3a404a" },
};

function Laurel({ color }: { color: string }) {
  // Leaves along an arc on each side of the face.
  const leaves = Array.from({ length: 7 }, (_, i) => i);
  return (
    <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
      {[1, -1].map((side) => (
        <g key={side} transform={side === -1 ? "translate(100 0) scale(-1 1)" : undefined}>
          {leaves.map((i) => {
            // From the bottom of the face up its left side; leaves lie along the curve.
            const deg = 250 - i * 19;
            const a = (deg * Math.PI) / 180;
            const x = 50 + Math.cos(a) * 36;
            const y = 50 - Math.sin(a) * 36;
            return <ellipse key={i} cx={x} cy={y} rx="2.4" ry="5.5" transform={`rotate(${-deg + 180 + 25} ${x} ${y})`} fill={color} opacity="0.5" />;
          })}
        </g>
      ))}
    </svg>
  );
}

type Body = { angle: number; vel: number; tilt: number; dragging: boolean; lastX: number };

/**
 * Hackathon and competition results as real medals hanging on ribbons. Each is a damped spring
 * pendulum: brush the mouse across it to set it swinging, grab and fling it, and scrolling jostles
 * the whole wall. The light on the metal shifts with the swing. Reduced motion keeps them still.
 */
export default function Medals({ results }: { results: Achievement[] }) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bodies: Body[] = results.map(() => ({ angle: 0, vel: 0, tilt: 0, dragging: false, lastX: 0 }));
    let raf = 0;
    let last = performance.now();
    let lastScroll = window.scrollY;
    let visible = false;

    const step = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      // Scrolling gives every medal a small nudge, alternating directions so the wall feels loose.
      const dy = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      bodies.forEach((b, i) => {
        if (!b.dragging) {
          b.vel += dy * 0.06 * (i % 2 ? 1 : -1);
          // Pendulum: restoring force, damping.
          b.vel += (-38 * b.angle - 2.4 * b.vel) * dt;
          b.angle += b.vel * dt;
          b.angle = Math.max(-1.2, Math.min(1.2, b.angle));
        }
        b.tilt += (b.vel * 0.25 - b.tilt) * 0.2;
        const el = refs.current[i];
        if (el) {
          el.style.transform = `rotate(${b.angle}rad)`;
          el.style.setProperty("--shine", `${50 + b.angle * 90}%`);
          el.style.setProperty("--turn", `${b.tilt * 40}deg`);
        }
      });
      raf = visible ? requestAnimationFrame(step) : 0;
    };
    const wake = () => {
      if (!raf && visible) {
        last = performance.now();
        raf = requestAnimationFrame(step);
      }
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      wake();
    });
    const wall = refs.current[0]?.closest("ul");
    if (wall) io.observe(wall);

    const cleanups = refs.current.map((el, i) => {
      if (!el) return () => {};
      const b = bodies[i];
      const pivot = () => {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top };
      };
      // Brushing past pushes the medal along with the mouse.
      const brush = (e: PointerEvent) => {
        if (b.dragging || e.pointerType !== "mouse") return;
        b.vel += e.movementX * 0.05;
        wake();
      };
      // Grab and drag: the medal points at the pointer; releasing keeps the swing speed.
      const grab = (e: PointerEvent) => {
        b.dragging = true;
        b.lastX = e.clientX;
        el.setPointerCapture(e.pointerId);
        wake();
      };
      const drag = (e: PointerEvent) => {
        if (!b.dragging) return;
        const p = pivot();
        const next = Math.max(-1.2, Math.min(1.2, Math.atan2(-(e.clientX - p.x), Math.max(40, e.clientY - p.y))));
        b.vel = (next - b.angle) * 30;
        b.angle = next;
      };
      const drop = () => {
        b.dragging = false;
      };
      el.addEventListener("pointerenter", brush);
      el.addEventListener("pointermove", brush);
      el.addEventListener("pointerdown", grab);
      el.addEventListener("pointermove", drag);
      el.addEventListener("pointerup", drop);
      el.addEventListener("pointercancel", drop);
      return () => {
        el.removeEventListener("pointerenter", brush);
        el.removeEventListener("pointermove", brush);
        el.removeEventListener("pointerdown", grab);
        el.removeEventListener("pointermove", drag);
        el.removeEventListener("pointerup", drop);
        el.removeEventListener("pointercancel", drop);
      };
    });
    window.addEventListener("scroll", wake, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      cleanups.forEach((c) => c());
      window.removeEventListener("scroll", wake);
    };
  }, [results]);

  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-6" aria-label="Hackathon and competition results">
      {results.map((a, i) => {
        const f = face(a.status);
        const m = a.kind === "Competition" ? METAL.silver : METAL.gold;
        const [base, stripe] = RIBBONS[i % RIBBONS.length];
        return (
          <li key={a.title} className="medal grid justify-items-center gap-4 text-center" data-reveal style={{ ["--rd" as string]: `${i * 110}ms` }}>
            <div className="medal-swing">
              {/* The physics rotates this; the drop-in animation is on its parent. */}
              <div
                ref={(el) => {
                  refs.current[i] = el;
                }}
                data-cursor="swing me"
                className="medal-body grid touch-none select-none justify-items-center"
                style={{ transformOrigin: "50% 0" }}
                aria-hidden="true"
              >
                {/* Ribbon: a V of striped fabric */}
                <svg viewBox="0 0 64 76" className="h-[76px] w-16 drop-shadow-[0_2px_0_rgb(0_0_0/0.15)]">
                  <defs>
                    <pattern id={`stripe-${i}`} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(90)">
                      <rect width="10" height="10" fill={base} />
                      <rect width="3" height="10" x="3.5" fill={stripe} />
                    </pattern>
                    <linearGradient id={`fold-${i}`} x1="0" x2="1">
                      <stop offset="0" stopColor="#000" stopOpacity="0.25" />
                      <stop offset="0.5" stopColor="#000" stopOpacity="0" />
                      <stop offset="1" stopColor="#000" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                  <path d="M2 0h24l18 70H28z" fill={`url(#stripe-${i})`} stroke="#121016" strokeWidth="1.5" />
                  <path d="M62 0H38L20 70h16z" fill={`url(#stripe-${i})`} stroke="#121016" strokeWidth="1.5" />
                  <path d="M2 0h24l18 70H28zM62 0H38L20 70h16z" fill={`url(#fold-${i})`} />
                </svg>
                {/* Clasp */}
                <span className="-mt-2 h-4 w-7 rounded-[4px] border-[1.5px] border-[#121016]" style={{ background: `linear-gradient(180deg, ${m.rim[3]}, ${m.rim[0]})` }} />
                <span className="-mt-1 h-3 w-3 rounded-full border-[1.5px] border-[#121016]" style={{ background: m.rim[2] }} />
                {/* The medal */}
                <div className="medal-disc relative -mt-1 h-[108px] w-[108px] rounded-full border-[1.5px] border-[#121016] p-[7px] shadow-[0_10px_18px_-8px_rgb(0_0_0/0.5)]" style={{ background: `conic-gradient(from 200deg, ${m.rim.join(", ")}, ${m.rim[0]})` }}>
                  <div
                    className="relative grid h-full w-full place-items-center overflow-hidden rounded-full border border-[#121016]/60"
                    style={{ background: `radial-gradient(circle at 35% 30%, ${m.face[0]} 0%, ${m.face[1]} 45%, ${m.face[2]} 100%)` }}
                  >
                    <Laurel color={m.ink} />
                    <span className="relative font-display text-[34px] leading-none" style={{ color: m.ink, textShadow: `0 1px 0 ${m.face[0]}, 0 -1px 0 rgb(0 0 0 / 0.35)` }}>
                      {f.big}
                      <sup className="text-[15px]">{f.small}</sup>
                    </span>
                    <span className="absolute bottom-[9px] text-[7px] font-bold uppercase tracking-[0.18em]" style={{ color: m.ink, opacity: 0.7 }}>
                      {a.year}
                    </span>
                    {/* Moving glint: follows the swing */}
                    <span className="medal-glint pointer-events-none absolute inset-0" />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-1">
              <p className="t-label">{a.status}</p>
              <h3 className="text-[15px] font-semibold leading-snug">{a.title}</h3>
              <p className="t-micro muted">
                {a.org} · {a.year}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
