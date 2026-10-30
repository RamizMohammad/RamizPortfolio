"use client";

import Image from "next/image";
import { useRef } from "react";
import { signals } from "@/scene/store";

/**
 * The hero's right column. The 3D core renders behind it; this layer catches the pointer so the
 * core can be dragged to spin and clicked to burst. Decorative, so it stays out of the tab order.
 */
export default function HeroStage() {
  const start = useRef<{ x: number; moved: boolean } | null>(null);

  return (
    <div
      className="relative hidden cursor-grab touch-pan-y select-none active:cursor-grabbing md:col-span-5 md:block lg:col-span-6"
      aria-hidden="true"
      onPointerDown={(e) => {
        start.current = { x: e.clientX, moved: false };
        signals.dragging = true;
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!start.current) return;
        signals.dragDelta += e.movementX;
        if (Math.abs(e.clientX - start.current.x) > 4) start.current.moved = true;
      }}
      onPointerUp={() => {
        if (start.current && !start.current.moved) signals.bursts += 1;
        start.current = null;
        signals.dragging = false;
      }}
      onPointerCancel={() => {
        start.current = null;
        signals.dragging = false;
      }}
    >
      <Image
        src="/images/core-poster.webp"
        alt=""
        width={900}
        height={900}
        priority
        draggable={false}
        className="core-poster pointer-events-none absolute left-1/2 top-1/2 w-[min(110%,720px)] max-w-none -translate-x-[46%] -translate-y-1/2"
      />
      <p className="stage-hint label pointer-events-none absolute bottom-10 right-0 fade-up" style={{ ["--d" as string]: "1400ms" }}>
        Drag to spin · Click to burst
      </p>
    </div>
  );
}
