/**
 * Publications: papers, patents and articles. Add a paper by adding an entry here; the
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

export const publications: Publication[] = [
  {
    kind: "Patent",
    title: "Method and System for Real-Time User Safety During Vehicle Commutes",
    venue: "Indian Patent Office · Published patent application",
    date: "27 June 2025",
    year: 2025,
    id: { label: "Application No.", value: "202511053637" },
    abstract:
      "A system for enhancing passenger safety during vehicle commutes, focusing on real-time safety monitoring, risk identification, and proactive intervention to address potential threats.",
    image: { src: "/images/certificates/patent.webp", width: 1000, height: 773, alt: "First page of the published patent application" },
    tags: ["Safety", "Real-time monitoring", "Risk detection"],
  },
];
