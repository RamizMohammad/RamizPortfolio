import data from "./data.json";
import type { System } from "./types";

// Rows of portfolio.systems, pulled from the database at build time (see db/README.md).
export const systems = data.systems as System[];

export const publicSystems = systems.filter((s) => !s.internal);
export const featuredSystems = systems.filter((s) => s.architecture);
export const getSystem = (slug: string) => publicSystems.find((s) => s.slug === slug);
