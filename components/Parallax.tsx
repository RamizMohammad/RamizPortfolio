"use client";

import { useRef, type ReactNode } from "react";

/**
 * Moves its layers against the pointer for a little depth: each child with data-depth shifts by
 * that many pixels at the card's edge. Touch and reduced motion leave everything still.
 */
export default function Parallax({ className, children }: { className?: string; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);

  const move = (e: React.PointerEvent) => {
    const b = box.current;
    if (!b || e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = b.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    b.querySelectorAll<HTMLElement>("[data-depth]").forEach((l) => {
      const d = Number(l.dataset.depth);
      l.style.transform = `translate3d(${-x * d}px, ${-y * d}px, 0)`;
    });
  };
  const reset = () => box.current?.querySelectorAll<HTMLElement>("[data-depth]").forEach((l) => (l.style.transform = ""));

  return (
    <div ref={box} className={className} onPointerMove={move} onPointerLeave={reset}>
      {children}
    </div>
  );
}
