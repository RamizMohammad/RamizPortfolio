import type { Achievement } from "@/content/achievements";

/** The medal face: the placing itself, shortened to fit (6th, F, SF, L1, ★). */
function face(status: string) {
  const place = status.match(/(\d+)(st|nd|rd|th)/i);
  if (place) return { big: place[1], small: place[2].toLowerCase() };
  if (/semi/i.test(status)) return { big: "SF", small: "" };
  if (/finalist/i.test(status)) return { big: "F", small: "" };
  const level = status.match(/level (\d+)/i);
  if (level) return { big: `L${level[1]}`, small: "" };
  return { big: "★", small: "" };
}

// Ribbon stripes: [base, stripe] per medal.
const RIBBONS = [
  ["#2f5bea", "#f47a9a"],
  ["#c93a63", "#ffcf3a"],
  ["#5fd3a4", "#121016"],
  ["#b9a6f5", "#2f5bea"],
  ["#ffcf3a", "#c93a63"],
  ["#121016", "#d4f25b"],
];
// Hackathon medals are gold; competition medals are silver. The metal marks the kind of event, not a rank.
const METAL = {
  gold: { rim: ["#8a5a00", "#ffe08a", "#b07a10", "#fff3c4", "#9c6a08"], face: ["#fff1b8", "#f2c14e", "#c48a14"], ink: "#5a3a00" },
  silver: { rim: ["#5d6470", "#f4f6fa", "#8a919c", "#ffffff", "#6b727d"], face: ["#ffffff", "#d5dae2", "#9aa2ae"], ink: "#3a404a" },
};

function Laurel({ color }: { color: string }) {
  // Leaves along an arc on each side of the face.
  const leaves = Array.from({ length: 7 }, (_, i) => i);
  return (
    <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
      {[1, -1].map((side) => (
        <g key={side} transform={side === -1 ? "translate(100 0) scale(-1 1)" : undefined}>
          {leaves.map((i) => {
            // From the bottom of the face up its left side; leaves lie along the curve.
            const deg = 250 - i * 19;
            const a = (deg * Math.PI) / 180;
            // Rounded so server and browser produce the same numbers (their trig can differ in the last digit).
            const x = Math.round((50 + Math.cos(a) * 36) * 100) / 100;
            const y = Math.round((50 - Math.sin(a) * 36) * 100) / 100;
            return <ellipse key={i} cx={x} cy={y} rx="2.4" ry="5.5" transform={`rotate(${-deg + 180 + 25} ${x} ${y})`} fill={color} opacity="0.5" />;
          })}
        </g>
      ))}
    </svg>
  );
}

/**
 * Hackathon and competition results as real medals hanging on ribbons, each rocking gently on its
 * own rhythm while a glint slides across the metal. Reduced motion keeps them still.
 */
export default function Medals({ results }: { results: Achievement[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-6" aria-label="Hackathon and competition results">
      {results.map((a, i) => {
        const f = face(a.status);
        const m = a.kind === "Competition" ? METAL.silver : METAL.gold;
        const [base, stripe] = RIBBONS[i % RIBBONS.length];
        return (
          <li key={a.title} className="medal grid justify-items-center gap-4 text-center" data-reveal style={{ ["--rd" as string]: `${i * 110}ms` }}>
            <div className="medal-swing">
              {/* The sway runs on this; the drop-in animation is on its parent. Each medal gets its own pace. */}
              <div
                className="medal-body grid select-none justify-items-center"
                style={{ ["--sway-t" as string]: `${3.2 + (i % 3) * 0.45}s`, ["--sway-d" as string]: `${-i * 0.7}s` }}
                aria-hidden="true"
              >
                {/* Ribbon: a V of striped fabric */}
                <svg viewBox="0 0 64 76" className="h-[76px] w-16 drop-shadow-[0_2px_0_rgb(0_0_0/0.15)]">
                  <defs>
                    <pattern id={`stripe-${i}`} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(90)">
                      <rect width="10" height="10" fill={base} />
                      <rect width="3" height="10" x="3.5" fill={stripe} />
                    </pattern>
                    <linearGradient id={`fold-${i}`} x1="0" x2="1">
                      <stop offset="0" stopColor="#000" stopOpacity="0.25" />
                      <stop offset="0.5" stopColor="#000" stopOpacity="0" />
                      <stop offset="1" stopColor="#000" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                  <path d="M2 0h24l18 70H28z" fill={`url(#stripe-${i})`} stroke="#121016" strokeWidth="1.5" />
                  <path d="M62 0H38L20 70h16z" fill={`url(#stripe-${i})`} stroke="#121016" strokeWidth="1.5" />
                  <path d="M2 0h24l18 70H28zM62 0H38L20 70h16z" fill={`url(#fold-${i})`} />
                </svg>
                {/* Clasp */}
                <span className="-mt-2 h-4 w-7 rounded-[4px] border-[1.5px] border-[#121016]" style={{ background: `linear-gradient(180deg, ${m.rim[3]}, ${m.rim[0]})` }} />
                <span className="-mt-1 h-3 w-3 rounded-full border-[1.5px] border-[#121016]" style={{ background: m.rim[2] }} />
                {/* The medal */}
                <div className="medal-disc relative -mt-1 h-[108px] w-[108px] rounded-full border-[1.5px] border-[#121016] p-[7px] shadow-[0_10px_18px_-8px_rgb(0_0_0/0.5)]" style={{ background: `conic-gradient(from 200deg, ${m.rim.join(", ")}, ${m.rim[0]})` }}>
                  <div
                    className="relative grid h-full w-full place-items-center overflow-hidden rounded-full border border-[#121016]/60"
                    style={{ background: `radial-gradient(circle at 35% 30%, ${m.face[0]} 0%, ${m.face[1]} 45%, ${m.face[2]} 100%)` }}
                  >
                    <Laurel color={m.ink} />
                    <span className="relative font-display text-[34px] leading-none" style={{ color: m.ink, textShadow: `0 1px 0 ${m.face[0]}, 0 -1px 0 rgb(0 0 0 / 0.35)` }}>
                      {f.big}
                      <sup className="text-[15px]">{f.small}</sup>
                    </span>
                    <span className="absolute bottom-[9px] text-[7px] font-bold uppercase tracking-[0.18em]" style={{ color: m.ink, opacity: 0.7 }}>
                      {a.year}
                    </span>
                    {/* Moving glint: follows the swing */}
                    <span className="medal-glint pointer-events-none absolute inset-0" />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-1">
              <p className="t-label">{a.status}</p>
              <h3 className="text-[15px] font-semibold leading-snug">{a.title}</h3>
              <p className="t-micro muted">
                {a.org} · {a.year}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
