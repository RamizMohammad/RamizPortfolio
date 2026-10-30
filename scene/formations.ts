import { profile } from "@/content/profile";
import { featuredSystems, systems } from "@/content/systems";
import { timeline } from "@/content/timeline";
import { LAYERS, type Layer } from "@/content/types";

/**
 * The scene is a pool of blocks that rearrange for each section. Blocks 0–4 are the five
 * core layers; blocks 5+ are "units" that stand for whatever the section lists
 * (interests, systems, architecture components, timeline entries).
 */
export const LAYER_BLOCKS = LAYERS.length;
export const UNIT_BLOCKS = Math.max(systems.length, profile.interestTags.length, timeline.length, 6);
export const BLOCKS = LAYER_BLOCKS + UNIT_BLOCKS;
export const FORMATIONS = 7; // one per beat, in BEAT_ORDER

export type Block = {
  p: [number, number, number];
  s: [number, number, number];
  r: [number, number, number];
  /** 0 normal → 1 emphasised (lighter face) */
  lit: number;
  /** Edge brightness */
  edge: number;
  /** Text shown beside the block, if any */
  label?: string;
  /** Where the label sits relative to the block centre, and which way it reads */
  la?: [number, number, number];
  align?: "left" | "right";
};

export type Ctx = {
  time: number;
  focus: Layer[];
  system: string | null;
  arch: string | null;
  now: number;
  /** Extra explode on the assembled core from hover and clicks */
  boost: number;
};

const THICK = 0.16;
const SIZES = LAYERS.map((_, i) => ({ w: 1.75 + i * 0.13, d: 1.2 + i * 0.08 }));
const gapFor = (e: number) => 0.05 + e * 0.62;
export const slabY = (i: number, e: number) => ((LAYER_BLOCKS - 1) / 2 - i) * (THICK + gapFor(e));

const HIDDEN = (): Block => ({ p: [0, 0, 0], s: [0.0001, 0.0001, 0.0001], r: [0, 0, 0], lit: 0, edge: 0 });

function slab(i: number, e: number, focus: Layer[]): Block {
  const on = focus.length === 0 || focus.includes(LAYERS[i].id);
  return {
    p: [0, slabY(i, e), 0],
    s: [SIZES[i].w, THICK, SIZES[i].d],
    r: [0, 0, 0],
    lit: focus.includes(LAYERS[i].id) ? 1 : 0,
    edge: on ? 0.95 : 0.18,
  };
}

/** 0 · Hero and 6 · Contact: the assembled core. */
function core(i: number, c: Ctx, e = 0.1): Block {
  return i < LAYER_BLOCKS ? slab(i, Math.max(-0.07, e + c.boost), []) : HIDDEN();
}

/** 1 · About: the layers stand up as a fanned set of profile cards; interests orbit them. */
function about(i: number, c: Ctx): Block {
  if (i < LAYER_BLOCKS) {
    const k = i - 2;
    return { p: [k * 0.34, 0.05 - Math.abs(k) * 0.04, -Math.abs(k) * 0.18], s: [0.95, 1.45, 0.035], r: [0, k * 0.22, k * -0.04], lit: k === 0 ? 1 : 0, edge: k === 0 ? 0.95 : 0.5 };
  }
  const u = i - LAYER_BLOCKS;
  const tags = profile.interestTags;
  if (u >= tags.length) return HIDDEN();
  const a = (u / tags.length) * Math.PI * 2 + c.time * 0.12;
  const x = Math.cos(a) * 1.15;
  const z = Math.sin(a) * 0.7;
  return { p: [x, (u % 2 ? 0.45 : -0.45) + Math.sin(c.time * 0.6 + u) * 0.05, z], s: [0.14, 0.14, 0.14], r: [c.time * 0.4 + u, c.time * 0.3, 0], lit: 1, edge: 0.95, label: tags[u], la: [x > 0 ? 0.14 : -0.14, 0, 0], align: x > 0 ? "right" : "left" };
}

