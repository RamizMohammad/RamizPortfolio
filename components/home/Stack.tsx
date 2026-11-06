import Terminal from "@/components/Terminal";
import { toolIcon } from "@/components/toolIcons";
import Words from "@/components/Words";
import { lensTags } from "@/content/lens";
import { stack } from "@/content/stack";
import { LAYERS, type Layer } from "@/content/types";
import SectionLabel from "./SectionLabel";

// Each layer's block colour, its darker side, and an icon.
const LOOK: Record<Layer, { tone: string; side: string; icon: React.ReactNode }> = {
  interface: {
    tone: "#f47a9a",
    side: "#c93a63",
    icon: <path d="M3 5h18v14H3zM3 9h18M6 7h.01M8.5 7h.01" />,
  },
  api: {
    tone: "#b9a6f5",
    side: "#7d64d6",
    icon: <path d="M4 8h10m0 0-3-3m3 3-3 3M20 16H10m0 0 3-3m-3 3 3 3" />,
  },
  automation: {
    tone: "#d4f25b",
    side: "#94b524",
    icon: <path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1m-8.6 8.6-2.1 2.1M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />,
  },
  data: {
    tone: "#ffcf3a",
    side: "#c99a10",
    icon: <path d="M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zm0 0v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />,
  },
  infra: {
    tone: "#5fd3a4",
    side: "#2e9c72",
    icon: <path d="M3 4h18v6H3zM3 14h18v6H3zM7 7h.01M7 17h.01M11 7h6M11 17h6" />,
  },
};

const total = LAYERS.reduce((n, l) => n + stack[l.id].length, 0);

/**
 * The stack as a physical pile of blocks: what everything runs on at the bottom, what people touch
 * on top. Blocks drop onto the pile one by one as the section scrolls in (bottom first), each tool
 * is a key on its block, and hovering a block lifts it while the rest dim.
 */
export default function Stack() {
  return (
    <section id="stack" aria-labelledby="stack-title" className="edge">
      <SectionLabel id="stack">Stack</SectionLabel>
      <div className="grid gap-[41px] py-24 lg:grid-cols-[4fr_7fr]">
        <div className="grid content-start gap-8 lg:sticky lg:top-28 lg:self-start">
          <h2 id="stack-title" className="t-h1 split" data-reveal>
            <Words text="Tools, by layer." />
          </h2>
          <p className="voice ink-in" data-reveal>
            {total} tools across five layers — from the servers at the bottom to the screens on top.
          </p>
          <div data-reveal>
            <Terminal />
          </div>
        </div>

        <ol className="stack-pile grid gap-4" data-reveal aria-label="Tools by layer, top layer first">
          {LAYERS.map((l, i) => {
            const look = LOOK[l.id];
            // Bottom block lands first.
            const order = LAYERS.length - 1 - i;
            return (
              <li
                key={l.id}
                className="stack-block relative rounded-[26px] border-[1.5px] border-ink p-5 text-[#121016] md:p-6"
                style={{ background: look.tone, boxShadow: `0 10px 0 ${look.side}, 0 10px 0 1.5px #121016`, ["--o" as string]: order }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-[14px] border-[1.5px] border-[#121016] bg-white/70">
                      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#121016" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        {look.icon}
                      </svg>
                    </span>
                    <span className="grid">
                      <span className="t-micro opacity-70">Layer {i + 1}</span>
                      <span className="t-h2">{l.label}</span>
                    </span>
                  </h3>
                  <span className="t-micro rounded-full border-[1.5px] border-[#121016] bg-white/70 px-2.5 py-1">{stack[l.id].length} tools</span>
                </div>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {stack[l.id].map((t, j) => {
                    const icon = toolIcon(t);
                    return (
                      <li
                        key={t}
                        className="stack-key flex items-center gap-2 rounded-[10px] border-[1.5px] border-[#121016] bg-white py-1.5 pl-2 pr-3 font-mono text-[12.5px] font-medium text-[#121016] shadow-[0_3px_0_#121016]"
                        style={{ ["--k" as string]: j, ["--o" as string]: order }}
                        data-lens-tags={lensTags(t)}
                      >
                        {/* The tool's logo in its brand colour, or the layer's glyph when it has none */}
                        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true" fill={icon ? `#${icon.hex}` : "none"} stroke={icon ? undefined : look.side} strokeWidth={icon ? undefined : 2} strokeLinecap="round" strokeLinejoin="round">
                          {icon ? <path d={icon.path} /> : look.icon}
                        </svg>
                        {t}
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
