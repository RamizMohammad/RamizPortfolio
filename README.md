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
| `scene/` | The 3D layer. Client-only, loaded after the page is interactive. `store.ts` holds the camera pose for each scroll beat; `formations.ts` places every object per section. |
| `motion/ScrollDirector.tsx` | GSAP ScrollTrigger: moves the core between beats. Loads with the scene. |
| `public/images/` | Optimised WebP images and the fallback poster of the core. |

## 3D models

The scene is a cast of real objects from [NVIDIA SimReady Assets](https://huggingface.co/datasets/nvidia/simready-assets) (CC BY 4.0; credits in `public/models/CREDITS.md` and the site footer). Each section arranges the same cast into its own scene in `scene/formations.ts`, and objects fly between arrangements as you scroll.

SimReady ships OpenUSD with NVIDIA MDL materials, which browsers can't load, so each asset is converted:

```bash
python scripts/usd2glb.py path/to/sm_<asset>_01.usd out.glb        # needs: pip install usd-core pygltflib numpy
npx @gltf-transform/cli optimize out.glb public/models/name.glb --compress meshopt --texture-compress webp --texture-size 512 --simplify-ratio 0.3
```

The converter maps each material's Albedo / ORM / Normal textures to glTF PBR and reads the surface type from SimReady's material names (only `metal` is metallic; `glossy` and `rough` set roughness; `glass` is transparent).

## How the 3D degrades

- **High tier** (desktop): full lighting, contact shadow, layer labels.
- **Low tier** (phones, touch, 4 cores or fewer): lower resolution, no shadow or labels, fewer packets.
- **Off** (no WebGL or Save-Data): a still poster of the core. Every section works without 3D.
- **Reduced motion**: no boot sequence, no scroll scrubbing; the core snaps to one still pose per section.

## Adding a project

Add an entry to `content/systems.ts`. Public entries get a case study at `/work/<slug>` automatically. Add an `architecture` block (nodes on a small grid, each tagged with a layer) to feature it in the Architecture section.
