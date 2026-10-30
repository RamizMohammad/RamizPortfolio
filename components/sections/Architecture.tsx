"use client";

import { Tabs } from "@animate-ui/react/primitives/radix-ui";
import { taglines } from "@/content/personality";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import ChapterHead from "@/components/ChapterHead";
import { featuredSystems } from "@/content/systems";
import { LAYERS, type Layer } from "@/content/types";
import { setArch, setFocus } from "@/scene/store";

const layersOf = (slug: string) => [...new Set(featuredSystems.find((s) => s.slug === slug)?.architecture?.nodes.map((n) => n.layer) ?? [])];

export default function Architecture() {
  const [active, setActive] = useState(featuredSystems[0].slug);
  const inView = useRef(false);
  const section = useRef<HTMLElement>(null);

  // The tower brings forward the floors the selected system uses, only while this section is on screen.
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      inView.current = e.isIntersecting;
      setFocus(e.isIntersecting ? layersOf(active) : []);
      setArch(active);
    }, { rootMargin: "-30% 0px -30% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [active]);

  const highlight = (layer: Layer | null) => {
    if (inView.current) setFocus(layer ? [layer] : layersOf(active));
  };
  const used = layersOf(active);

  return (
    <section ref={section} id="architecture" aria-labelledby="architecture-title" className="stop">
      <div className="grid gap-9">
        <ChapterHead n={2} kicker={taglines.chapters.architecture} title="Architecture" id="architecture-title">
          <p className="max-w-[52ch] text-fg-2" data-reveal style={{ ["--rd" as string]: "120ms" }}>
            Every system I build sits on the same five layers, stacked like the floors of the tower. Choose a system: the floors it uses come forward, and packets run between its components.
          </p>
        </ChapterHead>

        <ol className="grid border-t-[1.5px] border-fg" aria-label="The five layers">
          {LAYERS.map((l, i) => (
            <li key={l.id} data-reveal style={{ ["--rd" as string]: `${i * 70}ms` }} className={`flex items-baseline justify-between border-b border-rule py-2.5 transition-colors duration-500 ${used.includes(l.id) ? "text-fg" : "text-fg-3"}`}>
              <span className="text-[15px]">
                <span className="mr-3 inline-block h-2.5 w-2.5 rounded-full align-middle ring-[1.5px] ring-fg transition-opacity duration-500" style={{ background: l.color, opacity: used.includes(l.id) ? 1 : 0.3 }} />
                <span className="data mr-3 text-fg-3">L{i + 1}</span>
                {l.label}
              </span>
              <span className="label" style={{ color: used.includes(l.id) ? l.color : undefined }}>{used.includes(l.id) ? "In use" : "—"}</span>
            </li>
          ))}
        </ol>

        <Tabs.Root value={active} onValueChange={setActive} className="grid gap-6">
          <Tabs.List aria-label="Featured systems" className="flex flex-wrap gap-2">
            {featuredSystems.map((s) => (
              <Tabs.Trigger
                key={s.slug}
                value={s.slug}
                className="min-h-11 border-[1.5px] border-fg px-5 text-[14px] text-fg transition-colors hover:bg-tape data-[state=active]:bg-fg data-[state=active]:text-ink"
              >
                {s.name}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          {featuredSystems.map((s) => (
            <Tabs.Content key={s.slug} value={s.slug} className="grid gap-5 outline-none">
              <p className="text-fg-2">{s.summary}</p>
              <ArchitectureDiagram name={s.name} nodes={s.architecture!.nodes} edges={s.architecture!.edges} caption={s.architecture!.caption} onHighlight={highlight} />
              <Link href={`/work/${s.slug}`} className="text-[14px] text-cyan hover:underline">
                Read the case study →
              </Link>
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </div>
    </section>
  );
}
