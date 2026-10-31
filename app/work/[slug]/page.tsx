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
  const prev = publicSystems[(i - 1 + publicSystems.length) % publicSystems.length];
  const next = publicSystems[(i + 1) % publicSystems.length];

  return (
    <main id="main" className="edge pt-[var(--nav-h)]">
      <article>
        <header className="grid gap-12 py-16 lg:min-h-[calc(100svh-var(--nav-h))] lg:content-center lg:gap-16">
          <div className="grid gap-5">
            <Link href="/#work" className="t-label muted link-quiet w-fit">
              ~/work/{s.slug}
            </Link>
            <h1 className="t-display">{s.name}</h1>
            <p className="t-label">
              <span className="dot mr-2" /> {s.shipsAs}
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-[7fr_3fr] lg:items-end lg:gap-[41px]">
            <div className={`grid place-items-center rounded-[28px] border-[1.5px] border-ink p-[6%] ${["bg-blue", "bg-pink", "bg-lime", "bg-sun", "bg-violet", "bg-mint"][i % 6]}`}>
              {s.screen ? (
                <Image src={s.screen.src} alt={`Screenshot of ${s.name}`} width={s.screen.width} height={s.screen.height} sizes="(min-width: 1024px) 60vw, 84vw" priority className="h-auto w-full rounded-[14px] border-[1.5px] border-ink" />
              ) : (
                <div className="grid aspect-[16/7] place-items-center">
                  {s.logo && <Image src={s.logo} alt="" width={128} height={128} priority className="h-24 w-24 rounded-[24px] border-[1.5px] border-ink md:h-32 md:w-32" />}
                </div>
              )}
            </div>
            <p className="voice">{s.summary}</p>
          </div>
        </header>

        <div className="dash-t grid gap-[41px] py-24 lg:grid-cols-[3fr_7fr]">
          <h2 className="t-h1">What it does</h2>
          <div className="grid gap-10">
            {s.points ? (
              <ul className="dash-b">
                {s.points.map((p, n) => (
                  <li key={p} className="dash-t voice grid grid-cols-[56px_1fr] py-5">
                    <span className="t-label muted pt-2">{String(n + 1).padStart(2, "0")}</span>
                    {p}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="voice muted">A longer write-up is on its way. The live link has the full picture.</p>
            )}
            <dl className="t-label grid">
              <div className="dash-t grid grid-cols-[110px_1fr] gap-3 py-3">
                <dt className="muted">Stack</dt>
                <dd>{s.stack.join(" · ")}</dd>
              </div>
              <div className="dash-t grid grid-cols-[110px_1fr] gap-3 py-3">
                <dt className="muted">Domain</dt>
                <dd>{s.domains.map((d) => DOMAINS.find((x) => x.id === d)?.label).join(" · ")}</dd>
              </div>
              <div className="dash-t dash-b grid grid-cols-[110px_1fr] gap-3 py-3">
                <dt className="muted">Ships as</dt>
                <dd>{s.shipsAs}</dd>
              </div>
            </dl>
            {s.links && (
              <div className="flex flex-wrap gap-3">
                {s.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="btn-pill">
                    {l.label} ↗
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {s.architecture && (
          <section aria-labelledby="arch-title" className="dash-t grid gap-[41px] py-24 lg:grid-cols-[3fr_7fr]">
            <h2 id="arch-title" className="t-h1">Architecture</h2>
            <ArchitectureDiagram name={s.name} nodes={s.architecture.nodes} edges={s.architecture.edges} caption={s.architecture.caption} />
          </section>
        )}

        <nav aria-label="More case studies" className="dash-t grid gap-6 py-16 md:grid-cols-2">
          <Link href={`/work/${prev.slug}`} className="group grid gap-3">
            <span className="t-label muted">← Previous</span>
            <span className="t-h1 group-hover:underline group-hover:decoration-dashed group-hover:decoration-1 group-hover:underline-offset-8">{prev.name}</span>
          </Link>
          <Link href={`/work/${next.slug}`} className="group grid gap-3 md:justify-items-end md:text-right">
            <span className="t-label muted">Next →</span>
            <span className="t-h1 group-hover:underline group-hover:decoration-dashed group-hover:decoration-1 group-hover:underline-offset-8">{next.name}</span>
          </Link>
        </nav>
      </article>
    </main>
  );
}
