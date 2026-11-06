"use client";

import Link from "next/link";
import Words from "@/components/Words";
import Image from "next/image";
import { useState, useSyncExternalStore, type ReactNode } from "react";
import LivePreview, { liveUrl } from "@/components/work/LivePreview";
import SystemViewer from "@/components/work/SystemViewer";
import { systems } from "@/content/systems";
import type { System } from "@/content/types";
import SectionLabel from "./SectionLabel";

const pub = systems.filter((s) => !s.internal);
const internal = systems.filter((s) => s.internal);
const PLATFORM = { web: "Web", android: "Android", desktop: "Desktop", service: "Service", internal: "Internal" } as const;

// Every number on the collage is counted from content/systems.ts.
const count = (p: System["platform"]) => pub.filter((s) => s.platform === p).length;
const python = pub.filter((s) => s.stack.some((t) => t.startsWith("Python"))).length;

// Collage placement: [phone layout, desktop layout] spans, a tint and a tilt for each tile.
// Desktop rows each fill all 12 columns:
// [Confess 5 · Bakup 4 · count 3] [Ramanujan 4 · Confess Web 5 · platforms 3]
// [Time Fold 5 · Snapy 4 · Python 3] [BuddyCode 3 · Linkium 3 · Backup Engine 3 · Moglix 3]
const LAYOUT: Record<string, { m: string; d: string; tone: string; rot: number }> = {
  confess: { m: "col-span-2 row-span-3", d: "lg:col-span-5 lg:row-span-3", tone: "bg-mint", rot: -1.5 },
  bakup: { m: "col-span-2 row-span-2", d: "lg:col-span-4 lg:row-span-3", tone: "bg-ink", rot: 1.2 },
  ramanujan: { m: "col-span-1 row-span-2", d: "lg:col-span-4 lg:row-span-3", tone: "bg-violet", rot: 1.5 },
  "confess-web": { m: "col-span-2 row-span-2", d: "lg:col-span-5 lg:row-span-3", tone: "bg-pink", rot: -1 },
  timefold: { m: "col-span-2 row-span-2", d: "lg:col-span-5 lg:row-span-3", tone: "bg-blue", rot: -1.2 },
  snapy: { m: "col-span-1 row-span-2", d: "lg:col-span-4 lg:row-span-3", tone: "bg-lime", rot: 2 },
  buddycode: { m: "col-span-1 row-span-2", d: "lg:col-span-3 lg:row-span-2", tone: "bg-pink", rot: 2 },
  linkium: { m: "col-span-1 row-span-2", d: "lg:col-span-3 lg:row-span-2", tone: "bg-sun", rot: -2 },
  "backup-engine": { m: "col-span-2 row-span-2", d: "lg:col-span-3 lg:row-span-2", tone: "bg-mint", rot: 1.5 },
};
const bySlug = (slug: string) => pub.find((s) => s.slug === slug);

const noop = () => () => {};
const readParam = () => new URLSearchParams(window.location.search).get("system");

function Tile({ className, rot, i, children, onOpen, label }: { className: string; rot: number; i: number; children: ReactNode; onOpen?: () => void; label?: string }) {
  const style = { ["--rot" as string]: `${rot}deg`, ["--rd" as string]: `${i * 70}ms` };
  const cls = `collage-tile pop-in relative overflow-hidden rounded-[24px] border-[1.5px] border-ink ${className}`;
  return onOpen ? (
    <button type="button" onClick={onOpen} aria-label={label} data-cursor="open" className={`${cls} cursor-pointer text-left`} style={style} data-reveal>
      {children}
    </button>
  ) : (
    <div className={cls} style={style} data-reveal>
      {children}
    </div>
  );
}