/** 2 · Systems: a server rack. One unit per system, in Lab order; the hovered one slides out. */
const RACK_U = 0.19;
const RACK_GAP = 0.06;
const RACK_H = systems.length * (RACK_U + RACK_GAP) - RACK_GAP;
function rack(i: number, c: Ctx): Block {
  const w = 1.7, d = 1.05;
  if (i < LAYER_BLOCKS) {
    // Frame: top and bottom plates, two posts.
    if (i === 0) return { p: [0, RACK_H / 2 + 0.08, 0], s: [w + 0.2, 0.05, d + 0.1], r: [0, 0, 0], lit: 0, edge: 0.6 };
    if (i === 4) return { p: [0, -RACK_H / 2 - 0.08, 0], s: [w + 0.2, 0.05, d + 0.1], r: [0, 0, 0], lit: 0, edge: 0.6 };
    if (i === 1) return { p: [-(w / 2 + 0.07), 0, 0], s: [0.05, RACK_H + 0.2, d + 0.1], r: [0, 0, 0], lit: 0, edge: 0.6 };
    if (i === 2) return { p: [w / 2 + 0.07, 0, 0], s: [0.05, RACK_H + 0.2, d + 0.1], r: [0, 0, 0], lit: 0, edge: 0.6 };
    return HIDDEN();
  }
  const u = i - LAYER_BLOCKS;
  const sys = systems[u];
  if (!sys) return HIDDEN();
  const hot = c.system === sys.slug;
  const any = c.system !== null;
  return {
    p: [0, RACK_H / 2 - RACK_U / 2 - u * (RACK_U + RACK_GAP), hot ? 0.55 : 0],
    s: [w, RACK_U, d],
    r: [0, 0, 0],
    lit: hot ? 1 : 0,
    edge: !any || hot ? 0.95 : 0.3,
    label: sys.name,
    la: [-w / 2 - 0.16, 0, d / 2],
    align: "left",
  };
}

/** 3 · Architecture: the layers explode and the selected system's components sit on their layers. */
function architecture(i: number, c: Ctx): Block {
  if (i < LAYER_BLOCKS) {
    const b = slab(i, 1, c.focus);
    return { ...b, label: `L${i + 1}  ${LAYERS[i].label}`, la: [-SIZES[i].w / 2 - 0.16, 0, SIZES[i].d / 2], align: "left" };
  }
  const nodes = archNodes(c.arch);
  const n = nodes[i - LAYER_BLOCKS];
  if (!n) return HIDDEN();
  const L = LAYERS.findIndex((l) => l.id === n.layer);
  return { p: nodePos(n.x, n.y, L), s: [0.17, 0.17, 0.17], r: [0, 0, 0], lit: 1, edge: 0.95 };
}

export const archNodes = (slug: string | null) => (featuredSystems.find((s) => s.slug === slug) ?? featuredSystems[0]).architecture!.nodes;
export const archEdges = (slug: string | null) => (featuredSystems.find((s) => s.slug === slug) ?? featuredSystems[0]).architecture!.edges;
function nodePos(x: number, y: number, layer: number): [number, number, number] {
  return [(x - 1.5) * 0.46, slabY(layer, 1) + THICK / 2 + 0.1, (y - 1) * 0.34];
}

/** 4 · Timeline: one bar per entry, its length set by its real dates, on a rail of years. */
const T0 = 2020.5;
const T1 = 2027;
const TX = (year: number) => -1.5 + ((year - T0) / (T1 - T0)) * 3;
function timelineForm(i: number, c: Ctx): Block {
  if (i === LAYER_BLOCKS - 1) return { p: [0, -0.95, 0], s: [3.1, 0.02, 0.02], r: [0, 0, 0], lit: 1, edge: 0.95 };
  if (i < LAYER_BLOCKS) {
    // Year ticks for 2021, 2023, 2025 and 2027 reuse the other layer blocks.
    const year = [2021, 2023, 2025, 2027][i];
    return { p: [TX(year), -0.95, 0], s: [0.012, 0.16, 0.012], r: [0, 0, 0], lit: 1, edge: 0.7, label: String(year), la: [0, -0.2, 0], align: "right" };
  }
  const entries = timeline.filter((t) => t.span);
  const t = entries[i - LAYER_BLOCKS];
  if (!t?.span) return HIDDEN();
  const a = TX(t.span[0]);
  const b = TX(t.span[1] ?? c.now);
  const lane = i - LAYER_BLOCKS;
  const len = Math.max(0.08, b - a);
  return {
    p: [a + len / 2, 0.75 - lane * 0.42, 0],
    s: [len, 0.16, 0.22],
    r: [0, 0, 0],
    lit: t.span[1] === null ? 1 : 0,
    edge: 0.95,
    label: t.org,
    la: [-len / 2, 0.2, 0],
    align: "right",
  };
}

/** 5 · Stack: blocks fold away into the core; the constellation takes over. */
function stackForm(i: number): Block {
  if (i < LAYER_BLOCKS) {
    const b = slab(i, 0, []);
    return { ...b, s: [b.s[0] * 0.12, b.s[1] * 0.4, b.s[2] * 0.12], p: [0, b.p[1] * 0.3, 0], edge: 0.6 };
  }
  return HIDDEN();
}

export function formation(f: number, i: number, c: Ctx): Block {
  switch (f) {
    case 0: return core(i, c);
    case 1: return about(i, c);
    case 2: return rack(i, c);
    case 3: return architecture(i, c);
    case 4: return timelineForm(i, c);
    case 5: return stackForm(i);
    default: return core(i, c, 0);
  }
}
