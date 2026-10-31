"use client";

import { useEffect, useRef, useState } from "react";

/** What the cursor looks like in each section of the home page. */
type Look = { shape: "ring" | "viewfinder" | "commit" | "brackets" | "crosshair" | "star" | "quote" | "mail" | "face"; tint: string; tip?: string };

const LOOKS: Record<string, Look> = {
  hero: { shape: "ring", tint: "var(--color-pink)" },
  about: { shape: "face", tint: "var(--color-sun)", tip: "hi!" },
  moments: { shape: "viewfinder", tint: "var(--color-ink)", tip: "REC" },
  experience: { shape: "commit", tint: "var(--color-lime)" },
  work: { shape: "brackets", tint: "var(--color-blue)" },
  architecture: { shape: "crosshair", tint: "var(--color-pink-deep)" },
  stack: { shape: "brackets", tint: "var(--color-mint)" },
  awards: { shape: "star", tint: "var(--color-sun)" },
  publications: { shape: "quote", tint: "var(--color-violet)" },
  contact: { shape: "mail", tint: "var(--color-pink)" },
};
const DEFAULT: Look = { shape: "ring", tint: "var(--color-ink)" };

const INTERACTIVE = "a, button, [role='button'], [role='tab'], [role='option'], label, summary";

function Shape({ look }: { look: Look }) {
  const s = { stroke: "var(--color-ink)", strokeWidth: 2, fill: "none" } as const;
  switch (look.shape) {
    case "viewfinder":
      return (
        <svg viewBox="0 0 48 48" className="h-full w-full">
          <path d="M4 14V4h10M34 4h10v10M44 34v10H34M14 44H4V34" {...s} strokeWidth={2.5} strokeLinecap="round" />
          <circle cx="24" cy="24" r="3" style={{ fill: "var(--color-pink-deep)" }} />
        </svg>
      );
    case "commit":
      return (
        <svg viewBox="0 0 48 48" className="h-full w-full">
          <path d="M24 0v15M24 33v15" {...s} strokeDasharray="3 3" />
          <circle cx="24" cy="24" r="9" style={{ fill: look.tint, stroke: "var(--color-ink)", strokeWidth: 2 }} />
        </svg>
      );
    case "brackets":
      return (
        <svg viewBox="0 0 48 48" className="h-full w-full">
          <path d="M16 10c-5 0-6 3-6 7v3c0 3-2 4-4 4 2 0 4 1 4 4v3c0 4 1 7 6 7M32 10c5 0 6 3 6 7v3c0 3 2 4 4 4-2 0-4 1-4 4v3c0 4-1 7-6 7" {...s} strokeWidth={2.5} strokeLinecap="round" />
        </svg>
      );
    case "crosshair":
      return (
        <svg viewBox="0 0 48 48" className="h-full w-full">
          <circle cx="24" cy="24" r="14" {...s} strokeDasharray="4 3" />
          <path d="M24 2v12M24 34v12M2 24h12M34 24h12" {...s} />
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 48 48" className="h-full w-full">
          <path d="M24 4l5.6 12.4L43 18l-10 9.2 2.8 13.4L24 34l-11.8 6.6L15 27.2 5 18l13.4-1.6z" style={{ fill: look.tint, stroke: "var(--color-ink)", strokeWidth: 2, strokeLinejoin: "round" }} />
        </svg>
      );
    case "quote":
      return (
        <svg viewBox="0 0 48 48" className="h-full w-full">
          <circle cx="24" cy="24" r="20" style={{ fill: look.tint, stroke: "var(--color-ink)", strokeWidth: 2 }} />
          <text x="24" y="36" textAnchor="middle" fontSize="30" fontFamily="var(--font-display)" style={{ fill: "#121016" }}>
            &ldquo;
          </text>
        </svg>
      );
    case "mail":
      return (
        <svg viewBox="0 0 48 48" className="h-full w-full">
          <rect x="6" y="12" width="36" height="25" rx="4" style={{ fill: look.tint, stroke: "var(--color-ink)", strokeWidth: 2 }} />
          <path d="M7 14l17 13 17-13" {...s} strokeLinejoin="round" />
        </svg>
      );
    case "face":
      return (
        // eslint-disable-next-line @next/next/no-img-element -- a 48px decoration; next/image adds nothing here
        <img src="/images/mascot-face.webp" alt="" className="h-full w-full rounded-full border-2 border-ink" style={{ background: look.tint }} />
      );
    default:
      return <span className="block h-full w-full rounded-full border-2" style={{ borderColor: look.tint }} />;
  }
}

