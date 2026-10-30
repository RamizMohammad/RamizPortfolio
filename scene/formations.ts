import { featuredSystems, systems } from "@/content/systems";
import { timeline } from "@/content/timeline";
import { LAYERS, type Layer } from "@/content/types";

/**
 * The scene is a cast of real objects (NVIDIA SimReady models, see public/models/CREDITS.md).
 * Each section arranges the same cast into its own scene; between sections the objects fly from
 * one arrangement to the next. Units are metres, Y up; the cast root is scaled up to scene size.
 */

export type ModelId =
  | "open-box" | "box" | "long-box" | "parcel" | "cube-box" | "keyboard" | "monitor" | "tower" | "mouse"
  | "mug" | "desk" | "book" | "crate-blue" | "crate-green" | "crate-orange" | "crate-gray" | "crate-black";

export const MODELS: ModelId[] = [
  "open-box", "box", "long-box", "parcel", "cube-box", "keyboard", "monitor", "tower", "mouse",
  "mug", "desk", "book", "crate-blue", "crate-green", "crate-orange", "crate-gray", "crate-black",
];

/** Each layer is one coloured crate, in layer order. */
const CRATE_OF: Record<Layer, ModelId> = {
  interface: "crate-blue",
  api: "crate-green",
  automation: "crate-orange",
  data: "crate-gray",
  infra: "crate-black",
};

type Actor = { key: string; model: ModelId | null; sticker?: string };

/** The cast. Every formation looks actors up by key; actors a formation doesn't use shrink away. */
export const ACTORS: Actor[] = [
  { key: "openBox", model: "open-box" },
  { key: "box", model: "box" },
  { key: "tower1", model: "tower" },
  { key: "tower2", model: "tower" },
  { key: "tower3", model: "tower" },
  { key: "monitor1", model: "monitor" },
  { key: "monitor2", model: "monitor" },
  { key: "keyboard", model: "keyboard" },
  { key: "mouse", model: "mouse" },
  { key: "mug", model: "mug" },
  { key: "cubeBox", model: "cube-box" },
  { key: "book", model: "book" },
  { key: "desk", model: "desk" },
  ...LAYERS.map((l) => ({ key: `crate-${l.id}`, model: CRATE_OF[l.id] })),
  ...[0, 1, 2, 3].map((i) => ({ key: `long${i}`, model: "long-box" as ModelId })),
  ...[0, 1, 2, 3, 4].map((i) => ({ key: `node${i}`, model: "parcel" as ModelId })),
  // One product box per system, wearing its real logo
  ...systems.map((s) => ({ key: `prod-${s.slug}`, model: "cube-box" as ModelId, sticker: s.sticker })),
  // Label-only anchors (no model): timeline years
  ...[0, 1, 2, 3].map((i) => ({ key: `tick${i}`, model: null })),
];
export const FORMATIONS = 7; // one per beat, in BEAT_ORDER

export type Place = {
  p: [number, number, number];
  r: [number, number, number];
  /** Per-axis scale on the model's real size */
  s: [number, number, number];
  /** 1 normal → lower values fade the object back */
  dim: number;
  label?: string;
  la?: [number, number, number];
  align?: "left" | "right" | "center";
  color?: string;
};

export type Ctx = {
  time: number;
  focus: Layer[];
  system: string | null;
  arch: string | null;
  /** Domain the Systems list is filtered by */
  filter: string;
  now: number;
  /** Hero hover and click lift, in metres */
  boost: number;
};

export const HIDDEN: Place = { p: [0, 0, 0], r: [0, 0, 0], s: [0.0001, 0.0001, 0.0001], dim: 1 };
const at = (p: Place["p"], r: Place["r"] = [0, 0, 0], s: number | Place["s"] = 1, extra: Partial<Place> = {}): Place => ({
  p,
  r,
  s: typeof s === "number" ? [s, s, s] : s,
  dim: 1,
  ...extra,
});

