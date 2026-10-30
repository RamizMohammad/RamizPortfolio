import { stack } from "@/content/stack";
import ChapterHead from "@/components/ChapterHead";
import { taglines } from "@/content/personality";
import { LAYERS } from "@/content/types";

export default function Stack() {
  return (
    <section id="stack" aria-labelledby="stack-title" className="stop">
      <div className="grid gap-9">
        <ChapterHead n={4} kicker={taglines.chapters.stack} title="Stack" id="stack-title">
          <p className="max-w-[52ch] text-fg-2" data-reveal style={{ ["--rd" as string]: "120ms" }}>
            The warehouse keeps every tool on the shelf of the layer it works in. The same shelves are listed here.
          </p>
        </ChapterHead>
        <div className="grid gap-px border-[1.5px] border-fg bg-fg shadow-[6px_6px_0_var(--color-fg)] sm:grid-cols-2">
          {LAYERS.map((l, i) => (
            <div key={l.id} className={`group relative grid content-start gap-3 overflow-hidden bg-ink p-5 transition-colors hover:bg-panel ${i === LAYERS.length - 1 ? "sm:col-span-2" : ""}`} data-reveal style={{ ["--rd" as string]: `${i * 80}ms` }}>
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1" style={{ background: l.color }} />
              <h3 className="flex items-baseline gap-3">
                <span className="data" style={{ color: l.color }}>L{i + 1}</span>
                <span className="title text-[18px]">{l.label}</span>
              </h3>
              <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[15px] text-fg-2">
                {stack[l.id].map((s) => (
                  <li key={s} className="transition-colors hover:text-fg">{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
