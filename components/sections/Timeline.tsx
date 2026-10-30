import { timeline } from "@/content/timeline";

export default function Timeline() {
  return (
    <section id="timeline" aria-labelledby="timeline-title" className="border-t border-rule py-24 md:py-32">
      <div className="wrap grid md:grid-cols-12">
      <div className="grid gap-14 md:col-span-8 lg:col-span-7">
        <div>
          <p className="label eyebrow" data-reveal>Work, products, study · bars to scale</p>
          <h2 id="timeline-title" className="display mt-4 text-[clamp(44px,7vw,96px)]" data-reveal="mask">
            Timeline
          </h2>
        </div>
        <ol className="grid border-t border-cyan/50">
          {timeline.map((t, i) => (
            <li key={`${t.org}-${t.title}`} className="grid gap-4 border-b border-rule py-8 lg:grid-cols-12 lg:gap-6" data-reveal style={{ ["--rd" as string]: `${i * 80}ms` }}>
              <div className="lg:col-span-3">
                <p className="data flex items-center gap-2 text-cyan">
                  {t.span && t.span[1] === null && <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-60 motion-reduce:hidden" /><span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" /></span>}
                  {t.period || "—"}
                </p>
                <p className="label mt-1">{t.kind}</p>
              </div>
              <div className="lg:col-span-4">
                <h3 className="title text-[24px]">{t.title}</h3>
                <p className="mt-1 text-fg-2">{t.org}</p>
              </div>
              <div className="grid gap-3 lg:col-span-5">
                <ul className="grid gap-1.5 text-[15px] text-fg-2">
                  {t.points.map((p) => (
                    <li key={p} className="flex gap-3">
                      <span aria-hidden="true" className="mt-[11px] h-px w-3 shrink-0 bg-violet" />
                      {p}
                    </li>
                  ))}
                </ul>
                {t.tags && (
                  <ul className="label flex flex-wrap gap-x-4 gap-y-1 text-violet-soft" aria-label="Technologies">
                    {t.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
      </div>
    </section>
  );
}
