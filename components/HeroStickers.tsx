"use client";

import { useRef } from "react";
import { BugSticker, CoffeeSticker, DraggableSticker, GlobSticker, HeartSticker, OkSticker, PromptSticker } from "./Stickers";

/** Stickers around the centred hero, kept clear of the name, summary and buttons. Drag them anywhere in the hero. */
export default function HeroStickers() {
  const bounds = useRef<HTMLDivElement>(null);
  return (
    <div ref={bounds} className="pointer-events-none absolute inset-0 z-[3] overflow-hidden [&>*]:pointer-events-auto">
      <DraggableSticker bounds={bounds} className="left-[5%] top-[40%] w-14 md:top-[6%] md:w-20" rotate={-12} delay={0}>
        <BugSticker />
      </DraggableSticker>
      <DraggableSticker bounds={bounds} className="right-[5%] top-[44%] hidden w-[120px] md:block" rotate={8} delay={1}>
        <OkSticker />
      </DraggableSticker>
      <DraggableSticker bounds={bounds} className="bottom-[8%] right-[6%] hidden w-24 md:block" rotate={-14} delay={2}>
        <CoffeeSticker />
      </DraggableSticker>
      <DraggableSticker bounds={bounds} className="bottom-[10%] left-[6%] hidden w-[92px] lg:block" rotate={6} delay={3}>
        <PromptSticker />
      </DraggableSticker>
      <DraggableSticker bounds={bounds} className="left-[9%] top-[46%] hidden w-16 lg:block" rotate={-10} delay={4}>
        <GlobSticker />
      </DraggableSticker>
      <DraggableSticker bounds={bounds} className="right-[5%] top-[6%] hidden w-16 md:block" rotate={12} delay={5}>
        <HeartSticker />
      </DraggableSticker>
    </div>
  );
}
