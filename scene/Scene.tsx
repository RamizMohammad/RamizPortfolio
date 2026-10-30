"use client";

import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import SystemCore from "./SystemCore";
import { TIER_SETTINGS } from "./quality";
import { subscribe } from "./store";

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
        requestAnimationFrame(onReady);
      }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.25} />
      <directionalLight position={[-3, 5, 4]} intensity={2.4} />
      <directionalLight position={[3, 1.5, -4]} intensity={1.4} />
      {q.environment && (
        <Environment resolution={64} frames={1}>
          <Lightformer form="rect" intensity={2.5} position={[0, 4, 1]} scale={[8, 1.2, 1]} />
          <Lightformer form="rect" intensity={1.2} position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[4, 2, 1]} />
          <Lightformer form="rect" intensity={0.6} position={[5, 0, -2]} rotation-y={-Math.PI / 2} scale={[4, 2, 1]} />
        </Environment>
      )}
      <SystemCore packets={q.packets} labels={q.labels} reduced={reduced} />
      {q.shadows && <ContactShadows position={[0, -1.7, 0]} opacity={0.55} scale={9} blur={2.6} far={3.5} resolution={256} color="#000000" />}
      {reduced && <DemandBridge />}
    </Canvas>
  );
}
