"use client";

import Image from "next/image";
import Link from "next/link";
import { Dialog } from "radix-ui";
import { useState, useSyncExternalStore } from "react";
import type { StoreApp } from "@/content/store";

// Written out in full so Tailwind sees every class.
const TONE: Record<StoreApp["tone"], string> = {
  pink: "bg-pink",
  lime: "bg-lime",
  blue: "bg-blue text-card",
  sun: "bg-sun",
  violet: "bg-violet",
  mint: "bg-mint",
};

const FILTERS = [
  { id: "all", label: "All" },
  { id: "app", label: "Windows apps" },
  { id: "extension", label: "Extensions" },
] as const;
type Filter = (typeof FILTERS)[number]["id"];

/** ?app=slug opens that app's page, so a link can point straight at one. */
const noop = () => () => {};
const readParam = () => new URLSearchParams(window.location.search).get("app");

function Icon({ a, size = "md" }: { a: StoreApp; size?: "md" | "lg" }) {
  const box = size === "lg" ? "h-24 w-24 rounded-[26px] text-[52px] md:h-32 md:w-32 md:text-[68px]" : "h-16 w-16 rounded-[18px] text-[34px]";
  return a.logo ? (
    <Image src={a.logo.src} alt={a.logo.alt} width={a.logo.width} height={a.logo.height} className={`${box} shrink-0 border-[1.5px] border-[#121016] bg-white object-cover`} />
  ) : (
    <span aria-hidden="true" className={`${box} grid shrink-0 place-items-center border-[1.5px] border-[#121016] bg-white font-display text-[#121016]`}>
      {a.name[0].toUpperCase()}
    </span>
  );
}

/** Version · size · date, as small chips. */
function Meta({ a }: { a: StoreApp }) {
  const bits = [a.version && `v${a.version}`, a.size, a.released].filter(Boolean) as string[];
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Release">
      {bits.map((b) => (
        <li key={b} className="t-micro rounded-full border-[1.5px] border-ink px-2.5 py-1">
          {b}
        </li>
      ))}
    </ul>
  );
}

function GetButton({ a, className = "btn-pill" }: { a: StoreApp; className?: string }) {
  return (
    <a href={a.download.href} className={className} rel="noopener noreferrer" data-cursor="get it">
      {a.kind === "app" ? "Get" : "Download"}
      {a.size ? ` · ${a.size}` : ""}
    </a>
  );
}

function CopyLine({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center gap-2 rounded-[14px] border-[1.5px] border-ink bg-ink p-2 pl-4 text-card">
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-[12.5px]">{text}</code>
      <button
        type="button"
        className="btn-ghost btn-sm shrink-0"
        onClick={() =>
          navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
          })
        }
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

