import data from "./data.json";

/** Companies I founded or run. Add one by adding a row to portfolio.companies (see db/README.md). */
export type Company = {
  name: string;
  tagline: string;
  about: string;
  /** My role, e.g. "Founder". */
  role: string;
  /** As shown, e.g. "June 2026". */
  since?: string;
  /** The company's website. */
  url: string;
  /** The flat colour block the card sits on. */
  tone: "pink" | "lime" | "blue" | "sun" | "violet" | "mint";
  logo?: { src: string; width: number; height: number; alt: string };
  /** Social pages, in display order. */
  links: { label: string; href: string }[];
};

// Rows of portfolio.companies, pulled from the database at build time (see db/README.md).
export const companies = ((data as { companies?: Company[] }).companies ?? []) as Company[];
