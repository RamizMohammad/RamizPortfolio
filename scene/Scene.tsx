"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import IntroDirector from "./IntroDirector";
import { TIER_SETTINGS } from "./quality";
import { subscribe } from "./store";
import CameraRig from "./world/CameraRig";
import { PaperGround } from "./world/kit";
import Town from "./world/places";

/** Mounted after textures and fonts resolve: tells the page the 3D is ready, a frame later. */
function Ready({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    const id = requestAnimationFrame(onReady);
    return () => cancelAnimationFrame(id);
  }, [onReady]);
  return null;
}

/** With reduced motion the scene renders only when something changes. */
function DemandBridge() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => subscribe(() => invalidate()), [invalidate]);
  return null;
}

/** A warm low sun whose shadow box follows the place in view, so shadows stay crisp everywhere. */
function Sun({ focus, size }: { focus: React.RefObject<number>; size: number }) {
  const light = useRef<THREE.DirectionalLight>(null);
  const aim = useMemo(() => new THREE.Object3D(), []);
  useFrame(() => {
    const l = light.current;
    if (!l) return;
    const x = focus.current ?? 0;
    l.position.set(x - 6, 12, 9);
    l.target.position.set(x, 0, 0);
    l.target.updateMatrixWorld();
  });
  return (
    <>
      <primitive object={aim} />
      <directionalLight
        ref={light}
        target={aim}
        intensity={2.4}
        color="#fff3df"
        castShadow
        shadow-mapSize={[size, size]}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-radius={4}
      />
    </>
  );
}

type Props = { tier: "high" | "low"; reduced: boolean; onReady: () => void };

export default function Scene({ tier, reduced, onReady }: Props) {
  const q = TIER_SETTINGS[tier];
  const focus = useRef(0);
  return (
    <Canvas
      dpr={q.dpr}
      shadows={q.shadows ? "soft" : true}
      frameloop={reduced ? "demand" : "always"}
      camera={{ position: [0, 4, 11], fov: 34, near: 0.1, far: 200 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => gl.setClearColor("#fbf3e6", 1)}
      aria-hidden="true"
    >
      <fog attach="fog" args={["#fbf3e6", 26, 60]} />
      <hemisphereLight args={["#fffaf0", "#e8d6b8", 1.35]} />
      <Sun focus={focus} size={q.shadows ? 2048 : 1024} />
      <PaperGround />
      <Suspense fallback={null}>
        <Town />
        <Ready onReady={onReady} />
        <IntroDirector reduced={reduced} />
      </Suspense>
      <CameraRig
        reduced={reduced}
        onLight={(x) => {
          focus.current = x;
        }}
      />
      {reduced && <DemandBridge />}
    </Canvas>
  );
}
