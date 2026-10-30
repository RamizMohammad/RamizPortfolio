"use client";

import { useState } from "react";
import { LAYERS, type ArchEdge, type ArchNode, type Layer } from "@/content/types";

const COL = 232;
const NODE_W = 188;
const NODE_H = 62;
const ROW = 98;
const PAD = 20;

const layerIndex = (l: Layer) => LAYERS.findIndex((x) => x.id === l) + 1;
const color = (n: ArchNode) => LAYERS.find((x) => x.id === n.layer)?.color ?? "#3be8ff";

type Props = {
  name: string;
  nodes: ArchNode[];
  edges: ArchEdge[];
  caption: string;
  /** Called with the layer under the pointer or keyboard focus, or null when nothing is highlighted. */
  onHighlight?: (layer: Layer | null) => void;
};

export default function ArchitectureDiagram({ name, nodes, edges, caption, onHighlight }: Props) {
  const [hot, setHot] = useState<string | null>(null);
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const cols = Math.max(...nodes.map((n) => n.x)) + 1;
  const rows = Math.max(...nodes.map((n) => n.y)) + 1;
  const W = PAD * 2 + (cols - 1) * COL + NODE_W;
  const H = PAD * 2 + (rows - 1) * ROW + NODE_H + 34;

  const pos = (n: ArchNode) => ({ x: PAD + n.x * COL, y: PAD + n.y * ROW });
  const highlight = (id: string | null) => {
    setHot(id);
    onHighlight?.(id ? byId[id].layer : null);
  };
  const related = (e: ArchEdge) => hot !== null && (e.from === hot || e.to === hot);

  return (
    <figure className="grid gap-5">
      <div className="relative overflow-x-auto border border-rule bg-panel">
        <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" style={{ minWidth: 640 }} role="img" aria-label={`Architecture of ${name}. The components are listed below.`}>
          <defs>
            <marker id={`arrow-${name}`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
              <path d="M0,0 L8,4 L0,8 z" fill="#a08bff" />
            </marker>
          </defs>
          {edges.map((e, i) => {
            const a = pos(byId[e.from]);
            const b = pos(byId[e.to]);
            const forward = byId[e.to].x > byId[e.from].x;
            const sameCol = byId[e.to].x === byId[e.from].x;
            let d: string;
            let lx: number;
            let ly: number;
            let anchor: "middle" | "start" = "middle";
            if (sameCol) {
              // Straight drop between stacked nodes, label beside the line.
              const down = b.y > a.y;
              const x = a.x + NODE_W / 2, y1 = down ? a.y + NODE_H : a.y, y2 = down ? b.y - 4 : b.y + NODE_H + 4;
              d = `M${x} ${y1} L${x} ${y2}`;
              lx = x + 10;
              ly = (y1 + y2) / 2 + 4;
              anchor = "start";
            } else if (forward) {
              const x1 = a.x + NODE_W, y1 = a.y + NODE_H / 2, x2 = b.x - 4, y2 = b.y + NODE_H / 2;
              const mx = (x1 + x2) / 2;
              d = `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`;
              lx = mx;
              ly = (y1 + y2) / 2 - 8;
            } else {
              // Return paths run underneath the diagram so they never cross a node.
              const x1 = a.x + NODE_W / 2, y1 = a.y + NODE_H, x2 = b.x + NODE_W / 2 + 18, y2 = b.y + NODE_H + 4;
              const low = Math.max(y1, y2) + 26;
              d = `M${x1} ${y1} L${x1} ${low} L${x2} ${low} L${x2} ${y2}`;
              lx = (x1 + x2) / 2;
              ly = low - 6;
            }
            const on = related(e);
            return (
              <g key={i} opacity={hot && !on ? 0.25 : 1}>
                <path d={d} fill="none" stroke={on ? "#3be8ff" : "#a08bff"} strokeWidth={on ? 1.5 : 1} strokeDasharray={e.dashed ? "3 4" : undefined} markerEnd={`url(#arrow-${name})`} />
                {e.label && (
                  <text x={lx} y={ly} textAnchor={anchor} fontFamily="var(--font-mono)" fontSize="11" fill="#b3a2ff" letterSpacing="0.04em">
                    {e.label}
                  </text>
                )}
              </g>
            );
          })}
          {nodes.map((n) => {
            const p = pos(n);
            const on = hot === n.id;
            return (
              <g
                key={n.id}
                transform={`translate(${p.x} ${p.y})`}
                opacity={hot && !on && !edges.some((e) => related(e) && (e.from === n.id || e.to === n.id)) ? 0.35 : 1}
                onPointerEnter={() => highlight(n.id)}
                onPointerLeave={() => highlight(null)}
              >
                <rect width={NODE_W} height={NODE_H} fill={on ? color(n) : "#05070d"} stroke={color(n)} strokeWidth="1" style={{ filter: on ? `drop-shadow(0 0 10px ${color(n)})` : undefined }} />
                <text x="14" y="26" fontFamily="var(--font-sans)" fontSize="14" fontWeight="600" fill={on ? "#05070d" : "#eef3ff"}>
                  {n.label}
                </text>
                <text x="14" y="46" fontFamily="var(--font-mono)" fontSize="11" fill={on ? "#1d2333" : "#a3adc4"}>
                  {n.detail}
                </text>
                <text x={NODE_W - 10} y="16" textAnchor="end" fontFamily="var(--font-mono)" fontSize="10" fill={on ? "#1d2333" : color(n)}>
                  L{layerIndex(n.layer)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="grid gap-4">
        <ul className="grid border-l border-t border-rule sm:grid-cols-2 lg:grid-cols-3" aria-label={`Components of ${name}`}>
          {nodes.map((n) => (
            <li key={n.id} className="border-b border-r border-rule">
              <button
                type="button"
                aria-pressed={hot === n.id}
                onFocus={() => highlight(n.id)}
                onBlur={() => highlight(null)}
                onPointerEnter={() => highlight(n.id)}
                onPointerLeave={() => highlight(null)}
                className="grid w-full gap-1 p-4 text-left transition-colors aria-pressed:bg-cyan aria-pressed:text-ink"
              >
                <span className="label text-inherit opacity-70">
                  L{layerIndex(n.layer)} · {LAYERS.find((l) => l.id === n.layer)?.label}
                </span>
                <span className="text-[15px] font-semibold">{n.label}</span>
                <span className="text-[13px] opacity-80">{n.detail}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="label normal-case tracking-normal">{caption}</p>
      </figcaption>
    </figure>
  );
}
