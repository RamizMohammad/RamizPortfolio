import type { Layer } from "@/content/types";

/** Where the camera is. GSAP writes the target; the camera eases towards it every frame. */
export type Pose = {
  /** Which place the camera is at, as a position along BEAT_ORDER. Fractions are mid-flight between two places. */
  form: number;
};

export const BEAT_ORDER = ["hero", "about", "systems", "architecture", "timeline", "stack", "contact"] as const;
export type BeatId = (typeof BEAT_ORDER)[number];

export const BEATS = Object.fromEntries(BEAT_ORDER.map((id, i) => [id, { form: i }])) as Record<BeatId, Pose>;

/** street: how far along the Systems street the camera has walked, 0 (first kiosk) to 1 (Moglix). */
export const target: Pose & { street: number } = { ...BEATS.hero, street: 0.5 };

/** Interface → scene signals. Sections write these; the scene reads them every frame. */
export const signals = {
  /** Core layers to light up */
  focus: [] as Layer[],
  /** Slug of the system hovered in the Systems Lab */
  system: null as string | null,
  /** Domain the Systems Lab list is filtered by ("all" shows everything) */
  filter: "all" as string,
  /** Slug of the system selected in the Architecture tabs */
  arch: null as string | null,
  pointer: { x: 0, y: 0 },
  /** True while a mouse is over the page; touch never drives hover effects */
  pointerActive: false,
  /** Entrance progress: 0 blocks scattered → 1 assembled. Stays 1 when there is no intro. */
  intro: 1,
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
export function setSystemFilter(domain: string) {
  signals.filter = domain;
  emit();
}
export function setArch(slug: string | null) {
  signals.arch = slug;
  emit();
}
