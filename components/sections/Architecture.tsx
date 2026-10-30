"use client";

import { Tabs } from "@animate-ui/react/primitives/radix-ui";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import { featuredSystems } from "@/content/systems";
import { LAYERS, type Layer } from "@/content/types";
import { setFocus } from "@/scene/store";

const layersOf = (slug: string) => [...new Set(featuredSystems.find((s) => s.slug === slug)?.architecture?.nodes.map((n) => n.layer) ?? [])];

export default function Architecture() {
  const [active, setActive] = useState(featuredSystems[0].slug);
  const inView = useRef(false);
  const section = useRef<HTMLElement>(null);

  // The exploded core lights the layers the selected system uses, only while this section is on screen.
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      inView.current = e.isIntersecting;
      setFocus(e.isIntersecting ? layersOf(active) : []);
    }, { rootMargin: "-30% 0px -30% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [active]);

  const highlight = (layer: Layer | null) => {
    if (inView.current) setFocus(layer ? [layer] : layersOf(active));
  };
  const used = layersOf(active);

  return (
    <section ref={section} id="architecture" aria-labelledby="architecture-title" className="border-t border-rule py-24 md:py-32">
      <div className="wrap grid gap-14">
        <div className="grid min-h-[70svh] gap-10 md:grid-cols-12">
          <div className="flex flex-col justify-between gap-10 md:col-span-6 lg:col-span-5">
            <div>
              <p className="label">How the parts fit</p>
              <h2 id="architecture-title" className="display mt-4 text-[clamp(44px,7vw,96px)]">
                Architecture
              </h2>
              <p className="mt-6 max-w-[44ch] text-fg-2">
                Every system I build sits on the same five layers. Choose a system to see which layers it uses, its components and how data moves between them.
              </p>
            </div>
            <ol className="grid border-t border-rule" aria-label="The five layers">
              {LAYERS.map((l, i) => (
                <li key={l.id} className={`flex items-baseline justify-between border-b border-rule py-3 transition-colors ${used.includes(l.id) ? "text-fg" : "text-fg-3"}`}>
                  <span className="text-[15px]">
                    <span className="data mr-3 text-fg-3">L{i + 1}</span>
                    {l.label}
                  </span>
                  <span className="label">{used.includes(l.id) ? "In use" : "—"}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <Tabs.Root value={active} onValueChange={setActive} className="grid gap-6">
          <Tabs.List aria-label="Featured systems" className="flex flex-wrap gap-2">
            {featuredSystems.map((s) => (
              <Tabs.Trigger
                key={s.slug}
                value={s.slug}
                className="min-h-11 border border-rule px-5 text-[14px] text-fg-2 transition-colors hover:border-fg hover:text-fg data-[state=active]:border-fg data-[state=active]:bg-fg data-[state=active]:text-ink"
              >
                {s.name}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          {featuredSystems.map((s) => (
            <Tabs.Content key={s.slug} value={s.slug} className="grid gap-6 outline-none">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <p className="max-w-[60ch] text-fg-2">{s.summary}</p>
                <Link href={`/work/${s.slug}`} className="text-[14px] text-fg">
                  Read the case study →
                </Link>
              </div>
              <ArchitectureDiagram name={s.name} nodes={s.architecture!.nodes} edges={s.architecture!.edges} caption={s.architecture!.caption} onHighlight={highlight} />
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </div>
    </section>
  );
}
