"use client";

import { useState } from "react";

/** Pauses every looping animation on the page: the ribbon, the floating stickers, the strip. */
export default function MotionToggle() {
  const [paused, setPaused] = useState(false);
  const toggle = () => {
    const next = !paused;
    setPaused(next);
    if (next) document.documentElement.dataset.paused = "";
    else delete document.documentElement.dataset.paused;
    window.dispatchEvent(new Event("motion-toggle"));
  };
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={paused}
      aria-label={paused ? "Play animations" : "Pause animations"}
      className="grid h-9 w-9 place-items-center rounded-full border-[1.5px] border-ink bg-card transition-colors hover:bg-ink hover:text-card"
    >
      {paused ? (
        <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true"><path d="M3 1.5v9l7.5-4.5z" fill="currentColor" /></svg>
      ) : (
        <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true"><path d="M3 1.5h2v9H3zM7 1.5h2v9H7z" fill="currentColor" /></svg>
      )}
    </button>
  );
}
