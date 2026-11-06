import Words from "@/components/Words";
import { github, hasActivity, type Day } from "@/content/github";
import { profile } from "@/content/profile";
import SectionLabel from "./SectionLabel";

// The calendar's five shades, in the site's palette: paper for nothing, lime deepening to ink.
const SHADE = ["bg-paper", "bg-lime/45", "bg-lime", "bg-[#94b524]", "bg-ink"] as const;
const MONTH = new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "UTC" });
const DAY = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

function stats(days: Day[]) {
  let longest = 0;
  let run = 0;
  for (const d of days) {
    run = d.count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  const busiest = days.reduce((a, b) => (b.count > a.count ? b : a), days[0]);
  return { active: days.filter((d) => d.count > 0).length, longest, busiest };
}

/** A year of public GitHub activity: the contribution calendar, a few totals and the latest commits. */
export default function Activity() {
  if (!hasActivity) return null;
  const days = github.weeks.flat();
  const { active, longest, busiest } = stats(days);
  // A month label sits over the first week that starts in that month.
  const months = github.weeks.map((w, i) => {
    const m = MONTH.format(new Date(`${w[0].date}T00:00:00Z`));
    const prev = i > 0 ? MONTH.format(new Date(`${github.weeks[i - 1][0].date}T00:00:00Z`)) : null;
    return m !== prev ? m : "";
  });
  const figures = [
    { n: github.total.toLocaleString("en-IN"), label: "contributions in the last year" },
    { n: String(active), label: "days with commits" },
    { n: `${longest}`, label: `day${longest === 1 ? "" : "s"}, longest streak` },
    { n: String(busiest.count), label: `on ${DAY.format(new Date(`${busiest.date}T00:00:00Z`))}, the busiest day` },
  ];
  const profileUrl = profile.links.find((l) => /github/i.test(l.label))?.href ?? `https://github.com/${github.user}`;

  return (
    <section id="activity" aria-labelledby="activity-title" className="edge pb-24">
      <SectionLabel id="activity">Activity</SectionLabel>
      <div className="grid gap-4 pb-12 pt-16 lg:grid-cols-[1fr_auto] lg:items-end">
        <h2 id="activity-title" className="t-h1 split" data-reveal>
          <Words text="Commit log." />
        </h2>
        <p className="voice-sm muted ink-in max-w-[44ch]" data-reveal>
          A year of public work on GitHub, refreshed on every deploy.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="pop-in grid content-start gap-8 self-start rounded-[28px] border-[1.5px] border-ink bg-card p-5 md:p-7" data-reveal>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-4">
            {figures.map((f) => (
              <div key={f.label} className="grid gap-1">
                <dt className="t-micro muted order-2">{f.label}</dt>
                <dd className="font-display text-[clamp(34px,4vw,56px)] leading-none">{f.n}</dd>
              </div>
            ))}
          </dl>

          {/* The calendar scrolls sideways on narrow screens, newest week in view */}
          <div className="activity-cal overflow-x-auto pb-1" dir="rtl">
            <div dir="ltr" className="inline-grid gap-1.5">
              <div className="grid grid-flow-col gap-[3px]" style={{ gridTemplateColumns: `repeat(${github.weeks.length}, 12px)` }} aria-hidden="true">
                {months.map((m, i) => (
                  <span key={i} className="t-micro muted whitespace-nowrap">
                    {m}
                  </span>
                ))}
              </div>
              <div className="grid grid-flow-col gap-[3px]" style={{ gridTemplateColumns: `repeat(${github.weeks.length}, 12px)`, gridTemplateRows: "repeat(7, 12px)" }} role="img" aria-label={`${github.total} contributions in the last year`}>
                {github.weeks.map((w, wi) =>
                  w.map((d, di) => (
                    <span
                      key={d.date}
                      title={`${d.count || "No"} contribution${d.count === 1 ? "" : "s"} on ${DAY.format(new Date(`${d.date}T00:00:00Z`))}`}
                      className={`activity-day rounded-[3px] border border-ink/15 ${SHADE[d.level]}`}
                      style={{ gridColumn: wi + 1, gridRow: (wi === 0 ? 7 - w.length : 0) + di + 1, ["--i" as string]: wi }}
                    />
                  )),
                )}
              </div>
              <div className="t-micro muted flex items-center justify-end gap-1.5">
                Less
                {SHADE.map((s) => (
                  <i key={s} className={`h-3 w-3 rounded-[3px] border border-ink/15 ${s}`} />
                ))}
                More
              </div>
            </div>
          </div>
        </div>

        <div className="pop-in grid content-start gap-4 rounded-[28px] border-[1.5px] border-ink bg-ink p-5 text-card md:p-7" data-reveal style={{ ["--rd" as string]: "120ms" }}>
          <div className="flex items-center justify-between gap-3">
            <h3 className="t-label">Latest commits</h3>
            <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="t-micro link">
              GitHub ↗
            </a>
          </div>
          <ol className="grid gap-3">
            {github.commits.map((c) => (
              <li key={c.sha + c.repo}>
                <a href={c.url} target="_blank" rel="noopener noreferrer" className="group grid gap-1 rounded-[14px] border border-card/15 p-3 transition-colors hover:bg-card/10">
                  <span className="flex items-center justify-between gap-2">
                    <span className="t-micro rounded-full bg-lime px-2 py-0.5 text-[#121016]">{c.repo}</span>
                    <span className="font-mono text-[11px] opacity-60">
                      {c.sha} · {DAY.format(new Date(c.date))}
                    </span>
                  </span>
                  <span className="text-[14px] leading-snug group-hover:underline">{c.message}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
