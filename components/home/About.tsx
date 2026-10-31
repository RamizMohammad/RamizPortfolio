import Image from "next/image";
import CountUp from "@/components/CountUp";
import Parallax from "@/components/Parallax";
import { achievements } from "@/content/achievements";
import { profile } from "@/content/profile";
import { systems } from "@/content/systems";
import { timeline } from "@/content/timeline";
import SectionLabel from "./SectionLabel";

// Every number here is counted from the content files, so it stays true as they change.
const journey = timeline.filter((t) => t.span).sort((a, b) => a.span![0] - b.span![0]);
const now = timeline.find((t) => t.span && t.span[1] === null && t.kind === "Work");
const STATS = [
  { value: String(Math.floor(journey[0].span![0])), label: "Building software since", tone: "bg-lime" },
  { value: String(systems.filter((s) => !s.internal).length), label: "Public systems shipped", tone: "bg-pink" },
  { value: String(systems.filter((s) => s.internal).length), label: "Internal systems at Moglix", tone: "bg-sun" },
  { value: String(achievements.filter((a) => a.kind === "Patent").length), label: "Patent filed", tone: "bg-blue text-card" },
  { value: String(achievements.filter((a) => a.kind === "Hackathon" || a.kind === "Competition").length), label: "Hackathons and competitions", tone: "bg-mint" },
  { value: String(systems.filter((s) => s.shipsAs.includes("Google Play")).length), label: "App live on Google Play", tone: "bg-card" },
];
const CHIP_TONES = ["bg-pink", "bg-lime", "bg-sun", "bg-violet", "bg-mint", "bg-card"];

