"use client";

import { useFrame } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { profile } from "@/content/profile";
import { stack } from "@/content/stack";
import { featuredSystems, systems } from "@/content/systems";
import { timeline } from "@/content/timeline";
import { LAYERS } from "@/content/types";
import { signals } from "../store";
import { Block, INK, Picture, Platform, Sign, Tape, Tree } from "./kit";

/** Where each place stands along the town, and how the camera frames it. */
export const PLACES = [
  { id: "hero", x: 0, cam: [0, 3.6, 10.5], look: [0, 1.6, 0] },
  { id: "about", x: 18, cam: [0, 3.4, 9.5], look: [0, 1.5, 0] },
  { id: "systems", x: 38, cam: [0, 4.4, 10.5], look: [0, 1.7, 0] },
  { id: "architecture", x: 58, cam: [0, 4.4, 11], look: [0, 2.8, 0] },
  { id: "timeline", x: 76, cam: [1.5, 7.5, 13], look: [1.5, 0.6, 0] },
  { id: "stack", x: 96, cam: [-0.7, 4.2, 14], look: [-0.7, 2, 0] },
  { id: "contact", x: 114, cam: [0.9, 3.2, 9], look: [0.9, 1.4, 0] },
] as const;
const X = Object.fromEntries(PLACES.map((p) => [p.id, p.x])) as Record<(typeof PLACES)[number]["id"], number>;

const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
const pointer = (on: boolean) => {
  document.body.style.cursor = on ? "pointer" : "";
};

/* ---------------- Hero: the town square ---------------- */
function Plaza() {
  return (
    <group position={[X.hero, 0, 0]}>
      <Platform size={[9, 6]} />
      {/* The name board */}
      <Block size={[0.16, 2.6, 0.16]} position={[-2.4, 1.5, -0.6]} color={INK.kraftDark} />
      <Block size={[0.16, 2.6, 0.16]} position={[2.4, 1.5, -0.6]} color={INK.kraftDark} />
      <Block size={[5.6, 1.9, 0.18]} position={[0, 2.35, -0.55]} color={INK.paper} radius={0.1} />
      <Sign position={[0, 2.62, -0.45]} size={0.78}>RAMIZ</Sign>
      <Sign position={[0, 1.88, -0.45]} size={0.17} mono color={INK.blue}>{`${profile.role.toUpperCase()} · ${profile.company.toUpperCase()}`}</Sign>
      <Tape position={[-2.45, 3.18, -0.44]} rotation={[0, 0, 0.5]} length={1} />
      <Tape position={[2.45, 1.55, -0.44]} rotation={[0, 0, 0.45]} length={1} />
      {/* A desk terminal that greets you */}
      <Block size={[1.3, 0.75, 0.75]} position={[2.6, 0.6, 1.4]} color={INK.kraft} />
      <Block size={[1.1, 0.75, 0.08]} position={[2.6, 1.35, 1.25]} rotation={[-0.15, 0, 0]} color={INK.navy} />
      <Sign position={[2.6, 1.37, 1.31]} rotation={[-0.15, 0, 0]} size={0.2} mono color={INK.tape}>{">_ hello"}</Sign>
      {/* Wayfinding post */}
      <Block size={[0.12, 2.2, 0.12]} position={[-3.1, 1.1, 1.6]} color={INK.kraftDark} />
      {[["PROJECTS →", INK.blue, 1.9, -0.08], ["ABOUT →", INK.green, 1.45, 0.1], ["CONTACT →", INK.red, 1.0, -0.05]].map(([t, c, y, r]) => (
        <group key={t as string} position={[-2.55, y as number, 1.6]} rotation={[0, 0, r as number]}>
          <Block size={[1.25, 0.32, 0.06]} color={c as string} radius={0.04} />
          <Sign position={[0, 0, 0.04]} size={0.13} mono color={INK.paper}>{t as string}</Sign>
        </group>
      ))}
      <Tree position={[-3.9, 0.22, -1.8]} color={INK.green} />
      <Tree position={[3.9, 0.22, -1.7]} color={INK.blue} scale={0.8} />
    </group>
  );
}

