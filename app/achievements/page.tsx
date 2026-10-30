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
    <main id="main" className="page">
      <header className="border-b border-rule">
        <div className="wrap py-14 md:py-20">
          <p className="label">Record</p>
          <h1 className="display mt-4 text-[clamp(48px,9vw,128px)]">Achievements</h1>
        </div>
      </header>
      <div className="wrap grid gap-20 py-14 md:py-20">
        {GROUPS.map((g) => (
          <section key={g.title} aria-labelledby={g.title} className="grid gap-6">
            <h2 id={g.title} className="heading text-[clamp(28px,4vw,44px)]">{g.title}</h2>
            <ul className={`grid gap-px border border-rule bg-rule ${g.kinds[0] === "Patent" ? "" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
              {achievements
                .filter((a) => g.kinds.includes(a.kind))
                .map((a) => (
                  <li key={a.title} className={`grid content-start gap-5 bg-ink p-5 ${a.kind === "Patent" ? "md:grid-cols-2 md:gap-10 md:p-8" : ""}`}>
                    {a.image && (
                      <Image src={a.image.src} alt={a.image.alt} width={a.image.width} height={a.image.height} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="h-auto w-full border border-rule" />
                    )}
                    <div className="grid content-start gap-2">
                      <p className="label">
                        {a.kind} · {a.year}
                      </p>
                      <h3 className={a.kind === "Patent" ? "heading text-[clamp(24px,3vw,36px)]" : "title text-[20px]"}>{a.title}</h3>
                      <p className="text-fg-2">{a.org}</p>
                      <p className="mt-1 inline-flex w-fit border border-fg px-2 py-1 text-[12px] font-semibold">{a.status}</p>
                      {a.detail && <p className="mt-2 max-w-[60ch] text-[15px] text-fg-2">{a.detail}</p>}
                    </div>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