/** A project on the collage: its screenshot or logo, with a label bar underneath (never on top). */
function ProjectTile({ s, i, onOpen }: { s: System; i: number; onOpen: () => void }) {
  const l = LAYOUT[s.slug] ?? { m: "col-span-1 row-span-2", d: "lg:col-span-3 lg:row-span-2", tone: "bg-card", rot: 0 };
  return (
    <Tile className={`${l.m} ${l.d} ${l.tone} flex flex-col`} rot={l.rot} i={i} onOpen={onOpen} label={`Open ${s.name} in its editor`}>
      <div className="relative min-h-0 flex-1">
        {s.screen && liveUrl(s) ? (
          // The real landing page, live (view-only here); the screenshot shows until it loads.
          <div className="absolute inset-3 overflow-hidden rounded-[14px] border-[1.5px] border-ink">
            <LivePreview url={liveUrl(s)!} title={s.name} poster={s.screen} fill sizes="(min-width: 1024px) 40vw, 90vw" />
          </div>
        ) : s.screen ? (
          <Image src={s.screen.src} alt="" fill sizes="(min-width: 1024px) 40vw, 90vw" className={`rounded-[18px] object-cover p-3 ${s.screen.kind === "phone" ? "object-left" : "object-top"}`} />
        ) : (
          <div className="grid h-full place-items-center p-4">
            {s.logo ? (
              <Image src={s.logo} alt="" width={96} height={96} className="h-16 w-16 rounded-[18px] border-[1.5px] border-ink md:h-20 md:w-20" />
            ) : (
              // No screenshot or logo yet: a monogram and the first few tools
              <div className="grid justify-items-center gap-3">
                <span className="grid h-16 w-16 place-items-center rounded-[18px] border-[1.5px] border-ink bg-card font-display text-[34px] md:h-20 md:w-20 md:text-[44px]">{s.name[0]}</span>
                <ul className="hidden flex-wrap justify-center gap-1 md:flex">
                  {s.stack.slice(0, 3).map((t) => (
                    <li key={t} className="t-micro rounded-full border-[1.5px] border-ink bg-card px-2 py-0.5">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 border-t-[1.5px] border-ink bg-card px-4 py-2.5">
        <span className="t-h2 truncate !text-[20px]">{s.name}</span>
        <span className="t-micro shrink-0 rounded-full bg-ink px-2 py-1 text-card">{PLATFORM[s.platform]}</span>
      </div>
    </Tile>
  );
}

/**
 * Built and shipped: a collage of every project with a few counted facts, then a rail of the
 * same projects. Clicking any project opens it in the editor it was built in, next to the device
 * it runs on (?system=slug links straight to it).
 */
export default function Work() {
  const fromUrl = useSyncExternalStore(noop, readParam, () => null);
  const [chosen, setChosen] = useState<string | null | undefined>(undefined);
  const open = chosen === undefined ? fromUrl : chosen;

  const show = (slug: string | null) => {
    setChosen(slug);
    const url = new URL(window.location.href);
    if (slug) url.searchParams.set("system", slug);
    else url.searchParams.delete("system");
    window.history.replaceState(null, "", url);
  };

  const rail: (Pick<System, "slug" | "name" | "platform"> & { logo?: string })[] = [...pub, { slug: "moglix", name: `Moglix ×${internal.length}`, platform: "internal" }];
  const tile = (slug: string, i: number) => {
    const s = bySlug(slug);
    return s ? <ProjectTile key={slug} s={s} i={i} onOpen={() => show(slug)} /> : null;
  };

  return (
    <section id="work" aria-labelledby="work-title" className="edge pb-24">
      <SectionLabel n={4}>Systems</SectionLabel>
      <div className="grid gap-4 pb-12 pt-16 lg:grid-cols-[1fr_auto] lg:items-end">
        <h2 id="work-title" className="t-h1 split" data-reveal>
          <Words text="Built and shipped." />
        </h2>
        <div className="grid max-w-[44ch] gap-4" data-reveal>
          <p className="voice-sm muted ink-in">
            Click any project to open it where it was built: Android work in an Android IDE beside a phone, web apps in a code editor beside a browser.
          </p>
          <Link href="/shipyard" className="btn-ghost btn-sm w-fit">
            Install them → Shipyard
          </Link>
        </div>
      </div>

      {/* Collage */}
      <div className="grid grid-flow-dense auto-rows-[96px] grid-cols-2 gap-3 md:gap-4 lg:grid-flow-row lg:auto-rows-[92px] lg:grid-cols-12">
        {tile("confess", 0)}
        {tile("bakup", 1)}
        <Tile className="col-span-1 row-span-2 bg-ink p-5 text-card lg:col-span-3 lg:row-span-3" rot={-1} i={2}>
          <p className="t-display !text-[clamp(56px,7vw,120px)] text-lime">{pub.length}</p>
          <p className="t-label">Public systems shipped</p>
        </Tile>
        {tile("ramanujan", 4)}
        {tile("confess-web", 5)}
        <Tile className="col-span-1 row-span-2 bg-card p-5 lg:order-none lg:col-span-3 lg:row-span-3" rot={1} i={6}>
          <p className="t-label mb-3">Runs on</p>
          <ul className="grid gap-2 lg:gap-3">
            {(["web", "android", "desktop", "service"] as const).map((p) => (
              <li key={p} className="grid grid-cols-[60px_1fr_auto] items-center gap-2 text-[13px] font-semibold">
                <span>{PLATFORM[p]}</span>
                <span className="h-3 overflow-hidden rounded-full border-[1.5px] border-ink">
                  <span className="collage-bar block h-full bg-pink" style={{ width: `${(count(p) / pub.length) * 100}%` }} />
                </span>
                <span className="font-display text-[18px]">{count(p)}</span>
              </li>
            ))}
          </ul>
        </Tile>
        {tile("timefold", 7)}
        {tile("snapy", 8)}
        <Tile className="col-span-1 row-span-2 bg-sun p-5 lg:col-span-3 lg:row-span-3" rot={-1.5} i={9}>
          <p className="t-display !text-[clamp(48px,5vw,80px)]">
            {python}/{pub.length}
          </p>
          <p className="t-label">Built with Python</p>
        </Tile>
        {tile("buddycode", 9)}
        {tile("linkium", 10)}
        {tile("backup-engine", 11)}
        <Tile className="col-span-1 row-span-2 bg-ink p-5 text-card lg:col-span-3 lg:row-span-2" rot={1.5} i={12} onOpen={() => show("moglix")} label="Open the internal Moglix systems">
          <p className="t-label text-lime">🔒 Inside Moglix</p>
          <p className="t-display mt-2 !text-[clamp(48px,5vw,80px)]">{internal.length}</p>
          <p className="t-label">Internal systems →</p>
        </Tile>
      </div>

      {/* Rail */}
      <div className="mt-20 grid gap-6" data-reveal>
        <p className="t-label">Every system, in one line — click to open</p>
        <ol className="relative grid grid-cols-2 gap-6 sm:grid-cols-4 lg:flex lg:justify-between">
          <span aria-hidden="true" className="road-line absolute left-8 right-8 top-8 hidden h-[2px] bg-ink lg:block" />
          {rail.map((s, i) => (
            <li key={s.slug} className="relative">
              <button type="button" onClick={() => show(s.slug)} className="group grid w-full justify-items-center gap-2 text-center">
                <span style={{ ["--i" as string]: i }} className="road-step grid h-16 w-16 place-items-center overflow-hidden rounded-full border-[2px] border-ink bg-card transition-transform group-hover:-translate-y-1 group-hover:rotate-6">
                  {s.logo ? (
                    <Image src={s.logo} alt="" width={64} height={64} className="h-full w-full object-cover" />
                  ) : s.platform === "internal" ? (
                    <span className="text-[22px]">🔒</span>
                  ) : (
                    <span className="font-display text-[26px]">{s.name[0]}</span>
                  )}
                </span>
                <span className="t-label group-hover:underline">{s.name}</span>
                <span className="t-micro muted">{PLATFORM[s.platform]}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <SystemViewer slug={open} onClose={() => show(null)} />
    </section>
  );
}
