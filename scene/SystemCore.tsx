"use client";

import { Edges, Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { LAYERS } from "@/content/types";
import { stack } from "@/content/stack";
import { signals, target, type Pose } from "./store";

const N = LAYERS.length;
const THICK = 0.16;
// Widest at the bottom so the stack reads as a foundation: infrastructure carries everything above it.
const SIZES = LAYERS.map((_, i) => ({ w: 1.75 + i * 0.13, d: 1.2 + i * 0.08 }));
const PORTS: [number, number][] = [[-0.55, 0.28], [0.48, -0.32], [0.12, 0.42], [-0.3, -0.38]];

const FACE = new THREE.Color("#121211");
const FACE_LIT = new THREE.Color("#2c2c2a");

type Props = { packets: number; labels: boolean; reduced: boolean };

const gapFor = (explode: number) => 0.05 + explode * 0.62;
const slabY = (i: number, explode: number) => ((N - 1) / 2 - i) * (THICK + gapFor(explode));
const smooth = (a: number, b: number, v: number) => THREE.MathUtils.smoothstep(v, a, b);

/** Engraved grid on a slab's top face: a few static lines, one geometry per slab. */
function topGrid(w: number, d: number) {
  const pts: number[] = [];
  const y = THICK / 2 + 0.002;
  for (let k = 1; k < 8; k++) {
    const x = -w / 2 + (w * k) / 8;
    pts.push(x, y, -d / 2 + 0.06, x, y, d / 2 - 0.06);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return g;
}

export default function SystemCore({ packets, labels, reduced }: Props) {
  const { viewport, size } = useThree();
  const root = useRef<THREE.Group>(null);
  const slabGroup = useRef<THREE.Group>(null);
  const slabRefs = useRef<(THREE.Group | null)[]>([]);
  const faceMats = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const edgeMats = useRef<(THREE.LineBasicMaterial | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const packetMesh = useRef<THREE.InstancedMesh>(null);
  const starMesh = useRef<THREE.InstancedMesh>(null);
  const starGroup = useRef<THREE.Group>(null);
  const starLines = useRef<THREE.LineBasicMaterial>(null);
  const cur = useRef<Pose>({ ...target });
  const pointer = useRef({ x: 0, y: 0 });
  const lastOpacity = useRef(-1);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const grids = useMemo(() => SIZES.map((s) => topGrid(s.w, s.d)), []);

  // Constellation: one point per stack item, clustered by layer around a ring.
  const stars = useMemo(() => {
    const items: { pos: THREE.Vector3; center: THREE.Vector3 }[] = [];
    LAYERS.forEach((layer, li) => {
      const a = (li / N) * Math.PI * 2;
      const center = new THREE.Vector3(Math.cos(a) * 1.2, (N / 2 - li - 0.5) * 0.3, Math.sin(a) * 1.2);
      stack[layer.id].forEach((_, k) => {
        const t = k * 2.399963; // golden angle keeps the scatter even and deterministic
        const r = 0.22 + 0.06 * (k % 4);
        items.push({ pos: center.clone().add(new THREE.Vector3(Math.cos(t) * r, Math.sin(t * 1.7) * 0.18, Math.sin(t) * r)), center });
      });
    });
    const line: number[] = [];
    items.forEach(({ pos, center }) => line.push(pos.x, pos.y, pos.z, center.x, center.y, center.z));
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(line, 3));
    return { items, lines: g };
  }, []);

  useFrame((state, dt) => {
    const c = cur.current;
    const t = target;
    const k = reduced ? 1 : 1 - Math.exp(-3.2 * Math.min(dt, 0.1));
    (Object.keys(c) as (keyof Pose)[]).forEach((key) => {
      c[key] += (t[key] - c[key]) * k;
    });
    pointer.current.x += (signals.pointer.x - pointer.current.x) * (reduced ? 1 : 0.05);
    pointer.current.y += (signals.pointer.y - pointer.current.y) * (reduced ? 1 : 0.05);

    const narrow = size.width < 768;
    const time = state.clock.elapsedTime;
    const idle = reduced ? 0 : Math.sin(time * 0.25) * 0.12;

    // Whole-object fade is done on the canvas element: cheaper and free of transparency sorting.
    const opacity = narrow ? c.opacity * 0.6 : c.opacity;
    if (Math.abs(opacity - lastOpacity.current) > 0.004) {
      state.gl.domElement.style.opacity = opacity.toFixed(3);
      lastOpacity.current = opacity;
    }

    const g = root.current;
    if (!g) return;
    g.position.x = narrow ? 0 : c.x * (viewport.width / 2);
    g.position.y = narrow ? -viewport.height * 0.2 : c.y * viewport.height;
    g.rotation.y = c.rotY + idle + pointer.current.x * 0.14;
    g.rotation.x = c.rotX + pointer.current.y * 0.06;
    const fit = Math.min(1, viewport.width / 7.5);
    g.scale.setScalar(c.scale * (narrow ? 0.62 : fit));

    const con = c.constellation;
    slabGroup.current?.scale.setScalar(Math.max(0.0001, 1 - con));

    const focus = signals.focus;
    LAYERS.forEach((layer, i) => {
      const slab = slabRefs.current[i];
      if (slab) slab.position.y = slabY(i, c.explode);
      const on = focus.length === 0 || focus.includes(layer.id);
      const face = faceMats.current[i];
      if (face) face.color.lerp(focus.includes(layer.id) ? FACE_LIT : FACE, reduced ? 1 : 0.12);
      const edge = edgeMats.current[i];
      if (edge) edge.opacity += ((on ? 0.95 : 0.16) - edge.opacity) * (reduced ? 1 : 0.12);
      const label = labelRefs.current[i];
      if (label) label.style.opacity = String(smooth(0.55, 0.85, c.explode) * (1 - con) * (on ? 1 : 0.35));
    });

    // Packets run down the core's ports between layers, only once the layers have parted.
    const pm = packetMesh.current;
    if (pm) {
      const vis = smooth(0.15, 0.4, c.explode) * (1 - con);
      const top = slabY(0, c.explode);
      const bottom = slabY(N - 1, c.explode);
      for (let i = 0; i < packets; i++) {
        const [px, pz] = PORTS[i % PORTS.length];
        const u = reduced ? (i / packets) % 1 : (time * (0.12 + (i % 3) * 0.04) + i / packets) % 1;
        dummy.position.set(px, top + (bottom - top) * u, pz);
        dummy.scale.setScalar(vis);
        dummy.updateMatrix();
        pm.setMatrixAt(i, dummy.matrix);
      }
      pm.instanceMatrix.needsUpdate = true;
    }

    const sm = starMesh.current;
    if (sm) {
      stars.items.forEach(({ pos }, i) => {
        dummy.position.copy(pos).multiplyScalar(0.6 + 0.4 * con);
        dummy.scale.setScalar(con);
        dummy.rotation.set(time * 0.3, time * 0.2, 0);
        dummy.updateMatrix();
        sm.setMatrixAt(i, dummy.matrix);
      });
      sm.instanceMatrix.needsUpdate = true;
    }
    if (starGroup.current) {
      starGroup.current.visible = con > 0.01;
      starGroup.current.scale.setScalar(0.6 + 0.4 * con);
      if (!reduced) starGroup.current.rotation.y = time * 0.05;
    }
    if (starLines.current) starLines.current.opacity = con * 0.28;
  });

  return (
    <group ref={root}>
      <group ref={slabGroup}>
        {LAYERS.map((layer, i) => (
          <group key={layer.id} ref={(el) => { slabRefs.current[i] = el; }} position={[0, slabY(i, target.explode), 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[SIZES[i].w, THICK, SIZES[i].d]} />
              <meshStandardMaterial ref={(m) => { faceMats.current[i] = m; }} color={FACE} roughness={0.42} metalness={0.55} />
              <Edges threshold={20}>
                <lineBasicMaterial ref={(m) => { edgeMats.current[i] = m; }} color="#f4f4f1" transparent opacity={0.95} />
              </Edges>
            </mesh>
            <lineSegments geometry={grids[i]}>
              <lineBasicMaterial color="#f4f4f1" transparent opacity={0.1} />
            </lineSegments>
            {labels && (
              <Html position={[-SIZES[i].w / 2 - 0.2, 0, SIZES[i].d / 2]} center={false} zIndexRange={[0, 0]} pointerEvents="none">
                <div ref={(el) => { labelRefs.current[i] = el; }} className="label" style={{ opacity: 0, whiteSpace: "nowrap", color: "#f4f4f1", transform: "translate(-100%, -50%)", textAlign: "right" }} aria-hidden="true">
                  <span style={{ color: "#7a7a76" }}>L{i + 1}&nbsp;&nbsp;</span>
                  {layer.label}
                </div>
              </Html>
            )}
          </group>
        ))}
        <instancedMesh ref={packetMesh} args={[undefined, undefined, packets]} frustumCulled={false}>
          <boxGeometry args={[0.045, 0.045, 0.045]} />
          <meshBasicMaterial color="#f4f4f1" />
        </instancedMesh>
      </group>

      <group ref={starGroup} visible={false}>
        <instancedMesh ref={starMesh} args={[undefined, undefined, stars.items.length]} frustumCulled={false}>
          <octahedronGeometry args={[0.05, 0]} />
          <meshStandardMaterial color="#f4f4f1" roughness={0.3} metalness={0.2} emissive="#f4f4f1" emissiveIntensity={0.35} />
        </instancedMesh>
        <lineSegments geometry={stars.lines}>
          <lineBasicMaterial ref={starLines} color="#f4f4f1" transparent opacity={0} />
        </lineSegments>
      </group>
    </group>
  );
}
