"use client";

import Image from "next/image";
import Link from "next/link";
import { Dialog } from "radix-ui";
import { useState, useSyncExternalStore } from "react";
import { OS_LABEL, platformsOf, type OS, type StoreApp } from "@/content/store";
import { CardChrome, TabBanner, type Platform } from "./Glimpse";

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
  { id: "windows", label: "Windows apps" },
  { id: "macos", label: "Mac apps" },
  { id: "linux", label: "Linux apps" },
  { id: "vscode", label: "VS Code extensions" },
  { id: "pip", label: "Python libraries" },
  { id: "chrome", label: "Chrome extensions" },
] as const;
type Filter = (typeof FILTERS)[number]["id"];
const isOS = (f: Filter): f is OS => f === "windows" || f === "macos" || f === "linux";

/** Shown in place of the grid when a tab has nothing in it yet. */
const EMPTY: Partial<Record<Filter, { mark: string; tone: string; title: string; body: string }>> = {
  macos: { mark: "⌘", tone: "bg-ink text-card", title: "Mac apps are on the way", body: "Native macOS builds of my desktop tools will land here, as signed .dmg downloads." },
  linux: { mark: "$_", tone: "bg-sun", title: "Linux apps are on the way", body: "Linux builds of my desktop tools will land here as .deb and AppImage downloads." },
  pip: { mark: "py", tone: "bg-sun", title: "Python libraries are on the way", body: "Libraries I publish to PyPI will land here, each with its pip install line." },
  chrome: { mark: "◎", tone: "bg-pink", title: "Chrome extensions are on the way", body: "Browser tools I build will land here, with a Chrome Web Store link once they are listed." },
  vscode: { mark: "{ }", tone: "bg-blue text-card", title: "VS Code extensions are on the way", body: "Editor tools I’m building for my own workflow will land here first, with a link to each one on the Visual Studio Marketplace." },
};

/** The build to offer for an app on a given tab: that OS's own build when it has one. */
const fileFor = (a: StoreApp, os?: OS) => (os && a.osDownloads?.[os]) || a.download;

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
function Meta({ a, os }: { a: StoreApp; os?: OS }) {
  const f = fileFor(a, os);
  const size = f === a.download ? a.size : f.size;
  const bits = [a.version && `v${a.version}`, size, a.released].filter(Boolean) as string[];
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Release">
      {bits.map((b) => (
        <li key={b} className="t-micro rounded-full border-[1.5px] border-ink px-2.5 py-1">
          {b}
        </li>
      ))}
      {a.kind === "app" &&
        platformsOf(a).map((p) => (
          <li key={p} className={`t-micro rounded-full border-[1.5px] border-ink px-2.5 py-1 ${p === os ? "bg-ink text-card" : "bg-paper"}`}>
            {OS_LABEL[p]}
          </li>
        ))}
    </ul>
  );
}

