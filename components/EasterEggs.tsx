"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";

/**
 * Easter eggs. Each one, when found, pops a toast with how many of the set you have found so far
 * (remembered in this browser). Anything on the page can report a find with findEgg(id).
 *
 *  konami  ↑↑↓↓←→←→BA anywhere: a road trip across the bottom of the screen.
 *  sudo    type "sudo": the page shakes, the incident is reported.
 *  hire    type "hire": POST /hire → 201 Created.
 *  honk    click the car on the Experience road.
 *  leet    click the odometer in Experience.
 *  night   visit between midnight and 5am.
 *  console call ramiz() in the browser console.
 */
export const EGGS = {
  konami: { title: "Road trip unlocked", body: "↑↑↓↓←→←→BA. You know the classics. Enjoy the drive." },
  sudo: { title: "Permission denied", body: "You are not in the sudoers file. This incident will be reported." },
  hire: { title: "POST /hire → 201", body: "Request accepted. Response body: one backend engineer, ready to ship.", href: "#contact", cta: "Say hi" },
  honk: { title: "Beep beep", body: "The car is fine, thanks. It runs on coffee and FastAPI." },
  leet: { title: "13.37 yrs", body: "Odometer tampering detected. Rolling it back before anyone notices." },
  night: { title: "Debugging at this hour?", body: "Same. Grab some water; the bug will still be there." },
  console: { title: "Hello, console", body: "Fellow dev spotted. Check the console for the payload." },
} as const;

export type EggId = keyof typeof EGGS;
const KEY = "ramiz-eggs";
const TOTAL = Object.keys(EGGS).length;
const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

export const findEgg = (id: EggId) => window.dispatchEvent(new CustomEvent("egg", { detail: id }));

type Toast = { key: number; id: EggId; count: number; again: boolean };

function remember(id: EggId): { count: number; again: boolean } {
  let found: string[] = [];
  try {
    found = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    if (!Array.isArray(found)) found = [];
  } catch {}
  const again = found.includes(id);
  if (!again) found = [...found, id];
  try {
    localStorage.setItem(KEY, JSON.stringify(found));
  } catch {}
  return { count: found.filter((f) => f in EGGS).length, again };
}

export default function EasterEggs() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [trip, setTrip] = useState(0);
  const seq = useRef(0);

  useEffect(() => {
    const onEgg = (e: Event) => {
      const id = (e as CustomEvent<EggId>).detail;
      if (!(id in EGGS)) return;
      const { count, again } = remember(id);
      const key = ++seq.current;
      setToasts((t) => [...t.slice(-1), { key, id, count, again }]);
      window.setTimeout(() => setToasts((t) => t.filter((x) => x.key !== key)), 5600);
      if (id === "konami") setTrip(key);
      if (id === "sudo") {
        const root = document.documentElement;
        root.classList.remove("egg-shake");
        void root.offsetWidth;
        root.classList.add("egg-shake");
        window.setTimeout(() => root.classList.remove("egg-shake"), 700);
      }
    };
    window.addEventListener("egg", onEgg);

    // Keys: the Konami code, and words typed anywhere outside a text field.
    let pos = 0;
    let typed = "";
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      pos = k === KONAMI[pos] ? pos + 1 : k === KONAMI[0] ? 1 : 0;
      if (pos === KONAMI.length) {
        pos = 0;
        findEgg("konami");
      }
      if (k.length === 1) {
        typed = (typed + k).slice(-8);
        if (typed.endsWith("sudo")) findEgg("sudo");
        if (typed.endsWith("hire")) findEgg("hire");
      }
    };
    window.addEventListener("keydown", onKey);

    // Late-night visitors, once per visit.
    let night = 0;
    const h = new Date().getHours();
    try {
      if (h < 5 && !sessionStorage.getItem("ramiz-night")) {
        sessionStorage.setItem("ramiz-night", "1");
        night = window.setTimeout(() => findEgg("night"), 6000);
      }
    } catch {}

    // For whoever opens the console.
    const w = window as unknown as { ramiz?: () => void };
    w.ramiz = () => {
      console.log(
        "%c{\n  name: %o,\n  role: %o,\n  stack: ['Python', 'FastAPI', 'Kafka', 'Docker', 'LLMs'],\n  status: 'shipping',\n  contact: 'scroll to the bottom, or type hire',\n}",
        "font:13px ui-monospace,monospace",
        profile.name,
        `${profile.role} at ${profile.company}`,
      );
      findEgg("console");
    };
    console.log(
      `%cpsst: ${TOTAL} easter eggs are hidden on this site. Start here: call ramiz()`,
      "background:#121016;color:#d4f25b;font:600 12px ui-monospace,monospace;padding:4px 8px;border-radius:6px",
    );

    return () => {
      window.removeEventListener("egg", onEgg);
      window.removeEventListener("keydown", onKey);
      clearTimeout(night);
      delete w.ramiz;
    };
  }, []);

  return (
    <>
      <div aria-live="polite" className="pointer-events-none fixed bottom-5 left-[var(--edge)] z-[90] grid w-[min(340px,calc(100vw-40px))] gap-2">
        {toasts.map((t) => {
          const egg = EGGS[t.id];
          return (
            <div key={t.key} role="status" className="egg-toast pointer-events-auto relative rounded-[18px] border-[1.5px] border-ink bg-ink p-4 pr-10 text-card shadow-[5px_5px_0_0_var(--color-pink-deep)]">
              <p className="t-micro flex items-center gap-2 text-lime">
                <span aria-hidden="true">★</span> Easter egg · {t.count}/{TOTAL} found{t.again ? " · again" : ""}
              </p>
              <p className="mt-1.5 font-display text-[24px] uppercase leading-none">{egg.title}</p>
              <p className="mt-1.5 text-[14px] leading-snug opacity-80">{egg.body}</p>
              {"href" in egg && (
                <a href={egg.href} className="btn-pill btn-sm mt-3 !border-lime !bg-lime !text-[#121016]">
                  {egg.cta} →
                </a>
              )}
              <button type="button" onClick={() => setToasts((x) => x.filter((y) => y.key !== t.key))} className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full text-[14px] opacity-70 hover:opacity-100" aria-label="Dismiss">
                ✕
              </button>
            </div>
          );
        })}
      </div>

      {trip > 0 && <RoadTrip key={trip} onDone={() => setTrip(0)} />}
    </>
  );
}