/* ---------------- About: a desk diorama ---------------- */
function Room() {
  return (
    <group position={[X.about, 0, 0]} onClick={() => go("about")}>
      <Platform size={[7, 5]} />
      {/* Two walls, cut away like a dolls' house */}
      <Block size={[7, 3.6, 0.2]} position={[0, 2.02, -2.4]} color={INK.paper} radius={0.04} />
      <Block size={[0.2, 3.6, 5]} position={[-3.4, 2.02, 0]} color={INK.board} radius={0.04} />
      <Block size={[7, 0.3, 0.24]} position={[0, 0.37, -2.36]} color={INK.blue} radius={0.03} />
      {/* Portrait pinned on the wall */}
      <Block size={[1.5, 1.5, 0.06]} position={[-1.6, 2.5, -2.27]} color={INK.paper} radius={0.03} />
      <Picture src="/images/portrait-cut.webp" width={1.3} height={1.3} position={[-1.6, 2.5, -2.23]} />
      <Tape position={[-1.6, 3.22, -2.2]} rotation={[0, 0, -0.08]} length={0.7} />
      <Sign position={[-1.6, 1.55, -2.25]} size={0.13} mono>{profile.location.split(",")[0].toUpperCase()}</Sign>
      {/* Desk with a monitor showing the résumé tagline */}
      <Block size={[3.2, 0.12, 1.3]} position={[1, 1.12, -1.4]} color={INK.kraft} />
      {[[-0.45, -0.85], [2.45, -0.85], [-0.45, -1.95], [2.45, -1.95]].map(([x, z]) => (
        <Block key={`${x}${z}`} size={[0.1, 0.9, 0.1]} position={[x, 0.66, z]} color={INK.navy} radius={0.03} />
      ))}
      <Block size={[1.5, 0.95, 0.07]} position={[1.1, 1.85, -1.75]} color={INK.navy} radius={0.04} />
      <Block size={[1.36, 0.8, 0.02]} position={[1.1, 1.86, -1.7]} color={INK.blue} radius={0.01} castShadow={false} />
      <Sign position={[1.1, 1.92, -1.68]} size={0.11} mono color={INK.paper} maxWidth={1.2}>{"automates the boring parts"}</Sign>
      <Block size={[0.1, 0.35, 0.1]} position={[1.1, 1.3, -1.75]} color={INK.navy} />
      <Block size={[0.9, 0.04, 0.3]} position={[1.1, 1.2, -1.15]} color={INK.navy} radius={0.015} />
      <mesh position={[2.3, 1.3, -1.2]} castShadow>
        <cylinderGeometry args={[0.11, 0.1, 0.24, 20]} />
        <meshStandardMaterial color={INK.red} roughness={0.5} />
      </mesh>
      {/* Chair */}
      <Block size={[0.8, 0.12, 0.8]} position={[1.1, 0.75, -0.25]} color={INK.green} />
      <Block size={[0.8, 0.8, 0.12]} position={[1.1, 1.2, 0.1]} color={INK.green} />
      <Block size={[0.1, 0.55, 0.1]} position={[1.1, 0.45, -0.25]} color={INK.navy} />
      <Tree position={[2.8, 0.22, 1.2]} color={INK.orange} scale={0.7} />
    </group>
  );
}

/* ---------------- Systems: a street of kiosks, one per project ---------------- */
const SCREEN: Record<string, string | undefined> = {
  timefold: "/images/screens/timefold.webp",
  "confess-web": "/images/screens/confess-web.webp",
  confess: "/images/screens/confess-app.webp",
};
const KIOSK_INK = [INK.blue, INK.red, INK.green, INK.orange, INK.violet, INK.navy];

