# mohammadramiz.in

Personal portfolio of Mohammad Ramiz, a backend software engineer. A bold, playful site: a giant condensed wordmark over a waving pink ribbon, cartoon stickers of a backend engineer's tools floating around it, pill controls, and each project on its own flat colour block.

## Stack

Next.js 16 (App Router, static) · React 19 · TypeScript · Tailwind CSS 4 · Radix UI. No 3D and no animation library: the ribbon is a 2D canvas, everything else is CSS.

## Run

```bash
npm install
npm run dev
```

`npm run check` runs lint, type checks and a production build.

## Where things live

| Path | What |
| --- | --- |
| `db/` | The Postgres schema and seed for all site content, and how to update it (see `db/README.md`). |
| `content/` | Typed access to the content; `data.json` is the snapshot pulled from the database before each build. |
| `components/home/` | The home page sections, in page order in `app/page.tsx`. |
| `components/` | Shared pieces: header, command palette (⌘K), terminal, architecture diagram, footer. |
| `app/globals.css` | The design tokens and the few classes the whole site is built from. |
| `public/images/` | Optimised WebP images: portrait, logos, product screenshots, certificates. |

## Design rules

- **Colours:** lavender paper `#ebe8f6`, ink `#121016`, white cards, and candy accents used as flat blocks: pink `#f47a9a`, lime `#d4f25b`, blue `#2f5bea`, sun `#ffcf3a`, violet `#b9a6f5`, mint `#5fd3a4`.
- **Type:** Anton for display (always uppercase, tight leading), Inter for everything else; `.voice` is the large sentence-case line, `.t-label` the small uppercase one.
- **Controls:** pills only — `.btn-pill` (ink) for the main action, `.btn-ghost` (white, ink outline) for the rest.
- **Hero:** the wordmark letters slide in as slices; stickers (`components/hero/Stickers.tsx`) pop in and bob; the ribbon (`components/hero/Ribbon.tsx`) waves behind. A pause button stops all looping motion, and reduced motion shows a still frame.

## Adding a project

Add an entry to `content/systems.ts`. Public entries get a case study at `/work/<slug>` automatically. Add an `architecture` block (nodes on a small grid, each tagged with a layer) to feature it in the Architecture section, and a `screen` to show a screenshot of the live product.
