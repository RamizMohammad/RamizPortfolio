export type Tier = "high" | "low" | "off";

/** Picks how much 3D this device gets. "off" means a still poster instead of WebGL. */
export function detectTier(): Tier {
  if (typeof window === "undefined") return "off";
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  if (nav.connection?.saveData) return "off";
  try {
    const c = document.createElement("canvas");
    if (!(c.getContext("webgl2") || c.getContext("webgl"))) return "off";
  } catch {
    return "off";
  }
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.innerWidth < 768;
  const weak = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
  return coarse || narrow || weak ? "low" : "high";
}

export const TIER_SETTINGS = {
  high: { dpr: [1, 2] as [number, number], packets: 28, shadows: true, environment: true, labels: true },
  low: { dpr: [1, 1.5] as [number, number], packets: 10, shadows: false, environment: false, labels: false },
} as const;
