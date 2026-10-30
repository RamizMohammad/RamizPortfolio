/** The five layers of the system core. Every system, node and stack item maps onto one of them. */
export type Layer = "interface" | "api" | "automation" | "data" | "infra";

/** Each layer has its own colour on a cyan → violet ramp, shared by the page and the 3D scene. */
export const LAYERS: { id: Layer; label: string; short: string; color: string }[] = [
  { id: "interface", label: "Interface", short: "UI", color: "#3be8ff" },
  { id: "api", label: "API", short: "API", color: "#5ccbff" },
  { id: "automation", label: "Automation & AI", short: "AUTO", color: "#7eadff" },
  { id: "data", label: "Data", short: "DATA", color: "#9a98ff" },
  { id: "infra", label: "Infrastructure", short: "INFRA", color: "#b38bff" },
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
  points?: string[];
  architecture?: { caption: string; nodes: ArchNode[]; edges: ArchEdge[] };
};
