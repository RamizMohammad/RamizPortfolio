"use client";

import { useEffect } from "react";

const LINES = [
  "RAMIZ.OS 3.0",
  "mount  /systems ............ ok",
  "link   api ↔ automation .... ok",
  "load   core geometry ....... ok",
  "ready",
];

/**
 * Plays once per session. CSS hides it after 1.5 s, so it never blocks the page even
 * without JavaScript; this component only adds skip-by-key/click and remembers that it ran.
 */
export default function BootSequence() {
  useEffect(() => {
    try {
      sessionStorage.setItem("ramiz-boot", "1");
    } catch {}
    const skip = () => {
      document.documentElement.dataset.boot = "skip";
      cleanup();
    };
    const timer = window.setTimeout(() => {
      document.documentElement.dataset.boot = "skip";
      cleanup();
    }, 1900);
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    function cleanup() {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    }
    return cleanup;
  }, []);

  return (
    <div className="boot" aria-hidden="true">
      <div className="data grid w-full max-w-[420px] gap-1.5 text-[13px] text-fg-2">
        {LINES.map((l, i) => (
          <p key={l} className="boot-line" style={{ animationDelay: `${120 + i * 220}ms`, color: i === LINES.length - 1 ? "var(--color-fg)" : undefined }}>
            {l}
          </p>
        ))}
        <p className="boot-line mt-6 text-fg-3" style={{ animationDelay: "120ms" }}>
          Press any key to skip
        </p>
      </div>
    </div>
  );
}
