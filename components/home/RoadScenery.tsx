/**
 * Line-art scenery beside the Experience road: one scene per stop (picked by the kind of stop),
 * a small roadside board or sign above it, and a milestone stone with the year. Drawn in ink
 * strokes so it flips with the theme; candy colours only as small accents.
 */

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export type SceneKind = "home" | "store" | "campus" | "cones" | "servers" | "warehouse";

function Home() {
  return (
    <svg viewBox="0 0 240 160" className="w-full" {...S}>
      <path d="M8 150 H232" />
      <path d="M28 150 V82 L96 40 L164 82 V150" />
      <text x="96" y="76" textAnchor="middle" className="font-mono" fontSize="12" fill="currentColor" stroke="none">{"</>"}</text>
      <rect x="44" y="98" width="34" height="24" rx="2" />
      <path d="M50 106 H66 M50 113 H60" />
      <rect x="104" y="108" width="28" height="42" />
      <circle cx="126" cy="130" r="1.5" fill="currentColor" />
      {/* A dish on the roof: the self-hosted server lives here. */}
      <path d="M146 70 V48" />
      <path d="M134 48 A12 12 0 0 0 158 48 Z" />
      <circle cx="146" cy="44" r="3" className="fill-pink-deep" stroke="none" />
      <path d="M196 150 V116 H214 V126 H196" />
      <circle cx="214" cy="112" r="3.5" className="fill-pink-deep" stroke="none" />
    </svg>
  );
}

function Store() {
  return (
    <svg viewBox="0 0 240 160" className="w-full" {...S}>
      <path d="M8 150 H232" />
      <rect x="22" y="14" width="196" height="92" rx="10" className="fill-card" />
      <path d="M70 106 V150 M170 106 V150" />
      <rect x="38" y="26" width="38" height="68" rx="7" />
      <path d="M50 32 H64" />
      <rect x="45" y="42" width="10" height="10" rx="2" className="fill-lime" />
      <rect x="59" y="42" width="10" height="10" rx="2" className="fill-sun" />
      <rect x="45" y="56" width="10" height="10" rx="2" className="fill-violet" />
      <rect x="59" y="56" width="10" height="10" rx="2" className="fill-pink" />
      <text x="92" y="52" className="font-mono" fontSize="12" letterSpacing="2" fill="currentColor" stroke="none">SHIPPED TO</text>
      <text x="92" y="74" className="font-mono fill-pink-deep" fontSize="12" letterSpacing="2" stroke="none">PLAY STORE</text>
      <path d="M92 86 L100 86 M106 86 L196 86" strokeDasharray="2 5" />
    </svg>
  );
}

function Campus() {
  return (
    <svg viewBox="0 0 240 160" className="w-full" {...S}>
      <path d="M8 150 H232" />
      <path d="M30 66 L120 22 L210 66 Z" />
      <text x="120" y="56" textAnchor="middle" className="font-mono" fontSize="11" fill="currentColor" stroke="none">B.TECH</text>
      <path d="M40 66 H200 V150 H40 Z" />
      <path d="M62 80 V138 M90 80 V138 M150 80 V138 M178 80 V138" />
      <rect x="108" y="102" width="24" height="48" />
      <path d="M120 22 V2" />
      <path d="M120 3 L140 9 L120 15 Z" className="fill-pink-deep" stroke="none" />
    </svg>
  );
}

function Cones() {
  return (
    <svg viewBox="0 0 240 160" className="w-full" {...S}>
      <path d="M8 150 H232" />
      <path d="M70 14 L110 80 H30 Z" className="fill-card" />
      <text x="70" y="70" textAnchor="middle" fontSize="28" fontWeight="700" fill="currentColor" stroke="none">!</text>
      <path d="M70 80 V150" />
      <text x="80" y="104" className="font-mono" fontSize="10" letterSpacing="2" fill="currentColor" stroke="none">BUGS AHEAD</text>
      <path d="M150 150 L164 106 L178 150 Z" className="fill-pink-deep" stroke="none" />
      <path d="M142 150 H186" />
      <path d="M196 150 L205 122 L214 150 Z" className="fill-pink-deep" stroke="none" />
      <path d="M190 150 H220" />
    </svg>
  );
}

