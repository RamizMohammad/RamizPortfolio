import type { Metadata } from "next";
import Image from "next/image";
import { achievements, type Achievement } from "@/content/achievements";

export const metadata: Metadata = {
  title: "Achievements",
  description: "Patent, hackathons, competitions and certifications of Mohammad Ramiz.",
  alternates: { canonical: "/achievements" },
};

const GROUPS: { title: string; kinds: Achievement["kind"][] }[] = [
  { title: "Patent", kinds: ["Patent"] },
  { title: "Hackathons and competitions", kinds: ["Hackathon", "Competition"] },
  { title: "Certifications and internship", kinds: ["Certification", "Internship"] },
];

export default function AchievementsPage() {
  return (
    <main id="main" className="edge pt-[var(--nav-h)]">
      <header className="grid gap-6 py-24">
        <p className="t-label muted">~/recognition</p>
        <h1 className="t-display">Achievements</h1>
      </header>
      {GROUPS.map((g) => (
        <section key={g.title} aria-labelledby={g.title} className="dash-t grid gap-[41px] py-20 lg:grid-cols-[3fr_7fr]">
          <h2 id={g.title} className="t-h1">{g.title}</h2>
          <ul className="dash-b">
            {achievements
              .filter((a) => g.kinds.includes(a.kind))
              .map((a) => (
                <li key={a.title} className="dash-t grid gap-6 py-8 md:grid-cols-[5fr_4fr]">
                  <div className="grid content-start gap-3">
                    <p className="t-label muted">
                      {a.kind} — {a.year}
                    </p>
                    <h3 className="t-h2">{a.title}</h3>
                    <p className="t-label">
                      {a.org} — <span className="text-pink-deep">{a.status}</span>
                    </p>
                    {a.detail && <p className="voice-sm muted">{a.detail}</p>}
                  </div>
                  {a.image && (
                    <a href={a.image.src} target="_blank" rel="noopener noreferrer" aria-label={`Open ${a.image.alt}`}>
                      <Image src={a.image.src} alt={a.image.alt} width={a.image.width} height={a.image.height} sizes="(min-width: 768px) 40vw, 92vw" className="h-auto w-full" />
                    </a>
                  )}
                </li>
              ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
