"use client";

import { useEffect, useRef, useState } from "react";

/** What the speech tag says in each section of the home page. */
const SAYS: Record<string, string> = {
  hero: "hi!",
  about: "that's me",
  moments: "memories",
  experience: "git log",
  work: "my builds",
  architecture: "how it flows",
  stack: "my tools",
  activity: "commits",
  awards: "wins!",
  patents: "invented",
  papers: "papers",
  contact: "say hi",
  companies: "my ventures",
  header: "go to…",
  dialog: "pick one",
};

const INTERACTIVE = "a, button, [role='button'], [role='tab'], [role='option'], label, summary";

/**
 * For mouse users the pointer is the mascot's face with a speech tag beside it. The tag names
 * the section under the pointer, or what clicking will do when over something clickable (from the
 * element's data-cursor, else "visit ↗" for outside links and "click" for the rest). The face
 * grows a little over clickable things and squeezes on click. Touch screens and reduced motion
 * keep the normal cursor; text fields keep the I-beam.
 */
export default function Cursor() {
  const face = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [say, setSay] = useState("hi!");
  const [action, setAction] = useState(false);
  const [down, setDown] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    let started = false;
    let lastMove: PointerEvent | null = null;
    const target = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    let raf = 0;
    // The face eases only slightly, so it still feels like the pointer, and the loop stops as soon
    // as it has caught up: a still mouse costs nothing.
    const loop = () => {
      pos.x += (target.x - pos.x) * 0.45;
      pos.y += (target.y - pos.y) * 0.45;
      if (Math.abs(target.x - pos.x) < 0.3 && Math.abs(target.y - pos.y) < 0.3) {
        pos.x = target.x;
        pos.y = target.y;
        raf = 0;
      } else raf = requestAnimationFrame(loop);
      if (face.current) face.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };
    // Only touch React state when what it shows actually changes.
    const shown = { say: "hi!", action: false, hidden: false };
    const show = (next: typeof shown) => {
      if (next.say !== shown.say) setSay(next.say);
      if (next.action !== shown.action) setAction(next.action);
      if (next.hidden !== shown.hidden) setHidden(next.hidden);
      Object.assign(shown, next);
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      lastMove = e;
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
      wake();
      read(e.target as Element | null);
    };
    const read = (el: Element | null) => {
      const hit = el?.closest<HTMLElement>(`[data-cursor], ${INTERACTIVE}`) ?? null;
      const named = hit?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor;
      const where = el?.closest("[role='dialog']") ? "dialog" : el?.closest("header") ? "header" : (el?.closest("section[id]")?.id ?? "");
      show({
        hidden: !!el?.closest("input, textarea, [contenteditable='true']"),
        action: !!hit,
        say: named ?? (hit ? (hit.matches("a[target=_blank]") ? "visit ↗" : "click") : (SAYS[where] ?? "hi!")),
      });
    };
    // Scrolling moves the page under a still mouse, so the tag is re-read for what is now beneath
    // it, once the scroll settles: hit-testing on every scroll frame would force a layout each time.
    let settle = 0;
    const rescan = () => {
      window.clearTimeout(settle);
      settle = window.setTimeout(() => {
        if (lastMove) read(document.elementFromPoint(lastMove.clientX, lastMove.clientY));
      }, 120);
    };
    window.addEventListener("scroll", rescan, { passive: true });
    const leave = () => {
      target.x = target.y = -100;
      wake();
    };
    const press = () => setDown(true);
    const release = () => setDown(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", press);
    window.addEventListener("pointerup", release);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(settle);
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", rescan);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
    };
  }, []);

  if (!on) return null;

  return (
    <div aria-hidden="true" className={`pointer-events-none fixed inset-0 z-[400] transition-opacity duration-200 ${hidden ? "opacity-0" : ""}`}>
      <div ref={face} className="absolute left-0 top-0 will-change-transform">
        <div className="cursor-face relative" style={{ transform: `translate(-50%, -50%) scale(${down ? 0.85 : action ? 1.2 : 1})` }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- a 40px decoration; next/image adds nothing here */}
          <img src="/images/mascot-face.webp" alt="" width={40} height={40} className="h-10 w-10 rounded-full border-2 border-ink bg-sun" />
          <span
            key={say}
            className={`cursor-tag absolute left-[calc(100%+6px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border-[1.5px] border-ink px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.05em] ${action ? "" : "bg-card"}`}
            style={action ? { background: "var(--color-ink)", color: "var(--color-paper)" } : undefined}
          >
            {say}
          </span>
        </div>
      </div>
    </div>
  );
}
