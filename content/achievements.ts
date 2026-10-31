import data from "./data.json";

export type Achievement = {
  kind: "Award" | "Patent" | "Hackathon" | "Competition" | "Certification" | "Internship";
  title: string;
  org: string;
  year: string;
  status: string;
  detail?: string;
  image?: { src: string; width: number; height: number; alt: string };
};

// Rows of portfolio.achievements, pulled from the database at build time (see db/README.md).
export const achievements = data.achievements as Achievement[];