/* ---------- 0 · Hero: an open box, things popping out of it ---------- */
function hero(key: string, c: Ctx): Place | null {
  const lift = c.boost;
  const bob = (k: number) => Math.sin(c.time * 1.1 + k) * 0.008;
  switch (key) {
    case "openBox": return at([0, -0.16, 0], [0, 0.25, 0], 1.15);
    case "monitor1": return at([-0.02, -0.03 + lift * 1.2 + bob(1), -0.05], [-0.12, 0.35, 0.05], 0.72);
    case "keyboard": return at([0.13, 0.12 + lift * 0.9 + bob(2), 0.16], [-0.9, 0.45, 0.28], 0.8);
    case "mug": return at([0.5, -0.16 + lift * 0.25, 0.22], [0, -0.6, 0], 1.1);
    case "mouse": return at([-0.47, -0.16, 0.24], [0, 0.6, 0], 0.7);
    default: return null;
  }
}

/* ---------- 1 · About: my desk ---------- */
function about(key: string): Place | null {
  const top = -0.2 + 0.76; // desk top height, desk standing on y = -0.2
  switch (key) {
    case "desk": return at([0, -0.2, 0], [0, Math.PI / 2, 0], [1, 1, 0.8]);
    case "monitor1": return at([0.05, top, -0.17], [0, 0.1, 0], 0.95);
    case "keyboard": return at([0.05, top + 0.005, 0.1], [0, 0.05, 0], 1);
    case "mouse": return at([0.38, top, 0.1], [0, 0.05, 0], 0.8);
    case "mug": return at([-0.42, top, 0.04], [0, 0.7, 0], 1);
    case "book": return at([-0.5, top, -0.12], [0, 0.35, 0], 0.9);
    case "tower1": return at([0.66, -0.2, 0.02], [0, Math.PI / 2, 0], 0.9);
    default: return null;
  }
}

/* ---------- 2 · Systems: unboxing; each project is a box with its real logo ---------- */
// Boxes sit in list order: first row of the list at the back left, last at the front right,
// so the crate reads like the table next to it. Filtered-out systems sink back.
const CRATE_S = 2.1; // the open box at crate size: 1.3 m wide
function crateScene(key: string, c: Ctx): Place | null {
  if (key === "openBox") return at([0, -0.35, 0], [0, 0, 0], CRATE_S);
  if (!key.startsWith("prod-")) return null;
  const u = systems.findIndex((s) => `prod-${s.slug}` === key);
  const sys = systems[u];
  const col = u % 3;
  const row = Math.floor(u / 3);
  const floor = -0.35 + 0.02;
  if (c.system === sys.slug) {
    // Lifted out, facing the viewer, swaying so the logo stays readable.
    return at([0, 0.5 + Math.sin(c.time * 2) * 0.02, 0.2], [0.15, Math.sin(c.time * 1.4) * 0.5, 0], 2.9, {
      label: sys.name, la: [0, 0.4, 0], align: "center",
    });
  }
  const inFilter = c.filter === "all" || sys.domains.includes(c.filter as (typeof sys.domains)[number]);
  const tilt = ((u * 7) % 5 - 2) * 0.06; // a little untidy, like a real packed crate
  return at([(col - 1) * 0.36, floor - (inFilter ? 0 : 0.06), (row - 1) * 0.3], [0, tilt, 0], inFilter ? 2.3 : 1.8, {
    dim: c.system ? 0.4 : inFilter ? 1 : 0.3,
  });
}

/* ---------- 3 · Architecture: the five layers as coloured crates, components inside ---------- */
const LAYER_GAP = 0.36;
const crateY = (i: number) => (LAYERS.length / 2 - i - 0.5) * LAYER_GAP - 0.08;
export const archNodes = (slug: string | null) => (featuredSystems.find((s) => s.slug === slug) ?? featuredSystems[0]).architecture!.nodes;
export const archEdges = (slug: string | null) => (featuredSystems.find((s) => s.slug === slug) ?? featuredSystems[0]).architecture!.edges;
export function nodePos(x: number, y: number, layer: number): [number, number, number] {
  return [(x - 1.5) * 0.15, crateY(layer) + 0.03, (y - 1) * 0.11];
}
function architecture(key: string, c: Ctx): Place | null {
  const li = LAYERS.findIndex((l) => `crate-${l.id}` === key);
  if (li >= 0) {
    const on = c.focus.length === 0 || c.focus.includes(LAYERS[li].id);
    return at([0, crateY(li), 0], [0, 0, 0], 1, {
      dim: on ? 1 : 0.28, label: `L${li + 1}  ${LAYERS[li].label}`, la: [-0.34, 0.08, 0.2], align: "left", color: LAYERS[li].color,
    });
  }
  const m = /^node(\d)$/.exec(key);
  if (m) {
    const n = archNodes(c.arch)[Number(m[1])];
    if (!n) return null;
    const L = LAYERS.findIndex((l) => l.id === n.layer);
    return at(nodePos(n.x, n.y, L), [0, 0.3 * (Number(m[1]) % 2 ? 1 : -1), 0], 1.05);
  }
  return null;
}

