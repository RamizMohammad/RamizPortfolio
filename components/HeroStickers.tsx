"use client";

import { useRef } from "react";
import { BugSticker, CoffeeSticker, DraggableSticker, GlobSticker, HeartSticker, OkSticker, PromptSticker } from "./Stickers";

/** Stickers scattered around the hero. Drag them anywhere in the hero; they stay out of the text column at rest. */
export default function HeroStickers() {
  const bounds = useRef<HTMLDivElement>(null);
  return (
    <div ref={bounds} className="pointer-events-none absolute inset-0 z-[3] overflow-hidden [&>*]:pointer-events-auto">
      <DraggableSticker bounds={bounds} className="right-[6%] top-[9%] w-20 md:w-24" rotate={12} delay={0}>
        <BugSticker />
      </DraggableSticker>
      <DraggableSticker bounds={bounds} className="right-[13%] top-[34%] hidden w-[120px] md:block" rotate={-8} delay={1}>
        <OkSticker />
      </DraggableSticker>
      <DraggableSticker bounds={bounds} className="bottom-[16%] right-[3%] hidden w-24 md:block" rotate={-14} delay={2}>
        <CoffeeSticker />
      </DraggableSticker>
      <DraggableSticker bounds={bounds} className="bottom-[9%] right-[38%] hidden w-[92px] lg:block" rotate={6} delay={3}>
        <PromptSticker />
      </DraggableSticker>
      <DraggableSticker bounds={bounds} className="bottom-[30%] right-[44%] hidden w-16 lg:block" rotate={-10} delay={4}>
        <GlobSticker />
      </DraggableSticker>
      <DraggableSticker bounds={bounds} className="bottom-[6%] right-[8%] w-16 md:hidden" rotate={-6} delay={2}>
        <HeartSticker />
      </DraggableSticker>
    </div>
  );
}
