export type TimelineEntry = {
  period: string;
  kind: "Work" | "Internship" | "Freelance" | "Independent" | "Education";
  title: string;
  org: string;
  points: string[];
  tags?: string[];
};

// Ordered newest first. Education details (institution, years) are not yet supplied.
export const timeline: TimelineEntry[] = [
  {
    period: "Jan 2026 – Present",
    kind: "Work",
    title: "Software Engineer",
    org: "Moglix",
    points: [
      "Python backend development, backend APIs and integrations.",
      "Analysing operational reports and solving the problems they show through code.",
      "Agentic AI support system and chatbot development.",
      "Supplier Invoice Accuracy, Sourcing Agent, OCR Accuracy Report Pipeline.",
    ],
    tags: ["Python", "FastAPI", "Vertex AI", "OCR"],
  },
  {
    period: "May – Jun 2025",
    kind: "Internship",
    title: "Software Development Engineer",
    org: "Bluestock Fintech",
    points: ["Led the team as project lead.", "Built the complete admin panel and its frontend architecture."],
    tags: ["Flask", "Python"],
  },
  {
    period: "2022 – Present",
    kind: "Freelance",
    title: "Android Developer",
    org: "Freelance",
    points: ["Published Confess on Google Play.", "Firebase integration and real-time features.", "Confess, Share Wheels, BuddyCode."],
    tags: ["Java", "Kotlin", "Firebase"],
  },
  {
    period: "2021 – Present",
    kind: "Independent",
    title: "Backend and product development",
    org: "Independent",
    points: ["Backend systems in Python, Flask and FastAPI for web and mobile apps.", "Linkium, Backup Engine, Time Fold, Confess Web."],
    tags: ["Python", "Flask", "FastAPI"],
  },
  {
    period: "",
    kind: "Education",
    title: "Computer Science",
    org: "Undergraduate studies",
    points: ["Computer science, alongside building and shipping products."],
  },
];
