"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { ACTORS, archEdges, archNodes, FORMATIONS, MODELS, place, type Ctx, type ModelId, type Place } from "./formations";
import { signals, target, type Pose } from "./store";

const url = (m: ModelId) => `/models/${m}.glb`;
MODELS.forEach((m) => useGLTF.preload(url(m), false, true));

/** Metres → scene units: the hero box (0.6 m) ends up about two units wide. */
const K = 3.2;
const MAX_EDGES = 8;
const PACKETS_PER_EDGE = 2;

const ease = (t: number) => t * t * (3 - 2 * t);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutBack = (t: number) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2);
const nowYear = () => {
  const d = new Date();
  return d.getFullYear() + d.getMonth() / 12;
};

/** Where each object starts before the entrance: a wide deterministic cloud around the scene. */
const SCATTER = ACTORS.map((_, i) => {
  const a = i * 2.399963;
  const r = 1.3 + (i % 3) * 0.3;
  return { p: [Math.cos(a) * r, ((i % 5) - 2) * 0.4, Math.sin(a) * r - 0.4], r: [i * 1.3, i * 2.1, i * 0.7] };
});

type ActorProps = { model: ModelId; index: number; register: (i: number, g: THREE.Group | null) => void };

/** One real object: a private copy of the model, bottom-centred so placements can stand it on surfaces. */
function Actor({ model, index, register }: ActorProps) {
  const { scene } = useGLTF(url(model), false, true) as unknown as { scene: THREE.Group };
  const object = useMemo(() => {
    const copy = scene.clone(true);
    const box = new THREE.Box3().setFromObject(copy);
    const centre = box.getCenter(new THREE.Vector3());
    copy.position.set(-centre.x, -box.min.y, -centre.z);
    const wrap = new THREE.Group();
    wrap.add(copy);
    // Own materials, so each actor can fade back on its own.
    const mats: THREE.Material[] = [];
    copy.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const list = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).map((m) => m.clone());
      mesh.material = Array.isArray(mesh.material) ? list : list[0];
      mats.push(...list);
    });
    wrap.userData.mats = mats;
    wrap.userData.dim = 1;
    wrap.visible = false;
    return wrap;
  }, [scene]);
  return <primitive object={object} ref={(g: THREE.Group | null) => register(index, g)} />;
}

type Props = { packets: number; labels: boolean; reduced: boolean };

