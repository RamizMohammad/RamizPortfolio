import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import { DOMAINS } from "@/content/types";
import { getSystem, publicSystems } from "@/content/systems";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return publicSystems.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = getSystem((await params).slug);
  if (!s) return {};
  return { title: s.name, description: s.summary, alternates: { canonical: `/work/${s.slug}` } };
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params;
  const s = getSystem(slug);
  if (!s) notFound();
  const i = publicSystems.findIndex((x) => x.slug === s.slug);
  const next = publicSystems[(i + 1) % publicSystems.length];

  return (
    <main id="main" className="page">
      <article>
        <header className="border-b border-rule">
          <div className="wrap grid justify-items-center gap-6 py-14 text-center md:py-20">
            <Link href="/#systems" className="label no-underline hover:text-fg">
              ← Systems Lab
            </Link>
            {s.logo && <Image src={s.logo} alt={`${s.name} logo`} width={80} height={80} className="h-16 w-16 rounded-2xl border-[1.5px] border-fg bg-panel p-2 shadow-[4px_4px_0_var(--color-fg)] md:h-20 md:w-20" />}
            <h1 className="display text-[clamp(48px,9vw,128px)]">{s.name}</h1>
            <p>
              <span className="tape text-[clamp(14px,1.5vw,18px)] uppercase tracking-wide" style={{ ["--tilt" as string]: "-1deg" }}>
                {s.shipsAs} · {s.domains.map((d) => DOMAINS.find((x) => x.id === d)?.label).join(" · ")}
              </span>
            </p>
          </div>
        </header>

        {/* Three columns, like a design brief sheet: what was asked, what it does, what it is made of. */}
        <div className="wrap grid gap-12 py-14 md:grid-cols-3 md:gap-10 md:py-20">
          <section aria-labelledby="brief-title" className="grid content-start gap-3">
            <h2 id="brief-title" className="heading text-[26px] text-cyan">Brief</h2>
            <p className="text-[16px] leading-relaxed text-fg-2">{s.summary}</p>
          </section>
          <section aria-labelledby="what-title" className="grid content-start gap-3">
            <h2 id="what-title" className="heading text-[26px] text-cyan">What it does</h2>
            {s.points ? (
              <ul className="grid gap-2 text-[15px] text-fg-2">
                {s.points.map((p) => (
                  <li key={p} className="flex gap-3">
                    <span aria-hidden="true" className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-violet" />
                    {p}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[15px] text-fg-2">A longer write-up is on its way. The live link has the full picture.</p>
            )}
          </section>
          <section aria-labelledby="type-title" className="grid content-start gap-3">
            <h2 id="type-title" className="heading text-[26px] text-cyan">Project type</h2>
            <p className="text-[15px] text-fg-2">{s.shipsAs}</p>
            <h2 className="heading mt-3 text-[26px] text-cyan">Stack</h2>
            <ul className="flex flex-wrap gap-1.5">
              {s.stack.map((t) => (
                <li key={t} className="rounded-full border-[1.5px] border-fg px-2.5 py-1 text-[13px]">{t}</li>
              ))}
            </ul>
            {s.links && (
              <div className="mt-3 grid gap-1">
                {s.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="mark w-fit">
                    {l.label} ↗
                  </a>
                ))}
              </div>
            )}
          </section>
        </div>

        {s.architecture && (
          <section aria-labelledby="arch-title" className="wrap grid gap-6 pb-20">
            <h2 id="arch-title" className="justify-self-center">
              <span className="tape text-[clamp(18px,2vw,26px)]" style={{ ["--tilt" as string]: "-1.5deg" }}>Architecture</span>
            </h2>
            <ArchitectureDiagram name={s.name} nodes={s.architecture.nodes} edges={s.architecture.edges} caption={s.architecture.caption} />
          </section>
        )}

        <nav aria-label="Next case study" className="border-t border-rule">
          <Link href={`/work/${next.slug}`} className="wrap group flex flex-wrap items-baseline justify-between gap-4 py-14 no-underline">
            <span className="label">Next system</span>
            <span className="display text-[clamp(36px,6vw,80px)] transition-transform group-hover:translate-x-2 group-hover:text-cyan">{next.name} →</span>
          </Link>
        </nav>
      </article>
    </main>
  );
}
