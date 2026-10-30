/**
 * DRAFT taglines, written for Mohammad to approve, edit or delete before this ships.
 * Facts behind them: Python and automation focus (profile), independent work since 2021 (timeline).
 */
export const taglines = {
  hero: ["Automates the boring parts.", "Ships the rest."],
  heroAside: "Powered by Python and late-night commits",
  about: "The person behind the commits",
  systems: ["Handle with care:", "contains production code"],
  architecture: "Five layers, zero magic",
  timeline: "git log --oneline",
  stack: "Tools of the trade",
  contact: ["Ping me.", "I reply faster than CI."],
  resume: "Turning manual work into scripts since 2021",
  /** Chapter openers, one per numbered section */
  chapters: {
    systems: "let’s open the crate first.",
    architecture: "now, how it all fits.",
    timeline: "how I got here.",
    stack: "what’s in the toolbox.",
  },
} as const;
