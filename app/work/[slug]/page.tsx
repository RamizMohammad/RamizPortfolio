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
          <div className="wrap grid gap-8 py-14 md:py-20">
            <Link href="/#systems" className="label no-underline hover:text-fg">
              ← Systems Lab
            </Link>
            <div className="flex flex-wrap items-end justify-between gap-8">
              <h1 className="display text-[clamp(48px,9vw,128px)]">{s.name}</h1>
              {s.logo && <Image src={s.logo} alt={`${s.name} logo`} width={80} height={80} className="h-16 w-16 md:h-20 md:w-20" />}
            </div>
            <p className="max-w-[52ch] text-[19px] leading-[1.55] text-fg-2">{s.summary}</p>
          </div>
        </header>

        <div className="wrap grid gap-12 py-14 md:grid-cols-12 md:py-20">
          <aside className="md:col-span-3">
            <dl className="grid gap-6 border-t border-fg pt-6">
              <div>
                <dt className="label">Type</dt>
                <dd className="mt-1">{s.shipsAs}</dd>
              </div>
              <div>
                <dt className="label">Domain</dt>
                <dd className="mt-1">{s.domains.map((d) => DOMAINS.find((x) => x.id === d)?.label).join(" · ")}</dd>
              </div>
              <div>
                <dt className="label">Stack</dt>
                <dd className="mt-1">
                  <ul className="grid gap-1">
                    {s.stack.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              {s.links && (
                <div>
                  <dt className="label">Links</dt>
                  <dd className="mt-1 grid gap-1">
                    {s.links.map((l) => (
                      <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="underline">
                        {l.label} ↗
                      </a>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </aside>

          <div className="grid content-start gap-14 md:col-span-9">
            {s.points && (
              <section aria-labelledby="what-title" className="grid gap-5">
                <h2 id="what-title" className="heading text-[32px]">What it does</h2>
                <ul className="grid border-t border-rule">
                  {s.points.map((p) => (
                    <li key={p} className="border-b border-rule py-4 text-[17px] text-fg-2">
                      {p}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {s.architecture && (
              <section aria-labelledby="arch-title" className="grid gap-5">
                <h2 id="arch-title" className="heading text-[32px]">Architecture</h2>
                <ArchitectureDiagram name={s.name} nodes={s.architecture.nodes} edges={s.architecture.edges} caption={s.architecture.caption} />
              </section>
            )}
            {!s.points && !s.architecture && (
              <p className="max-w-[56ch] text-fg-2">A longer write-up of this project is on its way. Until then, the live link has the full picture.</p>
            )}
          </div>
        </div>

        <nav aria-label="Next case study" className="border-t border-rule">
          <Link href={`/work/${next.slug}`} className="wrap group flex flex-wrap items-baseline justify-between gap-4 py-14 no-underline">
            <span className="label">Next system</span>
            <span className="display text-[clamp(36px,6vw,80px)] transition-transform group-hover:translate-x-2">{next.name} →</span>
          </Link>
        </nav>
      </article>
    </main>
  );
}
