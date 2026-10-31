# Portfolio database

Every fact on the site — profile, timeline, stack, projects, achievements, photo timeline,
publications — lives in Postgres, in the `portfolio` schema. The site is still fully static:
before each build, `scripts/pull-content.mjs` reads the tables through the data API and writes
`content/data.json`, which the pages are built from.

```
Postgres (portfolio.*) ──data API──▶ npm run build ──▶ content/data.json ──▶ static site
```

## Set up (once)

1. Create a database for the portfolio (or use an existing one; everything lives in its own
   `portfolio` schema, so it never clashes with other tables).
2. Run the schema, then the seed, from any SQL client (DBeaver, psql over the SSH tunnel):

   ```bash
   psql "postgresql://USER:PASSWORD@localhost:15432/portfolio" -f db/schema.sql
   psql "postgresql://USER:PASSWORD@localhost:15432/portfolio" -f db/seed.sql
   ```

   `schema.sql` is safe to re-run. `seed.sql` **replaces** all portfolio content with what is in
   `content/data.json`, so run it only to start fresh.
3. Create a **read-only** API key for that database in the panel (API keys).
4. Add it to the build environment (Vercel / Netlify / your CI / `.env.local`), never to the repo:

   ```bash
   PORTFOLIO_DB_KEY=cpk_...
   # optional, this is the default:
   PORTFOLIO_DB_API=https://postgres-prod.mohammadramiz.in/v1/query
   ```

## Update the site

Change a row, then rebuild:

```sql
update portfolio.profile set headline = 'Python AI / LLM, backend and Android developer';

insert into portfolio.publications (kind, title, authors, venue, date_label, year, id_label, id_value, abstract, href)
values ('Conference paper', 'Paper title', array['Mohammad Ramiz', 'Co-author'], 'Conference name',
        'March 2026', 2026, 'DOI', '10.xxxx/xxxxx', 'Abstract…', 'https://doi.org/10.xxxx/xxxxx');

insert into portfolio.moments (when_year, date_label, place, title, caption, image, fit)
values (2026.2, 'March 2026', 'Bengaluru', 'Talk at …', 'Optional caption',
        '{"src": "/images/moments/talk.webp", "width": 1200, "height": 900, "alt": "Me on stage"}', 'cover');
```

Or the same through the data API, from a terminal:

```bash
curl -X POST https://postgres-prod.mohammadramiz.in/v1/query \
  -H "Authorization: Bearer cpk_..." \
  -H "Content-Type: application/json" \
  -d '{"sql": "update portfolio.achievements set year = $1 where title = $2", "params": ["2025", "Road Safety Hackathon"]}'
```

`npm run build` pulls automatically (`prebuild`). To pull without building: `npm run content:pull`,
then commit `content/data.json` so the snapshot in the repo stays current.

## Tables

| Table | One row per | Notes |
| --- | --- | --- |
| `profile` | — (exactly one row) | name, role, summary, contact, `interests text[]`, `portrait jsonb` |
| `profile_links` | social link | ordered by `sort` |
| `schooling` | degree / school | newest first by `sort` |
| `timeline` | role (Experience) | `kind` ∈ Work, Internship, Freelance, Independent, Education; `span_end` null = ongoing |
| `stack_items` | tool | `layer` ∈ interface, api, automation, data, infra |
| `systems` | project | `platform` ∈ web, android, desktop, service, internal (picks the IDE it opens in); `internal` hides links; `architecture jsonb` draws the diagram |
| `achievements` | award, hackathon, certificate | `kind` ∈ Award, Patent, Hackathon, Competition, Certification, Internship |
| `moments` | photo on the "Places I've been" timeline | ordered by `when_year` |
| `publications` | paper / patent / article | `authors text[]` in citation order |

Every table has `updated_at`, bumped automatically on update.

Images (`/images/...`) are files in `public/`; the tables store their paths.

## Safety

- The API key is only used on the build machine, never sent to the browser.
- If the key is missing or the API is unreachable, the build uses the last committed snapshot
  instead of failing. Set `PORTFOLIO_DB_STRICT=1` to make it fail instead.
- `npm run content:seed` regenerates `db/seed.sql` from the snapshot, so the SQL in the repo can
  always rebuild the database from scratch.
