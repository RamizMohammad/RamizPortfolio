"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { HalfFloatType, Vector2, WebGLRenderTarget } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

/** Soft glow on the brightest pixels only: the white edges, packets and scan line. Faces stay matte. */
export default function Bloom() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);

  const composer = useMemo(() => {
    // Multisampled target keeps the thin edge lines antialiased through the post pass.
    const c = new EffectComposer(gl, new WebGLRenderTarget(1, 1, { samples: 4, type: HalfFloatType }));
    c.addPass(new RenderPass(scene, camera));
    c.addPass(new UnrealBloomPass(new Vector2(256, 256), 0.6, 0.55, 0.72));
    c.addPass(new OutputPass());
    return c;
  }, [gl, scene, camera]);

  useEffect(() => {
    composer.setPixelRatio(gl.getPixelRatio());
    composer.setSize(size.width, size.height);
  }, [composer, gl, size]);

  useEffect(() => () => composer.dispose(), [composer]);

  // Priority 1 takes over rendering from R3F for this canvas.
  useFrame((_, dt) => composer.render(dt), 1);
  return null;
}
