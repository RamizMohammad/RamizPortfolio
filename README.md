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
| `scene/` | The 3D layer. Client-only, loaded after the page is interactive. `world/` is the town: `kit.tsx` holds the building parts, `places.tsx` one place per section, `CameraRig.tsx` flies the camera between them. |
| `motion/ScrollDirector.tsx` | GSAP ScrollTrigger: moves the camera from place to place as sections scroll in. Loads with the scene. |
| `public/images/` | Optimised WebP images and the fallback poster of the town. |

## The 3D world

The home page is a small paper-and-cardboard town. Each section of the page is a place in it, and scrolling flies the camera from one place to the next. All text lives in the panel on the left (or below the town on phones), never on top of the 3D.

| Section | Place |
| --- | --- |
| Hero | The square, with the name board |
| About | A room with my desk |
| Systems Lab | A street with one kiosk per public system, showing a screenshot of the live product, plus the Moglix building for internal work |
| Architecture | A five-floor tower, one floor per layer |
| Timeline | A road with a lane per role, stretched to scale |
| Stack | A warehouse with a shelf per layer |
| Contact | A post office |

Everything is built from the parts in `scene/world/kit.tsx` (rounded blocks, tape, painted signs, pictures), so the town has one consistent look and no external models. Screenshots of the live products are in `public/images/screens/`.

## How the 3D degrades

- **High tier** (desktop): soft shadows, full resolution.
- **Low tier** (phones, touch, 4 cores or fewer): lower resolution, hard shadows.
- **Off** (no WebGL or Save-Data): a still poster of the town. Every section works without 3D.
- **Reduced motion**: no boot sequence, no scroll scrubbing; the camera cuts straight to each place.

## Adding a project

Add an entry to `content/systems.ts`. Public entries get a case study at `/work/<slug>` automatically. Add an `architecture` block (nodes on a small grid, each tagged with a layer) to feature it in the Architecture section.