const card = "rounded-[28px] border-[1.5px] border-ink";

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="edge pb-24">
      <SectionLabel n={1}>About</SectionLabel>
      <div className="grid gap-4 pt-16 lg:grid-cols-12">
        {/* Intro */}
        <div className={`${card} pop-in grid content-between gap-8 bg-card p-7 md:p-10 lg:col-span-7`} data-reveal>
          <div className="grid gap-5">
            <div className="flex items-center gap-4">
              <Image src="/images/mascot-face.webp" alt="" width={512} height={512} sizes="112px" className="wave h-20 w-20 rounded-full border-[1.5px] border-ink bg-sun md:h-28 md:w-28" />
              <div className="grid gap-1">
                <p className="t-h2">{profile.name}</p>
                <p className="t-label muted">The person behind the systems</p>
              </div>
            </div>
            <h2 id="about-title" className="t-display">
              Hi, I&rsquo;m Ramiz.
            </h2>
            <p className="voice-sm max-w-[58ch] text-[18px]">
              I&rsquo;m a software engineer at {profile.company}, based in {profile.location}. I like the parts of software most people never see: the scripts that remove manual work, the APIs that connect systems, and the servers they run on. I&rsquo;ve been building since {STATS[0].value}, first my own products, then freelance Android apps, an internship as project lead, and now backend and agentic AI work at {profile.company}. I build the apps on top too, mostly Android and the web.
            </p>
          </div>
          <ul className="flex flex-wrap gap-2" aria-label="At a glance">
            <li className="btn-ghost btn-sm pointer-events-none">{profile.role}</li>
            <li className="btn-ghost btn-sm pointer-events-none">{profile.education}</li>
            <li className="btn-ghost btn-sm pointer-events-none">Greater Noida, India</li>
            <li className="btn-pill btn-sm pointer-events-none">
              <span className="dot pulse !bg-lime" /> Open to work
            </li>
          </ul>
        </div>

        {/* Mascot: the full-body render, big, with a little depth under the pointer */}
        <div className={`${card} pop-in relative min-h-[520px] overflow-hidden bg-blue md:min-h-[640px] lg:col-span-5 lg:row-span-2`} data-reveal style={{ ["--rd" as string]: "80ms" }}>
          <Parallax className="absolute inset-0">
            <div data-depth="18" className="absolute -inset-5 transition-transform duration-300 ease-out">
              <Image src={profile.portrait.src} alt={profile.portrait.alt} fill sizes="(min-width: 1024px) 42vw, 96vw" className="object-cover object-[50%_35%]" />
            </div>
            <p data-depth="-14" className="absolute left-6 top-6 hidden rounded-[18px] rounded-bl-[4px] border-[1.5px] border-ink bg-card px-4 py-2.5 font-mono text-[14px] transition-transform duration-300 ease-out md:block" aria-hidden="true">
              <span className="typing" style={{ ["--chars" as string]: 21 }}>print(&quot;hello, world&quot;)</span>
              <span className="caret ml-0.5 !w-[0.5em]" />
            </p>
          </Parallax>
        </div>

        {/* Numbers */}
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:col-span-7" aria-label="In numbers">
          {STATS.map((s, i) => (
            <li key={s.label} className={`${card} pop-in lift grid content-between gap-6 p-6 ${s.tone}`} data-reveal style={{ ["--rd" as string]: `${i * 60}ms` }}>
              <span className="t-display !text-[clamp(56px,6vw,88px)]">
                <CountUp value={Number(s.value)} from={Number(s.value) > 1000 ? Number(s.value) - 21 : 0} />
              </span>
              <span className="t-label">{s.label}</span>
            </li>
          ))}
        </ul>

        {/* Right now */}
        {now && (
          <div className={`${card} pop-in grid content-start gap-5 bg-ink p-7 text-paper md:p-10 lg:col-span-5`} data-reveal>
            <p className="t-label flex items-center gap-2 text-lime">
              <span className="dot !bg-lime" /> Right now
            </p>
            <h3 className="t-h1 !text-[clamp(36px,3.6vw,56px)]">
              {now.title} at {now.org}
            </h3>
            <p className="t-label text-[#a9a5bf]">Since {now.period.split("–")[0].trim()}</p>
            <ul className="voice-sm grid gap-2">
              {now.points.slice(0, 3).map((p) => (
                <li key={p} className="grid grid-cols-[20px_1fr]">
                  <span aria-hidden="true" className="text-lime">→</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Journey */}
        <div className={`${card} pop-in grid content-start gap-8 bg-card p-7 md:p-10 lg:col-span-7`} data-reveal>
          <h3 className="t-h2">The road so far</h3>
          <ol className="relative grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <span aria-hidden="true" className="road-line absolute left-5 right-10 top-5 hidden h-[2px] bg-ink xl:block" />
            {journey.map((t, i) => (
              <li key={t.org + t.title} className="relative grid content-start gap-2">
                <span className="grid justify-items-start gap-3">
                  <span style={{ ["--i" as string]: i }} className={`road-step relative z-[1] grid h-10 w-10 shrink-0 place-items-center rounded-full border-[1.5px] border-ink font-display text-[17px] ${CHIP_TONES[i % CHIP_TONES.length]}`}>{i + 1}</span>
                  <span className="t-h2">{Math.floor(t.span![0])}</span>
                </span>
                <span className="t-label">{t.title}</span>
                <span className="voice-sm muted !text-[15px]">
                  {t.org === t.kind ? t.org : `${t.org} · ${t.kind}`}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Details */}
        <div className={`${card} pop-in grid content-start gap-6 bg-sun p-7 md:p-10 lg:col-span-5`} data-reveal>
          <h3 className="t-h2">Reach me</h3>
          <dl className="grid">
            {[
              { term: "Email", value: profile.email, href: `mailto:${profile.email}` },
              { term: "Phone", value: profile.phone.display, href: profile.phone.href },
              { term: "Based in", value: profile.location },
              { term: "Education", value: profile.education },
            ].map((d) => (
              <div key={d.term} className="grid grid-cols-[84px_1fr] gap-3 border-t-[1.5px] border-ink/20 py-3 md:grid-cols-[100px_1fr]">
                <dt className="t-label">{d.term}</dt>
                <dd className="break-words text-[15px] font-medium md:text-[16px]">{d.href ? <a href={d.href} className="link">{d.value}</a> : d.value}</dd>
              </div>
            ))}
          </dl>
          <ul className="flex flex-wrap gap-2">
            {profile.links.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="btn-ghost btn-sm">
                  {l.label} ↗
                </a>
              </li>
            ))}
            <li>
              <a href={profile.resume} className="btn-pill btn-sm">Résumé PDF</a>
            </li>
          </ul>
        </div>

        {/* Interests */}
        <div className={`${card} pop-in grid content-start gap-6 bg-card p-7 md:p-10 lg:col-span-7`} data-reveal>
          <h3 className="t-h2">What I work on</h3>
          <ul className="flex flex-wrap gap-3">
            {profile.interests.map((it, i) => (
              <li
                key={it}
                className={`chip rounded-full border-[1.5px] border-ink px-4 py-2 text-[15px] font-medium ${CHIP_TONES[i % CHIP_TONES.length]}`}
                style={{ ["--rot" as string]: `${[-2, 1.5, -1, 2, -1.5, 1][i % 6]}deg`, ["--i" as string]: i }}
              >
                {it}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
