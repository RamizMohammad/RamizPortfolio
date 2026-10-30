"use client";

import Image from "next/image";
import Link from "next/link";
import ChapterHead from "@/components/ChapterHead";
import { taglines } from "@/content/personality";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { DOMAIN_LAYERS } from "@/content/layers";
import { systems } from "@/content/systems";
import { DOMAINS, type Domain } from "@/content/types";
import { setFocus, setSystem, setSystemFilter } from "@/scene/store";

const noop = () => () => {};
const readDomainParam = () => new URLSearchParams(window.location.search).get("domain");
const label = (d: Domain) => DOMAINS.find((x) => x.id === d)?.label ?? d;

export default function SystemsLab() {
  // Only offer filters that have at least one real system behind them.
  const domains = useMemo(() => DOMAINS.filter((d) => systems.some((s) => s.domains.includes(d.id))), []);
  // A shared link like /?domain=ai opens the Lab already filtered.
  const fromUrl = useSyncExternalStore(noop, readDomainParam, () => null);
  const [chosen, setFilter] = useState<Domain | "all" | null>(null);
  const filter = chosen ?? (fromUrl && domains.some((x) => x.id === fromUrl) ? (fromUrl as Domain) : "all");

  // The street mirrors the list: kiosks outside the filter sink into the ground.
  useEffect(() => setSystemFilter(filter), [filter]);

  const choose = (d: Domain | "all") => {
    setFilter(d);
    const url = new URL(window.location.href);
    if (d === "all") url.searchParams.delete("domain");
    else url.searchParams.set("domain", d);
    window.history.replaceState(null, "", url);
  };

  // Same order as the street: public systems kiosk by kiosk, then the Moglix building.
  const rows = [...systems.filter((s) => !s.internal), ...systems.filter((s) => s.internal)].filter((s) => filter === "all" || s.domains.includes(filter));

  const lift = (slug: string | null, domains: Domain[] = []) => {
    setFocus(domains.flatMap((d) => DOMAIN_LAYERS[d]));
    setSystem(slug);
  };

  return (
    <section id="systems" aria-labelledby="systems-title" className="stop">
      <div className="grid gap-9">
        <ChapterHead n={1} kicker={taglines.chapters.systems} title="Systems Lab" id="systems-title">
          <p className="flex flex-wrap gap-2 text-[14px]" data-reveal style={{ ["--rd" as string]: "200ms" }}>
            <span className="tape tape-line" style={{ ["--tilt" as string]: "-1.5deg" }}>{taglines.systems[0]}</span>
            <span className="tape tape-line" style={{ ["--tilt" as string]: "1deg" }}>{taglines.systems[1]}</span>
          </p>
          <p className="max-w-[52ch] text-fg-2" data-reveal style={{ ["--rd" as string]: "120ms" }}>
            Everything I have built and shipped. Each public system has its own kiosk on the street: point at one here or there and it lights up. Work done inside Moglix is listed by name only.
          </p>
        </ChapterHead>

        <div role="group" aria-label="Filter systems by domain" className="flex flex-wrap gap-2">
          {[{ id: "all" as const, label: "All" }, ...domains].map((d) => (
            <button
              key={d.id}
              type="button"
              aria-pressed={filter === d.id}
              onClick={() => choose(d.id)}
              className="min-h-10 border-[1.5px] border-fg px-4 text-[13px] text-fg transition-colors hover:bg-tape aria-pressed:bg-fg aria-pressed:text-ink"
            >
              {d.label}
            </button>
          ))}
        </div>

        <ul className="grid border-t-[1.5px] border-fg" aria-label={`Systems, ${filter === "all" ? "all domains" : label(filter)}`}>
          {rows.map((s, i) => (
            <li
              key={s.slug}
              className="group relative grid grid-cols-[48px_1fr_auto] items-start gap-4 border-b border-rule py-4 transition-colors hover:bg-panel focus-within:bg-panel"
              data-reveal
              style={{ ["--rd" as string]: `${Math.min(i, 6) * 50}ms` }}
              onPointerEnter={() => lift(s.slug, s.domains)}
              onPointerLeave={() => lift(null)}
              onFocus={() => lift(s.slug, s.domains)}
              onBlur={() => lift(null)}
            >
              {s.sticker ? (
                <Image src={s.sticker} alt="" width={48} height={48} className="mt-0.5 rounded-[10px] border-[1.5px] border-fg bg-ink" />
              ) : (
                <span aria-hidden="true" className="mt-0.5 h-12 w-12 rounded-[10px] border-[1.5px] border-fg bg-panel" />
              )}
              <div className="grid gap-1">
                {s.internal ? (
                  <h3 className="title text-[19px] text-fg">
                    {s.name} <span className="label ml-1 align-middle text-violet-soft">Internal</span>
                  </h3>
                ) : (
                  <h3 className="title text-[19px]">
                    <Link href={`/work/${s.slug}`} className="text-fg no-underline transition-colors after:absolute after:inset-0 after:content-[''] group-hover:text-cyan focus-visible:outline-none group-focus-within:underline">
                      {s.name}
                    </Link>
                  </h3>
                )}
                <p className="text-[14px] leading-snug text-fg-3">{s.summary}</p>
                <p className="label mt-1 normal-case tracking-normal text-fg-2">
                  {s.domains.map(label).join(" · ")} — {s.shipsAs}
                </p>
                <p className="data text-[12px] text-violet-soft/90">{s.stack.join(" · ")}</p>
              </div>
              <span className="data pt-1 text-cyan" aria-hidden="true">
                {s.internal ? "" : <span className="inline-block transition-transform group-hover:translate-x-1">→</span>}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
