"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog } from "radix-ui";
import { useEffect, useState } from "react";
import { profile } from "@/content/profile";
import { NAV, openPalette } from "./nav";

export default function SiteHeader() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [active, setActive] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // The nav row is transparent over the hero, and solid once text could scroll under it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Marks the section in view, on the home page only.
  useEffect(() => {
    if (!onHome) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    NAV.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [onHome]);

  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  const strip = ["Open to engineering roles and freelance work", `${profile.role} at ${profile.company}`, "Python · FastAPI · Docker · Linux", "Automation · Backends · Infrastructure"];

  return (
    <header className="fixed inset-x-0 top-0 z-50" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
      <div className="h-[var(--strip-h)] overflow-hidden bg-lime" aria-hidden="true">
        <div className="marquee t-micro h-full items-center">
          {[0, 1].map((k) => (
            <span key={k} className="flex">
              {[...strip, ...strip].map((t, i) => (
                <span key={i} className="whitespace-nowrap px-6">{t} ✦</span>
              ))}
            </span>
          ))}
        </div>
      </div>
      <div className={`edge flex h-[calc(var(--nav-h)-var(--strip-h))] items-center justify-between gap-6 transition-colors duration-300 ${scrolled || !onHome ? "dash-b bg-paper" : ""}`}>
      <Link href="/" className="grid h-11 w-11 place-items-center rounded-full border-[2px] border-ink bg-card font-display text-[22px] leading-none" aria-label={`${profile.name}, home`}>
        R
      </Link>

      <nav aria-label="Main" className="hidden md:block">
        <ul className="flex items-center gap-1.5">
          {NAV.map((n) => (
            <li key={n.id}>
              <a href={href(n.id)} aria-current={onHome && active === n.id ? "true" : undefined} className="btn-ghost btn-sm">
                {n.label}
              </a>
            </li>
          ))}
          <li>
            <button type="button" onClick={openPalette} className="btn-ghost btn-sm" aria-label="Open command menu" aria-keyshortcuts="Control+K Meta+K">
              ⌘K
            </button>
          </li>
          <li>
            <a href={profile.resume} className="btn-pill btn-sm">Résumé</a>
          </li>
        </ul>
      </nav>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger className="btn-pill btn-sm md:hidden">Menu</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Content className="edge fixed inset-0 z-[70] flex flex-col bg-paper outline-none" style={{ paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: "max(24px, env(safe-area-inset-bottom, 0px))" }}>
            <div className="dash-b flex h-[calc(var(--nav-h)-var(--strip-h))] items-center justify-between">
              <Dialog.Title className="t-label">Ramiz</Dialog.Title>
              <Dialog.Description className="sr-only">Site sections and links</Dialog.Description>
              <Dialog.Close className="btn-ghost btn-sm">Close</Dialog.Close>
            </div>
            <nav aria-label="Mobile" className="flex-1 overflow-y-auto py-8">
              <ul className="grid">
                {NAV.map((n) => (
                  <li key={n.id} className="dash-b">
                    <a href={href(n.id)} onClick={() => setOpen(false)} className="t-h1 block py-5">
                      {n.label}
                    </a>
                  </li>
                ))}
                <li className="dash-b">
                  <Link href="/achievements" onClick={() => setOpen(false)} className="t-h1 block py-5">
                    Recognition
                  </Link>
                </li>
              </ul>
            </nav>
            <div className="flex flex-wrap gap-3">
              <a href={profile.resume} className="btn-pill">Résumé PDF</a>
              <button type="button" className="btn-ghost" onClick={() => { setOpen(false); openPalette(); }}>
                Search
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      </div>
    </header>
  );
}
