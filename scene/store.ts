import type { Layer } from "@/content/types";

/** Pose of the system core. GSAP writes the target; the scene eases towards it every frame. */
export type Pose = {
  /** 0 assembled → 1 fully exploded */
  explode: number;
  /** Horizontal offset as a fraction of half the viewport width */
  x: number;
  y: number;
  rotY: number;
  rotX: number;
  scale: number;
  /** 0 slabs → 1 constellation of stack items */
  constellation: number;
  /** Overall visibility, lowered behind dense text */
  opacity: number;
};

export const BEATS = {
  hero: { explode: 0.1, x: 0.56, y: 0, rotY: -0.6, rotX: 0, scale: 1, constellation: 0, opacity: 1 },
  systems: { explode: 0.38, x: 0.8, y: 0.12, rotY: -0.95, rotX: 0.05, scale: 0.6, constellation: 0, opacity: 0.14 },
  architecture: { explode: 1, x: 0.52, y: 0, rotY: -0.3, rotX: 0.12, scale: 0.85, constellation: 0, opacity: 1 },
  timeline: { explode: 0.15, x: 0.8, y: -0.1, rotY: -1.2, rotX: 0, scale: 0.55, constellation: 0, opacity: 0.25 },
  stack: { explode: 0.2, x: 0.46, y: 0.02, rotY: -0.6, rotX: 0.15, scale: 0.85, constellation: 1, opacity: 1 },
  contact: { explode: 0, x: 0.5, y: 0, rotY: -0.7, rotX: 0, scale: 1, constellation: 0, opacity: 1 },
} satisfies Record<string, Pose>;

export type BeatId = keyof typeof BEATS;
export const BEAT_ORDER: BeatId[] = ["hero", "systems", "architecture", "timeline", "stack", "contact"];

export const target: Pose = { ...BEATS.hero };

/** Interface → scene signals: which layers to light up, and the pointer position. */
export const signals = {
  focus: [] as Layer[],
  pointer: { x: 0, y: 0 },
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
