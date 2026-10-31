import data from "./data.json";

/**
 * Publications: papers, patents and articles. Add a paper by adding a row to portfolio.publications; the
 * Publications section, its counts and its citations all come from this list (newest first).
 */
export type Publication = {
  kind: "Journal paper" | "Conference paper" | "Preprint" | "Patent" | "Article";
  title: string;
  /** In citation order, exactly as published. Leave out if unknown. */
  authors?: string[];
  /** Journal, conference, office or site. */
  venue: string;
  /** As shown on the card, e.g. "27 June 2025". */
  date: string;
  year: number;
  /** DOI, arXiv ID or application number. */
  id?: { label: string; value: string };
  abstract: string;
  /** Read the publication (DOI page, PDF, arXiv). */
  href?: string;
  /** First page or a figure, shown as the paper's thumbnail. */
  image?: { src: string; width: number; height: number; alt: string };
  tags?: string[];
};

// Rows of portfolio.publications, pulled from the database at build time (see db/README.md).
export const publications = data.publications as Publication[];
