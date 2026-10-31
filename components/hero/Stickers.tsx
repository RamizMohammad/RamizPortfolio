/**
 * Cartoon objects that float around the wordmark, each a piece of a backend engineer's day:
 * a request in flight, a cheerful database, a coin of curly braces, a terminal card, a gear.
 * Thick ink outlines and flat fills with one highlight, like die-cut stickers.
 */
const INK = "#121016";

export function PaperPlane() {
  return (
    <svg viewBox="0 0 160 120" className="h-full w-full overflow-visible">
      <path d="M8 62 150 8 92 112 74 76Z" fill="#d9ccff" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path d="M150 8 74 76 70 104 92 86" fill="#b9a6f5" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path d="M8 62 74 76" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <path d="M-14 84h26M-24 98h22M-6 70h12" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  );
}

export function Database() {
  return (
    <svg viewBox="0 0 120 140" className="h-full w-full overflow-visible">
      <path d="M12 28v84c0 13 21 22 48 22s48-9 48-22V28" fill="#ffcf3a" stroke={INK} strokeWidth="5" />
      <path d="M12 56c0 13 21 22 48 22s48-9 48-22M12 84c0 13 21 22 48 22s48-9 48-22" fill="none" stroke={INK} strokeWidth="4" />
      <ellipse cx="60" cy="28" rx="48" ry="20" fill="#ffe27a" stroke={INK} strokeWidth="5" />
      <path d="M26 40v58" stroke="#fff6cf" strokeWidth="7" strokeLinecap="round" />
      {/* a wink */}
      <circle cx="46" cy="66" r="5" fill={INK} />
      <path d="M68 66q6-6 12 0" fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
      <path d="M46 84q14 12 28 0" fill="#c93a63" stroke={INK} strokeWidth="4.5" strokeLinejoin="round" />
      <circle cx="36" cy="80" r="5" fill="#f47a9a" opacity="0.7" />
      <circle cx="86" cy="80" r="5" fill="#f47a9a" opacity="0.7" />
    </svg>
  );
}

export function BraceCoin() {
  return (
    <svg viewBox="0 0 130 130" className="h-full w-full overflow-visible">
      <ellipse cx="65" cy="72" rx="56" ry="54" fill="#2e9c72" stroke={INK} strokeWidth="5" />
      <ellipse cx="65" cy="62" rx="56" ry="54" fill="#5fd3a4" stroke={INK} strokeWidth="5" />
      <ellipse cx="65" cy="62" rx="42" ry="40" fill="none" stroke={INK} strokeWidth="3.5" opacity="0.35" />
      <text x="65" y="80" textAnchor="middle" fontFamily="var(--font-display), Impact, sans-serif" fontSize="52" fill={INK}>
        {"{ }"}
      </text>
      <path d="M30 34q10-12 26-16" stroke="#e4fff3" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M112 14l4 9 9 4-9 4-4 9-4-9-9-4 9-4z" fill="#fff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

export function TerminalCard() {
  return (
    <svg viewBox="0 0 170 110" className="h-full w-full overflow-visible">
      <rect x="6" y="6" width="158" height="98" rx="14" fill="#2f5bea" stroke={INK} strokeWidth="5" />
      <path d="M6 30h158" stroke={INK} strokeWidth="4" />
      <circle cx="22" cy="18" r="4.5" fill="#f47a9a" stroke={INK} strokeWidth="2" />
      <circle cx="36" cy="18" r="4.5" fill="#ffcf3a" stroke={INK} strokeWidth="2" />
      <circle cx="50" cy="18" r="4.5" fill="#5fd3a4" stroke={INK} strokeWidth="2" />
      <path d="M26 52l16 13-16 13" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M52 80h28" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      <path d="M100 48h46M100 64h30" stroke="#9fb4ff" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

export function Gear() {
  const teeth = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
      <g stroke={INK} strokeWidth="4.5" strokeLinejoin="round">
        {teeth.map((a) => (
          <rect key={a} x="42" y="2" width="16" height="22" rx="4" fill="#d4f25b" transform={`rotate(${a} 50 50)`} />
        ))}
        <circle cx="50" cy="50" r="33" fill="#d4f25b" />
        <circle cx="50" cy="50" r="12" fill="#ebe8f6" />
      </g>
    </svg>
  );
}

/** A glossy pink ball, like the one bouncing beside the ribbon. */
export function Ball() {
  return <div className="h-full w-full rounded-full" style={{ background: "radial-gradient(circle at 35% 30%, #ffd3df 0%, #f7899f 38%, #e0577d 75%, #c93a63 100%)" }} />;
}
