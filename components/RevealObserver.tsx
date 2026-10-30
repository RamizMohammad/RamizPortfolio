"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Adds .in to every [data-reveal] element as it scrolls into view. CSS does the animating. */
export default function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.in)");
    // A masked element is fully clipped while hidden, which the browser counts as not intersecting,
    // so its parent is watched instead.
    const watched = new Map<Element, HTMLElement[]>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          watched.get(e.target)?.forEach((el) => el.classList.add("in"));
          io.unobserve(e.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );
    els.forEach((el) => {
      const target = el.dataset.reveal === "mask" && el.parentElement ? el.parentElement : el;
      watched.set(target, [...(watched.get(target) ?? []), el]);
      io.observe(target);
    });
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
