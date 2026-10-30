"use client";

import { Edges } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import type { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { stack } from "@/content/stack";
import { LAYERS } from "@/content/types";
import { archEdges, archNodes, blockColor, BLOCKS, FORMATIONS, formation, LAYER_BLOCKS, type Block, type Ctx } from "./formations";
import { signals, target, type Pose } from "./store";

const FACE = new THREE.Color("#0a0e1a");
const colA = new THREE.Color();
const colB = new THREE.Color();
const tint = new THREE.Color();
const MAX_EDGES = 8;
const PACKETS_PER_EDGE = 2;

type Props = { packets: number; labels: boolean; reduced: boolean };

const ease = (t: number) => t * t * (3 - 2 * t);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutBack = (t: number) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2);
const SWEEP_EVERY = 6;
const SWEEP_TIME = 1.4;

/** Where each block starts before the entrance: a wide deterministic cloud around the core. */
const SCATTER = Array.from({ length: BLOCKS }, (_, i) => {
  const a = i * 2.399963;
  const r = 4.2 + (i % 3) * 0.9;
  return { p: [Math.cos(a) * r, ((i % 5) - 2) * 1.3, Math.sin(a) * r - 1.5], r: [i * 1.3, i * 2.1, i * 0.7] };
});
const lerp3 = (a: number[], b: number[], t: number, out: number[]) => {
  out[0] = a[0] + (b[0] - a[0]) * t;
  out[1] = a[1] + (b[1] - a[1]) * t;
  out[2] = a[2] + (b[2] - a[2]) * t;
};
const nowYear = () => {
  const d = new Date();
  return d.getFullYear() + d.getMonth() / 12;
};

