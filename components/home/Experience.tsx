"use client";

import { lensTags } from "@/content/lens";
import Words from "@/components/Words";
import { useEffect, useRef } from "react";
import { timeline } from "@/content/timeline";
import SectionLabel from "./SectionLabel";

// Oldest first, so the story runs from the first commit (git init) down to what I do now (HEAD).
const entries = [...timeline].sort((a, b) => (a.span?.[0] ?? 0) - (b.span?.[0] ?? 0));
const TONES = ["bg-violet", "bg-mint", "bg-sun", "bg-pink", "bg-lime"];
const branch = (org: string) => org.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/**
 * Experience as a git history: a spine runs down the middle, each role is a commit node with
 * its card on alternating sides. As you scroll, the spine fills in pink and each node lights
 * up as the fill reaches it; cards slide in from their own side.
 */
export default function Experience() {
  const list = useRef<HTMLOListElement>(null);
  const fill = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const l = list.current;
    const f = fill.current;
    if (!l || !f) return;
    let raf = 0;
    let height = 0;
    // Where each commit node sits down the list. Measured on resize, never during a scroll, so a
    // scroll frame only reads one rect and writes one transform.
    let nodes: { li: Element; at: number; on: boolean }[] = [];
    const measure = () => {
      height = l.offsetHeight;
      nodes = Array.from(l.children).flatMap((li) => {
        const node = (li as HTMLElement).querySelector<HTMLElement>("[data-node]");
        return node ? [{ li, at: node.offsetTop + (li as HTMLElement).offsetTop, on: li.hasAttribute("data-on") }] : [];
      });
    };
    const update = () => {
      raf = 0;
      const top = l.getBoundingClientRect().top;
      // The fill's tip follows a line 60% down the screen.
      const head = Math.min(height, Math.max(0, window.innerHeight * 0.6 - top));
      f.style.transform = `scaleY(${height ? head / height : 0})`;
      for (const n of nodes) {
        const on = head >= n.at;
        if (on !== n.on) {
          n.on = on;
          n.li.toggleAttribute("data-on", on);
        }
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    // Only listen while the timeline is anywhere near the screen.
    const onScroll = () => schedule();
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        window.addEventListener("scroll", onScroll, { passive: true });
        schedule();
      } else window.removeEventListener("scroll", onScroll);
    }, { rootMargin: "50% 0px" });
    const ro = new ResizeObserver(() => {
      measure();
      schedule();
    });
    measure();
    update();
    io.observe(l);
    ro.observe(l);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section id="experience" aria-labelledby="experience-title" className="edge pb-24">
      <SectionLabel id="experience">Experience</SectionLabel>
      <div className="grid gap-4 pb-14 pt-16 lg:grid-cols-[1fr_auto] lg:items-end">
        <h2 id="experience-title" className="t-h1 split" data-reveal>
          <Words text="Where I’ve worked." />
        </h2>
        <p className="voice-sm muted ink-in max-w-[44ch]" data-reveal>
          Building since 2021: my own products first, then freelance Android, a B.Tech in AI and ML, internships at Bluestock and Moglix, and now software engineer at Moglix.
        </p>
      </div>

      <div className="relative">
        {/* The spine and its fill */}
        <div aria-hidden="true" className="absolute bottom-0 left-[19px] top-0 w-0 border-l-[2px] border-dashed border-ink/30 lg:left-1/2" />
        <div ref={fill} aria-hidden="true" className="absolute bottom-0 left-[18px] top-0 w-[4px] origin-top rounded-full bg-pink-deep will-change-transform lg:left-[calc(50%-1px)]" style={{ transform: "scaleY(0)" }} />
        <ol ref={list} className="relative grid gap-10 lg:gap-6">

        {entries.map((t, i) => {
          const current = t.span && t.span[1] === null && t.kind === "Work";
          const right = i % 2 === 1;
          // Internships live on intern/ branches; a role that follows an internship at the same company merges it.
          const prev = entries[i - 1];
          const cmd =
            i === 0
              ? "git init"
              : t.kind === "Education"
                ? `git checkout -b study/${branch(t.org)}`
                : t.kind === "Internship"
                ? `git checkout -b intern/${branch(t.org)}`
                : prev?.kind === "Internship" && prev.org === t.org
                  ? `git merge intern/${branch(t.org)}`
                  : `git checkout -b ${branch(t.org)}`;
          return (
            <li key={`${t.org}-${t.title}`} className={`exp-item relative grid pl-14 lg:grid-cols-2 lg:pl-0 ${right ? "exp-right" : "exp-left"}`}>
              {/* Commit node on the spine */}
              <span data-node className="exp-node absolute left-0 top-6 z-[1] grid h-10 w-10 place-items-center rounded-full border-[2px] border-ink bg-card font-display text-[17px] lg:left-[calc(50%-20px)]">
                {i + 1}
              </span>
              {/* Date beside the node, on the side facing away from the card */}
              <p className={`t-label hidden items-center lg:absolute lg:top-8 lg:flex ${right ? "lg:right-[calc(50%+40px)]" : "lg:left-[calc(50%+40px)]"}`}>
                <span className="rounded-full border-[1.5px] border-ink bg-card px-3 py-1.5">{t.period || "Where it started"}</span>
              </p>
              <article className={`exp-card overflow-hidden rounded-[28px] border-[1.5px] border-ink bg-card ${right ? "lg:col-start-2 lg:ml-14" : "lg:mr-14"}`} data-reveal>
                <header className={`flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b-[1.5px] border-ink px-6 py-3 ${TONES[i % TONES.length]}`}>
                  <code className="break-all font-mono text-[12px] md:text-[13px]">$ {cmd}</code>
                  {current ? (
                    <span className="t-micro flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 text-lime">
                      <span className="dot pulse !h-1.5 !w-1.5 !bg-lime" /> Head
                    </span>
                  ) : t.span && t.span[1] === null ? (
                    <span className="t-micro shrink-0 rounded-full border-[1.5px] border-ink bg-card px-2.5 py-1">Ongoing</span>
                  ) : null}
                </header>
                <div className="grid gap-4 p-6 md:p-7">
                  <div className="grid gap-1.5">
                    <p className="t-label muted lg:hidden">{t.period || "Where it started"}</p>
                    <h3 className="t-h2">{t.title}</h3>
                    <p className="t-label">
                      {t.org}
                      {t.org !== t.kind && <span className="muted"> · {t.kind}</span>}
                    </p>
                  </div>
                  <ul className="grid gap-1.5 text-[16px] leading-snug">
                    {t.points.map((p) => (
                      <li key={p} className="grid grid-cols-[20px_1fr]" data-lens-tags={lensTags(p)}>
                        <span aria-hidden="true" className="text-pink-deep">→</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                  {t.tags && (
                    <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
                      {t.tags.map((tag) => (
                        <li key={tag} className="t-micro rounded-full border-[1.5px] border-ink px-2.5 py-1">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            </li>
          );
        })}
        </ol>
      </div>
    </section>
  );
}
