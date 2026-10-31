"use client";

import { useEffect, useRef, useState } from "react";
import { publicSystems } from "@/content/systems";
import { bootAscii } from "./ascii/AsciiMode";

const SESSION = [
  { cmd: "whoami", out: "mohammad-ramiz — software engineer @ moglix" },
  { cmd: "cat focus.txt", out: "llm agents · backend apis · automation · infrastructure" },
  { cmd: "ls ~/systems", out: publicSystems.map((s) => s.slug).join("  ") },
];

// Commands are typed character by character; output appears all at once, as in a real shell.
const STEPS = SESSION.flatMap((s) => [...[...s.cmd].map(() => 1), s.out.length]);
const TOTAL = STEPS.reduce((a, b) => a + b, 0);
// Where each command and its output start in the stream of typed characters.
const STARTS = SESSION.map((_, i) => SESSION.slice(0, i).reduce((n, s) => n + s.cmd.length + s.out.length, 0));
const part = (text: string, start: number, shown: number) => text.slice(0, Math.max(0, shown - start));

/**
 * A short shell session that types itself once, when it comes into view. Decorative; every fact in it
 * is also on the page as real text, so it is hidden from assistive technology.
 */
export default function Terminal() {
  const [shown, setShown] = useState(0);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let step = 0;
    let count = 0;
    let timer = 0;
    const tick = () => {
      count += STEPS[step];
      const wasOutput = STEPS[step] > 1;
      step += 1;
      setShown(count);
      if (step < STEPS.length) timer = window.setTimeout(tick, wasOutput ? 520 : 42 + Math.random() * 50);
    };
    // Starts typing the first time it scrolls into view.
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      timer = reduced ? window.setTimeout(() => setShown(TOTAL), 0) : window.setTimeout(tick, 400);
    }, { threshold: 0.4 });
    if (box.current) io.observe(box.current);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  return (
    // Clicking the terminal boots the whole site into text mode.
    <button
      type="button"
      onClick={bootAscii}
      aria-label="Boot the site into text mode"
      data-cursor="boot it"
      className="terminal-boot group block w-full cursor-pointer rounded-[24px] text-left focus-visible:outline-offset-4"
    >
    <div ref={box} aria-hidden="true" className="nc rounded-[24px] border-[1.5px] border-ink bg-ink p-6 font-mono text-paper text-[13px] leading-[1.7] font-normal transition-transform duration-300 group-hover:-translate-y-1 md:text-[15px]">
      <div className="mb-5 flex gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-pink" />
        <span className="h-2.5 w-2.5 rounded-full bg-sun" />
        <span className="h-2.5 w-2.5 rounded-full bg-mint" />
      </div>
      {/* The full session sits underneath, invisible, so the box never changes size while typing. */}
      <div className="grid">
        <div className="invisible col-start-1 row-start-1">
          {SESSION.map((s) => (
            <div key={s.cmd} className="mb-3">
              <div>$ {s.cmd}</div>
              <div>{s.out}</div>
            </div>
          ))}
          <span className="caret" />
        </div>
        <div className="col-start-1 row-start-1">
          {SESSION.map((s, i) => {
            if (shown <= STARTS[i]) return null;
            const cmd = part(s.cmd, STARTS[i], shown);
            const out = part(s.out, STARTS[i] + s.cmd.length, shown);
            return (
              <div key={s.cmd} className="mb-3">
                <div>
                  <span className="text-[#a9a5bf]">$ </span>
                  {cmd}
                </div>
                {out && <div className="text-[#a9a5bf]">{out}</div>}
              </div>
            );
          })}
          {shown >= TOTAL && <span className="text-[#a9a5bf]">$ </span>}
          <span className="caret" />
        </div>
      </div>
      <p className="mt-4 border-t border-dashed border-[#a9a5bf]/40 pt-3 text-[12px] text-lime">
        ▸ click to boot this site in text mode
      </p>
    </div>
    </button>
  );
}
