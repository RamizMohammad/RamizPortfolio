import data from "./data.json";
import type { Layer } from "./types";

// Rows of portfolio.stack_items, grouped by layer; pulled from the database at build time (see db/README.md).
export const stack = data.stack as Record<Layer, string[]>;
