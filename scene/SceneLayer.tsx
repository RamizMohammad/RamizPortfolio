"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useState, type ReactNode } from "react";
import { detectTier, type Tier } from "./quality";
import { signals } from "./store";

// three.js and R3F load only on the client, after the page is interactive.
const Scene = dynamic(() => import("./Scene"), { ssr: false });
// GSAP only drives the scene, so it loads with it and never on devices without 3D.
const ScrollDirector = dynamic(() => import("@/motion/ScrollDirector"), { ssr: false });

const whenIdle = (fn: () => void) => {
  if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(fn, { timeout: 1500 });
  else setTimeout(fn, 300);
};

export default function SceneLayer() {
  const [tier, setTier] = useState<Tier | null>(null);
  const [reduced, setReduced] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const start = () =>
      whenIdle(() => {
        setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
        setTier(detectTier());
      });
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      signals.pointerActive = true;
      signals.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      signals.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    if (tier === "off" || failed) document.documentElement.dataset.scene = "off";
  }, [tier, failed]);

  const live = tier && tier !== "off" && !failed ? tier : null;

  // The poster is a still of the town: it shows until WebGL is ready, and stays when 3D is off.
  return (
    <div className="world" aria-hidden="true">
      <div className="world-poster" />
      {live && (
        <div className="scene-layer">
          <ScrollDirector />
          <SceneBoundary onError={() => setFailed(true)}>
            <Scene tier={live} reduced={reduced} onReady={() => (document.documentElement.dataset.scene = "on")} />
          </SceneBoundary>
        </div>
      )}
    </div>
  );
}

/** A WebGL failure falls back to the poster instead of breaking the page. */
class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
