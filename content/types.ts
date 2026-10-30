/** The five layers of the system core. Every system, node and stack item maps onto one of them. */
export type Layer = "interface" | "api" | "automation" | "data" | "infra";

/** Each layer has the colour of its crate in the 3D scene (blue, green, orange, grey, black); shared by the page. */
export const LAYERS: { id: Layer; label: string; short: string; color: string }[] = [
  { id: "interface", label: "Interface", short: "UI", color: "#2b34c4" },
  { id: "api", label: "API", short: "API", color: "#0b6e4b" },
  { id: "automation", label: "Automation & AI", short: "AUTO", color: "#a63f09" },
  { id: "data", label: "Data", short: "DATA", color: "#5a5e88" },
  { id: "infra", label: "Infrastructure", short: "INFRA", color: "#1f2370" },
];

export type Domain = "ai" | "automation" | "api" | "tools" | "apps" | "infra";

export const DOMAINS: { id: Domain; label: string }[] = [
  { id: "ai", label: "AI / ML" },
  { id: "automation", label: "Automation" },
  { id: "api", label: "APIs" },
  { id: "tools", label: "Developer tools" },
  { id: "apps", label: "Apps" },
  { id: "infra", label: "Infrastructure" },
];

export type ArchNode = { id: string; label: string; detail: string; layer: Layer; x: number; y: number };
export type ArchEdge = { from: string; to: string; label?: string; dashed?: boolean };

export type System = {
  slug: string;
  name: string;
  summary: string;
  domains: Domain[];
  stack: string[];
  shipsAs: string;
  /** Internal work has no public page or link. */
  internal?: boolean;
  links?: { label: string; href: string }[];
  logo?: string;
  /** Square logo sticker shown on this system's box in the 3D crate */
  sticker?: string;
  points?: string[];
  architecture?: { caption: string; nodes: ArchNode[]; edges: ArchEdge[] };
};
