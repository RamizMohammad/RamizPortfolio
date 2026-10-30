"use client";

import { Drawer } from "@animate-ui/react/primitives/radix-ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog } from "radix-ui";
import { useEffect, useState } from "react";
import { profile } from "@/content/profile";

const NAV = [
  { id: "about", label: "About" },
  { id: "systems", label: "Systems" },
  { id: "architecture", label: "Architecture" },
  { id: "timeline", label: "Timeline" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  // Marks the section currently in view, on the home page only.
  useEffect(() => {
    if (!onHome) return;
    const sections = NAV.map((n) => document.getElementById(n.id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [onHome]);

  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);
  const current = onHome ? active : null;

  return (
    <header
      className="sticky z-50 border-b border-rule bg-ink/80 backdrop-blur-md"
      style={{ top: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="wrap flex h-16 items-center justify-between gap-6">
        <Link href="/" className="display text-[19px] tracking-[-0.02em] no-underline" aria-label={`${profile.name}, home`}>
          RAMIZ
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-[14px]">
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={href(n.id)}
                  aria-current={current === n.id ? "true" : undefined}
                  className="relative py-2 text-fg-2 no-underline transition-colors hover:text-fg aria-[current=true]:text-cyan"
                >
                  {n.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-cyan to-violet transition-transform duration-200 ${current === n.id ? "scale-x-100" : "scale-x-0"}`}
                  />
                </a>
              </li>
            ))}
            <li>
              <Link href="/achievements" aria-current={pathname === "/achievements" ? "page" : undefined} className="py-2 text-fg-2 no-underline hover:text-fg aria-[current=page]:text-fg">
                Achievements
              </Link>
            </li>
            <li>
              <a href={profile.resume} className="btn h-10 min-h-0 px-4 text-[13px]">
                Résumé
              </a>
            </li>
          </ul>
        </nav>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center border border-rule lg:hidden"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <span aria-hidden="true" className="grid w-5 gap-[5px]">
            <i className="block h-[1.5px] bg-fg" />
            <i className="block h-[1.5px] bg-fg" />
          </span>
        </button>
      </div>

      <Drawer.Root open={open} onOpenChange={setOpen} direction="right">
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-[60] bg-black/70" />
          <Drawer.Content
            className="fixed inset-y-0 right-0 z-[61] flex w-[min(88vw,380px)] flex-col border-l border-rule bg-ink outline-none"
            style={{ paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: "env(safe-area-inset-bottom, 0px)", paddingRight: "env(safe-area-inset-right, 0px)" }}
          >
            <div className="flex h-16 items-center justify-between border-b border-rule px-5">
              <Dialog.Title className="label">Menu</Dialog.Title>
              <Dialog.Description className="sr-only">Site sections and links</Dialog.Description>
              <button type="button" onClick={() => setOpen(false)} className="flex h-11 w-11 items-center justify-center border border-rule text-xl leading-none" aria-label="Close menu">
                ×
              </button>
            </div>
            <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-6">
              <ul className="grid">
                {NAV.map((n) => (
                  <li key={n.id} className="border-b border-rule">
                    <a href={href(n.id)} onClick={() => setOpen(false)} className="heading block py-4 text-[28px] no-underline">
                      {n.label}
                    </a>
                  </li>
                ))}
                <li className="border-b border-rule">
                  <Link href="/achievements" onClick={() => setOpen(false)} className="heading block py-4 text-[28px] no-underline">
                    Achievements
                  </Link>
                </li>
              </ul>
              <a href={profile.resume} className="btn btn-solid mt-8 w-full justify-center">
                Download résumé
              </a>
            </nav>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </header>
  );
}
