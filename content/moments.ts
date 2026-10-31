import data from "./data.json";

/**
 * The photo timeline after About. Add a moment by dropping an image in public/images/moments/
 * and adding a row to portfolio.moments; they are shown oldest first, sorted by `when`.
 *
 * The first entries use the certificates already on the site, so every moment is real. Replace
 * them with your own photos from each place whenever you like.
 */
export type Moment = {
  /** Sort key: a decimal year, e.g. 2025.5 for mid-2025. Only used for ordering. */
  when: number;
  /** What the card shows as the date, e.g. "June 2025" or just "2024". */
  date: string;
  place: string;
  title: string;
  caption?: string;
  image: { src: string; width: number; height: number; alt: string };
  /** "contain" shows the whole image on white (documents, certificates); "cover" fills the frame (photos). */
  fit?: "cover" | "contain";
};

// Rows of portfolio.moments, pulled from the database at build time (see db/README.md).
export const moments = data.moments as Moment[];
