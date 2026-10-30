"use client";

import { useRef } from "react";
import { BugSticker, DraggableSticker, GlobSticker, HeartSticker, OkSticker } from "./Stickers";

export default function ResumeStickers() {
  const bounds = useRef<HTMLDivElement>(null);
  return (
    <div ref={bounds} className="pointer-events-none absolute inset-0 z-[3] [&>*]:pointer-events-auto">
      <DraggableSticker bounds={bounds} className="right-[4%] top-[3%] hidden w-24 md:block" rotate={10}>
        <BugSticker />
      </DraggableSticker>
      <DraggableSticker bounds={bounds} className="left-[2%] top-[38%] hidden w-20 lg:block" rotate={-12} delay={1}>
        <GlobSticker />
      </DraggableSticker>
      <DraggableSticker bounds={bounds} className="bottom-[4%] right-[6%] hidden w-[120px] md:block" rotate={-6} delay={2}>
        <OkSticker />
      </DraggableSticker>
      <DraggableSticker bounds={bounds} className="right-[1.5%] top-[56%] hidden w-16 xl:block" rotate={8} delay={3}>
        <HeartSticker />
      </DraggableSticker>
    </div>
  );
}
