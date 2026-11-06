import LensPitch from "@/components/lens/LensPitch";
import LensSwitch from "@/components/lens/LensSwitch";
import PrintButton from "@/components/lens/PrintButton";
import { achievements } from "@/content/achievements";
import { lensTags } from "@/content/lens";
import { systems } from "@/content/systems";
import { profile } from "@/content/profile";
import { stack } from "@/content/stack";
import { timeline } from "@/content/timeline";
import { LAYERS } from "@/content/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Résumé",
  description: "Résumé of Mohammad Ramiz: experience, projects, skills, education and achievements. Pick a role (GenAI, backend, Android, ML) to tailor it.",
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
  const projects = systems.map((s) => ({ ...s, tags: lensTags(s.stack.join(" "), s.summary, ...(s.points ?? [])) }));

  return (
    <main id="main" className="print-lens edge pt-[var(--nav-h)]">
      <header className="grid gap-8 py-24 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="grid gap-5">
          <p className="t-label muted">~/resume</p>
          <h1 className="t-display">{profile.name}</h1>
          <p className="t-label">
            <LensPitch fallback={profile.headline} /> — {profile.role}, {profile.company} — {profile.location}
          </p>
        </div>
        <div className="no-print grid justify-items-start gap-3 lg:justify-items-end">
          <a href={profile.resume} className="btn-pill w-fit">Download PDF</a>
          <PrintButton />
        </div>
        <LensSwitch className="no-print !justify-start lg:col-span-2" />
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
                <ul className="lens-order voice-sm flex flex-col gap-1">
                  {t.points.map((p) => (
                    <li key={p} data-lens-tags={lensTags(p)}>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </Row>

      <Row title="Projects">
        <ul className="lens-order flex flex-col gap-6">
          {projects.map((s) => (
            <li key={s.slug} data-lens-tags={s.tags} className="grid gap-1 md:grid-cols-[200px_1fr] md:gap-6">
              <p className="t-label muted">{s.org ?? s.shipsAs}</p>
              <div className="grid gap-1">
                <p className="t-sub">{s.name}</p>
                <p className="voice-sm">{s.summary}</p>
                <p className="t-micro muted">{s.stack.join(" · ")}</p>
              </div>
            </li>
          ))}
        </ul>
      </Row>

      <Row title="Skills">
        <dl className="grid">
          {LAYERS.map((l) => (
            <div key={l.id} className="dash-b grid gap-2 py-3 md:grid-cols-[200px_1fr] md:gap-6">
              <dt className="t-label muted">{l.label}</dt>
              <dd className="lens-order t-label flex flex-wrap gap-x-3 gap-y-1 leading-[1.5]">
                {stack[l.id].map((t) => (
                  <span key={t} data-lens-tags={lensTags(t)}>
                    {t}
                  </span>
                ))}
              </dd>
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
