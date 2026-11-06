"use client";

import { useEffect, useRef } from "react";

type Size = { w: number; h: number; dpr: number };

/**
 * Draws the ribbon on a 2D context. Self-contained on purpose (it refers to nothing outside
 * itself), so the same code can run in a worker, from its source text, or on the main thread.
 * Time is measured from a shared wall-clock start, so a frame drawn on the page and the worker's
 * next frame line up; onFirstPaint fires once, after the first frame is on the canvas.
 */
function ribbonProgram(onFirstPaint?: () => void) {
  const STRANDS = 26;
  let ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D | null = null;
  let canvas: OffscreenCanvas | HTMLCanvasElement | null = null;
  let w = 0;
  let h = 0;
  let reduced = false;
  let running = false;
  let timer: ReturnType<typeof setTimeout> | number = 0;
  let painted = false;
  const clock = () => performance.timeOrigin + performance.now();
  let start = clock();
  // requestAnimationFrame exists in dedicated workers in current browsers; a timer is the fallback.
  const frame: (cb: (t: number) => void) => unknown =
    typeof requestAnimationFrame === "function" ? requestAnimationFrame : (cb) => setTimeout(() => cb(performance.now()), 33);

  const centre = (u: number, t: number) => h * (0.56 + 0.17 * Math.sin(u * 5.2 - t * 0.45 + 0.6) + 0.07 * Math.sin(u * 11 + t * 0.3));
  const half = (u: number, t: number) => Math.max(w, 900) * 0.072 * (0.62 + 0.38 * Math.cos(u * 6.1 - t * 0.35));

  /** Draws the ribbon as it is at a wall-clock moment (ms since the epoch). */
  const paint = (at: number) => {
    if (!ctx) return;
    const t = reduced ? 2 : (at - start) / 1000;
    ctx.clearRect(0, 0, w, h);
    const steps = Math.max(60, Math.round(w / 14));
    const xs = new Float32Array(steps + 1);
    const ys = new Float32Array(steps + 1);
    const nx = new Float32Array(steps + 1);
    const ny = new Float32Array(steps + 1);
    const rs = new Float32Array(steps + 1);
    for (let i = 0; i <= steps; i++) {
      const u = i / steps;
      const y = centre(u, t);
      const dy = (centre(u + 0.001, t) - y) / (0.00112 * w);
      const len = Math.hypot(1, dy);
      xs[i] = -0.06 * w + u * 1.12 * w;
      ys[i] = y;
      nx[i] = -dy / len;
      ny[i] = 1 / len;
      rs[i] = half(u, t);
    }
    const width = Math.max(w, 900) * 0.0068;
    ctx.lineCap = "round";
    for (let s = 0; s < STRANDS; s++) {
      const o = (s / (STRANDS - 1)) * 2 - 1; // -1 top edge … 1 bottom edge
      // Lit from above: light pink on top, deeper rose underneath, a sheen just above centre.
      const lit = 1 - (o + 1) / 2;
      const sheen = Math.exp(-((o + 0.35) ** 2) / 0.05) * 0.35;
      const r = Math.min(255, Math.round(232 + 20 * lit + 10 * sheen));
      const g = Math.min(255, Math.round(96 + 70 * lit + 50 * sheen));
      const b = Math.min(255, Math.round(128 + 50 * lit + 40 * sheen));
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const px = xs[i] + nx[i] * rs[i] * o;
        const py = ys[i] + ny[i] * rs[i] * o;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = `rgb(${r},${g},${b})`;
      ctx.lineWidth = width;
      ctx.stroke();
      // The groove between strands.
      ctx.strokeStyle = "rgba(150,30,70,0.18)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    if (!painted) {
      painted = true;
      onFirstPaint?.();
    }
  };

  let last = -Infinity;
  const loop = (time: number) => {
    timer = 0;
    if (!running) return;
    // The wave is slow, so 30 frames a second looks the same and halves the work.
    if (time - last >= 32) {
      last = time;
      paint(performance.timeOrigin + time);
    }
    timer = frame(loop) as number;
  };

  return {
    init(c: OffscreenCanvas | HTMLCanvasElement, size: Size, reduce: boolean, startAt?: number) {
      if (startAt) start = startAt;
      canvas = c;
      ctx = c.getContext("2d") as OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D | null;
      reduced = reduce;
      this.resize(size);
    },
    resize({ w: nw, h: nh, dpr }: Size) {
      if (!canvas || !ctx) return;
      w = nw;
      h = nh;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paint(clock());
    },
    run(on: boolean) {
      running = on && !reduced;
      if (running && !timer) timer = frame(loop) as number;
    },
  };
}

/**
 * Runs inline, straight after the poster canvas in the HTML, so the first frame is on screen as
 * soon as the browser reaches it, long before the site's JavaScript has downloaded. It shares its
 * start time on window so the worker's frames carry on from the same moment.
 */
