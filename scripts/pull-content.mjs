// Pulls the portfolio tables from the database through the HTTP data API and writes
// content/data.json, which the site is built from. Runs before every build (npm "prebuild").
//
//   PORTFOLIO_DB_KEY   API key with read access to the portfolio schema (required to pull)
//   PORTFOLIO_DB_API   query endpoint (default https://postgres-prod.mohammadramiz.in/v1/query)
//   PORTFOLIO_DB_STRICT=1  fail the build instead of falling back to the saved snapshot
//
// Without a key, or if the API cannot be reached, the build keeps the committed snapshot, so the
// site always builds. The key is only ever used here, on the build machine, never in the browser.
import { readFileSync, writeFileSync } from "node:fs";

const API = process.env.PORTFOLIO_DB_API || "https://postgres-prod.mohammadramiz.in/v1/query";
const KEY = process.env.PORTFOLIO_DB_KEY;
const STRICT = process.env.PORTFOLIO_DB_STRICT === "1";
const FILE = new URL("../content/data.json", import.meta.url);

async function query(sql) {
  const res = await fetch(API, {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ sql, params: [] }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${(await res.text()).slice(0, 200)}`);
  const body = await res.json();
  // Accept the common response shapes: a bare array, {rows}, {data} or {result: {rows}}.
  const rows = Array.isArray(body) ? body : body.rows ?? body.data ?? body.result?.rows;
  if (!Array.isArray(rows)) throw new Error(`unexpected response shape: ${JSON.stringify(body).slice(0, 200)}`);
  return rows;
}

// Optional fields are left out rather than set to null, as the site's types expect.
const clean = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== null && v !== undefined));
const n = (v) => (v === null || v === undefined ? null : Number(v));
// jsonb may arrive parsed or as a string, depending on the API.
const j = (v) => (typeof v === "string" ? JSON.parse(v) : v);

async function pull() {
  const T = (t, order = "sort, id") => query(`select * from portfolio.${t} order by ${order}`);
  const [[p], links, schooling, timeline, stack, systems, achievements, moments, publications, companies, store] = await Promise.all([
    T("profile", "id"),
    T("profile_links"),
    T("schooling"),
    T("timeline"),
    T("stack_items", "layer, sort, id"),
    T("systems", "sort, slug"),
    T("achievements"),
    T("moments", "when_year, id"),
    T("publications"),
    T("companies"),
    T("store_apps"),
  ]);
  if (!p) throw new Error("portfolio.profile is empty — run db/seed.sql first");

  const layers = ["interface", "api", "automation", "data", "infra"];
  return {
    profile: {
      name: p.name,
      firstName: p.first_name,
      lastName: p.last_name,
      role: p.role,
      company: p.company,
      location: p.location,
      headline: p.headline,
      summary: p.summary,
      interests: p.interests,
      education: p.education,
      schooling: schooling.map((s) => ({ degree: s.degree, school: s.school, score: s.score, period: s.period })),
      phone: { display: p.phone_display, href: p.phone_href },
      portrait: j(p.portrait),
      email: p.email,
      resume: p.resume,
      links: links.map((l) => ({ label: l.label, href: l.href, handle: l.handle })),
      siteUrl: p.site_url,
    },
    timeline: timeline.map((t) =>
      clean({ period: t.period, kind: t.kind, title: t.title, org: t.org, points: t.points, tags: t.tags, span: t.span_start === null ? null : [n(t.span_start), n(t.span_end)] }),
    ),
    stack: Object.fromEntries(layers.map((l) => [l, stack.filter((s) => s.layer === l).map((s) => s.item)])),
    systems: systems.map((s) =>
      clean({
        slug: s.slug,
        name: s.name,
        summary: s.summary,
        domains: s.domains,
        stack: s.stack,
        shipsAs: s.ships_as,
        platform: s.platform,
        org: s.org,
        internal: s.internal || null,
        links: j(s.links),
        logo: s.logo,
        screen: j(s.screen),
        points: s.points,
        architecture: j(s.architecture),
      }),
    ),
    achievements: achievements.map((a) => clean({ kind: a.kind, title: a.title, org: a.org, year: a.year, status: a.status, detail: a.detail, image: j(a.image) })),
    moments: moments.map((m) => clean({ when: n(m.when_year), date: m.date_label, place: m.place, title: m.title, caption: m.caption, image: j(m.image), fit: m.fit })),
    publications: publications.map((x) =>
      clean({
        kind: x.kind,
        title: x.title,
        authors: x.authors,
        venue: x.venue,
        date: x.date_label,
        year: n(x.year),
        id: x.id_label ? { label: x.id_label, value: x.id_value } : null,
        abstract: x.abstract,
        href: x.href,
        image: j(x.image),
        tags: x.tags,
      }),
    ),
    companies: companies.map((c) =>
      clean({ name: c.name, tagline: c.tagline, about: c.about, role: c.role, since: c.since, url: c.url, tone: c.tone, logo: j(c.logo), links: j(c.links) }),
    ),
    store: store.map((a) =>
      clean({
        slug: a.slug,
        name: a.name,
        kind: a.kind,
        category: a.category,
        publisher: a.publisher,
        tagline: a.tagline,
        about: a.about,
        version: a.version,
        released: a.released,
        size: a.size_label,
        requires: a.requires,
        tone: a.tone,
        logo: j(a.logo),
        download: j(a.download),
        platforms: a.platforms,
        osDownloads: j(a.os_downloads),
        install: a.install,
        steps: a.steps,
        downloads: j(a.downloads),
        links: j(a.links),
        features: a.features,
        system: a.system_slug,
      }),
    ),
  };
}

if (!KEY) {
  console.log("content: PORTFOLIO_DB_KEY not set — building from the saved snapshot (content/data.json)");
} else {
  try {
    const next = JSON.stringify(await pull(), null, 2) + "\n";
    const prev = readFileSync(FILE, "utf8");
    if (next === prev) console.log("content: database matches the snapshot");
    else {
      writeFileSync(FILE, next);
      console.log("content: updated content/data.json from the database");
    }
  } catch (e) {
    console.warn(`content: could not pull from the database (${e.message})`);
    if (STRICT) process.exit(1);
    console.warn("content: building from the saved snapshot instead");
  }
}
