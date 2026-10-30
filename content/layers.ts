import type { Domain, Layer } from "./types";

/** Which core layers light up when a domain is in focus. */
export const DOMAIN_LAYERS: Record<Domain, Layer[]> = {
  ai: ["automation"],
  automation: ["automation"],
  api: ["api"],
  tools: ["interface", "api"],
  apps: ["interface", "data"],
  infra: ["infra"],
};
