/** The five layers every system is built from. Every system, node and stack item maps onto one of them. */
export type Layer = "interface" | "api" | "automation" | "data" | "infra";

/** Top to bottom: L1 is what people touch, L5 what everything runs on. */
export const LAYERS: { id: Layer; label: string }[] = [
  { id: "interface", label: "Interface" },
  { id: "api", label: "API" },
  { id: "automation", label: "Automation & AI" },
  { id: "data", label: "Data" },
  { id: "infra", label: "Infrastructure" },
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
  /** Where it runs; picks the IDE and device a project opens in on the home page. */
  platform: "web" | "android" | "desktop" | "internal";
  /** Internal work has no public page or link. */
  internal?: boolean;
  links?: { label: string; href: string }[];
  logo?: string;
  /** Screenshot of the live product; "phone" screenshots are wide strips of app screens. */
  screen?: { src: string; width: number; height: number; kind: "web" | "phone" };
  points?: string[];
  architecture?: { caption: string; nodes: ArchNode[]; edges: ArchEdge[] };
};