function Servers() {
  return (
    <svg viewBox="0 0 240 160" className="w-full" {...S}>
      <path d="M8 150 H232" />
      <rect x="28" y="20" width="62" height="130" rx="4" className="fill-card" />
      {[34, 58, 82, 106].map((y) => (
        <g key={y}>
          <rect x="36" y={y} width="46" height="16" rx="2" />
          <circle cx="44" cy={y + 8} r="2.2" className="fill-lime" stroke="none" />
          <path d={`M54 ${y + 8} H74`} />
        </g>
      ))}
      <rect x="112" y="110" width="52" height="40" />
      <rect x="164" y="110" width="52" height="40" className="fill-violet" />
      <rect x="138" y="70" width="52" height="40" className="fill-sun" />
      <path d="M122 118 V142 M132 118 V142 M142 118 V142 M152 118 V142" />
      <text x="164" y="94" textAnchor="middle" className="font-mono" fontSize="10" letterSpacing="1.5" fill="#121016" stroke="none">DOCKER</text>
    </svg>
  );
}

function Warehouse() {
  return (
    <svg viewBox="0 0 240 160" className="w-full" {...S}>
      <path d="M8 150 H232" />
      <path d="M14 150 V62 L80 30 L146 62 V150" />
      <rect x="40" y="96" width="80" height="54" />
      <path d="M40 110 H120 M40 124 H120 M40 138 H120" />
      <rect x="150" y="106" width="52" height="34" rx="2" className="fill-card" />
      <text x="176" y="127" textAnchor="middle" className="font-mono" fontSize="9" letterSpacing="1" fill="currentColor" stroke="none">PO·RFQ</text>
      <path d="M202 116 H218 L228 128 V140 H202" />
      <circle cx="166" cy="144" r="7" className="fill-card" />
      <circle cx="214" cy="144" r="7" className="fill-card" />
      <circle cx="80" cy="76" r="4" className="fill-pink-deep" stroke="none" />
    </svg>
  );
}

const SCENES: Record<SceneKind, () => React.JSX.Element> = {
  home: Home,
  store: Store,
  campus: Campus,
  cones: Cones,
  servers: Servers,
  warehouse: Warehouse,
};

export function Scene({ kind }: { kind: SceneKind }) {
  const Art = SCENES[kind];
  return <Art />;
}

/** A small board on a post, two lines of mono text, the second in pink. */
function Board({ top, bottom }: { top: string; bottom: string }) {
  return (
    <div className="grid justify-items-center">
      <div className="rounded-[10px] border-[1.5px] border-ink bg-card px-3.5 py-2 font-mono text-[12px] uppercase leading-[1.5] tracking-[0.16em]">
        <p>{top}</p>
        <p className="text-pink-deep">{bottom}</p>
      </div>
      <span className="h-12 w-[1.5px] bg-ink" />
    </div>
  );
}

/** A round speed-limit-style sign on a post. */
function Limit({ value, unit }: { value: string; unit: string }) {
  return (
    <div className="grid justify-items-center">
      <div className="grid h-[76px] w-[76px] place-items-center rounded-full border-[6px] border-pink-deep bg-card text-center leading-none">
        <span>
          <span className="block font-display text-[26px]">{value}</span>
          <span className="t-micro">{unit}</span>
        </span>
      </div>
      <span className="h-14 w-[1.5px] bg-ink" />
    </div>
  );
}

function Sky() {
  return (
    <svg viewBox="0 0 200 80" className="w-[180px]" {...S}>
      <path d="M20 70 H120 C134 70 136 52 120 50 C120 36 100 30 92 42 C86 24 56 24 52 44 C34 40 24 54 30 62 C20 62 16 70 20 70 Z" />
      <path d="M150 22 q6 -7 12 0 q6 -7 12 0" />
      <path d="M140 46 q5 -6 10 0 q5 -6 10 0" />
    </svg>
  );
}

const FILLERS = [
  () => <Sky />,
  () => <Board top="No prod deploys" bottom="on Fridays" />,
  () => <Limit value="429" unit="Slow down" />,
  () => <Board top="Caffeine" bottom="Next exit →" />,
  () => <Sky />,
  () => <Limit value="41" unit="ms p95" />,
];

export function Filler({ i }: { i: number }) {
  const F = FILLERS[i % FILLERS.length];
  return <F />;
}

/** A milestone stone carved with the year. */
export function Milestone({ year }: { year: number }) {
  return (
    <div className="grid h-[58px] w-[50px] place-items-center rounded-t-full border-[1.5px] border-ink bg-card pt-1 font-mono text-[14px]">
      ’{String(Math.floor(year)).slice(2)}
    </div>
  );
}
