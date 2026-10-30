import type { Layer } from "@/content/types";

/** Pose of the 3D scene. GSAP writes the target; the scene eases towards it every frame. */
export type Pose = {
  /**
   * Which formation the blocks are in, as a position along BEAT_ORDER.
   * Fractions blend two neighbouring formations, so blocks fly between them while scrolling.
   */
  form: number;
  /** Horizontal offset as a fraction of half the viewport width */
  x: number;
  y: number;
  rotY: number;
  rotX: number;
  scale: number;
  /** Overall visibility, lowered behind dense text */
  opacity: number;
};

export const BEAT_ORDER = ["hero", "about", "systems", "architecture", "timeline", "stack", "contact"] as const;
export type BeatId = (typeof BEAT_ORDER)[number];

const form = (id: BeatId) => BEAT_ORDER.indexOf(id);

export const BEATS: Record<BeatId, Pose> = {
  hero: { form: form("hero"), x: 0, y: -0.1, rotY: -0.6, rotX: 0.12, scale: 0.72, opacity: 1 },
  about: { form: form("about"), x: -0.5, y: 0.02, rotY: 0.25, rotX: 0.05, scale: 0.5, opacity: 1 },
  systems: { form: form("systems"), x: 0, y: -0.08, rotY: -0.3, rotX: 0.58, scale: 0.62, opacity: 1 },
  architecture: { form: form("architecture"), x: -0.5, y: 0.04, rotY: 0.35, rotX: 0.12, scale: 0.5, opacity: 1 },
  timeline: { form: form("timeline"), x: -0.48, y: 0.0, rotY: 0.18, rotX: 0.16, scale: 0.46, opacity: 1 },
  stack: { form: form("stack"), x: 0, y: 0.05, rotY: -0.6, rotX: 0.15, scale: 0.62, opacity: 1 },
  contact: { form: form("contact"), x: 0, y: -0.22, rotY: -0.7, rotX: 0.1, scale: 0.45, opacity: 1 },
};

/**
 * Moves inside a beat that keep the same formation: once the Systems list scrolls in, the crate
 * slides right so pieces lifted by hovering a row stay in view beside it.
 */
export const SUB_BEATS: Partial<Record<BeatId, { id: string; pose: Partial<Pose> }>> = {
  systems: { id: "systems-list", pose: { x: 0.58, y: 0.0, rotY: -0.5, scale: 0.45 } },
};

export const target: Pose = { ...BEATS.hero };

/** Interface → scene signals. Sections write these; the scene reads them every frame. */
export const signals = {
  /** Core layers to light up */
  focus: [] as Layer[],
  /** Slug of the system hovered in the Systems Lab */
  system: null as string | null,
  /** Slug of the system selected in the Architecture tabs */
  arch: null as string | null,
  pointer: { x: 0, y: 0 },
  /** True while a mouse is over the page; touch never drives hover effects */
  pointerActive: false,
  /** Entrance progress: 0 blocks scattered → 1 assembled. Stays 1 when there is no intro. */
  intro: 1,
  /** Set when the intro lands, so the scan line sweeps right then */
  landed: false,
  /** Hero interaction: horizontal drag in pixels since the last frame, drag state, pending clicks */
  dragDelta: 0,
  dragging: false,
  bursts: 0,
};

type Listener = () => void;
const listeners = new Set<Listener>();

/** Notify the scene that something changed (needed when it renders on demand). */
export function emit() {
  listeners.forEach((l) => l());
}
export function subscribe(l: Listener) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function setFocus(layers: Layer[]) {
  signals.focus = layers;
  emit();
}
export function setSystem(slug: string | null) {
  signals.system = slug;
  emit();
}
export function setArch(slug: string | null) {
  signals.arch = slug;
  emit();
}