/* ---------- 4 · Timeline: long boxes stacked like stairs, each spanning its real dates ---------- */
const T0 = 2020.5;
const T1 = 2027;
const SPAN = 1.6;
const TX = (year: number) => -SPAN / 2 + ((year - T0) / (T1 - T0)) * SPAN;
const LONG = 0.16; // native length of the long box (its z axis)
function timelineScene(key: string, c: Ctx): Place | null {
  const entries = timeline.filter((t) => t.span);
  const m = /^long(\d)$/.exec(key);
  if (m) {
    const t = entries[Number(m[1])];
    if (!t?.span) return null;
    const a = TX(t.span[0]);
    const b = TX(t.span[1] ?? c.now);
    const len = Math.max(0.05, b - a);
    const lane = entries.length - 1 - Number(m[1]); // oldest at the bottom
    // Rotated so its length runs along x; the scale stretches the real box to its duration.
    return at([a + len / 2, -0.32 + lane * 0.13, 0], [0, Math.PI / 2, 0], [1.4, 1.5, len / LONG], {
      label: t.org, la: [-len / 2, 0.16, 0], align: "right", color: t.span[1] === null ? "#2b34c4" : "#c4262f",
    });
  }
  const tk = /^tick(\d)$/.exec(key);
  if (tk) {
    const year = [2021, 2023, 2025, 2027][Number(tk[1])];
    return at([TX(year), -0.36, 0.12], [0, 0, 0], 1, { label: String(year), la: [0, -0.05, 0], align: "center" });
  }
  if (key === "book") {
    const edu = timeline.find((t) => t.kind === "Education");
    return at([-SPAN / 2 - 0.12, -0.32, 0.12], [0, 0.4, 0], 0.8, edu ? { label: edu.title, la: [0, 0.14, 0], align: "center" } : {});
  }
  return null;
}

/* ---------- 5 · Stack: the crates as a shelf, one per layer ---------- */
function stackScene(key: string): Place | null {
  const li = LAYERS.findIndex((l) => `crate-${l.id}` === key);
  if (li < 0) return null;
  // Three on the floor, two on top, like a stacked shelf.
  const slots: [number, number][] = [[-0.64, 0], [0, 0], [0.64, 0], [-0.32, 1], [0.32, 1]];
  const [x, level] = slots[li];
  const h = level === 0 ? -0.36 : -0.36 + 0.26;
  return at([x, h, 0], [0, (li - 2) * 0.05, 0], 1, {
    label: `L${li + 1}  ${LAYERS[li].label}`, la: [0, 0.32, 0.22], align: "center", color: LAYERS[li].color,
  });
}

/* ---------- 6 · Contact: a taped box, ready to ship ---------- */
function contact(key: string, c: Ctx): Place | null {
  switch (key) {
    case "box": return at([0, -0.3 + c.boost * 0.2, 0], [0, -0.35, 0], 1);
    case "mug": return at([0.55, -0.3, 0.2], [0, 0.9, 0], 1.1);
    default: return null;
  }
}

export function place(f: number, key: string, c: Ctx): Place {
  let p: Place | null = null;
  switch (f) {
    case 0: p = hero(key, c); break;
    case 1: p = about(key); break;
    case 2: p = crateScene(key, c); break;
    case 3: p = architecture(key, c); break;
    case 4: p = timelineScene(key, c); break;
    case 5: p = stackScene(key); break;
    default: p = contact(key, c);
  }
  return p ?? HIDDEN;
}
