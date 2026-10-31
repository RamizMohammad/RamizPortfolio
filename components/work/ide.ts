import { DOMAINS, LAYERS, type System } from "@/content/types";

/** Colours for each IDE look. Each platform opens in the editor that kind of project is built in. */
export type IdeTheme = {
  bg: string;
  panel: string;
  bar: string;
  border: string;
  text: string;
  muted: string;
  accent: string;
  status: string;
  statusText: string;
  heading: string;
  keyword: string;
  string: string;
  number: string;
};

export const THEMES: Record<"android" | "web" | "desktop" | "service", IdeTheme> = {
  // Darcula-style dark with the Android green
  android: { bg: "#1e1f22", panel: "#2b2d30", bar: "#2b2d30", border: "#3c3f41", text: "#bcbec4", muted: "#6f737a", accent: "#3ddc84", status: "#2b2d30", statusText: "#9da0a8", heading: "#56a8f5", keyword: "#cf8e6d", string: "#6aab73", number: "#2aacb8" },
  // The familiar dark editor with a blue status bar
  web: { bg: "#1e1e1e", panel: "#252526", bar: "#323233", border: "#2d2d2d", text: "#d4d4d4", muted: "#858585", accent: "#3794ff", status: "#007acc", statusText: "#ffffff", heading: "#569cd6", keyword: "#c586c0", string: "#ce9178", number: "#b5cea8" },
  // JetBrains dark with a Python yellow
  // Backend services open in the same editor as web work, with a violet accent
  service: { bg: "#1e1e1e", panel: "#252526", bar: "#323233", border: "#2d2d2d", text: "#d4d4d4", muted: "#858585", accent: "#a78bfa", status: "#6d28d9", statusText: "#ffffff", heading: "#569cd6", keyword: "#c586c0", string: "#ce9178", number: "#b5cea8" },
  desktop: { bg: "#1e1f22", panel: "#27282c", bar: "#2b2d30", border: "#393b40", text: "#bcbec4", muted: "#6f737a", accent: "#f5c84b", status: "#27282c", statusText: "#9da0a8", heading: "#f5c84b", keyword: "#cf8e6d", string: "#6aab73", number: "#2aacb8" },
};

export type IdeFile = { name: string; lang: "md" | "json"; lines: string[] };

const label = (d: string) => DOMAINS.find((x) => x.id === d)?.label ?? d;
const layer = (l: string) => {
  const i = LAYERS.findIndex((x) => x.id === l);
  return `L${i + 1} ${LAYERS[i]?.label ?? l}`;
};

/**
 * The files shown in a project's IDE. They summarise the project from its real content
 * (summary, features, stack, architecture, links); they are not its source code.
 */
export function filesFor(s: System): IdeFile[] {
  const files: IdeFile[] = [
    {
      name: "README.md",
      lang: "md",
      lines: [
        `# ${s.name}`,
        "",
        s.summary,
        "",
        `- **Ships as:** ${s.shipsAs}`,
        `- **Domains:** ${s.domains.map(label).join(", ")}`,
        ...(s.links ?? []).map((l) => `- **Link:** [${l.label}](${l.href})`),
      ],
    },
  ];
  if (s.points?.length) {
    files.push({ name: "FEATURES.md", lang: "md", lines: ["## What it does", "", ...s.points.map((p) => `- ${p}`)] });
  }
  files.push({
    name: "stack.json",
    lang: "json",
    lines: [
      "{",
      `  "project": "${s.slug}",`,
      `  "platform": "${s.platform}",`,
      `  "stack": [`,
      ...s.stack.map((t, i) => `    "${t}"${i < s.stack.length - 1 ? "," : ""}`),
      "  ]",
      "}",
    ],
  });
  if (s.architecture) {
    const byId = Object.fromEntries(s.architecture.nodes.map((n) => [n.id, n.label]));
    files.push({
      name: "ARCHITECTURE.md",
      lang: "md",
      lines: [
        "## Components",
        "",
        ...s.architecture.nodes.map((n) => `- **${n.label}** — ${n.detail} (${layer(n.layer)})`),
        "",
        "## Data flow",
        "",
        ...s.architecture.edges.map((e) => `- ${byId[e.from]} → ${byId[e.to]}${e.label ? ` (${e.label})` : ""}`),
        "",
        `> ${s.architecture.caption}`,
      ],
    });
  }
  return files;
}

export type Token = { t: string; c?: keyof IdeTheme; b?: boolean };

/** A tiny highlighter: just enough Markdown and JSON to read like an editor. */
export function tokenize(line: string, lang: IdeFile["lang"]): Token[] {
  if (lang === "json") {
    const out: Token[] = [];
    const re = /("(?:[^"\\]|\\.)*")(\s*:)?|(-?\d+(?:\.\d+)?)|([{}[\],])/g;
    let last = 0;
    for (let m = re.exec(line); m; m = re.exec(line)) {
      if (m.index > last) out.push({ t: line.slice(last, m.index) });
      if (m[1]) {
        out.push({ t: m[1], c: m[2] ? "heading" : "string" });
        if (m[2]) out.push({ t: m[2] });
      } else if (m[3]) out.push({ t: m[3], c: "number" });
      else out.push({ t: m[4], c: "muted" });
      last = re.lastIndex;
    }
    if (last < line.length) out.push({ t: line.slice(last) });
    return out;
  }
  if (/^#{1,6} /.test(line)) return [{ t: line, c: "heading", b: true }];
  if (line.startsWith("> ")) return [{ t: line, c: "muted" }];
  const out: Token[] = [];
  let rest = line;
  if (rest.startsWith("- ")) {
    out.push({ t: "- ", c: "keyword" });
    rest = rest.slice(2);
  }
  const re = /(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)]+\))|(→)/g;
  let last = 0;
  for (let m = re.exec(rest); m; m = re.exec(rest)) {
    if (m.index > last) out.push({ t: rest.slice(last, m.index) });
    if (m[1]) out.push({ t: m[1], c: "keyword", b: true });
    else if (m[2]) out.push({ t: m[2], c: "string" });
    else out.push({ t: m[3], c: "accent" });
    last = re.lastIndex;
  }
  if (last < rest.length) out.push({ t: rest.slice(last) });
  return out;
}
