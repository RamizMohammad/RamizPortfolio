"use client";

import { useEffect, useRef } from "react";

const STRANDS = 26;

/**
 * A soft pink ribbon of grooved strands waving behind the wordmark. Drawn in 2D canvas: each strand
 * is an offset of one centre curve, shaded from light (top edge) to deep (bottom edge), and the
 * width breathes along the curve so the band seems to twist in depth.
 */
export default function Ribbon() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Centre line and half-width of the band at horizontal position u (0..1) and time t (seconds).
    const centre = (u: number, t: number) =>
      h * (0.56 + 0.17 * Math.sin(u * 5.2 - t * 0.45 + 0.6) + 0.07 * Math.sin(u * 11 + t * 0.3));
    const half = (u: number, t: number) => Math.max(w, 900) * 0.072 * (0.62 + 0.38 * Math.cos(u * 6.1 - t * 0.35));

    const draw = (time: number) => {
      const t = reduced ? 2 : (time - start) / 1000;
      ctx.clearRect(0, 0, w, h);
      const steps = Math.max(80, Math.round(w / 8));
      // Points along the curve with their normals, computed once per frame.
      const pts: { x: number; y: number; nx: number; ny: number; r: number }[] = [];
      for (let i = 0; i <= steps; i++) {
        const u = i / steps;
        const x = -0.06 * w + u * 1.12 * w;
        const y = centre(u, t);
        const dy = (centre(u + 0.001, t) - y) / (0.00112 * w);
        const len = Math.hypot(1, dy);
        pts.push({ x, y, nx: -dy / len, ny: 1 / len, r: half(u, t) });
      }
      for (let s = 0; s < STRANDS; s++) {
        const o = (s / (STRANDS - 1)) * 2 - 1; // -1 top edge … 1 bottom edge
        // Lit from above: light pink on top, deeper rose underneath, a sheen just above centre.
        const lit = 1 - (o + 1) / 2;
        const sheen = Math.exp(-((o + 0.35) ** 2) / 0.05) * 0.35;
        const r = Math.round(232 + 20 * lit + 10 * sheen);
        const g = Math.round(96 + 70 * lit + 50 * sheen);
        const b = Math.round(128 + 50 * lit + 40 * sheen);
        ctx.beginPath();
        pts.forEach((p, i) => {
          const px = p.x + p.nx * p.r * o;
          const py = p.y + p.ny * p.r * o;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.strokeStyle = `rgb(${Math.min(r, 255)},${Math.min(g, 255)},${Math.min(b, 255)})`;
        ctx.lineWidth = Math.max(w, 900) * 0.0068;
        ctx.lineCap = "round";
        ctx.stroke();
        // The groove between strands.
        ctx.strokeStyle = "rgba(150,30,70,0.18)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      if (!reduced && visible && !document.documentElement.dataset.paused) raf = requestAnimationFrame(draw);
    };

    const restart = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    };
    resize();
    restart();

    const ro = new ResizeObserver(() => {
      resize();
      restart();
    });
    ro.observe(c);
    // Stop drawing when the hero is off screen or the visitor pauses motion.
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) restart();
    });
    io.observe(c);
    window.addEventListener("motion-toggle", restart);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("motion-toggle", restart);
    };
  }, []);

  return <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