export default function SystemCore({ packets, labels, reduced }: Props) {
  const { viewport, size } = useThree();
  const gl = useThree((s) => s.gl);
  const root = useRef<THREE.Group>(null);
  const actors = useRef<(THREE.Group | null)[]>([]);
  const labelEls = useRef<HTMLDivElement[]>([]);
  const labelText = useRef<string[]>([]);
  const packetMesh = useRef<THREE.InstancedMesh>(null);
  const linkMat = useRef<THREE.LineBasicMaterial>(null);
  const cur = useRef<Pose>({ ...target });
  const pointer = useRef({ x: 0, y: 0 });
  const lastOpacity = useRef(-1);
  const phys = useRef({ hover: 0, burst: 0, burstV: 0, spin: 0, spinV: 0 });
  const liveRef = useRef(ACTORS.map(() => ({ p: [0, 0, 0], r: [0, 0, 0], s: [1, 1, 1] })));
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const anchor = useMemo(() => new THREE.Vector3(), []);
  const now = useMemo(() => nowYear(), []);
  const packetCount = Math.min(packets, MAX_EDGES * PACKETS_PER_EDGE);
  const register = useMemo(
    () => (i: number, g: THREE.Group | null) => {
      actors.current[i] = g;
    },
    [],
  );

  const links = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(MAX_EDGES * 6), 3));
    g.setDrawRange(0, 0);
    return g;
  }, []);

  // Labels are plain DOM nodes over the canvas, projected from 3D each frame.
  useEffect(() => {
    const host = gl.domElement.parentElement;
    if (!labels || !host) return;
    const layer = document.createElement("div");
    layer.setAttribute("aria-hidden", "true");
    layer.style.cssText = "position:absolute;inset:0;pointer-events:none;overflow:hidden";
    labelEls.current = ACTORS.map(() => {
      const el = document.createElement("div");
      el.className = "label";
      el.style.cssText = "position:absolute;left:0;top:0;white-space:nowrap;color:#1f2370;opacity:0;will-change:transform;background:#ffd84a;padding:3px 7px;box-shadow:2px 2px 0 #1f2370";
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
    const wCore = weight(0) + weight(FORMATIONS - 1);

    // On phones the scene sits behind the text, so it steps back once you scroll past the hero.
    const opacity = narrow ? c.opacity * (0.6 - 0.32 * THREE.MathUtils.smoothstep(c.form, 0, 1)) : c.opacity;
    if (Math.abs(opacity - lastOpacity.current) > 0.004) {
      state.gl.domElement.style.opacity = opacity.toFixed(3);
      lastOpacity.current = opacity;
    }

    const g = root.current;
    if (!g) return;

    // Hero and contact are playable: a click pops things up on a damped spring, a drag spins.
    const P = phys.current;
    const step = Math.min(dt, 1 / 30);
    if (!reduced) {
      if (signals.bursts > 0) {
        P.burstV += 3.2 * signals.bursts;
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
    anchor.set(0, 0, 0);
    g.localToWorld(anchor).project(state.camera);
    const aspect = size.width / size.height;
    const dist = Math.hypot((signals.pointer.x - anchor.x) * aspect, -signals.pointer.y - anchor.y);
    const near = signals.pointerActive && !narrow ? 1 - THREE.MathUtils.smoothstep(dist, 0.12, 0.6) : 0;
    P.hover += (near - P.hover) * (reduced ? 1 : 0.08);

    // Entrance: objects fly in from the cloud while the camera pulls in.
    const intro = signals.intro;
    const introCam = 1 - easeOutCubic(intro);
    state.camera.position.z = 7.2 + introCam * 5.5;
    state.camera.position.y = 0.9 + introCam * 1.4;
    signals.landed = false;

    const idle = reduced ? 0 : Math.sin(time * 0.25) * 0.12 * (1 - 0.7 * wArch);
    g.position.x = narrow ? 0 : c.x * (viewport.width / 2);
    // Phones: the scene sits in the gap between the hero name block and the summary.
    g.position.y = narrow ? viewport.height * 0.01 : c.y * viewport.height;
    g.rotation.y = c.rotY + idle + pointer.current.x * 0.14 + P.spin * wCore + introCam * 1.6;
    g.rotation.x = c.rotX + pointer.current.y * 0.06;
    g.scale.setScalar(K * c.scale * (narrow ? 0.62 : Math.min(1, viewport.width / 7.5)));
    g.updateMatrixWorld();

    const boost = (P.hover * 0.08 + P.burst * 0.18) * wCore;
    const ctx: Ctx = { time, focus: signals.focus, system: signals.system, arch: signals.arch, now, boost };
    const labelFade = Math.abs(1 - 2 * t); // labels cross-fade through zero while objects travel

    ACTORS.forEach((actor, i) => {
      const A: Place = place(f0, actor.key, ctx);
      const B: Place = place(f1, actor.key, ctx);
      const L = live[i];
      for (let a = 0; a < 3; a++) {
        L.p[a] = A.p[a] + (B.p[a] - A.p[a]) * t;
        L.r[a] = A.r[a] + (B.r[a] - A.r[a]) * t;
        L.s[a] = A.s[a] + (B.s[a] - A.s[a]) * t;
      }
      if (intro < 1) {
        const u = THREE.MathUtils.clamp((intro - (i % 12) * 0.03) / 0.55, 0, 1);
        const sp = SCATTER[i];
        const k2 = easeOutBack(u);
        const k3 = easeOutCubic(u);
        for (let a = 0; a < 3; a++) {
          L.p[a] = sp.p[a] + (L.p[a] - sp.p[a]) * k2;
          L.r[a] = sp.r[a] + (L.r[a] - sp.r[a]) * k3;
          L.s[a] *= 0.3 + 0.7 * k3;
        }
      }

      const obj = actors.current[i];
      if (obj) {
        obj.position.set(L.p[0], L.p[1], L.p[2]);
        obj.rotation.set(L.r[0], L.r[1], L.r[2]);
        obj.scale.set(L.s[0], L.s[1], L.s[2]);
        obj.visible = L.s[0] > 0.004 && L.s[1] > 0.004;
        // Fade objects that should step back (unused layers, other systems while one is lifted).
        const dim = A.dim + (B.dim - A.dim) * t;
        const prev = obj.userData.dim as number;
        const next = prev + (dim - prev) * (reduced ? 1 : 0.15);
        if (Math.abs(next - prev) > 0.002 || (next > 0.995 && prev !== 1)) {
          const value = next > 0.995 ? 1 : next;
          obj.userData.dim = value;
          (obj.userData.mats as THREE.Material[]).forEach((m) => {
            m.transparent = value < 1;
            m.opacity = value;
            m.depthWrite = value > 0.6;
          });
        }
      }

      // Labels follow the dominant formation and swap text while invisible.
      const el = labelEls.current[i];
      if (el) {
        const D = t < 0.5 ? A : B;
        const text = D.label ?? "";
        if (labelText.current[i] !== text) {
          labelText.current[i] = text;
          el.textContent = text;
          el.style.boxShadow = `2px 2px 0 ${D.color ?? "#1f2370"}`;
        }
        const op = text ? labelFade * intro * intro : 0;
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
    });

    // Architecture: links and packets run along the selected system's real edges, parcel to parcel.
    const nodes = archNodes(signals.arch);
    const edges = archEdges(signals.arch).slice(0, MAX_EDGES);
    const nodeTop = (id: string) => {
      const p = live[ACTORS.findIndex((a) => a.key === `node${nodes.findIndex((n) => n.id === id)}`)].p;
      return [p[0], p[1] + 0.05, p[2]];
    };
    const pos = links.getAttribute("position") as THREE.BufferAttribute;
    edges.forEach((e, j) => {
      const a = nodeTop(e.from);
      const b = nodeTop(e.to);
      pos.setXYZ(j * 2, a[0], a[1], a[2]);
      pos.setXYZ(j * 2 + 1, b[0], b[1], b[2]);
    });
    pos.needsUpdate = true;
    links.setDrawRange(0, edges.length * 2);
    if (linkMat.current) linkMat.current.opacity = wArch * wArch * 0.8;

    const pm = packetMesh.current;
    if (pm) {
      for (let j = 0; j < packetCount; j++) {
        const e = edges[Math.floor(j / PACKETS_PER_EDGE)];
        if (!e) {
          dummy.scale.setScalar(0);
        } else {
          const a = nodeTop(e.from);
          const b = nodeTop(e.to);
          const u = reduced ? 0.5 : (time * 0.35 + (j % PACKETS_PER_EDGE) / PACKETS_PER_EDGE) % 1;
          dummy.position.set(a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u);
          dummy.scale.setScalar(wArch * wArch);
        }
        dummy.updateMatrix();
        pm.setMatrixAt(j, dummy.matrix);
      }
      pm.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={root}>
      {ACTORS.map((a, i) => (a.model ? <Actor key={a.key} model={a.model} index={i} register={register} /> : null))}
      <lineSegments geometry={links}>
        <lineBasicMaterial ref={linkMat} color="#c4262f" transparent opacity={0} toneMapped={false} />
      </lineSegments>
      <instancedMesh ref={packetMesh} args={[undefined, undefined, packetCount]} frustumCulled={false}>
        <boxGeometry args={[0.022, 0.022, 0.022]} />
        <meshBasicMaterial color="#c4262f" toneMapped={false} />
      </instancedMesh>
    </group>
  );
}
