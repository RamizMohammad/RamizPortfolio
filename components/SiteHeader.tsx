"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog } from "radix-ui";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { NAV, openPalette, SECTIONS } from "./nav";
import ThemeToggle from "./ThemeToggle";

const RING = 2 * Math.PI * 21;

/**
 * The header. At the top of the page it is a full-width row under the lime strip; once you scroll
 * it tucks into a floating pill, hides while you scroll down and returns as soon as you scroll up.
 * A highlight slides to the section in view, and a ring around the logo shows how far down you are.
 */
export default function SiteHeader() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [active, setActive] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const ring = useRef<SVGCircleElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 24);
      // Hide after the hero when scrolling down by more than a nudge; any scroll up brings it back.
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > window.innerHeight * 0.8);
        last = y;
      }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (ring.current) ring.current.style.strokeDashoffset = String(RING * (1 - (max > 0 ? Math.min(1, y / max) : 0)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Marks the section in view, on the home page only.
  useEffect(() => {
    if (!onHome) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    SECTIONS.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [onHome]);

  // Moves the highlight under the active link (or hides it when the active section isn't in the header).
  useLayoutEffect(() => {
    // Measured on the list item, whose offsetParent is the list.
    const measure = () => {
      const li = list.current?.querySelector<HTMLElement>(`a[data-id="${active}"]`)?.parentElement;
      setPill(li ? { left: li.offsetLeft, width: li.offsetWidth } : null);
    };
    measure();
    // Again once the bar has finished changing shape.
    const t = window.setTimeout(measure, 550);
    window.addEventListener("resize", measure);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, [active, scrolled]);

  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);
  const current = onHome ? active : null;
  const strip = ["Open to engineering roles and freelance work", `${profile.role} at ${profile.company}`, "Python · FastAPI · LLM agents · Docker", "Automation · Backends · Infrastructure"];
  const compact = scrolled || !onHome;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${hidden && !open ? "-translate-y-[120%]" : ""}`}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      {/* The lime strip folds away once you start scrolling. */}
      <div className={`overflow-hidden bg-lime transition-[height] duration-500 ${compact ? "h-0" : "h-[var(--strip-h)]"}`} aria-hidden="true">
        <div className="marquee t-micro h-[var(--strip-h)] items-center">
          {[0, 1].map((k) => (
            <span key={k} className="flex">
              {[...strip, ...strip].map((t, i) => (
                <span key={i} className="whitespace-nowrap px-6">
                  {t} ✦
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <div className={`edge transition-[padding] duration-500 ${compact ? "pt-3" : "pt-0"}`}>
        <div
          className={`nav-shell mx-auto flex items-center gap-2 transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
            compact ? "h-14 max-w-[1180px] rounded-full border-[1.5px] border-ink bg-card/85 pl-1.5 pr-1.5 shadow-[0_12px_40px_-16px_rgb(0_0_0/0.35)] backdrop-blur-md" : "h-[calc(var(--nav-h)-var(--strip-h))] max-w-[2000px] border-[1.5px] border-transparent"
          }`}
        >
          <Link href="/" className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full border-[2px] border-ink bg-sun" aria-label={`${profile.name}, home`}>
            <Image src="/images/mascot-face.webp" alt="" width={88} height={88} priority className="h-full w-full rounded-full" />
            <svg viewBox="0 0 48 48" className="pointer-events-none absolute -inset-[4px] h-[calc(100%+8px)] w-[calc(100%+8px)] -rotate-90" aria-hidden="true">
              <circle ref={ring} cx="24" cy="24" r="21" fill="none" strokeWidth="3" strokeLinecap="round" style={{ stroke: "var(--color-pink-deep)", strokeDasharray: RING, strokeDashoffset: RING }} />
            </svg>
          </Link>

          <nav aria-label="Main" className="ml-auto hidden xl:block">
            <ul ref={list} className="relative flex items-center">
              {/* The sliding highlight */}
              <span
                aria-hidden="true"
                className="absolute top-1/2 h-9 -translate-y-1/2 rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)]"
                style={{ background: "var(--color-ink)", left: pill?.left ?? 0, width: pill?.width ?? 0, opacity: pill && current ? 1 : 0 }}
              />
              {NAV.map((n) => (
                <li key={n.id} className="relative">
                  <a
                    href={href(n.id)}
                    data-id={n.id}
                    aria-current={current === n.id ? "true" : undefined}
                    className="nav-link block rounded-full px-3.5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.03em] transition-colors duration-300"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1.5 xl:ml-2">
            <button type="button" onClick={openPalette} className="btn-ghost btn-sm hidden md:inline-flex" aria-label="Open command menu" aria-keyshortcuts="Control+K Meta+K">
              ⌘K
            </button>
            <ThemeToggle />
            <a href={profile.resume} className="btn-pill btn-sm hidden md:inline-flex">
              Résumé
            </a>

            <Dialog.Root open={open} onOpenChange={setOpen}>
              <Dialog.Trigger className="btn-pill btn-sm xl:hidden">Menu</Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Content className="menu edge fixed inset-0 z-[70] flex flex-col bg-paper outline-none" style={{ paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: "max(24px, env(safe-area-inset-bottom, 0px))" }}>
                  <div className="dash-b flex h-[calc(var(--nav-h)-var(--strip-h))] items-center justify-between">
                    <Dialog.Title className="t-label">Ramiz</Dialog.Title>
                    <Dialog.Description className="sr-only">Site sections and links</Dialog.Description>
                    <Dialog.Close className="btn-ghost btn-sm">Close</Dialog.Close>
                  </div>
                  <nav aria-label="Mobile" className="flex-1 overflow-y-auto py-6">
                    <ul className="grid">
                      {SECTIONS.map((n, i) => (
                        <li key={n.id} className="menu-item dash-b overflow-hidden" style={{ ["--mi" as string]: i }}>
                          <a href={href(n.id)} onClick={() => setOpen(false)} aria-current={current === n.id ? "true" : undefined} className="group flex items-baseline gap-4 py-3.5">
                            <span className="t-label muted w-7">{String(i + 1).padStart(2, "0")}</span>
                            <span className="t-h1 !text-[clamp(36px,9vw,64px)] transition-transform duration-300 group-hover:translate-x-2 group-aria-[current=true]:text-pink-deep">{n.label}</span>
                          </a>
                        </li>
                      ))}
                      <li className="menu-item dash-b overflow-hidden" style={{ ["--mi" as string]: SECTIONS.length }}>
                        <Link href="/shipyard" onClick={() => setOpen(false)} className="group flex items-baseline gap-4 py-3.5">
                          <span className="t-label muted w-7">→</span>
                          <span className="t-h1 !text-[clamp(36px,9vw,64px)] transition-transform duration-300 group-hover:translate-x-2">Shipyard</span>
                        </Link>
                      </li>
                      <li className="menu-item dash-b overflow-hidden" style={{ ["--mi" as string]: SECTIONS.length }}>
                        <Link href="/achievements" onClick={() => setOpen(false)} className="group flex items-baseline gap-4 py-3.5">
                          <span className="t-label muted w-7">→</span>
                          <span className="t-h1 !text-[clamp(36px,9vw,64px)] transition-transform duration-300 group-hover:translate-x-2">Achievements</span>
                        </Link>
                      </li>
                    </ul>
                  </nav>
                  <div className="menu-item flex flex-wrap gap-3" style={{ ["--mi" as string]: SECTIONS.length + 1 }}>
                    <a href={profile.resume} className="btn-pill">
                      Résumé PDF
                    </a>
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => {
                        setOpen(false);
                        openPalette();
                      }}
                    >
                      Search ⌘K
                    </button>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
      </div>
    </header>
  );
}
