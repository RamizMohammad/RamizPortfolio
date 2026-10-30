"use client";

import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import Bloom from "./Bloom";
import IntroDirector from "./IntroDirector";
import SystemCore from "./SystemCore";
import { TIER_SETTINGS } from "./quality";
import { subscribe } from "./store";

/** Mounted after the models resolve: tells the page the 3D is ready, a frame later. */
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

type Props = { tier: "high" | "low"; reduced: boolean; onReady: () => void };

export default function Scene({ tier, reduced, onReady }: Props) {
  const q = TIER_SETTINGS[tier];
  return (
    <Canvas
      dpr={q.dpr}
      frameloop={reduced ? "demand" : "always"}
      camera={{ position: [0, 0.9, 7.2], fov: 32 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
      aria-hidden="true"
    >
            <ambientLight intensity={1.1} color="#fff4e2" />
      <directionalLight position={[-3, 5, 4]} intensity={2.4} color="#ffffff" />
      <directionalLight position={[3, 1.5, -4]} intensity={0.9} color="#ffd9a8" />
      <pointLight position={[-2.5, -1, 2.5]} intensity={2} distance={8} color="#fff1d6" />
      {/* Real PBR models need reflections: a tiny studio of light panels, rendered once, no download. */}
      <Environment resolution={q.environment ? 64 : 32} frames={1}>
          <Lightformer form="rect" intensity={2.2} position={[0, 4, 1]} scale={[8, 1.2, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={2} position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[4, 2, 1]} color="#fff4e2" />
          <Lightformer form="rect" intensity={2} position={[5, 0, -2]} rotation-y={-Math.PI / 2} scale={[4, 2, 1]} color="#ffe2b8" />
      </Environment>
      {/* The models stream in; the poster stays up until every one has loaded. */}
      <Suspense fallback={null}>
        <SystemCore packets={q.packets} labels={q.labels} reduced={reduced} />
        <Ready onReady={onReady} />
        <IntroDirector reduced={reduced} />
      </Suspense>
      {q.shadows && <ContactShadows position={[0, -1.25, 0]} opacity={0.38} scale={10} blur={2.2} far={4} resolution={256} color="#5a4630" />}
      {reduced && <DemandBridge />}
      {q.bloom && <Bloom />}
    </Canvas>
  );
}
