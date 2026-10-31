"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A number that counts up from `from` the first time it scrolls into view. The final value is
 * what renders on the server, so it is always correct without JavaScript or with reduced motion.
 */
export default function CountUp({ value, from = 0, ms = 1200 }: { value: number; from?: number; ms?: number }) {
  const [n, setN] = useState(value);
  const el = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !el.current) return;
    let raf = requestAnimationFrame(() => setN(from));
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now() + 250;
      const step = (now: number) => {
        const t = Math.min(1, Math.max(0, (now - start) / ms));
        const eased = 1 - Math.pow(1 - t, 4);
        setN(Math.round(from + (value - from) * eased));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, { threshold: 0.2 });
    io.observe(el.current);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, from, ms]);

  return (
    <span ref={el} className="tabular-nums">
      {n}
    </span>
  );
}