function Kiosk({ slug, name, ink, x }: { slug: string; name: string; ink: string; x: number }) {
  const router = useRouter();
  const sys = systems.find((s) => s.slug === slug)!;
  const ref = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);
  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    const hot = hover || signals.system === slug;
    const inFilter = signals.filter === "all" || sys.domains.includes(signals.filter as (typeof sys.domains)[number]);
    const y = hot ? 0.35 : inFilter ? 0 : -1.25; // filtered out: the shutter drops into the street
    g.position.y += (y - g.position.y) * Math.min(1, dt * 6);
    const s = hot ? 1.06 : 1;
    g.scale.setScalar(g.scale.x + (s - g.scale.x) * Math.min(1, dt * 6));
  });
  const screen = SCREEN[slug];
  return (
    <group
      ref={ref}
      position={[x, 0, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        pointer(true);
      }}
      onPointerOut={() => {
        setHover(false);
        pointer(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        pointer(false);
        router.push(`/work/${slug}`);
      }}
    >
      {/* counter */}
      <Block size={[2.3, 1.05, 1.2]} position={[0, 0.75, 0.55]} color={INK.paper} />
      <Block size={[2.36, 0.14, 1.26]} position={[0, 1.33, 0.55]} color={ink} radius={0.04} />
      <Sign position={[0, 0.78, 1.17]} size={0.2} maxWidth={2.1}>{name}</Sign>
      {/* posts and striped awning */}
      <Block size={[0.1, 2.5, 0.1]} position={[-1.08, 1.45, 1.1]} color={INK.kraftDark} />
      <Block size={[0.1, 2.5, 0.1]} position={[1.08, 1.45, 1.1]} color={INK.kraftDark} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Block key={i} size={[0.4, 0.08, 1.5]} position={[-1.0 + i * 0.4, 2.78, 0.45]} rotation={[0.28, 0, 0]} color={i % 2 ? INK.paper : ink} radius={0.03} />
      ))}
      {/* back screen: a real screenshot, or the logo on a coloured panel */}
      <Block size={[2.3, 1.5, 0.14]} position={[0, 2.1, -0.15]} color={INK.navy} radius={0.05} />
      {screen ? (
        <Picture src={screen} width={2.12} height={slug === "confess" ? 1.06 : 1.33} position={[0, 2.1, -0.07]} glow={hover ? 0.3 : 0} />
      ) : (
        <>
          <Block size={[2.12, 1.32, 0.02]} position={[0, 2.1, -0.07]} color={ink} radius={0.02} castShadow={false} />
          {sys.sticker && <Picture src={sys.sticker} width={0.95} height={0.95} position={[0, 2.12, -0.05]} glow={hover ? 0.3 : 0} />}
        </>
      )}
      {sys.sticker && screen && <Picture src={sys.sticker} width={0.42} height={0.42} position={[0.82, 1.62, 1.16]} rotation={[0, 0, 0.12]} />}
    </group>
  );
}

function MoglixHQ({ x }: { x: number }) {
  const internal = systems.filter((s) => s.internal);
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    const hot = internal.some((s) => s.slug === signals.system);
    const inFilter = signals.filter === "all" || internal.some((s) => s.domains.includes(signals.filter as (typeof s.domains)[number]));
    const y = hot ? 0.25 : inFilter ? 0 : -3.4;
    g.position.y += (y - g.position.y) * Math.min(1, dt * 6);
  });
  return (
    <group ref={ref} position={[x, 0, -0.4]}>
      {internal.map((s, i) => {
        const hot = () => signals.system === s.slug;
        return <Floor key={s.slug} y={0.22 + i * 1.05} name={s.name} isHot={hot} />;
      })}
      <Block size={[2.8, 0.18, 2]} position={[0, 0.22 + internal.length * 1.05 + 0.09, 0]} color={INK.red} />
      <Block size={[1.8, 0.75, 0.12]} position={[0, 0.22 + internal.length * 1.05 + 0.6, 0.5]} color={INK.paper} radius={0.06} />
      <Picture src="/images/stickers/moglix.webp" width={0.62} height={0.62} position={[0, 0.22 + internal.length * 1.05 + 0.6, 0.57]} />
      <Sign position={[0, 0.5, 1.12]} size={0.15} mono color={INK.paper}>MOGLIX · INTERNAL</Sign>
    </group>
  );
}

function Floor({ y, name, isHot }: { y: number; name: string; isHot: () => boolean }) {
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(() => {
    if (mat.current) mat.current.emissiveIntensity = isHot() ? 0.5 : 0;
  });
  return (
    <group position={[0, y, 0]}>
      <Block size={[2.6, 1, 2]} position={[0, 0.5, 0]} color={INK.board} />
      <mesh position={[0, 0.52, 1.005]}>
        <planeGeometry args={[2.3, 0.62]} />
        <meshStandardMaterial ref={mat} color={INK.navy} emissive={INK.tape} emissiveIntensity={0} roughness={0.7} />
      </mesh>
      <Sign position={[0, 0.52, 1.02]} size={0.13} mono color={INK.paper} maxWidth={2.1}>{name.toUpperCase()}</Sign>
    </group>
  );
}

/* The street's layout: public systems in list order, then the Moglix building for internal work. */
const publicSys = systems.filter((s) => !s.internal);
const GAP = 2.75;
const START = -(publicSys.length * GAP) / 2 + GAP / 2 - 1.8;
const HQ_X = START + publicSys.length * GAP + 0.9;

/** Where along the street (relative to its centre) the kiosk for a system stands. */
export function streetSpot(slug: string) {
  const i = publicSys.findIndex((s) => s.slug === slug);
  return i < 0 ? HQ_X : START + i * GAP;
}
/** The street is longer than one view: the camera walks between the first kiosk and the Moglix building. */
export const STREET_ENDS = [START + 1, HQ_X - 0.4] as const;

