import data from "./github.json";

/** One day on the contribution calendar. level is GitHub's own 0–4 shade. */
export type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
export type Commit = { repo: string; message: string; sha: string; url: string; date: string };

export type GitHubActivity = {
  user: string;
  /** When scripts/pull-github.mjs last ran; null until it has. */
  pulledAt: string | null;
  /** Total contributions over the calendar below (the last year). */
  total: number;
  /** Whole weeks, Sunday first, oldest first: GitHub's own layout. */
  weeks: Day[][];
  commits: Commit[];
};

// Written by scripts/pull-github.mjs before each build; the committed copy is the fallback.
export const github = data as GitHubActivity;
export const hasActivity = github.weeks.length > 0;
