"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/** The width the live site is laid out at: a real desktop viewport, scaled down to fit. */
const VW = 1280;

type Props = {
  url: string;
  title: string;
  poster: { src: string; width: number; height: number };
  /** In the project viewer people can scroll and click the live site; in the collage it is a picture. */
  interactive?: boolean;
  sizes: string;
  /** Fill the parent (which sets the size) instead of keeping the screenshot's shape. */
  fill?: boolean;
  /** Load the live site only once someone points at (or focuses) it, instead of when it scrolls near. */
  onDemand?: boolean;
  className?: string;
};

/**
 * A project's real landing page, live. It renders the site in a frame at desktop width and scales it
 * to fit; the screenshot shows until the live page has loaded and stays if the site is slow or
 * refuses to be embedded. Loads only when near the viewport, and not at all with Save-Data on.
 */
export default function LivePreview({ url, title, poster, interactive = false, sizes, fill = false, onDemand = false, className = "" }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const scale = size.w / VW;
  const [near, setNear] = useState(false);
  const [state, setState] = useState<"waiting" | "live" | "failed">("waiting");
  const vh = Math.round((VW * poster.height) / poster.width);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (onDemand) {
      // Each live site runs its own scripts and animations, so a page of them would make scrolling
      // past cost far more than it should: wait until this one is wanted.
      const want = () => !saveData && setNear(true);
      const tile = el.closest("button, a") ?? el;
      tile.addEventListener("pointerenter", want, { once: true });
      tile.addEventListener("focusin", want, { once: true });
      return () => {
        ro.disconnect();
        tile.removeEventListener("pointerenter", want);
        tile.removeEventListener("focusin", want);
      };
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !saveData) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, [onDemand]);

  // A site that never finishes loading (or is blocked from embedding) keeps the screenshot.
  useEffect(() => {
    if (!near || state !== "waiting") return;
    const t = window.setTimeout(() => setState((s) => (s === "waiting" ? "failed" : s)), 15000);
    return () => window.clearTimeout(t);
  }, [near, state]);

  return (
    <div ref={box} className={`${fill ? "absolute inset-0" : "relative w-full"} overflow-hidden bg-white ${className}`} style={fill ? undefined : { aspectRatio: `${poster.width} / ${poster.height}` }}>
      <Image src={poster.src} alt={`Screenshot of ${title}`} fill sizes={sizes} className="object-cover object-top" />
      {near && state !== "failed" && scale > 0 && (
        <iframe
          src={url}
          title={`${title}, live`}
          loading="lazy"
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
          tabIndex={interactive ? 0 : -1}
          aria-hidden={interactive ? undefined : true}
          onLoad={() => setState("live")}
          className={`absolute left-0 top-0 origin-top-left border-0 bg-white transition-opacity duration-700 ${state === "live" ? "opacity-100" : "opacity-0"} ${interactive ? "" : "pointer-events-none"}`}
          style={{ width: VW, height: fill ? Math.ceil(size.h / scale) : vh, transform: `scale(${scale})` }}
        />
      )}
      {state === "live" && (
        <span className="t-micro pointer-events-none absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full border-[1.5px] border-[#121016] bg-white px-2 py-0.5 text-[#121016]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#e5484d]" /> Live
        </span>
      )}
    </div>
  );
}

/** The live address for a project: its first web link, when it has a web screenshot to fall back on. */
export function liveUrl(s: { platform: string; screen?: { kind: string }; links?: { href: string }[] }) {
  const href = s.links?.[0]?.href;
  return s.platform === "web" && s.screen?.kind === "web" && href && !/github\.com|play\.google\.com/.test(href) ? href : null;
}