const POSTER_SCRIPT = `try{(function(){var c=document.currentScript.previousElementSibling,s=performance.timeOrigin+performance.now();window.__ribbonStart=s;(${ribbonProgram.toString()})().init(c,{w:c.clientWidth,h:c.clientHeight,dpr:Math.min(window.devicePixelRatio||1,1.25)},matchMedia("(prefers-reduced-motion: reduce)").matches,s);c.dataset.drawn="1"})()}catch(e){}`;

type Message = { type: "resize"; size: Size } | { type: "run"; on: boolean };

/**
 * One drawing surface per canvas. A canvas can hand its surface to a worker only once, and React
 * runs effects twice in development, so the worker is kept with the canvas and reused.
 */
const surfaces = new WeakMap<HTMLCanvasElement, { send: (m: Message) => void; dispose: () => void }>();

// In a worker, the program listens for messages from the page.
const WORKER_SOURCE = `const ribbon=(${ribbonProgram.toString()})(()=>postMessage({type:"drawn"}));onmessage=(e)=>{const m=e.data;if(m.type==="init")ribbon.init(m.canvas,m.size,m.reduced,m.start);else if(m.type==="resize")ribbon.resize(m.size);else if(m.type==="run")ribbon.run(m.on)};`;

/**
 * A soft pink ribbon of grooved strands waving behind the wordmark. Drawn in 2D canvas: each strand
 * is an offset of one centre curve, shaded from light (top edge) to deep (bottom edge), and the
 * width breathes along the curve so the band seems to twist in depth.
 *
 * It is drawn in a worker (OffscreenCanvas), so scrolling and everything else on the main thread
 * never waits for it, at 30 frames a second, and only while the hero is on screen and motion is on.
 * A worker takes a moment to start, so the very first frame is drawn straight away on a second
 * canvas on the page (a "poster"), which steps aside once the worker's own first frame is up.
 */
export default function Ribbon() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const poster = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // A soft, blurry-edged band: 1.25x is indistinguishable from retina here and draws ~2.5x fewer pixels.
    const size = (): Size => ({ w: c.clientWidth, h: c.clientHeight, dpr: Math.min(window.devicePixelRatio || 1, 1.25) });
    let visible = true;
    const shouldRun = () => visible && !document.hidden && !document.documentElement.dataset.paused;

    const p = poster.current;
    // The poster is only needed until the worker has drawn; this also frees its pixels.
    const dropPoster = () => {
      if (!p) return;
      p.style.display = "none";
      p.width = p.height = 0;
    };

    let surface = surfaces.get(c);
    if (!surface) {
      if ("transferControlToOffscreen" in c) {
        const shared = (window as Window & { __ribbonStart?: number }).__ribbonStart;
        const start = shared ?? performance.timeOrigin + performance.now();
        // Frame one is normally already up (drawn by the inline script); if not, draw it now.
        if (p && !p.dataset.drawn) ribbonProgram().init(p, size(), reduced, start);
        const url = URL.createObjectURL(new Blob([WORKER_SOURCE], { type: "text/javascript" }));
        const worker = new Worker(url);
        // Swap only after the worker's frame has reached the screen, so there is never a blank frame.
        worker.onmessage = (e) => e.data?.type === "drawn" && requestAnimationFrame(() => requestAnimationFrame(dropPoster));
        const off = c.transferControlToOffscreen();
        worker.postMessage({ type: "init", canvas: off, size: size(), reduced, start }, [off]);
        surface = {
          send: (m) => worker.postMessage(m),
          dispose: () => {
            worker.terminate();
            URL.revokeObjectURL(url);
          },
        };
      } else {
        const ribbon = ribbonProgram();
        ribbon.init(c, size(), reduced);
        dropPoster();
        surface = { send: (m) => (m.type === "resize" ? ribbon.resize(m.size) : ribbon.run(m.on)), dispose: () => ribbon.run(false) };
      }
      surfaces.set(c, surface);
    } else dropPoster();
    const send = surface.send;
    const sync = () => send({ type: "run", on: shouldRun() });
    sync();

    const ro = new ResizeObserver(() => send({ type: "resize", size: size() }));
    ro.observe(c);
    // Stop drawing when the hero is off screen, the tab is hidden or the visitor pauses motion.
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    });
    io.observe(c);
    window.addEventListener("motion-toggle", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("motion-toggle", sync);
      document.removeEventListener("visibilitychange", sync);
      send({ type: "run", on: false });
      // Only let the worker go once the canvas has really left the page (not on a development re-run).
      window.setTimeout(() => {
        if (!c.isConnected) {
          surfaces.get(c)?.dispose();
          surfaces.delete(c);
        }
      }, 0);
    };
  }, []);

  return (
    <>
      <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 h-full w-full" />
      <canvas ref={poster} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
      {/* The function's compiled text differs between the server and browser bundles, which is fine: it only ever runs from the HTML. */}
      <script dangerouslySetInnerHTML={{ __html: POSTER_SCRIPT }} suppressHydrationWarning />
    </>
  );
}
