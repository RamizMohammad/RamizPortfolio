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
// Systems need two extra units for the crate flaps.
export const UNIT_BLOCKS = Math.max(systems.length + 2, profile.interestTags.length, timeline.length, 6);
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
  /** Edge and label colour; defaults to the layer colour for blocks 0–4 and cyan for units */
  color?: string;
  /** Text shown beside the block, if any */
  label?: string;
  /** Where the label sits relative to the block centre, and which way it reads */
  la?: [number, number, number];
  align?: "left" | "right" | "center";
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

const CYAN = "#2b34c4";
const VIOLET = "#c4262f";
/** Sticker inks, cycled: each unit gets the next one */
const ramp = (i: number) => LAYERS[i % LAYERS.length].color;
export const blockColor = (i: number, b: Block) => b.color ?? (i < LAYER_BLOCKS ? LAYERS[i].color : CYAN);

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
  return { p: [x, (u % 2 ? 0.45 : -0.45) + Math.sin(c.time * 0.6 + u) * 0.05, z], s: [0.14, 0.14, 0.14], r: [c.time * 0.4 + u, c.time * 0.3, 0], lit: 1, edge: 0.95, color: u % 2 ? VIOLET : CYAN, label: tags[u], la: [x > 0 ? 0.14 : -0.14, 0, 0], align: x > 0 ? "right" : "left" };
}

/**
 * 2 · Systems: an open crate. Its walls are the five layers; each system sits inside as a piece of
 * hardware shaped like what it is. The system hovered in the Lab lifts out and turns.
 */
const CRATE = { w: 2.3, d: 1.6, h: 0.82, y: -0.42 };
const TAPE = "#d99a00";
type Kind = "blade" | "phone" | "screen" | "keyboard" | "router" | "usb";
const KIND: Record<string, Kind> = {
  "supplier-invoice-accuracy": "blade",
  "sourcing-agent": "blade",
  "ocr-accuracy-report-pipeline": "blade",
  buddycode: "keyboard",
  linkium: "router",
  "backup-engine": "usb",
  confess: "phone",
  "confess-web": "screen",
  timefold: "screen",
};
const SHAPE: Record<Kind, { s: [number, number, number]; r: [number, number, number] }> = {
  blade: { s: [0.56, 0.1, 0.36], r: [0, 0, 0] },
  phone: { s: [0.24, 0.48, 0.05], r: [-0.25, 0.2, 0] },
  screen: { s: [0.5, 0.34, 0.04], r: [-0.35, -0.1, 0] },
  keyboard: { s: [0.58, 0.06, 0.24], r: [0, 0.15, 0] },
  router: { s: [0.46, 0.1, 0.3], r: [0, -0.2, 0] },
  usb: { s: [0.13, 0.08, 0.42], r: [0, 0.6, 0] },
};
function crate(i: number, c: Ctx): Block {
  const { w, d, h, y } = CRATE;
  const wall = (p: Block["p"], sz: Block["s"]): Block => ({ p, s: sz, r: [0, 0, 0], lit: 0, edge: 0.75 });
  if (i < LAYER_BLOCKS) {
    if (i === 0) return wall([-w / 2, y, 0], [0.05, h, d]);
    if (i === 1) return wall([w / 2, y, 0], [0.05, h, d]);
    if (i === 2) return wall([0, y, -d / 2], [w, h, 0.05]);
    if (i === 3) return wall([0, y - 0.18, d / 2], [w, h - 0.36, 0.05]); // lower front wall lets you see inside
    return wall([0, y - h / 2, 0], [w, 0.05, d]);
  }
  const u = i - LAYER_BLOCKS;
  // Two flaps hinged on the side walls, folded open outwards, edged in tape yellow.
  if (u === systems.length || u === systems.length + 1) {
    const side = u === systems.length ? -1 : 1;
    const theta = 1.05 + Math.sin(c.time * 0.8 + side) * 0.04;
    const L = 0.7;
    return {
      p: [side * (w / 2 + Math.sin(theta) * (L / 2)), y + h / 2 + Math.cos(theta) * (L / 2), 0],
      s: [0.04, L, d],
      r: [0, 0, -side * theta],
      lit: 1,
      edge: 0.9,
      color: TAPE,
    };
  }
  const sys = systems[u];
  if (!sys) return HIDDEN();
  const shape = SHAPE[KIND[sys.slug] ?? "blade"];
  const col = u % 3;
  const row = Math.floor(u / 3);
  const hot = c.system === sys.slug;
  const any = c.system !== null;
  const rest: [number, number, number] = [(col - 1) * 0.7, y - h / 2 + 0.05 + shape.s[1] / 2 + Math.sin(c.time * 1.3 + u) * 0.015, (row - 1) * 0.46];
  return {
    p: hot ? [rest[0] * 0.5, y + h / 2 + 0.75, rest[2] * 0.3 + 0.25] : rest,
    s: hot ? [shape.s[0] * 1.5, shape.s[1] * 1.5, shape.s[2] * 1.5] : shape.s,
    r: hot ? [shape.r[0] * 0.5, c.time * 0.9, 0] : shape.r,
    lit: hot ? 1 : 0,
    color: ramp(u),
    edge: !any || hot ? 0.95 : 0.3,
    label: hot ? sys.name : undefined,
    la: [0, shape.s[1] * 0.75 + 0.18, 0],
    align: "center",
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
  return { p: nodePos(n.x, n.y, L), s: [0.17, 0.17, 0.17], r: [0, 0, 0], lit: 1, edge: 0.95, color: LAYERS[L].color };
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
    color: t.span[1] === null ? CYAN : VIOLET,
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
    case 2: return crate(i, c);
    case 3: return architecture(i, c);
    case 4: return timelineForm(i, c);
    case 5: return stackForm(i);
    default: return core(i, c, 0);
  }
}
