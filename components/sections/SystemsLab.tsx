"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { DOMAIN_LAYERS } from "@/content/layers";
import { systems } from "@/content/systems";
import { DOMAINS, type Domain } from "@/content/types";
import { setFocus } from "@/scene/store";

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

  const choose = (d: Domain | "all") => {
    setFilter(d);
    const url = new URL(window.location.href);
    if (d === "all") url.searchParams.delete("domain");
    else url.searchParams.set("domain", d);
    window.history.replaceState(null, "", url);
  };

  const rows = systems.filter((s) => filter === "all" || s.domains.includes(filter));

  return (
    <section id="systems" aria-labelledby="systems-title" className="border-t border-rule py-24 md:py-32">
      <div className="wrap grid gap-10">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-6">
            <p className="label">Index of work</p>
            <h2 id="systems-title" className="display mt-4 text-[clamp(44px,7vw,96px)]">
              Systems Lab
            </h2>
          </div>
          <p className="max-w-[46ch] text-fg-2 md:col-span-5 md:col-start-8">
            Things I have built and shipped. Each public system opens a case study. Work done inside Moglix is listed by name only.
          </p>
        </div>

        <div role="group" aria-label="Filter systems by domain" className="flex flex-wrap gap-2">
          {[{ id: "all" as const, label: "All" }, ...domains].map((d) => (
            <button
              key={d.id}
              type="button"
              aria-pressed={filter === d.id}
              onClick={() => choose(d.id)}
              className="min-h-10 border border-rule px-4 text-[13px] text-fg-2 transition-colors hover:border-fg hover:text-fg aria-pressed:border-fg aria-pressed:bg-fg aria-pressed:text-ink"
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <caption className="sr-only">Systems, filtered by {filter === "all" ? "all domains" : label(filter)}</caption>
            <thead>
              <tr className="border-b border-rule">
                <th scope="col" className="label pb-3 pr-4 font-medium">System</th>
                <th scope="col" className="label pb-3 pr-4 font-medium">Domain</th>
                <th scope="col" className="label pb-3 pr-4 font-medium">Stack</th>
                <th scope="col" className="label pb-3 pr-4 font-medium">Ships as</th>
                <th scope="col" className="pb-3"><span className="sr-only">Open</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr
                  key={s.slug}
                  className="group relative border-b border-rule transition-colors hover:bg-panel focus-within:bg-panel"
                  onPointerEnter={() => setFocus(s.domains.flatMap((d) => DOMAIN_LAYERS[d]))}
                  onPointerLeave={() => setFocus([])}
                  onFocus={() => setFocus(s.domains.flatMap((d) => DOMAIN_LAYERS[d]))}
                  onBlur={() => setFocus([])}
                >
                  <th scope="row" className="py-5 pr-4 align-top font-normal">
                    {s.internal ? (
                      <span className="title text-[20px] text-fg">{s.name}</span>
                    ) : (
                      <Link href={`/work/${s.slug}`} className="title text-[20px] text-fg no-underline after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-focus-within:underline">
                        {s.name}
                      </Link>
                    )}
                    <p className="mt-1 max-w-[42ch] text-[14px] leading-snug text-fg-3">{s.summary}</p>
                  </th>
                  <td className="py-5 pr-4 align-top text-[14px] text-fg-2">{s.domains.map(label).join(" · ")}</td>
                  <td className="py-5 pr-4 align-top text-[14px] text-fg-2">{s.stack.join(", ")}</td>
                  <td className="py-5 pr-4 align-top text-[14px] text-fg-2">{s.shipsAs}</td>
                  <td className="data py-5 text-right align-top text-fg" aria-hidden="true">
                    {s.internal ? "" : <span className="inline-block transition-transform group-hover:translate-x-1">→</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