/**
 * A two-part cursor for mouse users: a dot that sits exactly on the pointer, and a trailing shape
 * that changes with the section under it (a viewfinder over the photo timeline, a commit node on the
 * experience history, brackets over projects, a crosshair on the diagrams, a star among the awards…).
 * Over anything clickable it grows and shows what clicking does, from the element's data-cursor or a
 * sensible default. Touch screens and reduced motion keep the normal cursor.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [section, setSection] = useState<string | null>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [hovering, setHovering] = useState(false);
  const [down, setDown] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!fine.matches) return;
    let started = false;

    const target = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    let raf = 0;
    const loop = () => {
      // The shape eases after the pointer; the dot is exact.
      pos.x += (target.x - pos.x) * 0.2;
      pos.y += (target.y - pos.y) * 0.2;
      if (ring.current) ring.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      // Switches on at the first real mouse movement, so touch-only devices never see it.
      if (!started) {
        started = true;
        pos.x = e.clientX;
        pos.y = e.clientY;
        document.documentElement.classList.add("custom-cursor");
        setOn(true);
      }
      target.x = e.clientX;
      target.y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      const el = e.target as Element | null;
      // Text fields keep the normal I-beam.
      setHidden(!!el?.closest("input, textarea, [contenteditable='true']"));
      const hit = el?.closest<HTMLElement>(`[data-cursor], ${INTERACTIVE}`) ?? null;
      setHovering(!!hit);
      setLabel(hit?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? (hit?.matches("a[target=_blank]") ? "Visit ↗" : null));
      setSection(el?.closest("[role='dialog']") ? "dialog" : el?.closest("header") ? "header" : (el?.closest("section[id]")?.id ?? null));
    };
    const leave = () => {
      target.x = target.y = -100;
      if (dot.current) dot.current.style.transform = "translate3d(-100px,-100px,0)";
    };
    const press = () => setDown(true);
    const release = () => setDown(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", press);
    window.addEventListener("pointerup", release);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
    };
  }, []);

  if (!on) return null;
  const look = (section && LOOKS[section]) || DEFAULT;
  const size = label ? 84 : hovering ? 64 : look.shape === "face" ? 44 : 40;

  return (
    <div aria-hidden="true" className={`pointer-events-none fixed inset-0 z-[400] transition-opacity duration-200 ${hidden ? "opacity-0" : ""}`}>
      <div ref={ring} className="absolute left-0 top-0 will-change-transform">
        <div
          className="cursor-shape relative"
          style={{ width: size, height: size, transform: `translate(-50%, -50%) scale(${down ? 0.82 : 1})` }}
        >
          {label ? (
            <span className="grid h-full w-full place-items-center rounded-full text-center text-[11px] font-semibold uppercase leading-tight tracking-[0.04em]" style={{ background: "var(--color-ink)", color: "var(--color-paper)", boxShadow: `0 0 0 3px ${look.tint}` }}>
              {label}
            </span>
          ) : (
            <div key={look.shape} className="cursor-morph h-full w-full">
              <Shape look={look} />
            </div>
          )}
          {!label && look.tip && !hovering && (
            <span className="absolute left-full top-0 ml-1 whitespace-nowrap rounded-full border-[1.5px] border-ink bg-card px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.05em]">
              {look.tip === "REC" ? <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-pink-deep align-middle" /> : null}
              {look.tip}
            </span>
          )}
        </div>
      </div>
      <div ref={dot} className={`absolute left-0 top-0 transition-opacity duration-150 will-change-transform ${label ? "opacity-0" : ""}`}>
        <span className="block h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "var(--color-pink-deep)" }} />
      </div>
    </div>
  );
}
