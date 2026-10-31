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

// Ordered newest first.
export const timeline: TimelineEntry[] = [
  {
    period: "Jul 2026 – Present",
    kind: "Work",
    title: "Software Engineer",
    org: "Moglix",
    span: [2026.5, null],
    points: [
      "REST APIs and backend systems, with VLLMs, OCR techniques and predictive LLM models.",
      "Working with the AI and Analytics team to deliver solutions for major clients and for Moglix itself.",
    ],
    tags: ["Python", "REST APIs", "Kafka", "Docker", "AI models"],
  },
  {
    period: "Jan – Jul 2026",
    kind: "Internship",
    title: "Python Engineering Intern",
    org: "Moglix",
    span: [2026, 2026.5],
    points: [
      "Designed and built analytical solutions involving data processing, analysis and programming.",
      "Worked with teams to deliver insights and automate workflows across ongoing projects.",
    ],
    tags: ["Python", "REST APIs", "MySQL", "PostgreSQL", "MongoDB", "Kafka"],
  },
  {
    period: "May – Jun 2025",
    kind: "Internship",
    title: "Software Development Engineer Intern",
    org: "Bluestock Fintech",
    span: [2025.33, 2025.5],
    points: ["Developed the internal admin panel as project lead.", "Designed the backend logic with the team and built the core features."],
    tags: ["Python", "REST APIs", "Flask"],
  },
  {
    period: "2022 – Present",
    kind: "Freelance",
    title: "Android Developer",
    org: "Freelance",
    span: [2022, null],
    points: ["Published Confess on Google Play.", "Firebase integration and real-time features.", "Confess, Share Wheels, BuddyCode."],
    tags: ["Java", "Kotlin", "Jetpack Compose", "Firebase"],
  },
  {
    period: "2022 – 2026",
    kind: "Education",
    title: "B.Tech CSE, AI & ML",
    org: "Sharda University",
    span: [2022.1, 2026],
    points: ["Computer science with a specialisation in AI and machine learning. CGPA 8.3."],
  },
  {
    period: "2021 – Present",
    kind: "Independent",
    title: "Backend and product development",
    org: "Independent",
    span: [2021, null],
    points: ["Backend systems in Python, Flask and FastAPI for web and mobile apps.", "Bakup, Snapy, Linkium, Time Fold, Confess Web."],
    tags: ["Python", "Flask", "FastAPI", "Docker"],
  },
];
