"use client";

import { useEffect, useRef, useState } from "react";
import { achievements } from "@/content/achievements";
import { stack } from "@/content/stack";
import { publicSystems } from "@/content/systems";
import { BANNER, FACE } from "./art";

const KEY = "ramiz-ascii";
const tools = Object.values(stack).flat().length;

// The boot log, typed out line by line. Counts come from the content.
const BIOS = [
  "RAMIZ-OS BIOS v26.10  (c) Mohammad Ramiz",
  "CPU: Python 3 · FastAPI · Docker ............ OK",
  `Memory test: ${tools} tools ................... OK`,
  `Mounting /systems (${publicSystems.length}) .......................... OK`,
  `Mounting /awards (${achievements.length}) ........................... OK`,
  "Loading text-mode renderer ................. OK",
  "Starting portfolio.service ................. [ OK ]",
];

/** Runs in <head>: keeps text mode on across pages for the rest of the visit. */
export const asciiScript = `try{if(sessionStorage.getItem('${KEY}'))document.documentElement.dataset.ascii=''}catch(e){}`;

/** Starts the boot from anywhere: the terminal, the command menu. */
export const bootAscii = () => window.dispatchEvent(new Event("boot-ascii"));

/**
 * Text mode. Booting plays a CRT switch-on, a BIOS log and the ASCII banner and mascot, then flips
 * the whole site into a green-phosphor terminal look (html[data-ascii], styled in globals.css).
 * Escape or the [ EXIT ] button powers it back down. Reduced motion skips the animations.
 */
export default function AsciiMode() {
  const [phase, setPhase] = useState<"off" | "boot" | "on" | "shutdown">("off");
  const [lines, setLines] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));
    const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    // Text mode already on from an earlier page of this visit.
    if ("ascii" in root.dataset) later(() => setPhase("on"), 0);

    const boot = () => {
      if ("ascii" in root.dataset) return;
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      if (reduced()) {
        root.dataset.ascii = "";
        setPhase("on");
        return;
      }
      setLines(0);
      setPhase("boot");
      BIOS.forEach((_, i) => later(() => setLines(i + 1), 700 + i * 260));
      // Flip the site underneath while the boot screen is still up, then lift it.
      later(() => (root.dataset.ascii = ""), 700 + BIOS.length * 260 + 900);
      later(() => setPhase("on"), 700 + BIOS.length * 260 + 1500);
    };
    const exit = () => {
      if (!("ascii" in root.dataset)) return;
      try {
        sessionStorage.removeItem(KEY);
      } catch {}
      if (reduced()) {
        delete root.dataset.ascii;
        setPhase("off");
        return;
      }
      setPhase("shutdown");
      later(() => delete root.dataset.ascii, 450);
      later(() => setPhase("off"), 900);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.querySelector("[role='dialog']")) exit();
    };
    window.addEventListener("boot-ascii", boot);
    window.addEventListener("exit-ascii", exit);
    window.addEventListener("keydown", key);
    const pending = timers.current;
    return () => {
      pending.forEach((t) => window.clearTimeout(t));
      window.removeEventListener("boot-ascii", boot);
      window.removeEventListener("exit-ascii", exit);
      window.removeEventListener("keydown", key);
    };
  }, []);

  return (
    <>
      {phase === "boot" && (
        <div className="ascii-boot fixed inset-0 z-[600] overflow-hidden bg-black font-mono text-[#33ff66]" aria-live="polite">
          <div className="ascii-crt-on absolute inset-0 grid content-center justify-items-center gap-6 p-6">
            <div className="grid w-[min(760px,100%)] gap-1 text-[12px] md:text-[14px]">
              {BIOS.slice(0, lines).map((l) => (
                <p key={l} className="whitespace-pre">
                  {l}
                </p>
              ))}
              {lines < BIOS.length && <span className="caret" />}
            </div>
            {lines >= BIOS.length && (
              <div className="ascii-reveal flex w-[min(760px,100%)] flex-wrap items-center gap-6">
                <pre className="text-[5px] leading-[1.05] md:text-[6.5px]" aria-hidden="true">
                  {FACE}
                </pre>
                <div className="grid gap-3">
                  <pre className="ascii-glow text-[7px] leading-none md:text-[11px]" aria-label="RAMIZ">
                    {BANNER}
                  </pre>
                  <p className="text-[12px]">Booting into text mode<span className="caret ml-1" /></p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {phase === "shutdown" && <div className="ascii-crt-off pointer-events-none fixed inset-0 z-[600] bg-black" aria-hidden="true" />}
      {phase === "on" && (
        <button type="button" onClick={() => window.dispatchEvent(new Event("exit-ascii"))} className="ascii-exit fixed bottom-5 left-5 z-[300]" data-cursor="power off">
          [ ESC · exit text mode ]
        </button>
      )}
    </>
  );
}
