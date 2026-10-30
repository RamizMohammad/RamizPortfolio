# mohammadramiz.in

Personal portfolio of Mohammad Ramiz. A monochrome site built around one 3D object, the system core: five layers (interface, API, automation, data, infrastructure) that separate as you scroll and map onto the architecture of real projects.

## Stack

Next.js 16 (App Router, static) · React 19 · TypeScript · Tailwind CSS 4 · React Three Fiber + Drei · GSAP ScrollTrigger · Animate UI (Radix) · Motion

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
| `components/sections/` | The home page sections, server-rendered HTML. |
| `scene/` | The 3D layer. Client-only, loaded after the page is interactive. `store.ts` holds the pose for each scroll beat. |
| `motion/ScrollDirector.tsx` | GSAP ScrollTrigger: moves the core between beats. Loads with the scene. |
| `public/images/` | Optimised WebP images and the fallback poster of the core. |

## How the 3D degrades

- **High tier** (desktop): full lighting, contact shadow, layer labels.
- **Low tier** (phones, touch, 4 cores or fewer): lower resolution, no shadow or labels, fewer packets.
- **Off** (no WebGL or Save-Data): a still poster of the core. Every section works without 3D.
- **Reduced motion**: no boot sequence, no scroll scrubbing; the core snaps to one still pose per section.

## Adding a project

Add an entry to `content/systems.ts`. Public entries get a case study at `/work/<slug>` automatically. Add an `architecture` block (nodes on a small grid, each tagged with a layer) to feature it in the Architecture section.
