"use client";

import Words from "@/components/Words";
import Image from "next/image";
import { useState } from "react";
import { profile } from "@/content/profile";
import { publications, type Publication } from "@/content/publications";
import SectionLabel from "./SectionLabel";

const KIND_TONE: Record<Publication["kind"], string> = {
  "Journal paper": "bg-blue text-card",
  "Conference paper": "bg-violet",
  Preprint: "bg-lime",
  Patent: "bg-sun",
  Article: "bg-mint",
};

/** A plain-text citation, built only from the fields the entry actually has. */
function cite(p: Publication) {
  // Authors appear only when listed; they are never guessed.
  const who = p.authors?.length ? `${p.authors.join(", ")}. ` : "";
  const id = p.id ? ` ${p.id.label} ${p.id.value}.` : "";
  return `${who}"${p.title}." ${p.venue}, ${p.date}.${id}${p.href ? ` ${p.href}` : ""}`;
}

function Paper({ p, i }: { p: Publication; i: number }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const copy = () =>
    navigator.clipboard.writeText(cite(p)).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      },
      () => setOpen(true),
    );

  return (
    <article className="paper pop-in grid gap-6 rounded-[28px] border-[1.5px] border-ink bg-card p-5 md:grid-cols-[minmax(0,240px)_1fr] md:p-7" data-reveal style={{ ["--rd" as string]: `${i * 90}ms` }}>
      {/* The first page, as a sheet of paper with a folded corner */}
      <div className="paper-sheet relative self-start">
        {p.image ? (
          <Image src={p.image.src} alt={p.image.alt} width={p.image.width} height={p.image.height} sizes="240px" className="h-auto w-full rounded-[6px] border-[1.5px] border-ink bg-white" />
        ) : (
          <div className="grid aspect-[3/4] place-items-center rounded-[6px] border-[1.5px] border-ink bg-white p-4 text-center font-display text-[20px] leading-tight text-[#121016]">{p.title}</div>
        )}
        <span aria-hidden="true" className="paper-fold absolute right-0 top-0 h-8 w-8" />
      </div>

      <div className="grid content-start gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`t-micro rounded-full border-[1.5px] border-ink px-2.5 py-1 ${KIND_TONE[p.kind]}`}>{p.kind}</span>
          <span className="t-label muted">{p.date}</span>
        </div>
        <h3 className="t-h2 !text-[clamp(24px,2.4vw,34px)]">{p.title}</h3>
        {p.authors && (
          <p className="text-[15px]">
            {p.authors.map((a, j) => (
              <span key={a}>
                {a === profile.name ? <strong className="underline decoration-pink-deep decoration-2 underline-offset-4">{a}</strong> : a}
                {j < p.authors!.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        )}
        <p className="t-label muted">
          {p.venue}
          {p.id && (
            <>
              {" · "}
              {p.id.label} <span className="font-mono normal-case">{p.id.value}</span>
            </>
          )}
        </p>

        <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
          <div className="overflow-hidden">
            <div className="grid gap-3 pb-1">
              <p className="voice-sm">{p.abstract}</p>
              <p className="rounded-[12px] border-[1.5px] border-dashed border-line p-3 font-mono text-[12px] leading-relaxed">{cite(p)}</p>
            </div>
          </div>
        </div>

        {p.tags && (
          <ul className="flex flex-wrap gap-1.5" aria-label="Topics">
            {p.tags.map((t) => (
              <li key={t} className="t-micro rounded-full border-[1.5px] border-ink px-2.5 py-1">
                {t}
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="btn-ghost btn-sm">
            {open ? "Hide abstract" : "Abstract"}
          </button>
          <button type="button" onClick={copy} data-cursor="copy" className="btn-ghost btn-sm">
            {copied ? "Citation copied" : "Cite"}
          </button>
          {p.href && (
            <a href={p.href} target="_blank" rel="noopener noreferrer" className="btn-pill btn-sm">
              Read ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

type ListProps = {
  /** Section id, used by the header, the ⌘K palette and the cursor label. */
  id: string;
  label: string;
  heading: string;
  /** Singular and plural noun for the count line. */
  noun: [string, string];
  items: Publication[];
};

/** One section of publications, newest first. */
function PublicationList({ id, label, heading, noun, items }: ListProps) {
  const sorted = [...items].sort((a, b) => b.year - a.year);
  if (!sorted.length) return null;
  const kinds = [...new Set(sorted.map((p) => p.kind))];
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="edge pb-24">
      <SectionLabel id={id}>{label}</SectionLabel>
      <div className="grid gap-4 pb-12 pt-16 lg:grid-cols-[1fr_auto] lg:items-end">
        <h2 id={`${id}-title`} className="t-h1 split" data-reveal>
          <Words text={heading} />
        </h2>
        <p className="voice-sm muted ink-in max-w-[44ch]" data-reveal>
          {sorted.length} {sorted.length === 1 ? noun[0] : noun[1]}
          {id === "papers" ? ` · ${kinds.join(", ")}` : ""}. Open one for its abstract and a ready-to-paste citation.
        </p>
      </div>
      <div className="grid gap-6">
        {sorted.map((p, i) => (
          <Paper key={p.title} p={p} i={i} />
        ))}
      </div>
    </section>
  );
}

/** Patents, right after Awards. */
export function Patents() {
  return <PublicationList id="patents" label="Patents" heading="Patented." noun={["patent", "patents"]} items={publications.filter((p) => p.kind === "Patent")} />;
}

/** Papers and articles, after Patents. */
export function Papers() {
  return <PublicationList id="papers" label="Papers" heading="Published." noun={["paper", "papers"]} items={publications.filter((p) => p.kind !== "Patent")} />;
}
