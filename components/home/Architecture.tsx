"use client";

import Link from "next/link";
import { useState } from "react";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import { featuredSystems } from "@/content/systems";
import { LAYERS, type Layer } from "@/content/types";
import SectionLabel from "./SectionLabel";

const layersOf = (slug: string) => new Set(featuredSystems.find((s) => s.slug === slug)?.architecture?.nodes.map((n) => n.layer) ?? []);

/** The diagram is the object here; it gets the width of two columns because it is read, not glanced at. */
export default function Architecture() {
  const [active, setActive] = useState(featuredSystems[0].slug);
  const [hot, setHot] = useState<Layer | null>(null);
  const s = featuredSystems.find((x) => x.slug === active)!;
  const used = layersOf(active);

  return (
    <section id="architecture" aria-labelledby="architecture-title" className="edge">
      <SectionLabel n={3}>Architecture</SectionLabel>
      <div className="grid min-h-[100svh] content-center gap-[41px] py-24 lg:grid-cols-[3fr_7fr]">
        <div className="grid content-start gap-8">
          <h2 id="architecture-title" className="t-h1" data-reveal>
            Five layers, one system.
          </h2>
          <p className="voice" data-reveal>
            Every system I build sits on five layers. Pick one to see how data moves.
          </p>
          <div role="tablist" aria-label="Featured systems" className="flex flex-wrap gap-2">
            {featuredSystems.map((x) => (
              <button
                key={x.slug}
                role="tab"
                type="button"
                id={`tab-${x.slug}`}
                aria-selected={active === x.slug}
                aria-controls="arch-panel"
                onClick={() => setActive(x.slug)}
                className="btn-ghost"
              >
                {x.name}
              </button>
            ))}
          </div>
          <ol className="t-label grid" aria-label="The five layers">
            {LAYERS.map((l, i) => (
              <li key={l.id} className={`dash-t flex justify-between py-2.5 transition-opacity ${used.has(l.id) ? "" : "opacity-40"} ${hot === l.id ? "underline decoration-dashed underline-offset-4" : ""}`}>
                <span>
                  <span className="muted mr-3">L{i + 1}</span>
                  {l.label}
                </span>
                <span className="muted">{used.has(l.id) ? "In use" : "—"}</span>
              </li>
            ))}
          </ol>
        </div>
        <div id="arch-panel" role="tabpanel" aria-labelledby={`tab-${active}`} className="grid content-center gap-6" data-reveal>
          <ArchitectureDiagram key={s.slug} name={s.name} nodes={s.architecture!.nodes} edges={s.architecture!.edges} caption={s.architecture!.caption} onHighlight={setHot} />
          <Link href={`/work/${s.slug}`} className="t-label link w-fit">
            {s.name} case study →
          </Link>
        </div>
      </div>
    </section>
  );
}