function Street() {
  return (
    <group position={[X.systems, 0, 0]}>
      <Platform size={[24, 6]} />
      <Block size={[23, 0.04, 1.1]} position={[0, 0.24, 2.3]} color={INK.navy} radius={0.02} castShadow={false} />
      {[...Array(11)].map((_, i) => (
        <Block key={i} size={[0.9, 0.02, 0.1]} position={[-10 + i * 2, 0.27, 2.3]} color={INK.tape} radius={0.01} castShadow={false} />
      ))}
      <group position={[0, 0.22, 0]}>
        {publicSys.map((s, i) => (
          <Kiosk key={s.slug} slug={s.slug} name={s.name} ink={KIOSK_INK[i % KIOSK_INK.length]} x={START + i * GAP} />
        ))}
        <MoglixHQ x={HQ_X} />
      </group>
      <Tree position={[-11.2, 0.22, -2.1]} color={INK.green} />
      <Tree position={[11.3, 0.22, -2]} color={INK.orange} scale={0.85} />
    </group>
  );
}

/* ---------------- Architecture: the five-layer tower ---------------- */
const FLOOR_H = 0.95;
const nodeSpot = (x: number, y: number, layer: number): [number, number, number] => [(x - 1.5) * 0.72, 0.22 + layer * FLOOR_H + 0.75, 1.15 + (y - 1) * 0.12];

function Tower() {
  const order = [...LAYERS].reverse(); // infrastructure at the bottom
  const packets = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const layerIndex = (id: string) => order.findIndex((l) => l.id === id);
  useFrame((state) => {
    const pm = packets.current;
    if (!pm) return;
    const sys = featuredSystems.find((s) => s.slug === signals.arch) ?? featuredSystems[0];
    const nodes = sys.architecture!.nodes;
    const edges = sys.architecture!.edges.slice(0, 8);
    const t = state.clock.elapsedTime;
    for (let i = 0; i < 16; i++) {
      const e = edges[Math.floor(i / 2)];
      if (!e) {
        dummy.scale.setScalar(0);
      } else {
        const a = nodes.find((n) => n.id === e.from)!;
        const b = nodes.find((n) => n.id === e.to)!;
        const pa = nodeSpot(a.x, a.y, layerIndex(a.layer));
        const pb = nodeSpot(b.x, b.y, layerIndex(b.layer));
        const u = (t * 0.4 + (i % 2) * 0.5) % 1;
        dummy.position.set(pa[0] + (pb[0] - pa[0]) * u, pa[1] + (pb[1] - pa[1]) * u + 0.12, pa[2] + (pb[2] - pa[2]) * u + 0.08);
        dummy.scale.setScalar(1);
      }
      dummy.updateMatrix();
      pm.setMatrixAt(i, dummy.matrix);
    }
    pm.instanceMatrix.needsUpdate = true;
  });
  return (
    <group position={[X.architecture, 0, 0]} onClick={() => go("architecture")}>
      <Platform size={[7, 5]} />
      {order.map((l, i) => (
        <TowerFloor key={l.id} y={0.22 + i * FLOOR_H} color={l.color} label={`L${LAYERS.findIndex((x) => x.id === l.id) + 1} ${l.label.toUpperCase()}`} layer={l.id} />
      ))}
      <Block size={[3.6, 0.2, 2.6]} position={[0, 0.22 + 5 * FLOOR_H + 0.1, 0]} color={INK.red} />
      <TowerNodes nodeSpot={nodeSpot} layerIndex={layerIndex} />
      <instancedMesh ref={packets} args={[undefined, undefined, 16]} frustumCulled={false}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshStandardMaterial color={INK.red} emissive={INK.red} emissiveIntensity={0.4} />
      </instancedMesh>
      <Tree position={[2.9, 0.22, 1.3]} color={INK.blue} scale={0.75} />
    </group>
  );
}

function TowerFloor({ y, color, label, layer }: { y: number; color: string; label: string; layer: string }) {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!g.current) return;
    const on = signals.focus.length === 0 || signals.focus.includes(layer as (typeof signals.focus)[number]);
    const target = on ? 0 : -0.45; // unused layers slide back into the tower
    g.current.position.z += (target - g.current.position.z) * Math.min(1, dt * 5);
  });
  return (
    <group ref={g} position={[0, y, 0]}>
      <Block size={[3.4, FLOOR_H - 0.08, 2.4]} position={[0, FLOOR_H / 2, 0]} color={INK.board} />
      <Block size={[3.44, 0.16, 2.44]} position={[0, 0.1, 0]} color={color} radius={0.04} />
      <Sign position={[-1.62, FLOOR_H / 2 + 0.05, 1.22]} size={0.14} mono color={color} anchorX="left">{label}</Sign>
    </group>
  );
}

