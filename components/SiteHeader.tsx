"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog, NavigationMenu } from "radix-ui";
import { memo, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { profile } from "@/content/profile";
import { activeGroup, GROUPS, openPalette, SECTIONS, type NavLink } from "./nav";
import LensMenu from "./lens/LensMenu";
import LensSwitch from "./lens/LensSwitch";
import ResumeButton from "./lens/ResumeButton";
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
  const group = activeGroup(onHome ? active : null, pathname);
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
      const li = list.current?.querySelector<HTMLElement>(`[data-id="${group}"]`)?.parentElement;
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
  }, [group, scrolled]);

  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);
  const current = onHome ? active : null;
  const linkHref = (l: NavLink) => l.page ?? href(l.section!);
  const strip = ["Open to engineering roles and freelance work", `${profile.role} at ${profile.company}`, "Python · FastAPI · LLM agents · Docker", "Automation · Backends · Infrastructure"];
  const compact = scrolled || !onHome;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${hidden && !open ? "-translate-y-[120%]" : ""}`}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      {/* The lime strip folds away once you start scrolling. */}
      <div className={`overflow-hidden bg-lime transition-[height] duration-500 ${compact ? "h-0 [&_.marquee]:[animation-play-state:paused]" : "h-[var(--strip-h)]"}`} aria-hidden="true">
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
            compact ? "h-14 max-w-[1180px] rounded-full border-[1.5px] border-ink bg-card/95 pl-1.5 pr-1.5 shadow-[0_12px_40px_-16px_rgb(0_0_0/0.35)]" : "h-[calc(var(--nav-h)-var(--strip-h))] max-w-[2000px] border-[1.5px] border-transparent"
          }`}
        >
          <Link href="/" className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full border-[2px] border-ink bg-sun" aria-label={`${profile.name}, home`}>
            <Image src="/images/mascot-face.webp" alt="" width={88} height={88} priority className="h-full w-full rounded-full" />
            <svg viewBox="0 0 48 48" className="pointer-events-none absolute -inset-[4px] h-[calc(100%+8px)] w-[calc(100%+8px)] -rotate-90" aria-hidden="true">
              <circle ref={ring} cx="24" cy="24" r="21" fill="none" strokeWidth="3" strokeLinecap="round" style={{ stroke: "var(--color-pink-deep)", strokeDasharray: RING, strokeDashoffset: RING }} />
            </svg>
          </Link>

          <DesktopNav group={group} current={current} pathname={pathname} onHome={onHome} listRef={list} pill={pill} />

          <div className="ml-auto flex items-center gap-1.5 xl:ml-2">
            <button type="button" onClick={openPalette} className="btn-ghost btn-sm hidden md:inline-flex" aria-label="Open command menu" aria-keyshortcuts="Control+K Meta+K">
              ⌘K
            </button>
            <ThemeToggle />
            <ResumeButton className="btn-pill btn-sm hidden md:inline-flex" />
            <LensMenu className="hidden md:inline-flex" />

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
                    {GROUPS.map((g, gi) => (
                      <section key={g.id} className="menu-item dash-b overflow-hidden py-3" style={{ ["--mi" as string]: gi }}>
                        {g.links ? (
                          <div>
                            <p className="t-label muted pb-1.5">
                              {String(gi + 1).padStart(2, "0")} · {g.label}
                            </p>
                            <ul className="grid">
                              {g.links.map((l) => {
                                const here = l.section ? current === l.section : pathname === l.page;
                                const cls = "group flex items-baseline justify-between gap-4 py-1.5";
                                const text = (
                                  <span className="t-h1 !text-[clamp(30px,7.5vw,52px)] transition-transform duration-300 group-hover:translate-x-2 group-aria-[current=true]:text-pink-deep">{l.label}</span>
                                );
                                return (
                                  <li key={l.label}>
                                    {l.page ? (
                                      <Link href={l.page} onClick={() => setOpen(false)} aria-current={here ? "true" : undefined} className={cls}>
                                        {text}
                                        <span className="t-micro muted">page ↗</span>
                                      </Link>
                                    ) : (
                                      <a href={linkHref(l)} onClick={() => setOpen(false)} aria-current={here ? "true" : undefined} className={cls}>
                                        {text}
                                      </a>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ) : (
                          <a href={href(g.section!)} onClick={() => setOpen(false)} aria-current={current === g.section ? "true" : undefined} className="group flex items-baseline gap-4">
                            <span className="t-label muted w-7">{String(gi + 1).padStart(2, "0")}</span>
                            <span className="t-h1 !text-[clamp(30px,7.5vw,52px)] transition-transform duration-300 group-hover:translate-x-2 group-aria-[current=true]:text-pink-deep">{g.label}</span>
                          </a>
                        )}
                      </section>
                    ))}
                  </nav>
                  <div className="menu-item pb-4" style={{ ["--mi" as string]: GROUPS.length }}>
                    <LensSwitch className="!justify-start" />
                  </div>
                  <div className="menu-item flex flex-wrap gap-3" style={{ ["--mi" as string]: GROUPS.length + 1 }}>
                    <ResumeButton className="btn-pill" />
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

/**
 * The desktop links and their dropdowns. Kept apart from the header and memoised, because the
 * header re-renders as you scroll (it hides, shows and changes shape) and this menu only needs to
 * when the highlighted group or the page changes.
 */
const DesktopNav = memo(function DesktopNav({
  group,
  current,
  pathname,
  onHome,
  listRef,
  pill,
}: {
  group: string | null;
  current: string | null;
  pathname: string;
  onHome: boolean;
  listRef: RefObject<HTMLUListElement | null>;
  pill: { left: number; width: number } | null;
}) {
  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);
  const linkHref = (l: NavLink) => l.page ?? href(l.section!);
  return (
    <NavigationMenu.Root aria-label="Main" className="ml-auto hidden xl:block" delayDuration={60}>
      <NavigationMenu.List ref={listRef} className="relative flex items-center">
        {/* The sliding highlight, under the group that holds the section in view */}
        <span
          aria-hidden="true"
          className="absolute top-1/2 h-9 -translate-y-1/2 rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)]"
          style={{ background: "var(--color-ink)", left: pill?.left ?? 0, width: pill?.width ?? 0, opacity: pill && group ? 1 : 0 }}
        />
        {GROUPS.map((g) =>
          g.links ? (
            <NavigationMenu.Item key={g.id} value={g.id} className="relative">
              <NavigationMenu.Trigger
                data-id={g.id}
                aria-current={group === g.id ? "true" : undefined}
                className="nav-link group flex items-center gap-1.5 rounded-full px-3.5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.03em] transition-colors duration-300"
              >
                {g.label}
                <svg viewBox="0 0 10 6" className="h-1.5 w-2.5 transition-transform duration-300 group-data-[state=open]:rotate-180" aria-hidden="true">
                  <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </NavigationMenu.Trigger>
              {/* Padding, not margin, bridges the gap so the menu stays open on the way down */}
              <NavigationMenu.Content className="nav-menu absolute left-1/2 top-full z-10 w-[340px] -translate-x-1/2 pt-3">
                <ul className="grid gap-0.5 rounded-[22px] border-[1.5px] border-ink bg-card p-2 shadow-[0_18px_40px_-18px_rgb(0_0_0/0.45)]">
                  {g.links.map((l) => {
                    const here = l.section ? current === l.section : pathname === l.page;
                    const body = (
                      <>
                        <span className="flex items-center justify-between gap-2 text-[13.5px] font-semibold">
                          {l.label}
                          {l.page && <span className="t-micro muted">page ↗</span>}
                        </span>
                        <span className="muted text-[12.5px] leading-snug">{l.hint}</span>
                      </>
                    );
                    const cls = `grid gap-0.5 rounded-[14px] px-3.5 py-2.5 transition-colors hover:bg-paper focus-visible:bg-paper ${here ? "bg-paper" : ""}`;
                    return (
                      <li key={l.label}>
                        <NavigationMenu.Link asChild active={here}>
                          {l.page ? (
                            <Link href={l.page} className={cls}>
                              {body}
                            </Link>
                          ) : (
                            <a href={linkHref(l)} className={cls}>
                              {body}
                            </a>
                          )}
                        </NavigationMenu.Link>
                      </li>
                    );
                  })}
                </ul>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          ) : (
            <NavigationMenu.Item key={g.id} value={g.id} className="relative">
              <NavigationMenu.Link asChild>
                <a
                  href={href(g.section!)}
                  data-id={g.id}
                  aria-current={group === g.id ? "true" : undefined}
                  className="nav-link block rounded-full px-3.5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.03em] transition-colors duration-300"
                >
                  {g.label}
                </a>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          ),
        )}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
});
