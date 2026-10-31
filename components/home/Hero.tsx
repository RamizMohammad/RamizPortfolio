import MotionToggle from "@/components/hero/MotionToggle";
import Ribbon from "@/components/hero/Ribbon";
import { Ball, BraceCoin, Database, Gear, PaperPlane, TerminalCard } from "@/components/hero/Stickers";
import { BANNER } from "@/components/ascii/art";
import { profile } from "@/content/profile";

const WORD = "RAMIZ";
const SLICES = 5;

/** One letter cut into horizontal bands; each band slides in from the opposite side to the last. */
function SlicedLetter({ ch, i }: { ch: string; i: number }) {
  return (
    <span className="relative inline-block">
      <span className="invisible">{ch}</span>
      {Array.from({ length: SLICES }, (_, s) => (
        <span
          key={s}
          className="slice absolute inset-0"
          style={{
            // Bands overlap slightly so no seam shows once they meet.
            clipPath: `inset(${Math.max(0, (s / SLICES) * 100 - 0.6)}% -2% ${Math.max(0, 100 - ((s + 1) / SLICES) * 100 - 0.6)}% -2%)`,
            ["--from" as string]: `${(s + i) % 2 ? 60 : -60}%`,
            ["--d" as string]: `${200 + i * 70 + s * 45}ms`,
          }}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

/** Each sticker is placed relative to the wordmark and sized in em, so it scales with it. */
const STICKERS = [
  { el: <PaperPlane />, style: { left: "-6%", top: "-6%", width: "0.36em" }, r: [-8, -2], t: 6, d: 900 },
  { el: <Database />, style: { left: "40%", top: "-14%", width: "0.2em" }, r: [6, -4], t: 5, d: 1000 },
  { el: <BraceCoin />, style: { left: "-3%", top: "52%", width: "0.24em" }, r: [-6, 4], t: 5.5, d: 1100 },
  { el: <TerminalCard />, style: { right: "-9%", top: "34%", width: "0.3em" }, r: [-14, -8], t: 6.5, d: 1200 },
  { el: <Gear />, style: { right: "8%", top: "-12%", width: "0.13em" }, r: [0, 40], t: 7, d: 1300 },
  { el: <Ball />, style: { right: "-2%", top: "-24%", width: "0.15em", aspectRatio: "1" }, r: [0, 0], t: 4.5, d: 1400 },
];

export default function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-title" className="relative grid min-h-[100svh] overflow-clip pt-[var(--nav-h)]">
      <Ribbon />
      <div className="edge relative grid content-center justify-items-center gap-8 pb-20 pt-10 text-center">
        <h1 id="hero-title" className="t-mega relative">
          <span className="sr-only">{profile.name}, software engineer</span>
          {/* In text mode the wordmark becomes an ASCII banner. */}
          <pre aria-hidden="true" className="ascii-only ascii-glow text-[clamp(7px,1.5vw,18px)] !leading-none">
            {BANNER}
          </pre>
          <span aria-hidden="true" className="ascii-hide relative inline-block">
            {[...WORD].map((ch, i) => (
              <SlicedLetter key={i} ch={ch} i={i} />
            ))}
            {STICKERS.map((s, i) => (
              <span key={i} className="hero-sticker pop pointer-events-none absolute" style={{ ...s.style, ["--d" as string]: `${s.d}ms` }}>
                <span
                  className="bob block"
                  style={{ ["--r0" as string]: `${s.r[0]}deg`, ["--r1" as string]: `${s.r[1]}deg`, ["--t" as string]: `${s.t}s`, ["--bd" as string]: `${-i * 0.7}s`, aspectRatio: s.style.aspectRatio }}
                >
                  {s.el}
                </span>
              </span>
            ))}
          </span>
        </h1>
        <p className="voice rise max-w-[24ch] text-[clamp(28px,3.4vw,52px)] [text-wrap:balance]" style={{ ["--d" as string]: "900ms" }}>
          Build the backend. Ship the rest.
        </p>
        <p className="t-label rise" style={{ ["--d" as string]: "1000ms" }}>
          {profile.name} — {profile.role} at {profile.company}
        </p>
        <div className="rise flex flex-wrap justify-center gap-3" style={{ ["--d" as string]: "1100ms" }}>
          <a href="#work" className="btn-pill">See my work</a>
          <a href="#contact" className="btn-ghost">Email me ↗</a>
        </div>
      </div>
      <div className="absolute bottom-5 right-[var(--edge-r)]">
        <MotionToggle />
      </div>
    </section>
  );
}
