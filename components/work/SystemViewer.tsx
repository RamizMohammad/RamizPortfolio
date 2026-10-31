"use client";

import Link from "next/link";
import { Dialog } from "radix-ui";
import { useState, type CSSProperties } from "react";
import { systems } from "@/content/systems";
import type { System } from "@/content/types";
import { Browser, ChatWindow, DesktopWindow, Phone } from "./Devices";
import { filesFor, THEMES, tokenize, type IdeTheme } from "./ide";

const internal = systems.filter((s) => s.internal);

/** The editor window: title bar, file tree, tabs, highlighted file, a summary panel and status bar. */
function Ide({ s, theme, onClose }: { s: System; theme: IdeTheme; onClose: () => void }) {
  const files = filesFor(s);
  const [active, setActive] = useState(0);
  const file = files[active];
  const vscode = s.platform === "web" || s.platform === "service";
  const c = (k?: keyof IdeTheme) => (k ? theme[k] : theme.text);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[14px] border text-[13px]" style={{ background: theme.bg, borderColor: theme.border, color: theme.text }}>
      {/* Title bar */}
      <div className="flex h-10 shrink-0 items-center gap-3 border-b px-3" style={{ background: theme.bar, borderColor: theme.border }}>
        <span className="flex gap-1.5" aria-hidden="true">
          <i className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <i className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <i className="h-3 w-3 rounded-full bg-[#28c840]" />
        </span>
        <p className="flex-1 truncate text-center font-mono text-[12px]" style={{ color: theme.muted }}>
          {s.slug} — {file.name}
        </p>
        <Link href={`/work/${s.slug}`} className="rounded-md px-2 py-1 text-[12px] font-semibold hover:underline" style={{ color: theme.accent }}>
          Case study ↗
        </Link>
        <button type="button" onClick={onClose} className="grid h-7 w-7 place-items-center rounded-md text-[16px] hover:bg-white/10" aria-label="Close">
          ×
        </button>
      </div>

      <div className="flex min-h-0 flex-1">
        {vscode && (
          <div className="hidden w-11 shrink-0 flex-col items-center gap-4 border-r pt-3 sm:flex" style={{ background: theme.bar, borderColor: theme.border }} aria-hidden="true">
            {["▤", "⌕", "⑂", "▷"].map((g, i) => (
              <span key={g} className="text-[16px]" style={{ color: i === 0 ? theme.text : theme.muted }}>
                {g}
              </span>
            ))}
          </div>
        )}
        {/* Explorer */}
        <nav aria-label={`${s.name} files`} className="hidden w-52 shrink-0 border-r py-2 md:block" style={{ background: theme.panel, borderColor: theme.border }}>
          <p className="px-4 pb-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: theme.muted }}>
            Project
          </p>
          <p className="px-4 py-1 font-mono text-[12px]">▾ {s.slug}</p>
          <ul>
            {files.map((f, i) => (
              <li key={f.name}>
                <button type="button" onClick={() => setActive(i)} aria-current={i === active} className="w-full px-8 py-1 text-left font-mono text-[12px]" style={{ background: i === active ? `${theme.accent}22` : undefined, color: i === active ? theme.text : theme.muted }}>
                  {f.lang === "json" ? "{ }" : "≡"} {f.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Editor */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div role="tablist" aria-label="Open files" className="flex shrink-0 overflow-x-auto border-b" style={{ background: theme.panel, borderColor: theme.border }}>
            {files.map((f, i) => (
              <button
                key={f.name}
                role="tab"
                type="button"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className="shrink-0 border-r px-4 py-2 font-mono text-[12px]"
                style={{ borderColor: theme.border, background: i === active ? theme.bg : undefined, color: i === active ? theme.text : theme.muted, boxShadow: i === active ? `inset 0 2px 0 ${theme.accent}` : undefined }}
              >
                {f.name}
              </button>
            ))}
          </div>
          <div key={file.name} className="min-h-0 flex-1 overflow-auto py-3 font-mono text-[12.5px] leading-[1.7]">
            {file.lines.map((line, i) => (
              <div key={i} className="ide-line flex" style={{ ["--i" as string]: i } as CSSProperties}>
                <span className="w-12 shrink-0 select-none pr-4 text-right" style={{ color: theme.muted }}>
                  {i + 1}
                </span>
                <span className="whitespace-pre-wrap break-words pr-4">
                  {tokenize(line, file.lang).map((t, j) => (
                    <span key={j} style={{ color: c(t.c), fontWeight: t.b ? 700 : undefined }}>
                      {t.t}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>
          {/* Summary panel, like the run/terminal pane */}
          <div className="hidden shrink-0 border-t px-4 py-2 font-mono text-[12px] sm:block" style={{ background: theme.panel, borderColor: theme.border }}>
            <p style={{ color: theme.muted }}>{vscode ? "TERMINAL" : "Run"}</p>
            <p>
              <span style={{ color: theme.accent }}>$</span> project {s.slug} <span style={{ color: theme.muted }}>— {s.shipsAs} · {s.stack.join(", ")}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex h-6 shrink-0 items-center gap-4 px-3 font-mono text-[11px]" style={{ background: theme.status, color: theme.statusText }}>
        <span>● {s.shipsAs}</span>
        <span className="hidden sm:inline">{s.stack.length} technologies</span>
        <span className="ml-auto">{file.lang === "json" ? "JSON" : "Markdown"}</span>
      </div>
    </div>
  );
}

/** Moglix work is private: a plain terminal with the names and summaries only. */
function InternalTerminal({ onClose }: { onClose: () => void }) {
  return (
    <div className="mx-auto flex h-full max-h-[720px] w-full max-w-[860px] flex-col overflow-hidden rounded-[14px] border border-[#3c3f41] bg-[#121016] font-mono text-[13px] text-[#e6e3f2]">
      <div className="flex h-10 items-center gap-3 border-b border-[#3c3f41] px-3">
        <span className="flex gap-1.5" aria-hidden="true">
          <i className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <i className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <i className="h-3 w-3 rounded-full bg-[#28c840]" />
        </span>
        <p className="flex-1 text-center text-[12px] text-[#a9a5bf]">moglix — internal</p>
        <button type="button" onClick={onClose} className="grid h-7 w-7 place-items-center rounded-md text-[16px] hover:bg-white/10" aria-label="Close">
          ×
        </button>
      </div>
      <div className="flex-1 overflow-auto p-5 leading-[1.8]">
        {internal.map((s, i) => (
          <div key={s.slug} className="ide-line mb-4" style={{ ["--i" as string]: i * 3 } as CSSProperties}>
            <p>
              <span className="text-[#d4f25b]">$</span> cat {s.slug}/README
            </p>
            <p className="font-semibold">{s.name}</p>
            <p className="text-[#a9a5bf]">{s.summary}</p>
            {s.points?.map((p) => (
              <p key={p} className="text-[#a9a5bf]">
                <span className="text-[#d4f25b]">→</span> {p}
              </p>
            ))}
            <p className="text-[#a9a5bf]">stack: {s.stack.join(", ")}</p>
          </div>
        ))}
        <p className="ide-line text-[#f47a9a]" style={{ ["--i" as string]: 10 } as CSSProperties}>
          🔒 Built inside Moglix — the code is private; these notes are from my résumé.
        </p>
      </div>
    </div>
  );
}

/** Opens a project in the environment it was built in. `slug` "moglix" opens the internal terminal. */
export default function SystemViewer({ slug, onClose }: { slug: string | null; onClose: () => void }) {
  const s = systems.find((x) => x.slug === slug);
  const open = slug !== null;
  const theme = s && s.platform !== "internal" ? THEMES[s.platform] : null;

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="viewer-overlay fixed inset-0 z-[90] bg-ink/70 backdrop-blur-sm" />
        <Dialog.Content className="viewer fixed inset-0 z-[91] flex items-center justify-center p-3 outline-none md:p-6" aria-describedby={undefined}>
          <Dialog.Title className="sr-only">{s ? `${s.name}, opened in its editor` : "Internal systems at Moglix"}</Dialog.Title>
          {s && theme ? (
            <div className="grid h-full max-h-[860px] w-full max-w-[1500px] gap-4 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_auto] lg:overflow-visible">
              <div className="viewer-ide min-h-[420px] lg:min-h-0">
                <Ide key={s.slug} s={s} theme={theme} onClose={onClose} />
              </div>
              <div className={`viewer-device grid content-center ${s.platform === "android" ? "" : "lg:w-[min(560px,38vw)]"}`}>
                {s.platform === "android" ? <Phone s={s} /> : s.platform === "web" ? <Browser s={s} /> : s.platform === "service" ? <ChatWindow s={s} /> : <DesktopWindow s={s} />}
              </div>
            </div>
          ) : (
            <div className="viewer-ide h-full w-full">
              <InternalTerminal onClose={onClose} />
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