export default function SystemCore({ packets, labels, reduced }: Props) {
  const { viewport, size } = useThree();
  const gl = useThree((s) => s.gl);
  const root = useRef<THREE.Group>(null);
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const faceMats = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const edgeMats = useRef<(LineMaterial | null)[]>([]);
  const labelEls = useRef<HTMLDivElement[]>([]);
  const labelText = useRef<string[]>([]);
  const packetMesh = useRef<THREE.InstancedMesh>(null);
  const linkMat = useRef<THREE.LineBasicMaterial>(null);
  const starMesh = useRef<THREE.InstancedMesh>(null);
  const starGroup = useRef<THREE.Group>(null);
  const starLines = useRef<THREE.LineBasicMaterial>(null);
  const cur = useRef<Pose>({ ...target });
  const pointer = useRef({ x: 0, y: 0 });
  const lastOpacity = useRef(-1);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const anchor = useMemo(() => new THREE.Vector3(), []);
  const scan = useRef<THREE.Group>(null);
  const scanLine = useRef<THREE.LineBasicMaterial>(null);
  const scanFill = useRef<THREE.MeshBasicMaterial>(null);
  // Hero physics: hover parting, click burst (a damped spring), drag spin with inertia.
  const phys = useRef({ hover: 0, burst: 0, burstV: 0, spin: 0, spinV: 0, sweepAt: 0 });
  const scanGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute([-1.3, 0, -0.82, 1.3, 0, -0.82, 1.3, 0, 0.82, -1.3, 0, 0.82], 3));
    return g;
  }, []);
  const now = useMemo(() => nowYear(), []);
  const packetCount = Math.min(packets, MAX_EDGES * PACKETS_PER_EDGE);

  // Current blended position of every block, reused by links and packets.
  const liveRef = useRef(Array.from({ length: BLOCKS }, () => ({ p: [0, 0, 0], s: [1, 1, 1], r: [0, 0, 0] })));

  const links = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(MAX_EDGES * 6), 3));
    g.setDrawRange(0, 0);
    return g;
  }, []);

  // Constellation: one point per stack item, clustered by layer around a ring.
  const stars = useMemo(() => {
    const items: { pos: THREE.Vector3; center: THREE.Vector3; color: string }[] = [];
    LAYERS.forEach((layer, li) => {
      const a = (li / LAYERS.length) * Math.PI * 2;
      const center = new THREE.Vector3(Math.cos(a) * 1.2, (LAYERS.length / 2 - li - 0.5) * 0.3, Math.sin(a) * 1.2);
      stack[layer.id].forEach((_, k) => {
        const t = k * 2.399963; // golden angle keeps the scatter even and deterministic
        const r = 0.22 + 0.06 * (k % 4);
        items.push({ pos: center.clone().add(new THREE.Vector3(Math.cos(t) * r, Math.sin(t * 1.7) * 0.18, Math.sin(t) * r)), center, color: layer.color });
      });
    });
    const line: number[] = [];
    items.forEach(({ pos, center }) => line.push(pos.x, pos.y, pos.z, center.x, center.y, center.z));
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(line, 3));
    return { items, lines: g };
  }, []);

  // Each constellation point takes its layer's colour.
  useEffect(() => {
    const sm = starMesh.current;
    if (!sm) return;
    const col = new THREE.Color();
    stars.items.forEach((it, i) => sm.setColorAt(i, col.set(it.color)));
    if (sm.instanceColor) sm.instanceColor.needsUpdate = true;
  }, [stars]);

  // Labels are plain DOM nodes over the canvas, projected from 3D each frame.
  useEffect(() => {
    const host = gl.domElement.parentElement;
    if (!labels || !host) return;
    const layer = document.createElement("div");
    layer.setAttribute("aria-hidden", "true");
    layer.style.cssText = "position:absolute;inset:0;pointer-events:none;overflow:hidden";
    labelEls.current = Array.from({ length: BLOCKS }, () => {
      const el = document.createElement("div");
      el.className = "label";
      el.style.cssText = "position:absolute;left:0;top:0;white-space:nowrap;color:#3be8ff;opacity:0;will-change:transform;text-shadow:0 0 12px currentColor";
      layer.appendChild(el);
      return el;
    });
    host.appendChild(layer);
    return () => {
      layer.remove();
      labelEls.current = [];
      labelText.current = [];
    };
  }, [labels, gl]);

  useFrame((state, dt) => {
    const live = liveRef.current;
    const c = cur.current;
    const k = reduced ? 1 : 1 - Math.exp(-3.2 * Math.min(dt, 0.1));
    (Object.keys(c) as (keyof Pose)[]).forEach((key) => {
      c[key] += (target[key] - c[key]) * k;
    });
    pointer.current.x += (signals.pointer.x - pointer.current.x) * (reduced ? 1 : 0.05);
    pointer.current.y += (signals.pointer.y - pointer.current.y) * (reduced ? 1 : 0.05);

    const narrow = size.width < 768;
    const time = reduced ? 0 : state.clock.elapsedTime;

    // Which two formations we are between, and how far.
    const f = THREE.MathUtils.clamp(c.form, 0, FORMATIONS - 1);
    const f0 = Math.floor(f);
    const f1 = Math.min(f0 + 1, FORMATIONS - 1);
    const t = ease(f - f0);
    const weight = (id: number) => (f0 === id ? 1 - t : 0) + (f1 === id ? t : 0);
    const wArch = weight(3);
    const wStack = weight(5);

    // Whole-object fade on the canvas element: cheaper and free of transparency sorting.
    // On phones the scene sits behind the text, so it steps back once you scroll past the hero.
    const opacity = narrow ? c.opacity * (0.6 - 0.32 * THREE.MathUtils.smoothstep(c.form, 0, 1)) : c.opacity;
    if (Math.abs(opacity - lastOpacity.current) > 0.004) {
      state.gl.domElement.style.opacity = opacity.toFixed(3);
      lastOpacity.current = opacity;
    }

    const g = root.current;
    if (!g) return;

    // Hero interaction, only while the core is assembled.
    const wCore = weight(0) + weight(FORMATIONS - 1);
    const P = phys.current;
    const step = Math.min(dt, 1 / 30);
    if (!reduced) {
      if (signals.bursts > 0) {
        P.burstV += 4.2 * signals.bursts;
        signals.bursts = 0;
      }
      P.burstV += (-38 * P.burst - 6 * P.burstV) * step;
      P.burst += P.burstV * step;
      if (signals.dragging) P.spinV = (signals.dragDelta * 0.012) / Math.max(step, 1 / 120);
      else P.spinV *= Math.exp(-2.2 * step);
      signals.dragDelta = 0;
      P.spin += P.spinV * step;
      if (!signals.dragging && Math.abs(P.spinV) < 0.4) P.spin *= Math.exp(-0.8 * step);
    }

    // Cursor near the core parts its layers.
    anchor.set(0, 0, 0);
    g.localToWorld(anchor).project(state.camera);
    const aspect = size.width / size.height;
    const dist = Math.hypot((signals.pointer.x - anchor.x) * aspect, -signals.pointer.y - anchor.y);
    const near = signals.pointerActive && !narrow ? 1 - THREE.MathUtils.smoothstep(dist, 0.12, 0.6) : 0;
    P.hover += (near - P.hover) * (reduced ? 1 : 0.08);

    // Entrance: blocks fly in from the cloud while the camera pulls in.
    const intro = signals.intro;
    const introCam = 1 - easeOutCubic(intro);
    state.camera.position.z = 7.2 + introCam * 5.5;
    state.camera.position.y = 0.9 + introCam * 1.4;
    if (signals.landed) {
      P.sweepAt = time;
      signals.landed = false;
    }

    const idle = reduced ? 0 : Math.sin(time * 0.25) * 0.12 * (1 - 0.7 * wArch);
    g.position.x = narrow ? 0 : c.x * (viewport.width / 2);
    g.position.y = narrow ? -viewport.height * 0.2 : c.y * viewport.height;
    g.rotation.y = c.rotY + idle + pointer.current.x * 0.14 + P.spin * wCore + introCam * 1.6;
    g.rotation.x = c.rotX + pointer.current.y * 0.06;
    g.scale.setScalar(c.scale * (narrow ? 0.62 : Math.min(1, viewport.width / 7.5)));
    g.updateMatrixWorld();

    const boost = (P.hover * 0.3 + P.burst) * wCore;
    const ctx: Ctx = { time, focus: signals.focus, system: signals.system, arch: signals.arch, now, boost };
    const labelFade = Math.abs(1 - 2 * t); // labels cross-fade through zero while blocks travel

    for (let i = 0; i < BLOCKS; i++) {
      const A: Block = formation(f0, i, ctx);
      const B: Block = formation(f1, i, ctx);
      const L = live[i];
      lerp3(A.p, B.p, t, L.p);
      lerp3(A.s, B.s, t, L.s);
      lerp3(A.r, B.r, t, L.r);
      if (intro < 1) {
        const u = THREE.MathUtils.clamp((intro - i * 0.035) / 0.55, 0, 1);
        const sp = SCATTER[i];
        const k2 = easeOutBack(u);
        const k3 = easeOutCubic(u);
        for (let a = 0; a < 3; a++) {
          L.p[a] = sp.p[a] + (L.p[a] - sp.p[a]) * k2;
          L.r[a] = sp.r[a] + (L.r[a] - sp.r[a]) * k3;
          L.s[a] *= 0.35 + 0.65 * k3;
        }
      }

      const m = meshes.current[i];
      if (m) {
        m.position.set(L.p[0], L.p[1], L.p[2]);
        m.scale.set(L.s[0], L.s[1], L.s[2]);
        m.rotation.set(L.r[0], L.r[1], L.r[2]);
        m.visible = L.s[0] > 0.003 && L.s[1] > 0.003;
      }
      const lit = A.lit + (B.lit - A.lit) * t;
      colA.set(blockColor(i, A));
      colB.set(blockColor(i, B));
      colA.lerp(colB, t);
      // Lit faces take on a dim wash of their own colour.
      tint.copy(colA).multiplyScalar(0.2);
      faceMats.current[i]?.color.lerpColors(FACE, tint, lit);
      const em = edgeMats.current[i];
      if (em) {
        em.color.copy(colA);
        em.opacity += (A.edge + (B.edge - A.edge) * t - em.opacity) * (reduced ? 1 : 0.2);
      }

      // Labels follow the dominant formation and swap text while invisible.
      const el = labelEls.current[i];
      if (el) {
        const D = t < 0.5 ? A : B;
        const text = D.label ?? "";
        if (labelText.current[i] !== text) {
          labelText.current[i] = text;
          el.textContent = text;
          el.style.color = blockColor(i, D);
        }
        const op = text ? labelFade * (1 - wStack) * intro * intro : 0;
        el.style.opacity = op.toFixed(3);
        if (op > 0.001) {
          const la = D.la ?? [0, 0, 0];
          anchor.set(L.p[0] + la[0], L.p[1] + la[1], L.p[2] + la[2]);
          g.localToWorld(anchor).project(state.camera);
          const x = (anchor.x * 0.5 + 0.5) * size.width;
          const y = (-anchor.y * 0.5 + 0.5) * size.height;
          const shift = D.align === "left" ? "-100%" : D.align === "center" ? "-50%" : "0";
          el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(${shift}, -50%)`;
        }
      }
    }

    // Architecture: links and packets follow the selected system's real edges.
    const nodes = archNodes(signals.arch);
    const edges = archEdges(signals.arch).slice(0, MAX_EDGES);
    const pos = links.getAttribute("position") as THREE.BufferAttribute;
    edges.forEach((e, j) => {
      const a = live[LAYER_BLOCKS + nodes.findIndex((n) => n.id === e.from)].p;
      const b = live[LAYER_BLOCKS + nodes.findIndex((n) => n.id === e.to)].p;
      pos.setXYZ(j * 2, a[0], a[1], a[2]);
      pos.setXYZ(j * 2 + 1, b[0], b[1], b[2]);
    });
    pos.needsUpdate = true;
    links.setDrawRange(0, edges.length * 2);
    if (linkMat.current) linkMat.current.opacity = wArch * wArch * 0.7;

    const pm = packetMesh.current;
    if (pm) {
      for (let j = 0; j < packetCount; j++) {
        const e = edges[Math.floor(j / PACKETS_PER_EDGE)];
        if (!e) {
          dummy.scale.setScalar(0);
        } else {
          const a = live[LAYER_BLOCKS + nodes.findIndex((n) => n.id === e.from)].p;
          const b = live[LAYER_BLOCKS + nodes.findIndex((n) => n.id === e.to)].p;
          const u = reduced ? 0.5 : (time * 0.35 + (j % PACKETS_PER_EDGE) / PACKETS_PER_EDGE) % 1;
          dummy.position.set(a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u);
          dummy.scale.setScalar(wArch * wArch);
        }
        dummy.updateMatrix();
        pm.setMatrixAt(j, dummy.matrix);
      }
      pm.instanceMatrix.needsUpdate = true;
    }

    // Scan line: sweeps down the assembled core when the intro lands, then every few seconds.
    const sc = scan.current;
    if (sc) {
      const since = time - P.sweepAt;
      const u = reduced ? 1 : (since % SWEEP_EVERY) / SWEEP_TIME;
      const top = live[0].p[1] + 0.3;
      const bottom = live[LAYER_BLOCKS - 1].p[1] - 0.3;
      const on = u < 1 && since >= 0 ? Math.sin(u * Math.PI) * wCore * (intro >= 1 ? 1 : 0) : 0;
      sc.visible = on > 0.01;
      sc.position.y = top + (bottom - top) * Math.min(u, 1);
      if (scanLine.current) scanLine.current.opacity = on;
      if (scanFill.current) scanFill.current.opacity = on * 0.07;
    }

    const sm = starMesh.current;
    if (sm) {
      stars.items.forEach(({ pos: p }, i) => {
        dummy.position.copy(p).multiplyScalar(0.6 + 0.4 * wStack);
        dummy.scale.setScalar(wStack);
        dummy.rotation.set(time * 0.3, time * 0.2, 0);
        dummy.updateMatrix();
        sm.setMatrixAt(i, dummy.matrix);
      });
      sm.instanceMatrix.needsUpdate = true;
    }
    if (starGroup.current) {
      starGroup.current.visible = wStack > 0.01;
      starGroup.current.rotation.y = time * 0.05;
    }
    if (starLines.current) starLines.current.opacity = wStack * 0.28;
  });

  return (
    <group ref={root}>
      {Array.from({ length: BLOCKS }, (_, i) => (
        <mesh key={i} ref={(el) => { meshes.current[i] = el; }} visible={i < LAYER_BLOCKS}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial ref={(m) => { faceMats.current[i] = m; }} color={FACE} roughness={0.42} metalness={0.55} />
          {/* drei's Edges draws its own fat-line material; take it from the ref to drive colour and opacity. */}
          <Edges
            threshold={20}
            ref={(e: LineSegments2 | null) => { edgeMats.current[i] = e ? (e.material as LineMaterial) : null; }}
            color="#3be8ff"
            lineWidth={1.4}
            transparent
            opacity={0.95}
            toneMapped={false}
          />
        </mesh>
      ))}

      <group ref={scan} visible={false}>
        <lineLoop geometry={scanGeo}>
          <lineBasicMaterial ref={scanLine} color="#7ff3ff" transparent opacity={0} toneMapped={false} />
        </lineLoop>
        <mesh rotation-x={-Math.PI / 2}>
          <planeGeometry args={[2.6, 1.64]} />
          <meshBasicMaterial ref={scanFill} color="#3be8ff" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      </group>

      <lineSegments geometry={links}>
        <lineBasicMaterial ref={linkMat} color="#a08bff" transparent opacity={0} toneMapped={false} />
      </lineSegments>
      <instancedMesh ref={packetMesh} args={[undefined, undefined, packetCount]} frustumCulled={false}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color="#7ff3ff" toneMapped={false} />
      </instancedMesh>

      <group ref={starGroup} visible={false}>
        <instancedMesh ref={starMesh} args={[undefined, undefined, stars.items.length]} frustumCulled={false}>
          <octahedronGeometry args={[0.05, 0]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </instancedMesh>
        <lineSegments geometry={stars.lines}>
          <lineBasicMaterial ref={starLines} color="#a08bff" transparent opacity={0} toneMapped={false} />
        </lineSegments>
      </group>
    </group>
  );
}