/** The app's own page, as a dialog: what it is, how to install it, every download and the release details. */
function Details({ a, onClose }: { a: StoreApp; onClose: () => void }) {
  const info = [
    ["Version", a.version],
    ["Released", a.released],
    ["Download size", a.size],
    ["Requires", a.requires],
    ["Publisher", a.publisher ?? "Mohammad Ramiz"],
    ["Price", "Free"],
  ].filter(([, v]) => v) as [string, string][];

  return (
    <div className="viewer-ide relative grid max-h-full w-full max-w-[920px] overflow-y-auto rounded-[28px] border-[1.5px] border-ink bg-card text-ink">
      <div className={`grid gap-6 rounded-t-[26px] border-b-[1.5px] border-ink p-6 md:grid-cols-[auto_1fr] md:items-center md:p-8 ${TONE[a.tone]}`}>
        <Icon a={a} size="lg" />
        <div className="grid gap-3">
          <p className="t-label">
            {a.category}
            {a.publisher ? ` · ${a.publisher}` : ""}
          </p>
          <Dialog.Title className="t-h1 !text-[clamp(40px,5vw,72px)]">{a.name}</Dialog.Title>
          <Dialog.Description className="voice-sm max-w-[48ch]">{a.tagline}</Dialog.Description>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <GetButton a={a} />
            {a.system && (
              <Link href={`/work/${a.system}`} className="btn-ghost">
                Case study
              </Link>
            )}
          </div>
        </div>
        <Dialog.Close className="btn-ghost btn-sm absolute right-4 top-4" onClick={onClose}>
          Close
        </Dialog.Close>
      </div>

      <div className="grid gap-10 p-6 md:grid-cols-[3fr_2fr] md:p-8">
        <div className="grid content-start gap-8">
          <section className="grid gap-3">
            <h3 className="t-label muted">About</h3>
            <p className="voice-sm">{a.about}</p>
          </section>

          {a.features?.length ? (
            <section className="grid gap-3">
              <h3 className="t-label muted">Features</h3>
              <ul className="grid gap-2">
                {a.features.map((f) => (
                  <li key={f} className="flex gap-3 text-[15px]">
                    <span aria-hidden="true" className="mt-[7px] h-2 w-2 shrink-0 rounded-full bg-pink-deep" />
                    {f}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="grid gap-3">
            <h3 className="t-label muted">Install</h3>
            {a.install && <CopyLine text={a.install} />}
            {a.steps?.length ? (
              <ol className="grid gap-2">
                {a.steps.map((s, i) => (
                  <li key={s} className="flex gap-3 text-[15px]">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border-[1.5px] border-ink font-display text-[13px]">{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            ) : null}
            {!a.install && !a.steps?.length && (
              <p className="text-[15px]">
                Download <span className="font-mono text-[13px]">{a.download.file}</span> and run it. If Windows SmartScreen warns about an unknown publisher, choose <strong>More info</strong>, then <strong>Run anyway</strong>.
              </p>
            )}
          </section>
        </div>

        <aside className="grid content-start gap-8">
          <dl className="grid gap-0 rounded-[18px] border-[1.5px] border-ink">
            {info.map(([k, v], i) => (
              <div key={k} className={`grid grid-cols-[110px_1fr] gap-3 px-4 py-3 ${i ? "border-t-[1.5px] border-line" : ""}`}>
                <dt className="t-micro muted pt-0.5">{k}</dt>
                <dd className="text-[14px] font-medium">{v}</dd>
              </div>
            ))}
          </dl>

          <section className="grid gap-3">
            <h3 className="t-label muted">Downloads</h3>
            <ul className="grid gap-2">
              {[a.download, ...(a.downloads ?? [])].map((d, i) => (
                <li key={d.href}>
                  <a href={d.href} rel="noopener noreferrer" className="group flex items-center justify-between gap-3 rounded-[14px] border-[1.5px] border-ink px-4 py-3 transition-colors hover:bg-ink hover:text-card">
                    <span className="grid min-w-0">
                      <span className="text-[14px] font-semibold">{i === 0 ? a.download.label : d.label}</span>
                      <span className="truncate font-mono text-[11.5px] opacity-70">{d.file}</span>
                    </span>
                    <span aria-hidden="true">↓</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {a.links?.length ? (
            <ul className="t-label flex flex-wrap gap-x-5 gap-y-2">
              {a.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="link">
                    {l.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function Card({ a, i, onOpen }: { a: StoreApp; i: number; onOpen: () => void }) {
  return (
    <article className="pop-in group grid content-start overflow-hidden rounded-[24px] border-[1.5px] border-ink bg-card" data-reveal style={{ ["--rd" as string]: `${(i % 3) * 90}ms` }}>
      <button type="button" onClick={onOpen} className={`flex items-center gap-4 border-b-[1.5px] border-ink p-5 text-left ${TONE[a.tone]}`} aria-label={`Open ${a.name}`}>
        <span className="transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
          <Icon a={a} />
        </span>
        <span className="grid gap-1">
          <span className="t-h2 !text-[26px]">{a.name}</span>
          <span className="t-micro">{a.category}</span>
        </span>
      </button>
      <div className="grid content-start gap-4 p-5">
        <p className="text-[15px] leading-snug">{a.tagline}</p>
        <Meta a={a} />
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <GetButton a={a} className="btn-pill btn-sm" />
          <button type="button" onClick={onOpen} className="btn-ghost btn-sm">
            Details
          </button>
        </div>
      </div>
    </article>
  );
}

/** The newest app, as the store's banner. */
function Featured({ a, onOpen }: { a: StoreApp; onOpen: () => void }) {
  return (
    <section aria-label="Featured" className={`pop-in relative mb-12 grid gap-8 overflow-hidden rounded-[32px] border-[1.5px] border-ink p-7 md:grid-cols-[1fr_auto] md:items-center md:p-10 ${TONE[a.tone]}`} data-reveal>
      <div className="grid gap-4">
        <p className="t-label">
          New{a.version ? ` · v${a.version}` : ""}
          {a.released ? ` · ${a.released}` : ""}
        </p>
        <h2 className="t-h1">{a.name}</h2>
        <p className="voice max-w-[26ch]">{a.tagline}</p>
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <GetButton a={a} />
          <button type="button" onClick={onOpen} className="btn-ghost">
            Details
          </button>
        </div>
      </div>
      <div className="justify-self-center md:justify-self-end md:pr-6">
        <div className="rotate-[-6deg]">
          <Icon a={a} size="lg" />
        </div>
      </div>
    </section>
  );
}

export default function Store({ apps }: { apps: StoreApp[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const fromUrl = useSyncExternalStore(noop, readParam, () => null);
  const [chosen, setChosen] = useState<string | null | undefined>(undefined);
  const openSlug = chosen === undefined ? fromUrl : chosen;
  const open = apps.find((a) => a.slug === openSlug);

  const show = (slug: string | null) => {
    setChosen(slug);
    const url = new URL(window.location.href);
    if (slug) url.searchParams.set("app", slug);
    else url.searchParams.delete("app");
    window.history.replaceState(null, "", url);
  };

  const featured = apps.find((a) => a.kind === "app");
  const list = apps.filter((a) => filter === "all" || a.kind === filter);

  return (
    <>
      {featured && <Featured a={featured} onOpen={() => show(featured.slug)} />}

      <div className="flex flex-wrap items-center justify-between gap-4 pb-8">
        <h2 className="t-h2">{FILTERS.find((f) => f.id === filter)!.label}</h2>
        <div role="group" aria-label="Filter" className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button key={f.id} type="button" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)} className="btn-ghost btn-sm">
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((a, i) => (
          <Card key={a.slug} a={a} i={i} onOpen={() => show(a.slug)} />
        ))}
      </div>

      <p className="t-label muted pt-12">
        If Windows SmartScreen warns about an unknown publisher, choose More info, then Run anyway.
      </p>

      <Dialog.Root open={!!open} onOpenChange={(o) => !o && show(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="viewer-overlay fixed inset-0 z-[90] bg-ink/70 backdrop-blur-sm" />
          <Dialog.Content className="fixed inset-0 z-[91] flex items-center justify-center p-3 outline-none md:p-6" onClick={(e) => e.target === e.currentTarget && show(null)}>
            {open && <Details a={open} onClose={() => show(null)} />}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