const CONFETTI = ["#f47a9a", "#d4f25b", "#2f5bea", "#ffcf3a", "#b9a6f5", "#5fd3a4"];

/** A strip of road across the bottom of the screen; the car drives over and confetti bursts up behind it. */
function RoadTrip({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 4200);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div aria-hidden="true" className="egg-trip pointer-events-none fixed inset-x-0 bottom-0 z-[85] h-[110px]">
      <div className="absolute inset-x-0 bottom-0 h-[54px] border-t-[3px] border-ink bg-[#221e2a]">
        <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-[repeating-linear-gradient(90deg,#f2eefb_0_22px,transparent_22px_44px)] opacity-60" />
      </div>
      <svg viewBox="-34 -22 68 44" className="egg-car absolute bottom-[5px] h-[44px] w-[68px]">
        <g transform="rotate(-90)">
          <rect x="-19" y="-17" width="5" height="10" rx="2" fill="#121016" />
          <rect x="14" y="-17" width="5" height="10" rx="2" fill="#121016" />
          <rect x="-19" y="9" width="5" height="10" rx="2" fill="#121016" />
          <rect x="14" y="9" width="5" height="10" rx="2" fill="#121016" />
          <rect x="-15" y="-26" width="30" height="52" rx="11" fill="#f47a9a" stroke="#121016" strokeWidth="2" />
          <rect x="-3" y="-26" width="6" height="52" fill="#f2eefb" opacity="0.8" />
          <rect x="-11" y="4" width="22" height="12" rx="3.5" fill="#f2eefb" stroke="#121016" strokeWidth="1.5" />
          <rect x="-10" y="-19" width="20" height="8" rx="3" fill="#f2eefb" stroke="#121016" strokeWidth="1.5" />
          <circle cx="-9" cy="24" r="2.6" fill="#ffcf3a" />
          <circle cx="9" cy="24" r="2.6" fill="#ffcf3a" />
        </g>
      </svg>
      {Array.from({ length: 28 }, (_, i) => (
        <span
          key={i}
          className="egg-bit absolute bottom-[40px] h-2.5 w-2.5 rounded-[2px]"
          style={{
            left: `${(i * 37) % 100}%`,
            background: CONFETTI[i % CONFETTI.length],
            ["--dx" as string]: `${((i * 53) % 120) - 60}px`,
            ["--dy" as string]: `${-140 - ((i * 29) % 160)}px`,
            ["--r" as string]: `${(i * 97) % 540}deg`,
            animationDelay: `${(((i * 37) % 100) / 100) * 2.6}s`,
          }}
        />
      ))}
    </div>
  );
}