function TowerNodes({ nodeSpot: spot, layerIndex }: { nodeSpot: typeof nodeSpot; layerIndex: (id: string) => number }) {
  const [slug, setSlug] = useState(signals.arch);
  useFrame(() => {
    if (signals.arch !== slug) setSlug(signals.arch);
  });
  const sys = featuredSystems.find((s) => s.slug === slug) ?? featuredSystems[0];
  return (
    <>
      {sys.architecture!.nodes.map((n) => {
        const p = spot(n.x, n.y, layerIndex(n.layer));
        return (
          <group key={`${sys.slug}-${n.id}`} position={p}>
            <Block size={[0.62, 0.3, 0.3]} position={[0, 0, 0]} color={INK.kraft} radius={0.05} />
            <Sign position={[0, 0.01, 0.16]} size={0.07} mono maxWidth={0.58}>{n.label.toUpperCase()}</Sign>
          </group>
        );
      })}
    </>
  );
}

/* ---------------- Timeline: a road through the years ---------------- */
function Road() {
  const T0 = 2020.5;
  const T1 = 2027;
  const L = 16;
  const tx = (year: number) => -L / 2 + ((year - T0) / (T1 - T0)) * L;
  const d = new Date();
  const now = d.getFullYear() + d.getMonth() / 12;
  const entries = timeline.filter((t) => t.span);
  const inks = [INK.blue, INK.red, INK.green, INK.orange];
  return (
    <group position={[X.timeline, 0, 0]} onClick={() => go("timeline")}>
      <Platform size={[19, 7]} />
      <Block size={[L + 0.6, 0.05, 1.3]} position={[0, 0.25, 1.6]} color={INK.navy} radius={0.02} castShadow={false} />
      {[...Array(16)].map((_, i) => (
        <Block key={i} size={[0.55, 0.02, 0.09]} position={[-L / 2 + 0.5 + i, 0.29, 1.6]} color={INK.tape} radius={0.01} castShadow={false} />
      ))}
      {[2021, 2022, 2023, 2024, 2025, 2026].map((y) => (
        <group key={y} position={[tx(y), 0.22, 2.55]}>
          <Block size={[0.08, 0.5, 0.08]} position={[0, 0.25, 0]} color={INK.kraftDark} />
          <Block size={[0.7, 0.3, 0.05]} position={[0, 0.55, 0]} color={INK.paper} radius={0.03} />
          <Sign position={[0, 0.55, 0.04]} size={0.14} mono>{String(y)}</Sign>
        </group>
      ))}
      {/* each entry: a raised lane from its start to its end, with a sign at the start */}
      {entries.map((t, i) => {
        const a = tx(t.span![0]);
        const b = tx(t.span![1] ?? now);
        const len = Math.max(0.3, b - a);
        const z = 0.6 - i * 0.62;
        return (
          <group key={t.org}>
            <Block size={[len, 0.22 + i * 0.05, 0.42]} position={[a + len / 2, 0.33 + i * 0.025, z]} color={inks[i % inks.length]} radius={0.06} />
            <Block size={[0.08, 1 + i * 0.25, 0.08]} position={[a + 0.1, 0.72 + i * 0.12, z - 0.3]} color={INK.kraftDark} />
            <group position={[a + 0.1 + 0.85, 1.15 + i * 0.25, z - 0.3]}>
              <Block size={[1.8, 0.4, 0.06]} color={INK.paper} radius={0.04} />
              <Sign position={[0, 0, 0.04]} size={0.15} anchorX="center" maxWidth={1.7}>{t.org}</Sign>
            </group>
          </group>
        );
      })}
      <Tree position={[-9, 0.22, -2.6]} color={INK.green} />
      <Tree position={[8.8, 0.22, -2.7]} color={INK.violet} scale={0.8} />
    </group>
  );
}

