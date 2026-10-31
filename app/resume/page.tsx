import type { Metadata } from "next";
import { achievements } from "@/content/achievements";
import { profile } from "@/content/profile";
import { stack } from "@/content/stack";
import { timeline } from "@/content/timeline";
import { LAYERS } from "@/content/types";

export const metadata: Metadata = {
  title: "Résumé",
  description: "One-page résumé of Mohammad Ramiz: experience, skills, education, achievements and contact.",
  alternates: { canonical: "/resume" },
};

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="dash-t grid gap-6 py-12 lg:grid-cols-[3fr_7fr] lg:gap-[41px]">
      <h2 className="t-h2">{title}</h2>
      <div>{children}</div>
    </section>
  );
}

export default function ResumePage() {
  const work = timeline.filter((t) => t.kind !== "Education");

  return (
    <main id="main" className="edge pt-[var(--nav-h)]">
      <header className="grid gap-8 py-24 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="grid gap-5">
          <p className="t-label muted">~/resume</p>
          <h1 className="t-display">{profile.name}</h1>
          <p className="t-label">
            {profile.headline} — {profile.role}, {profile.company} — {profile.location}
          </p>
        </div>
        <a href={profile.resume} className="btn-pill w-fit">Download PDF</a>
      </header>

      <Row title="Summary">
        <p className="voice">{profile.summary}</p>
      </Row>

      <Row title="Experience">
        <ol className="grid gap-8">
          {work.map((t) => (
            <li key={t.org + t.title} className="grid gap-2 md:grid-cols-[200px_1fr] md:gap-6">
              <p className="t-label muted">{t.period}</p>
              <div className="grid gap-2">
                <p className="t-sub">
                  {t.title} — {t.org}
                </p>
                <ul className="voice-sm grid gap-1">
                  {t.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </Row>

      <Row title="Skills">
        <dl className="grid">
          {LAYERS.map((l) => (
            <div key={l.id} className="dash-b grid gap-2 py-3 md:grid-cols-[200px_1fr] md:gap-6">
              <dt className="t-label muted">{l.label}</dt>
              <dd className="t-label leading-[1.5]">{stack[l.id].join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </Row>

      <Row title="Achievements">
        <ul className="grid gap-4">
          {achievements.map((a) => (
            <li key={a.title} className="grid gap-1 md:grid-cols-[200px_1fr] md:gap-6">
              <p className="t-label muted">
                {a.year} — {a.status}
              </p>
              <p className="t-label leading-[1.5]">
                {a.title} <span className="muted">— {a.org}</span>
              </p>
            </li>
          ))}
        </ul>
      </Row>

      <Row title="Education">
        <ul className="grid gap-4">
          {profile.schooling.map((e) => (
            <li key={e.degree} className="grid gap-1 md:grid-cols-[200px_1fr] md:gap-6">
              <p className="t-label muted">
                {e.period} — {e.score}
              </p>
              <p className="t-label leading-[1.5]">
                {e.degree} <span className="muted">— {e.school}</span>
              </p>
            </li>
          ))}
        </ul>
      </Row>

      <Row title="Contact">
        <ul className="t-label grid gap-3">
          <li>
            <a href={`mailto:${profile.email}`} className="link nc">{profile.email}</a>
          </li>
          <li>
            <a href={profile.phone.href} className="link">{profile.phone.display}</a>
          </li>
          {profile.links.map((l) => (
            <li key={l.label}>
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="link">
                {l.label} — <span className="nc">{l.handle}</span>
              </a>
            </li>
          ))}
        </ul>
      </Row>
    </main>
  );
}
