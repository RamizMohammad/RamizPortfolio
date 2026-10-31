import { timeline } from "@/content/timeline";
import SectionLabel from "./SectionLabel";

/** Newest first, like a log. Ongoing roles carry the HEAD marker. */
export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="edge">
      <SectionLabel n={5}>Experience</SectionLabel>
      <div className="grid gap-[41px] py-24 lg:grid-cols-[3fr_7fr]">
        <div className="grid content-start gap-8">
          <h2 id="experience-title" className="t-h1" data-reveal>
            Where I&rsquo;ve worked.
          </h2>
          <p className="voice" data-reveal>
            Backend work since 2021: independent products first, then an internship, now Moglix.
          </p>
        </div>
        <ol className="dash-b">
          {timeline.map((t, i) => (
            <li key={`${t.org}-${t.title}`} className="dash-t grid gap-4 py-8 md:grid-cols-[minmax(200px,2fr)_5fr] md:gap-6" data-reveal style={{ ["--rd" as string]: `${i * 60}ms` }}>
              <div className="t-label grid content-start gap-2">
                {t.span && t.span[1] === null && (
                  <span className="text-ember">
                    <span className="dot mr-2" />
                    Head
                  </span>
                )}
                <span>{t.period || "—"}</span>
                <span className="muted">{t.kind}</span>
              </div>
              <div className="grid content-start gap-4">
                <div className="grid gap-1.5">
                  <h3 className="t-h2">{t.title}</h3>
                  <p className="t-label muted">{t.org}</p>
                </div>
                <ul className="voice-sm grid gap-1.5">
                  {t.points.map((p) => (
                    <li key={p} className="grid grid-cols-[20px_1fr]">
                      <span aria-hidden="true" className="muted">—</span>
                      {p}
                    </li>
                  ))}
                </ul>
                {t.tags && (
                  <ul className="t-label muted flex flex-wrap gap-x-4 gap-y-1" aria-label="Technologies">
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
