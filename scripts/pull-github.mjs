// Pulls a year of GitHub activity into content/github.json, which the Activity section is built
// from. Runs before every build (npm "prebuild"), after the content pull.
//
//   GITHUB_USER    whose activity to show (default RamizMohammad)
//   GITHUB_TOKEN   optional. With it, the calendar comes from the GraphQL API; without it, the
//                  public contributions page is read.
//
// Only public activity is shown. If GitHub can't be reached, the committed snapshot is kept, so the
// site always builds.
import { writeFileSync } from "node:fs";

const USER = process.env.GITHUB_USER || "RamizMohammad";
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const FILE = new URL("../content/github.json", import.meta.url);

const headers = { "User-Agent": "mohammadramiz.in build", Accept: "application/vnd.github+json", ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}) };

async function get(url, init = {}) {
  const res = await fetch(url, { ...init, headers: { ...headers, ...init.headers }, signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res;
}

const LEVEL = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };

async function calendarFromApi() {
  const query = `query($login: String!) { user(login: $login) { contributionsCollection { contributionCalendar {
    totalContributions weeks { contributionDays { date contributionCount contributionLevel } } } } } }`;
  const body = await get("https://api.github.com/graphql", { method: "POST", body: JSON.stringify({ query, variables: { login: USER } }) }).then((r) => r.json());
  const cal = body.data?.user?.contributionsCollection?.contributionCalendar;
  if (!cal) throw new Error(`GraphQL: ${JSON.stringify(body.errors ?? body).slice(0, 200)}`);
  return {
    total: cal.totalContributions,
    weeks: cal.weeks.map((w) => w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount, level: LEVEL[d.contributionLevel] ?? 0 }))),
  };
}

/** Reads GitHub's own contributions fragment: one <td> per day, its count in a linked <tool-tip>. */
export function parseCalendarHtml(html) {
  const attr = (tag, name) => (tag.match(new RegExp(`\\s${name}="([^"]*)"`)) || [])[1];
  const tips = new Map();
  for (const m of html.matchAll(/<tool-tip\b([^>]*)>([^<]*)<\/tool-tip>/g)) tips.set(attr(m[1], "for"), m[2].trim());
  const days = [];
  for (const [tag] of html.matchAll(/<td\b[^>]*\sdata-date="[^"]+"[^>]*>/g)) {
    const tip = tips.get(attr(tag, "id")) ?? "";
    const n = tip.match(/^([\d,]+) contributions?/);
    days.push({ date: attr(tag, "data-date"), count: n ? Number(n[1].replace(/,/g, "")) : 0, level: Number(attr(tag, "data-level") ?? 0) });
  }
  days.sort((a, b) => a.date.localeCompare(b.date));
  // Whole weeks, Sunday first, as GitHub draws them.
  const weeks = [];
  for (const d of days) {
    const sunday = new Date(`${d.date}T00:00:00Z`).getUTCDay() === 0;
    if (!weeks.length || sunday) weeks.push([]);
    weeks.at(-1).push(d);
  }
  const heading = html.match(/([\d,]+)\s+contributions?\s+in the last year/);
  const total = heading ? Number(heading[1].replace(/,/g, "")) : days.reduce((n, d) => n + d.count, 0);
  return { total, weeks };
}

async function calendarFromPage() {
  const html = await get(`https://github.com/users/${USER}/contributions`, { headers: { Accept: "text/html", "X-Requested-With": "XMLHttpRequest" } }).then((r) => r.text());
  const cal = parseCalendarHtml(html);
  if (!cal.weeks.length) throw new Error("no days found on the contributions page");
  return cal;
}

async function pull() {
  const cal = await (TOKEN ? calendarFromApi().catch(() => calendarFromPage()) : calendarFromPage());
  return { user: USER, pulledAt: new Date().toISOString(), total: cal.total, weeks: cal.weeks };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const data = await pull();
    writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n");
    console.log(`github: ${data.total} contributions over ${data.weeks.length} weeks`);
  } catch (e) {
    console.warn(`github: could not pull activity (${e.message}); building from the saved snapshot`);
  }
}