/* ---------------- Stack: a shelf of labelled boxes ---------------- */
function Warehouse() {
  const order = [...LAYERS].reverse();
  const W = 8;
  return (
    <group position={[X.stack, 0, 0]} onClick={() => go("stack")}>
      <Platform size={[11, 5]} />
      <Block size={[0.16, 4.6, 1.3]} position={[-W / 2 - 0.1, 2.52, -0.6]} color={INK.kraftDark} />
      <Block size={[0.16, 4.6, 1.3]} position={[W / 2 + 0.1, 2.52, -0.6]} color={INK.kraftDark} />
      {order.map((l, i) => {
        const y = 0.3 + i * 0.88;
        const items = stack[l.id];
        const step = W / Math.max(items.length, 6);
        return (
          <group key={l.id} position={[0, y, -0.6]}>
            <Block size={[W + 0.2, 0.08, 1.3]} position={[0, 0, 0]} color={INK.board} radius={0.02} />
            <Block size={[W + 0.2, 0.12, 0.06]} position={[0, 0.02, 0.66]} color={l.color} radius={0.02} />
            <Sign position={[-W / 2 - 0.35, 0.36, 0.5]} size={0.12} mono color={l.color} anchorX="right">{l.label.toUpperCase()}</Sign>
            {items.map((name, k) => (
              <group key={name} position={[-W / 2 + step / 2 + k * step, 0.31, 0.1 + ((k % 2) * 0.12)]} rotation={[0, ((k * 5) % 7 - 3) * 0.03, 0]}>
                <Block size={[Math.min(step - 0.1, 0.78), 0.54, 0.6]} color={INK.kraft} radius={0.04} />
                <Block size={[Math.min(step - 0.18, 0.7), 0.2, 0.01]} position={[0, 0.05, 0.305]} color={INK.paper} radius={0.005} castShadow={false} />
                <Sign position={[0, 0.05, 0.315]} size={0.065} mono maxWidth={Math.min(step - 0.2, 0.66)}>{name}</Sign>
              </group>
            ))}
          </group>
        );
      })}
      <Tree position={[5.2, 0.22, 1.4]} color={INK.green} scale={0.8} />
    </group>
  );
}

/* ---------------- Contact: the post office ---------------- */
function PostOffice() {
  const env = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!env.current) return;
    const t = state.clock.elapsedTime;
    env.current.position.y = 2.6 + Math.sin(t * 1.6) * 0.12;
    env.current.rotation.z = Math.sin(t * 1.1) * 0.12;
  });
  return (
    <group position={[X.contact, 0, 0]}>
      <Platform size={[7, 5]} />
      {/* mailbox */}
      <Block size={[0.14, 1.1, 0.14]} position={[-1.2, 0.77, 0.4]} color={INK.navy} />
      <Block size={[1.0, 0.75, 1.3]} position={[-1.2, 1.6, 0.4]} color={INK.blue} radius={0.18} />
      <Block size={[0.6, 0.06, 0.02]} position={[-1.2, 1.7, 1.06]} color={INK.navy} radius={0.01} castShadow={false} />
      <Block size={[0.06, 0.55, 0.06]} position={[-0.62, 2.0, 0.6]} color={INK.red} />
      <Block size={[0.32, 0.2, 0.04]} position={[-0.48, 2.2, 0.6]} color={INK.red} radius={0.02} />
      {/* envelope on its way */}
      <group ref={env} position={[0.6, 2.6, 0.6]}>
        <Block size={[1.2, 0.75, 0.05]} color={INK.paper} radius={0.04} />
        <Block size={[0.4, 0.4, 0.06]} position={[0, -0.02, 0.01]} rotation={[0, 0, Math.PI / 4]} color={INK.red} radius={0.02} castShadow={false} />
      </group>
      {/* sign with the email */}
      <Block size={[0.12, 1.6, 0.12]} position={[1.8, 1.0, -0.8]} color={INK.kraftDark} />
      <Block size={[2.6, 0.8, 0.1]} position={[1.8, 1.75, -0.8]} color={INK.paper} radius={0.06} />
      <Sign position={[1.8, 1.9, -0.74]} size={0.2}>SAY HELLO</Sign>
      <Sign position={[1.8, 1.6, -0.74]} size={0.11} mono color={INK.blue}>{profile.email}</Sign>
      <Tape position={[0.7, 2.1, -0.74]} rotation={[0, 0, 0.6]} length={0.6} />
      <Tree position={[-2.8, 0.22, -1.6]} color={INK.red} scale={0.8} />
      <Tree position={[2.9, 0.22, 1.3]} color={INK.green} scale={0.7} />
    </group>
  );
}

export default function Town() {
  return (
    <>
      <Plaza />
      <Room />
      <Street />
      <Tower />
      <Road />
      <Warehouse />
      <PostOffice />
    </>
  );
}