function GetButton({ a, os, className = "btn-pill" }: { a: StoreApp; os?: OS; className?: string }) {
  const f = fileFor(a, os);
  const size = f === a.download ? a.size : f.size;
  const label =
    a.kind === "chrome" ? "Download" : a.kind === "pip" ? "View on PyPI" : os && os !== "windows" && f !== a.download ? `Get for ${OS_LABEL[os]}` : "Get";
  return (
    <a href={f.href} className={className} rel="noopener noreferrer" data-cursor="get it">
      {label}
      {size ? ` · ${size}` : ""}
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
    ["Runs on", a.kind === "app" ? platformsOf(a).map((p) => OS_LABEL[p]).join(", ") : undefined],
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
            <h3 className="t-label muted">{a.kind === "vscode" || a.kind === "pip" ? "Get it" : "Downloads"}</h3>
            <ul className="grid gap-2">
              {[a.download, ...Object.values(a.osDownloads ?? {}), ...(a.downloads ?? [])].filter((d, i, all) => all.findIndex((x) => x.href === d.href) === i).map((d, i) => (
                <li key={d.href}>
                  <a href={d.href} rel="noopener noreferrer" className="group flex items-center justify-between gap-3 rounded-[14px] border-[1.5px] border-ink px-4 py-3 transition-colors hover:bg-ink hover:text-card">
                    <span className="grid min-w-0">
                      <span className="text-[14px] font-semibold">{i === 0 ? a.download.label : d.label}</span>
                      <span className="truncate font-mono text-[11.5px] opacity-70">{d.file}</span>
                    </span>
                    <span aria-hidden="true">{d.href.startsWith("http") && !/\.(exe|msi|msix|whl|deb|zip|ya?ml|ps1)$/i.test(d.href) ? "↗" : "↓"}</span>
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

function Card({ a, i, os, tab, onOpen }: { a: StoreApp; i: number; os?: OS; tab?: Platform; onOpen: () => void }) {
  return (
    <article className="store-card group grid content-start overflow-hidden rounded-[24px] border-[1.5px] border-ink bg-card" style={{ ["--rd" as string]: `${i * 70}ms` }}>
      {tab && <CardChrome tab={tab} a={a} />}
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
        <Meta a={a} os={os} />
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <GetButton a={a} os={os} className="btn-pill btn-sm" />
          <button type="button" onClick={onOpen} className="btn-ghost btn-sm">
            Details
          </button>
        </div>
      </div>
    </article>
  );
}

/** The catalog's shelves, one per kind, in the order they appear on the All tab. */
const SHELVES: { kind: StoreApp["kind"]; title: string; hint: string; tab: Filter }[] = [
  { kind: "app", title: "Desktop apps", hint: "Windows, Mac and Linux", tab: "windows" },
  { kind: "vscode", title: "VS Code extensions", hint: "From the Visual Studio Marketplace", tab: "vscode" },
  { kind: "pip", title: "Python libraries", hint: "pip install, straight from PyPI", tab: "pip" },
  { kind: "chrome", title: "Chrome extensions", hint: "Load unpacked in any Chromium browser", tab: "chrome" },
];

/** The All tab: the whole catalog, one numbered shelf per kind that scrolls sideways. */
function Catalog({ apps, onOpen, onSeeAll }: { apps: StoreApp[]; onOpen: (slug: string) => void; onSeeAll: (tab: Filter) => void }) {
  const shelves = SHELVES.map((s) => ({ ...s, items: apps.filter((a) => a.kind === s.kind) })).filter((s) => s.items.length);
  let n = 0;
  return (
    <div className="grid gap-14">
      {shelves.map((s, si) => (
        <section key={s.kind} aria-labelledby={`shelf-${s.kind}`} className="grid gap-5">
          <div className="dash-t flex flex-wrap items-end justify-between gap-3 pt-5">
            <div className="flex items-baseline gap-4">
              <span className="t-label muted">{String(si + 1).padStart(2, "0")}</span>
              <div className="grid gap-1">
                <h3 id={`shelf-${s.kind}`} className="t-h2">
                  {s.title} <span className="muted">· {s.items.length}</span>
                </h3>
                <p className="t-micro muted">{s.hint}</p>
              </div>
            </div>
            <button type="button" onClick={() => onSeeAll(s.tab)} className="btn-ghost btn-sm">
              See all →
            </button>
          </div>
          <ul className="shelf -mx-[var(--edge)] flex snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--edge)] pb-3">
            {s.items.map((a) => (
              <li key={a.slug} className="w-[min(320px,82vw)] shrink-0 snap-start [&>article]:h-full">
                <Card a={a} i={n++} onOpen={() => onOpen(a.slug)} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
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

  const os = isOS(filter) ? filter : undefined;
  const list = apps.filter((a) => (os ? a.kind === "app" && platformsOf(a).includes(os) : filter === "all" || a.kind === filter));
  // The Mac banner already says its builds are on the way, so it needs no empty card too.
  const empty = !list.length && filter !== "macos" ? EMPTY[filter] : undefined;
  // Each platform's tab borrows a little of that platform's look; "All" stays in the site's own theme.
  const tab = filter === "all" ? undefined : (filter as Platform);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 pb-8">
        <h2 className="t-h2">{filter === "all" ? "The catalog" : FILTERS.find((f) => f.id === filter)!.label}</h2>
        <div role="group" aria-label="Filter" className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button key={f.id} type="button" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)} className="btn-ghost btn-sm">
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {tab && (list.length > 0 || tab === "macos") && <TabBanner key={`banner-${tab}`} tab={tab} apps={list} />}

      {filter === "all" ? (
        <Catalog key="catalog" apps={apps} onOpen={show} onSeeAll={(t) => setFilter(t)} />
      ) : (
        // Keyed by filter so the cards replay their entrance on every switch
        <div key={filter} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a, i) => (
            <Card key={a.slug} a={a} i={i} os={os} tab={tab} onOpen={() => show(a.slug)} />
          ))}
          {empty && (
            <div className="store-card grid content-center justify-items-start gap-4 rounded-[24px] border-[1.5px] border-dashed border-ink p-6 sm:col-span-2 lg:col-span-3">
              <span aria-hidden="true" className={`grid h-16 w-16 place-items-center rounded-[18px] border-[1.5px] border-ink font-mono text-[24px] font-bold ${empty.tone}`}>
                {empty.mark}
              </span>
              <p className="t-h2">{empty.title}</p>
              <p className="voice-sm muted max-w-[52ch]">{empty.body}</p>
            </div>
          )}
        </div>
      )}

      {(filter === "all" || filter === "windows") && (
        <p className="t-label muted pt-12">If Windows SmartScreen warns about an unknown publisher, choose More info, then Run anyway.</p>
      )}

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
