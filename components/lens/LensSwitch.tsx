"use client";

import { LENSES } from "@/content/lens";
import { setLens, useLens } from "./useLens";

/** "Hiring for: Any · GenAI · Backend · Android · ML" — the pills that set the lens. */
export default function LensSwitch({ className = "" }: { className?: string }) {
  const lens = useLens();
  return (
    <div role="group" aria-label="Hiring for" className={`flex flex-wrap items-center justify-center gap-1.5 ${className}`}>
      <span className="t-micro muted mr-1">Hiring for</span>
      <button type="button" aria-pressed={lens === null} onClick={() => setLens(null)} className="btn-ghost btn-sm">
        Any role
      </button>
      {LENSES.map((l) => (
        <button key={l.id} type="button" aria-pressed={lens === l.id} onClick={() => setLens(l.id)} className="btn-ghost btn-sm" title={l.label}>
          {l.short}
        </button>
      ))}
    </div>
  );
}
