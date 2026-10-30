import { stack } from "@/content/stack";
import { LAYERS } from "@/content/types";

/** A slow ribbon of the real stack between the hero and About. Decorative: the Stack section lists the same items. */
export default function Marquee() {
  const items = LAYERS.flatMap((l) => stack[l.id].slice(0, 4));
  const run = [...items, ...items];
  return (
    <div className="relative z-[2] overflow-hidden border-y border-rule py-5" aria-hidden="true">
      <div className="marquee">
        {run.map((it, i) => (
          <span key={i} className="heading flex items-center whitespace-nowrap px-6 text-[clamp(22px,3vw,40px)]">
            <span className={i % 3 === 0 ? "accent-text" : i % 3 === 1 ? "text-fg" : "text-fg-3"}>{it}</span>
            <span className="ml-12 text-[0.5em] text-cyan">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
