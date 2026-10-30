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
  hero: { form: form("hero"), x: 0.56, y: 0, rotY: -0.6, rotX: 0, scale: 1, opacity: 1 },
  about: { form: form("about"), x: 0.5, y: 0, rotY: -0.25, rotX: 0.05, scale: 0.95, opacity: 1 },
  systems: { form: form("systems"), x: 0.64, y: 0, rotY: -0.5, rotX: 0.08, scale: 0.85, opacity: 1 },
  architecture: { form: form("architecture"), x: 0.52, y: 0, rotY: -0.3, rotX: 0.12, scale: 0.85, opacity: 1 },
  timeline: { form: form("timeline"), x: 0.6, y: 0, rotY: -0.18, rotX: 0.16, scale: 0.78, opacity: 1 },
  stack: { form: form("stack"), x: 0.46, y: 0.02, rotY: -0.6, rotX: 0.15, scale: 0.85, opacity: 1 },
  contact: { form: form("contact"), x: 0.5, y: 0, rotY: -0.7, rotX: 0, scale: 1, opacity: 1 },
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
