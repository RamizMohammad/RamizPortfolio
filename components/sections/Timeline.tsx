import { timeline } from "@/content/timeline";

export default function Timeline() {
  return (
    <section id="timeline" aria-labelledby="timeline-title" className="border-t border-rule py-24 md:py-32">
      <div className="wrap grid gap-14">
        <div className="md:w-1/2">
          <p className="label">Work, products, study</p>
          <h2 id="timeline-title" className="display mt-4 text-[clamp(44px,7vw,96px)]">
            Timeline
          </h2>
        </div>
        <ol className="grid border-t border-fg">
          {timeline.map((t) => (
            <li key={`${t.org}-${t.title}`} className="grid gap-4 border-b border-rule py-8 md:grid-cols-12 md:gap-6">
              <div className="md:col-span-3">
                <p className="data text-fg">{t.period || "—"}</p>
                <p className="label mt-1">{t.kind}</p>
              </div>
              <div className="md:col-span-4">
                <h3 className="title text-[24px]">{t.title}</h3>
                <p className="mt-1 text-fg-2">{t.org}</p>
              </div>
              <div className="grid gap-3 md:col-span-5">
                <ul className="grid gap-1.5 text-[15px] text-fg-2">
                  {t.points.map((p) => (
                    <li key={p} className="flex gap-3">
                      <span aria-hidden="true" className="mt-[11px] h-px w-3 shrink-0 bg-fg-3" />
                      {p}
                    </li>
                  ))}
                </ul>
                {t.tags && (
                  <ul className="label flex flex-wrap gap-x-4 gap-y-1" aria-label="Technologies">
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
