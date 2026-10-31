"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { systems } from "@/content/systems";
import { DOMAINS, type Domain, type System } from "@/content/types";
import SectionLabel from "./SectionLabel";

const noop = () => () => {};
const readDomainParam = () => new URLSearchParams(window.location.search).get("domain");
const label = (d: Domain) => DOMAINS.find((x) => x.id === d)?.label ?? d;

const publicOnes = systems.filter((s) => !s.internal);
const internal = systems.filter((s) => s.internal);

/** Each project sits on its own flat colour block, like a sticker sheet. */
const PANELS = ["bg-blue", "bg-pink", "bg-lime", "bg-sun", "bg-violet", "bg-mint"];

/** The object of each project screen: a screenshot of the live product, or its logo, on a colour block. */
function Artifact({ s, i }: { s: System; i: number }) {
  return (
    <div className={`grid aspect-[16/11] place-items-center rounded-[28px] border-[1.5px] border-ink p-[7%] ${PANELS[i % PANELS.length]}`}>
      {s.screen ? (
        <Image
          src={s.screen.src}
          alt={`Screenshot of ${s.name}`}
          width={s.screen.width}
          height={s.screen.height}
          sizes="(min-width: 1024px) 36vw, 84vw"
          className="h-auto w-full rounded-[14px] border-[1.5px] border-ink"
        />
      ) : (
        <div className="grid justify-items-center gap-4">
          {s.logo && <Image src={s.logo} alt="" width={120} height={120} className="h-24 w-24 rounded-[24px] border-[1.5px] border-ink md:h-28 md:w-28" />}
          <span className="btn-ghost btn-sm pointer-events-none">{s.name}</span>
        </div>
      )}
    </div>
  );
}

export default function Work() {
  // Only offer filters that have at least one real system behind them.
  const domains = useMemo(() => DOMAINS.filter((d) => systems.some((s) => s.domains.includes(d.id))), []);
  // A shared link like /?domain=ai opens the list already filtered.
  const fromUrl = useSyncExternalStore(noop, readDomainParam, () => null);
  const [chosen, setChosen] = useState<Domain | "all" | null>(null);
  const filter = chosen ?? (fromUrl && domains.some((x) => x.id === fromUrl) ? (fromUrl as Domain) : "all");
  const fits = (s: System) => filter === "all" || s.domains.includes(filter);

  const choose = (d: Domain | "all") => {
    setChosen(d);
    const url = new URL(window.location.href);
    if (d === "all") url.searchParams.delete("domain");
    else url.searchParams.set("domain", d);
    window.history.replaceState(null, "", url);
  };

  const shown = publicOnes.filter(fits);
  const shownInternal = internal.filter(fits);

  return (
    <section id="work" aria-labelledby="work-title" className="edge">
      <SectionLabel n={4}>Systems</SectionLabel>
      <div className="grid gap-8 pb-12 pt-24 lg:grid-cols-[3fr_7fr] lg:gap-[41px]">
        <h2 id="work-title" className="t-h1" data-reveal>
          Built and shipped.
        </h2>
        <div className="grid content-end gap-8">
          <p className="voice max-w-[34ch]" data-reveal>
            {publicOnes.length} public systems, from a collaborative code editor to an app on Google Play, plus the internal work I do at Moglix.
          </p>
          <div role="group" aria-label="Filter systems by domain" className="t-label flex flex-wrap gap-x-6 gap-y-3">
            {[{ id: "all" as const, label: "All" }, ...domains].map((d) => (
              <button key={d.id} type="button" aria-pressed={filter === d.id} onClick={() => choose(d.id)} className={`uppercase ${filter === d.id ? "link" : "link-quiet muted hover:text-ink"}`}>
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {shown.map((s) => (
        <article key={s.slug} aria-labelledby={`sys-${s.slug}`} className="void dash-t">
          <div className="grid content-start gap-5" data-reveal>
            <p className="t-label muted">
              {String(publicOnes.indexOf(s) + 1).padStart(2, "0")} / {String(publicOnes.length).padStart(2, "0")}
            </p>
            <h3 id={`sys-${s.slug}`} className="t-h1">{s.name}</h3>
            <p className="t-label">
              <span className="dot mr-2" /> {s.shipsAs}
            </p>
          </div>
          <Link href={`/work/${s.slug}`} aria-label={`${s.name} case study`} tabIndex={-1} data-reveal style={{ ["--rd" as string]: "80ms" }}>
            <Artifact s={s} i={publicOnes.indexOf(s)} />
          </Link>
          <div className="grid content-start gap-6" data-reveal style={{ ["--rd" as string]: "160ms" }}>
            <p className="voice">{s.summary}</p>
            <dl className="t-label grid">
              <div className="dash-t grid grid-cols-[96px_1fr] gap-3 py-3">
                <dt className="muted">Stack</dt>
                <dd>{s.stack.join(" · ")}</dd>
              </div>
              <div className="dash-t dash-b grid grid-cols-[96px_1fr] gap-3 py-3">
                <dt className="muted">Domain</dt>
                <dd>{s.domains.map(label).join(" · ")}</dd>
              </div>
            </dl>
            <div className="flex flex-wrap items-center gap-5">
              <Link href={`/work/${s.slug}`} className="btn-ghost">Read case study</Link>
              {s.links?.[0] && (
                <a href={s.links[0].href} target="_blank" rel="noopener noreferrer" className="t-label link">
                  {s.links[0].label} ↗
                </a>
              )}
            </div>
          </div>
        </article>
      ))}

      {shownInternal.length > 0 && (
        <div className="dash-t grid gap-8 py-24 lg:grid-cols-[3fr_7fr] lg:gap-[41px]">
          <div className="grid content-start gap-4" data-reveal>
            <h3 className="t-h1">Inside Moglix</h3>
            <p className="voice-sm muted max-w-[34ch]">Internal systems, listed by name only.</p>
          </div>
          <ul className="dash-b">
            {shownInternal.map((s) => (
              <li key={s.slug} className="dash-t grid gap-2 py-5 md:grid-cols-[1fr_auto] md:items-baseline md:gap-6" data-reveal>
                <div className="grid gap-2">
                  <p className="t-h2">{s.name}</p>
                  <p className="voice-sm muted">{s.summary}</p>
                </div>
                <p className="t-label muted">
                  {s.stack.join(" · ")} — Internal
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {shown.length === 0 && shownInternal.length === 0 && <p className="t-label muted pb-24">Nothing in this domain yet.</p>}
    </section>
  );
}
