"use client";

import { useState } from "react";
import { LAYERS, type ArchEdge, type ArchNode, type Layer } from "@/content/types";

const COL = 232;
const NODE_W = 188;
const NODE_H = 66;
const ROW = 100;
const PAD = 20;

const CREAM = "#ffedd7";
const MUTED = "#b3a491";
const CANVAS = "#100904";

const layerIndex = (l: Layer) => LAYERS.findIndex((x) => x.id === l) + 1;

type Props = {
  name: string;
  nodes: ArchNode[];
  edges: ArchEdge[];
  caption: string;
  /** Called with the layer under the pointer or keyboard focus, or null when nothing is highlighted. */
  onHighlight?: (layer: Layer | null) => void;
};

/** A system drawn in cream hairlines: components as boxes, data flow as lines with packets running along them. */
export default function ArchitectureDiagram({ name, nodes, edges, caption, onHighlight }: Props) {
  const [hot, setHot] = useState<string | null>(null);
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const cols = Math.max(...nodes.map((n) => n.x)) + 1;
  const rows = Math.max(...nodes.map((n) => n.y)) + 1;
  const W = PAD * 2 + (cols - 1) * COL + NODE_W;
  const H = PAD * 2 + (rows - 1) * ROW + NODE_H + 34;
  const id = name.toLowerCase().replace(/\W+/g, "-");

  const pos = (n: ArchNode) => ({ x: PAD + n.x * COL, y: PAD + n.y * ROW });
  const highlight = (nodeId: string | null) => {
    setHot(nodeId);
    onHighlight?.(nodeId ? byId[nodeId].layer : null);
  };
  const related = (e: ArchEdge) => hot !== null && (e.from === hot || e.to === hot);

  return (
    <figure className="grid gap-6">
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" style={{ minWidth: 640 }} role="img" aria-label={`Architecture of ${name}. The components are listed below.`}>
          <defs>
            <marker id={`arrow-${id}`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0,0 L8,4 L0,8 z" fill={CREAM} />
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
              ly = (y1 + y2) / 2 - 9;
            } else {
              // Return paths run underneath the diagram so they never cross a node.
              const x1 = a.x + NODE_W / 2, y1 = a.y + NODE_H, x2 = b.x + NODE_W / 2 + 18, y2 = b.y + NODE_H + 4;
              const low = Math.max(y1, y2) + 26;
              d = `M${x1} ${y1} L${x1} ${low} L${x2} ${low} L${x2} ${y2}`;
              lx = (x1 + x2) / 2;
              ly = low - 7;
            }
            const on = related(e);
            return (
              <g key={i} opacity={hot && !on ? 0.22 : 1} style={{ transition: "opacity 200ms" }}>
                <path id={`${id}-edge-${i}`} d={d} fill="none" stroke={CREAM} strokeWidth={on ? 1.5 : 1} strokeDasharray={e.dashed ? "4 5" : undefined} markerEnd={`url(#arrow-${id})`} />
                <circle className="packet" r="3" fill={CREAM}>
                  <animateMotion dur={`${2.4 + (i % 3) * 0.5}s`} begin={`${i * 0.35}s`} repeatCount="indefinite">
                    <mpath href={`#${id}-edge-${i}`} />
                  </animateMotion>
                </circle>
                {e.label && (
                  <text x={lx} y={ly} textAnchor={anchor} fontFamily="var(--font-sans)" fontWeight="500" fontSize="10" fill={MUTED} style={{ textTransform: "uppercase" }}>
                    {e.label}
                  </text>
                )}
              </g>
            );
          })}
          {nodes.map((n) => {
            const p = pos(n);
            const on = hot === n.id;
            const near = on || edges.some((e) => related(e) && (e.from === n.id || e.to === n.id));
            return (
              <g key={n.id} transform={`translate(${p.x} ${p.y})`} opacity={hot && !near ? 0.3 : 1} style={{ transition: "opacity 200ms" }} onPointerEnter={() => highlight(n.id)} onPointerLeave={() => highlight(null)}>
                <rect width={NODE_W} height={NODE_H} rx="12" fill={on ? CREAM : CANVAS} stroke={CREAM} strokeWidth="1" />
                <text x="14" y="28" fontFamily="var(--font-sans)" fontSize="13" fontWeight="500" fill={on ? CANVAS : CREAM} style={{ textTransform: "uppercase" }}>
                  {n.label}
                </text>
                <text x="14" y="48" fontFamily="var(--font-sans)" fontSize="12" fill={on ? CANVAS : MUTED}>
                  {n.detail}
                </text>
                <text x={NODE_W - 12} y="18" textAnchor="end" fontFamily="var(--font-sans)" fontWeight="500" fontSize="9" fill={on ? CANVAS : MUTED}>
                  L{layerIndex(n.layer)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="grid gap-4">
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-6" aria-label={`Components of ${name}`}>
          {nodes.map((n) => (
            <li key={n.id} className="dash-t">
              <button
                type="button"
                aria-pressed={hot === n.id}
                onFocus={() => highlight(n.id)}
                onBlur={() => highlight(null)}
                onPointerEnter={() => highlight(n.id)}
                onPointerLeave={() => highlight(null)}
                className="grid w-full gap-1 py-3 text-left uppercase transition-opacity aria-pressed:opacity-100"
              >
                <span className="t-micro muted">
                  L{layerIndex(n.layer)} · {LAYERS.find((l) => l.id === n.layer)?.label}
                </span>
                <span className="t-label">{n.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="t-micro muted">{caption}</p>
      </figcaption>
    </figure>
  );
}
