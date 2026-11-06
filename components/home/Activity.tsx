import Words from "@/components/Words";
import { github, hasActivity, type Day } from "@/content/github";
import { profile } from "@/content/profile";
import SectionLabel from "./SectionLabel";

// The calendar's five shades, in the site's palette: paper for nothing, lime deepening to ink.
const SHADE = [
  "bg-paper",
  "bg-lime/45",
  "bg-lime",
  "bg-[#94b524]",
  "bg-ink",
] as const;
const MONTH = new Intl.DateTimeFormat("en-GB", {
  month: "short",
  timeZone: "UTC",
});
const DAY = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

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

/** A year of public GitHub activity: the contribution calendar and a few totals. */
export default function Activity() {
  if (!hasActivity) return null;
  const days = github.weeks.flat();
  const { active, longest, busiest } = stats(days);
  // A month label sits over the first week that starts in that month.
  const months = github.weeks.map((w, i) => {
    const m = MONTH.format(new Date(`${w[0].date}T00:00:00Z`));
    const prev =
      i > 0
        ? MONTH.format(new Date(`${github.weeks[i - 1][0].date}T00:00:00Z`))
        : null;
    return m !== prev ? m : "";
  });
  const figures = [
    {
      n: github.total.toLocaleString("en-IN"),
      label: "contributions in the last year",
    },
    { n: String(active), label: "days with commits" },
    {
      n: `${longest}`,
      label: `day${longest === 1 ? "" : "s"}, longest streak`,
    },
    {
      n: String(busiest.count),
      label: `on ${DAY.format(new Date(`${busiest.date}T00:00:00Z`))}, the busiest day`,
    },
  ];
  const profileUrl =
    profile.links.find((l) => /github/i.test(l.label))?.href ??
    `https://github.com/${github.user}`;

  return (
    <section
      id="activity"
      aria-labelledby="activity-title"
      className="edge pb-24"
    >
      <SectionLabel id="activity">Activity</SectionLabel>
      <div className="grid gap-4 pb-12 pt-16 lg:grid-cols-[1fr_auto] lg:items-end">
        <h2 id="activity-title" className="t-h1 split" data-reveal>
          <Words text="Commit log." />
        </h2>
        <p className="voice-sm muted ink-in max-w-[44ch]" data-reveal>
          A year of public work on GitHub, refreshed on every deploy.
        </p>
      </div>

      <div
        className="pop-in grid content-start gap-8 rounded-[28px] border-[1.5px] border-ink bg-card p-5 md:p-8"
        data-reveal
      >
        <div className="flex justify-end">
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="t-label link"
          >
            @{github.user} on GitHub ↗
          </a>
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-4">
          {figures.map((f) => (
            <div key={f.label} className="grid gap-1">
              <dt className="t-micro muted order-2">{f.label}</dt>
              <dd className="font-display text-[clamp(34px,4vw,56px)] leading-none">
                {f.n}
              </dd>
            </div>
          ))}
        </dl>

        {/* The calendar scrolls sideways on narrow screens, newest week in view */}
        <div className="activity-cal overflow-x-auto pb-1" dir="rtl">
          <div dir="ltr" className="grid w-full min-w-[720px] gap-2">
            <div
              className="grid gap-[3px] md:gap-1"
              style={{
                gridTemplateColumns: `repeat(${github.weeks.length}, minmax(0, 1fr))`,
              }}
              aria-hidden="true"
            >
              {months.map((m, i) => (
                <span key={i} className="t-micro muted whitespace-nowrap">
                  {m}
                </span>
              ))}
            </div>
            <div
              className="grid gap-[3px] md:gap-1"
              style={{
                gridTemplateColumns: `repeat(${github.weeks.length}, minmax(0, 1fr))`,
              }}
              role="img"
              aria-label={`${github.total} contributions in the last year`}
            >
              {github.weeks.map((w, wi) =>
                w.map((d, di) => (
                  <span
                    key={d.date}
                    title={`${d.count || "No"} contribution${d.count === 1 ? "" : "s"} on ${DAY.format(new Date(`${d.date}T00:00:00Z`))}`}
                    className={`activity-day aspect-square rounded-[3px] border border-ink/15 md:rounded-[4px] ${SHADE[d.level]}`}
                    style={{
                      gridColumn: wi + 1,
                      gridRow: (wi === 0 ? 7 - w.length : 0) + di + 1,
                      ["--i" as string]: wi,
                    }}
                  />
                )),
              )}
            </div>
            <div className="t-micro muted flex items-center justify-end gap-1.5">
              Less
              {SHADE.map((s) => (
                <i
                  key={s}
                  className={`h-3 w-3 rounded-[3px] border border-ink/15 ${s}`}
                />
              ))}
              More
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
