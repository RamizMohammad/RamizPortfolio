# mohammadramiz.in

Personal portfolio of Mohammad Ramiz, a backend software engineer. A darkroom-editorial site: a warm near-black canvas, cream uppercase type, and one artifact per screen — a terminal session, a project screenshot, a system architecture diagram.

## Stack

Next.js 16 (App Router, static) · React 19 · TypeScript · Tailwind CSS 4 · Radix UI. No 3D and no animation library.

## Run

```bash
npm install
npm run dev
```

`npm run check` runs lint, type checks and a production build.

## Where things live

| Path | What |
| --- | --- |
| `content/` | All facts on the site: profile, systems, timeline, stack, achievements. Edit here, not in components. |
| `components/home/` | The home page sections, in page order in `app/page.tsx`. |
| `components/` | Shared pieces: header, command palette (⌘K), terminal, architecture diagram, footer. |
| `app/globals.css` | The design tokens and the few classes the whole site is built from. |
| `public/images/` | Optimised WebP images: portrait, logos, product screenshots, certificates. |

## Design rules

- **Colours:** canvas `#100904`, cream `#ffedd7`, bark `#382416` (the only raised surface), cork `#40372e` and driftwood `#6c5f51` for dashed hairlines, ember `#dc5000` only for status dots and credit lines — never on buttons.
- **Type:** Inter with `ss01`. Everything is uppercase at weight 500; descriptions use `.voice` (mixed case, weight 400). Display and heading sizes use line-height 0.9.
- **Shapes:** 12px cards, 36px filled pill (at most one per section), 22.5px outlined ghost buttons. No shadows.
- **Layout:** full-bleed. Sections use `.void` (heading left, one object centred, description right) or a 3/7 split. Text never sits over an image.

## Adding a project

Add an entry to `content/systems.ts`. Public entries get a case study at `/work/<slug>` automatically. Add an `architecture` block (nodes on a small grid, each tagged with a layer) to feature it in the Architecture section, and a `screen` to show a screenshot of the live product.
