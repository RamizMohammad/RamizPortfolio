import { timeline } from "@/content/timeline";
import ChapterHead from "@/components/ChapterHead";
import { taglines } from "@/content/personality";

export default function Timeline() {
  return (
    <section id="timeline" aria-labelledby="timeline-title" className="stop">
      <div className="grid gap-9">
        <ChapterHead n={3} kicker={taglines.chapters.timeline} title="Timeline" id="timeline-title">
          <p className="label" data-reveal>
            <span className="tape" style={{ ["--tilt" as string]: "1.5deg" }}>{taglines.timeline}</span> · lanes on the road are to scale
          </p>
        </ChapterHead>
        <ol className="grid border-t-[1.5px] border-fg">
          {timeline.map((t, i) => (
            <li key={`${t.org}-${t.title}`} className="grid gap-3 border-b border-rule py-6 sm:grid-cols-[120px_1fr] sm:gap-6" data-reveal style={{ ["--rd" as string]: `${i * 80}ms` }}>
              <div>
                <p className="data flex items-center gap-2 text-cyan">
                  {t.span && t.span[1] === null && (
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-60 motion-reduce:hidden" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" />
                    </span>
                  )}
                  {t.period || "—"}
                </p>
                <p className="label mt-1">{t.kind}</p>
              </div>
              <div className="grid gap-3">
                <div>
                  <h3 className="title text-[21px]">{t.title}</h3>
                  <p className="mt-0.5 text-fg-2">{t.org}</p>
                </div>
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
    </section>
  );
}
