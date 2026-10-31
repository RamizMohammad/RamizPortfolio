"use client";

import { useEffect, useState } from "react";

const SESSION = [
  { cmd: "whoami", out: "mohammad-ramiz — software engineer @ moglix" },
  { cmd: "cat focus.txt", out: "automation · backend apis · infrastructure" },
  { cmd: "ls ~/systems", out: "buddycode  linkium  backup-engine  confess  confess-web  timefold" },
];

// Commands are typed character by character; output appears all at once, as in a real shell.
const STEPS = SESSION.flatMap((s) => [...[...s.cmd].map(() => 1), s.out.length]);
const TOTAL = STEPS.reduce((a, b) => a + b, 0);
// Where each command and its output start in the stream of typed characters.
const STARTS = SESSION.map((_, i) => SESSION.slice(0, i).reduce((n, s) => n + s.cmd.length + s.out.length, 0));
const part = (text: string, start: number, shown: number) => text.slice(0, Math.max(0, shown - start));

/**
 * The hero artifact: a short shell session that types itself once. Decorative; every fact in it
 * is also on the page as real text, so it is hidden from assistive technology.
 */
export default function Terminal() {
  const [shown, setShown] = useState(0);

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
    timer = reduced ? window.setTimeout(() => setShown(TOTAL), 0) : window.setTimeout(tick, 700);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div aria-hidden="true" className="nc rounded-[12px] bg-bark p-6 font-mono text-[13px] leading-[1.7] font-normal md:text-[15px]">
      <div className="mb-5 flex gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-cork" />
        <span className="h-2.5 w-2.5 rounded-full bg-cork" />
        <span className="h-2.5 w-2.5 rounded-full bg-cork" />
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
                  <span className="text-muted">$ </span>
                  {cmd}
                </div>
                {out && <div className="text-muted">{out}</div>}
              </div>
            );
          })}
          {shown >= TOTAL && <span className="text-muted">$ </span>}
          <span className="caret" />
        </div>
      </div>
    </div>
  );
}
