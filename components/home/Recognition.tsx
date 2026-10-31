import Link from "next/link";
import { achievements } from "@/content/achievements";
import SectionLabel from "./SectionLabel";

const HIGHLIGHTS = ["56-hour hackathon", "Flipkart GRiD 6.0, Software Development track", "Deep Dive on AWS"];

export default function Recognition() {
  const picks = achievements.filter((a) => a.kind === "Patent" || HIGHLIGHTS.includes(a.title));
  return (
    <section id="recognition" aria-labelledby="recognition-title" className="edge">
      <SectionLabel n={6}>Recognition</SectionLabel>
      <div className="grid gap-[41px] py-24 lg:grid-cols-[3fr_7fr]">
        <div className="grid content-start justify-items-start gap-8">
          <h2 id="recognition-title" className="t-h1" data-reveal>
            On the record.
          </h2>
          <Link href="/achievements" className="btn-ghost">All achievements</Link>
        </div>
        <ul className="dash-b">
          {picks.map((a) => (
            <li key={a.title} className="dash-t grid gap-3 py-6 md:grid-cols-[minmax(200px,2fr)_5fr] md:gap-6" data-reveal>
              <p className="t-label grid content-start gap-2">
                <span>{a.year}</span>
                <span className="muted">{a.kind}</span>
              </p>
              <div className="grid gap-2">
                <h3 className="t-h2">{a.title}</h3>
                <p className="t-label muted">
                  {a.org} — {a.status}
                </p>
                {a.kind === "Patent" && a.detail && <p className="voice-sm muted">{a.detail}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
