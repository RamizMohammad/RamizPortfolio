"use client";

import { useEffect, useRef } from "react";

/**
 * A ring that trails the pointer and a dot that sits on it. The ring grows over links and turns
 * into a "DRAG" handle over the 3D core. Fine pointers only; hidden for touch and reduced motion.
 */
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let x = -100, y = -100, rx = -100, ry = -100, raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = e.target as HTMLElement | null;
      const state = t?.closest("[data-cursor='drag']") ? "drag" : t?.closest("a, button, [role='tab'], summary") ? "link" : "";
      if (ring.current) {
        ring.current.dataset.state = state;
        ring.current.style.opacity = "1";
      }
      if (dot.current) {
        dot.current.style.opacity = "1";
        dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    };
    const leave = () => {
      if (ring.current) ring.current.style.opacity = "0";
      if (dot.current) dot.current.style.opacity = "0";
    };
    const tick = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true">
        <span>DRAG</span>
      </div>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
