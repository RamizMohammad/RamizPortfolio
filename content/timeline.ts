import data from "./data.json";

export type TimelineEntry = {
  period: string;
  kind: "Work" | "Internship" | "Freelance" | "Independent" | "Education";
  title: string;
  org: string;
  points: string[];
  tags?: string[];
  /** Start and end as decimal years, used to size the 3D timeline bars. End null means ongoing. */
  span?: [number, number | null];
};

// Rows of portfolio.timeline, pulled from the database at build time (see db/README.md).
export const timeline = data.timeline as TimelineEntry[];
