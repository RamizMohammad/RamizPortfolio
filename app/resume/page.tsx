import type { Metadata } from "next";
import Image from "next/image";
import CurvedLed from "@/components/CurvedLed";
import ResumeStickers from "@/components/ResumeStickers";
import { achievements } from "@/content/achievements";
import { taglines } from "@/content/personality";
import { profile } from "@/content/profile";
import { stack } from "@/content/stack";
import { timeline } from "@/content/timeline";
import { LAYERS } from "@/content/types";

export const metadata: Metadata = {
  title: "Résumé",
  description: "One-page résumé of Mohammad Ramiz: experience, skills, education, achievements and contact.",
  alternates: { canonical: "/resume" },
};

function Block({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`grid content-start gap-4 ${className}`} data-reveal>
      <h2 className="pill w-fit">{title}</h2>
      {children}
    </section>
  );
}

export default function ResumePage() {
  const work = timeline.filter((t) => t.kind !== "Education");
  const edu = timeline.find((t) => t.kind === "Education");
  const wins = achievements.filter((a) => a.kind === "Patent" || a.kind === "Hackathon" || a.kind === "Competition");
  const certs = achievements.filter((a) => a.kind === "Certification");

  return (
    <main id="main" className="page relative overflow-hidden">
      <ResumeStickers />
      <div className="wrap relative z-[2] grid gap-14 py-14 md:py-20">
        <header className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="label eyebrow">Spec sheet</p>
            <CurvedLed text="Unboxing me······" className="-mb-3 mt-2 w-[min(100%,420px)]" />
            <h1 className="display text-[clamp(52px,9vw,128px)]" data-reveal="mask">
              Résumé
            </h1>
            <p className="mt-5">
              <span className="tape text-[15px]" style={{ ["--tilt" as string]: "-1.5deg" }}>
                {taglines.resume}
              </span>
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:col-span-4 md:justify-end">
            <a href={profile.resume} className="btn btn-solid">
              Download PDF
            </a>
            <a href={`mailto:${profile.email}`} className="btn">
              Email me
            </a>
          </div>
        </header>

        <div className="grid gap-12 lg:grid-cols-12">
          {/* ID card styled like an old handset, as in a physical portfolio box */}
          <aside className="grid content-start gap-8 lg:col-span-4">
            <div className="relative mx-auto w-full max-w-[320px]" data-reveal>
              <div className="rounded-[44px] border-2 border-violet/70 bg-gradient-to-b from-[#2a2470] to-[#15123d] p-5 shadow-[0_30px_80px_-30px_var(--color-violet)]">
                <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-ink/60" />
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border-4 border-ink bg-[radial-gradient(circle_at_50%_30%,#1d2a55,#05070d)]">
                  <Image src="/images/portrait-cut.webp" alt={profile.portrait.alt} width={640} height={640} sizes="300px" className="absolute bottom-0 left-1/2 w-[120%] max-w-none -translate-x-1/2" />
                  <span className="tape absolute left-3 top-3 text-[11px]" style={{ ["--tilt" as string]: "-4deg" }}>
                    {profile.name}
                  </span>
                </div>
                <div className="mt-5 grid grid-cols-3 items-center gap-3">
                  <span className="h-3 rounded-full bg-ink/50" />
                  <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border-2 border-violet/60 bg-[#211c5c]">
                    <span className="h-6 w-6 rounded-full border-2 border-violet/60" />
                  </span>
                  <span className="h-3 rounded-full bg-ink/50" />
                </div>
              </div>
            </div>

            <Block title="About me">
              <p className="text-[15px] leading-relaxed text-fg-2">
                {profile.name}, <mark>{profile.role}</mark> at {profile.company}. {profile.summary}
              </p>
            </Block>

            <Block title="Contact">
              <ul className="grid gap-2 text-[15px]">
                <li className="text-fg-2">{profile.location}</li>
                <li>
                  <a href={`mailto:${profile.email}`} className="mark">{profile.email}</a>
                </li>
                <li>
                  <a href={profile.phone.href} className="underline decoration-cyan/50 hover:text-cyan">{profile.phone.display}</a>
                </li>
                {profile.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="underline decoration-cyan/50 hover:text-cyan">
                      {l.label} · {l.handle}
                    </a>
                  </li>
                ))}
              </ul>
            </Block>

            {edu && (
              <Block title="Education">
                <p className="text-[15px]">
                  <span className="font-semibold">{edu.title}</span>
                  <span className="block text-fg-2">{edu.org}</span>
                </p>
              </Block>
            )}
          </aside>

          <div className="grid content-start gap-12 md:grid-cols-2 lg:col-span-8">
            <Block title="Experience" className="md:col-span-2">
              <ol className="grid gap-5">
                {work.map((t) => (
                  <li key={t.org + t.title} className="grid gap-1 border-l-2 border-violet/50 pl-4 sm:grid-cols-[150px_1fr] sm:gap-4">
                    <span className="data text-cyan">{t.period}</span>
                    <div>
                      <p className="text-[16px]">
                        <mark>{t.title}</mark> <span className="text-fg-2">· {t.org}</span>
                      </p>
                      <p className="mt-1 text-[14px] text-fg-2">{t.points[0]}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Block>

            <Block title="Hard skills" className="md:col-span-2">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {LAYERS.map((l) => (
                  <div key={l.id}>
                    <p className="label mb-2" style={{ color: l.color }}>{l.label}</p>
                    <ul className="flex flex-wrap gap-1.5">
                      {stack[l.id].map((s) => (
                        <li key={s} className="rounded-full border px-2.5 py-1 text-[12px]" style={{ borderColor: `${l.color}66` }}>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Block>

            <Block title="Achievements">
              <ul className="grid gap-3 text-[14px]">
                {wins.map((a) => (
                  <li key={a.title} className="grid grid-cols-[44px_1fr] gap-3">
                    <span className="data text-cyan">{a.year}</span>
                    <span>
                      <mark>{a.status}</mark> {a.title}
                      <span className="block text-fg-2">{a.org}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Block>

            <Block title="Certificates">
              <ul className="grid gap-3 text-[14px]">
                {certs.map((a) => (
                  <li key={a.title} className="grid grid-cols-[44px_1fr] gap-3">
                    <span className="data text-cyan">{a.year}</span>
                    <span>
                      {a.title}
                      <span className="block text-fg-2">{a.org}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Block>

            <Block title="Objective" className="md:col-span-2">
              <p className="max-w-[70ch] text-[15px] leading-relaxed text-fg-2">
                Build <mark>automation</mark>, <mark>backends</mark> and the <mark>infrastructure</mark> under them, and keep the apps on top fast and simple. Also working with <mark>AI/ML</mark>, computer vision and OCR.
              </p>
            </Block>
          </div>
        </div>
      </div>
    </main>
  );
}
