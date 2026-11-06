"use client";

import { useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import { useEffect, useMemo, useState } from "react";
import { profile } from "@/content/profile";
import { publicSystems } from "@/content/systems";
import { SECTIONS } from "./nav";
import { switchTheme } from "./ThemeToggle";
import { bootAscii } from "./ascii/AsciiMode";

type Item = { group: string; label: string; hint?: string; run: () => void };

/** ⌘K / Ctrl+K: jump to any section or project, copy the email, open links. */
export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [note, setNote] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-palette", onOpen);
    };
  }, []);

  const items = useMemo<Item[]>(() => {
    const go = (path: string) => () => {
      setOpen(false);
      router.push(path);
    };
    const visit = (href: string) => () => {
      setOpen(false);
      window.open(href, "_blank", "noopener,noreferrer");
    };
    return [
      ...SECTIONS.map((s) => ({ group: "Sections", label: s.label, run: go(`/#${s.id}`) })),
      ...publicSystems.map((s) => ({ group: "Projects", label: s.name, hint: s.shipsAs, run: go(`/work/${s.slug}`) })),
      { group: "Pages", label: "Shipyard", hint: "Apps, extensions and libraries to install", run: go("/shipyard") },
      { group: "Pages", label: "Live infra", hint: "My server, in real time", run: go("/infra") },
      { group: "Pages", label: "All achievements", run: go("/achievements") },
      { group: "Pages", label: "Résumé", run: go("/resume") },
      {
        group: "Actions",
        label: "Copy email",
        hint: profile.email,
        run: () => {
          navigator.clipboard.writeText(profile.email).then(
            () => setNote("Email copied"),
            () => setNote(profile.email),
          );
        },
      },
      { group: "Actions", label: "Download résumé PDF", run: visit(profile.resume) },
      {
        group: "Actions",
        label: "Boot text mode (ASCII)",
        run: () => {
          setOpen(false);
          window.setTimeout(() => (document.documentElement.dataset.ascii !== undefined ? window.dispatchEvent(new Event("exit-ascii")) : bootAscii()), 120);
        },
      },
      {
        group: "Actions",
        label: "Switch day / night mode",
        run: () => {
          setOpen(false);
          // Let the dialog close first so the reveal plays over the page.
          window.setTimeout(() => switchTheme(), 120);
        },
      },
      ...profile.links.map((l) => ({ group: "Links", label: l.label, hint: l.handle, run: visit(l.href) })),
    ];
  }, [router]);

  const q = query.trim().toLowerCase();
  const shown = q ? items.filter((i) => `${i.group} ${i.label} ${i.hint ?? ""}`.toLowerCase().includes(q)) : items;
  const current = Math.min(index, Math.max(shown.length - 1, 0));

  const onOpenChange = (o: boolean) => {
    setOpen(o);
    setQuery("");
    setIndex(0);
    setNote("");
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((current + 1) % Math.max(shown.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((current - 1 + shown.length) % Math.max(shown.length, 1));
    } else if (e.key === "Enter" && shown[current]) {
      e.preventDefault();
      shown[current].run();
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-paper/85" />
        <Dialog.Content
          className="fixed left-1/2 top-[12vh] z-[81] grid w-[min(600px,calc(100vw-32px))] -translate-x-1/2 gap-4 rounded-[12px] border border-line bg-paper p-6 outline-none"
          onKeyDown={onKeyDown}
        >
          <Dialog.Title className="t-label muted">Command menu</Dialog.Title>
          <Dialog.Description className="sr-only">Type to filter, use the arrow keys to choose, Enter to open.</Dialog.Description>
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            placeholder="Jump to…"
            aria-label="Search sections, projects and links"
            aria-controls="palette-list"
            aria-activedescendant={shown[current] ? `palette-${current}` : undefined}
            className="t-h2 nc w-full rounded-none border-b border-ink bg-transparent px-0.5 pb-2 text-ink placeholder:text-muted focus:outline-none"
          />
          <ul id="palette-list" role="listbox" aria-label="Results" className="-mx-2 max-h-[52vh] overflow-y-auto">
            {shown.map((item, i) => (
              <li
                key={`${item.group}-${item.label}`}
                id={`palette-${i}`}
                role="option"
                aria-selected={i === current}
                onPointerMove={() => setIndex(i)}
                onClick={item.run}
                className={`flex cursor-pointer items-baseline justify-between gap-4 rounded-[12px] px-3 py-2.5 ${i === current ? "bg-card" : ""}`}
              >
                <span className="t-label">
                  <span className="muted mr-3">{item.group}</span>
                  {item.label}
                </span>
                {item.hint && <span className="t-micro muted nc truncate">{item.hint}</span>}
              </li>
            ))}
            {shown.length === 0 && <li className="t-label muted px-3 py-2.5">No matches</li>}
          </ul>
          <p role="status" className="t-micro muted">
            {note || "↑ ↓ to choose · Enter to open · Esc to close"}
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
