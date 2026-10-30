import { stack } from "@/content/stack";
import ChapterHead from "@/components/ChapterHead";
import { taglines } from "@/content/personality";
import { LAYERS } from "@/content/types";

export default function Stack() {
  return (
    <section id="stack" aria-labelledby="stack-title" className="border-t border-rule py-24 md:py-32">
      <div className="wrap grid gap-14">
        <ChapterHead n={4} kicker={taglines.chapters.stack} title="Stack" id="stack-title">
          <p className="max-w-[52ch] text-fg-2" data-reveal style={{ ["--rd" as string]: "120ms" }}>
            The constellation groups every tool by the layer it works in. The same groups are listed below.
          </p>
        </ChapterHead>
        <div aria-hidden="true" className="hidden h-[52svh] md:block" />
        <div className="relative z-[2] grid gap-px border-[1.5px] border-fg bg-fg shadow-[8px_8px_0_var(--color-fg)] sm:grid-cols-2 lg:grid-cols-5">
          {LAYERS.map((l, i) => (
            <div key={l.id} className="group relative grid content-start gap-4 overflow-hidden bg-ink p-5 transition-colors hover:bg-panel" data-reveal style={{ ["--rd" as string]: `${i * 80}ms` }}>
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px origin-left scale-x-30 transition-transform duration-500 group-hover:scale-x-100" style={{ background: l.color }} />
              <h3 className="flex items-baseline gap-3">
                <span className="data" style={{ color: l.color }}>L{i + 1}</span>
                <span className="title text-[18px]">{l.label}</span>
              </h3>
              <ul className="grid gap-1.5 text-[15px] text-fg-2">
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
