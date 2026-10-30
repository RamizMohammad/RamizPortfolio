"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRef, type ReactNode, type RefObject } from "react";

/*
 * Developer stickers. Each one is drawn on a die-cut backing: a thick light outline around the
 * shape, so it reads as a sticker on the dark page. Decorative only.
 */

const OUTLINE = "#eef3ff";
const INK = "#05070d";

const Eyes = ({ x, y, gap = 16, r = 7 }: { x: number; y: number; gap?: number; r?: number }) => (
  <g>
    <circle cx={x - gap / 2} cy={y} r={r} fill="#fff" stroke={INK} strokeWidth="2.5" />
    <circle cx={x + gap / 2} cy={y} r={r} fill="#fff" stroke={INK} strokeWidth="2.5" />
    <circle cx={x - gap / 2 + 2} cy={y + 1} r={r * 0.45} fill={INK} />
    <circle cx={x + gap / 2 + 2} cy={y + 1} r={r * 0.45} fill={INK} />
  </g>
);

export function BugSticker() {
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%">
      <g stroke={OUTLINE} strokeWidth="14" strokeLinejoin="round" strokeLinecap="round" fill={OUTLINE}>
        <ellipse cx="60" cy="68" rx="30" ry="36" />
        <circle cx="60" cy="34" r="18" />
        <path d="M30 56 14 46M30 72 10 72M32 88 16 100M90 56 106 46M90 72 110 72M88 88 104 100M52 20 44 6M68 20 76 6" fill="none" />
      </g>
      <g stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M30 56 14 46M30 72 10 72M32 88 16 100M90 56 106 46M90 72 110 72M88 88 104 100M52 20 44 6M68 20 76 6" />
      </g>
      <ellipse cx="60" cy="68" rx="30" ry="36" fill="#a08bff" stroke={INK} strokeWidth="4" />
      <path d="M60 34v68" stroke={INK} strokeWidth="4" />
      <circle cx="47" cy="78" r="5" fill={INK} opacity="0.35" />
      <circle cx="73" cy="62" r="5" fill={INK} opacity="0.35" />
      <circle cx="60" cy="34" r="18" fill="#ff6b8b" stroke={INK} strokeWidth="4" />
      <Eyes x={60} y={32} gap={15} r={6} />
    </svg>
  );
}

export function CoffeeSticker() {
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%">
      <g fill={OUTLINE} stroke={OUTLINE} strokeWidth="14" strokeLinejoin="round">
        <rect x="22" y="42" width="58" height="62" rx="12" />
        <path d="M80 56h10a14 14 0 0 1 0 28H80" fill="none" />
        <path d="M40 30c-6-8 6-12 0-22M56 30c-6-8 6-12 0-22" fill="none" />
      </g>
      <path d="M40 30c-6-8 6-12 0-22M56 30c-6-8 6-12 0-22" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M80 56h10a14 14 0 0 1 0 28H80" stroke={INK} strokeWidth="8" fill="none" />
      <path d="M80 56h10a14 14 0 0 1 0 28H80" stroke="#3be8ff" strokeWidth="3.5" fill="none" />
      <rect x="22" y="42" width="58" height="62" rx="12" fill="#3be8ff" stroke={INK} strokeWidth="4" />
      <Eyes x={51} y={66} gap={18} r={7} />
      <path d="M43 84q8 7 16 0" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function OkSticker() {
  return (
    <svg viewBox="0 0 140 70" width="100%" height="100%">
      <rect x="6" y="6" width="128" height="58" rx="29" fill={OUTLINE} />
      <rect x="12" y="12" width="116" height="46" rx="23" fill="#ffd84a" stroke={INK} strokeWidth="4" />
      <circle cx="31" cy="35" r="7" fill="#4be3a5" stroke={INK} strokeWidth="3" />
      <text x="82" y="43" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontWeight="700" fontSize="21" fill={INK}>
        200 OK
      </text>
    </svg>
  );
}

export function GlobSticker() {
  const arms = [0, 60, 120];
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%">
      <g transform="translate(60 60)">
        {arms.map((a) => (
          <rect key={`o${a}`} x="-15" y="-52" width="30" height="104" rx="15" transform={`rotate(${a})`} fill={OUTLINE} stroke={OUTLINE} strokeWidth="12" />
        ))}
        {arms.map((a) => (
          <rect key={a} x="-13" y="-50" width="26" height="100" rx="13" transform={`rotate(${a})`} fill="#4be3a5" stroke={INK} strokeWidth="4" />
        ))}
        {arms.map((a) => (
          <rect key={`f${a}`} x="-9" y="-46" width="18" height="92" rx="9" transform={`rotate(${a})`} fill="#4be3a5" />
        ))}
      </g>
      <Eyes x={60} y={56} gap={18} r={7} />
      <path d="M52 72q8 6 16 0" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function PromptSticker() {
  return (
    <svg viewBox="0 0 130 100" width="100%" height="100%">
      <rect x="5" y="5" width="120" height="90" rx="16" fill={OUTLINE} />
      <rect x="11" y="11" width="108" height="78" rx="11" fill="#0d111c" stroke={INK} strokeWidth="4" />
      <circle cx="26" cy="24" r="4" fill="#ff6b8b" />
      <circle cx="38" cy="24" r="4" fill="#ffd84a" />
      <circle cx="50" cy="24" r="4" fill="#4be3a5" />
      <text x="24" y="66" fontFamily="var(--font-geist-mono), monospace" fontWeight="700" fontSize="26" fill="#3be8ff">
        &gt;_
      </text>
      <rect x="66" y="48" width="14" height="20" fill="#3be8ff" className="motion-safe:animate-pulse" />
    </svg>
  );
}

export function HeartSticker() {
  return (
    <svg viewBox="0 0 120 110" width="100%" height="100%">
      <path d="M60 100C20 72 8 52 14 32 20 12 46 8 60 28 74 8 100 12 106 32c6 20-6 40-46 68Z" fill={OUTLINE} stroke={OUTLINE} strokeWidth="12" strokeLinejoin="round" />
      <path d="M60 100C20 72 8 52 14 32 20 12 46 8 60 28 74 8 100 12 106 32c6 20-6 40-46 68Z" fill="#ff6b8b" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <text x="60" y="66" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontWeight="700" fontSize="24" fill={INK}>
        &lt;/&gt;
      </text>
    </svg>
  );
}

type DragProps = {
  children: ReactNode;
  bounds: RefObject<HTMLElement | null>;
  className?: string;
  rotate?: number;
  /** Seconds offset so neighbouring stickers don't bob in sync */
  delay?: number;
};

/** A sticker that floats gently and can be dragged anywhere inside its bounds. */
export function DraggableSticker({ children, bounds, className = "", rotate = 0, delay = 0 }: DragProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  return (
    <motion.div
      ref={ref}
      className={`sticker absolute ${className}`}
      aria-hidden="true"
      drag
      dragConstraints={bounds}
      dragElastic={0.25}
      dragTransition={{ bounceStiffness: 260, bounceDamping: 18 }}
      initial={reduce ? false : { opacity: 0, scale: 0.4, rotate: rotate - 25 }}
      animate={reduce ? { rotate } : { opacity: 1, scale: 1, rotate: [rotate - 3, rotate + 3, rotate - 3], y: [0, -6, 0] }}
      transition={
        reduce
          ? undefined
          : {
              opacity: { duration: 0.4, delay: 1.6 + delay * 0.15 },
              scale: { type: "spring", stiffness: 260, damping: 14, delay: 1.6 + delay * 0.15 },
              rotate: { duration: 5 + delay, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 4 + delay * 0.7, repeat: Infinity, ease: "easeInOut" },
            }
      }
      whileHover={reduce ? undefined : { scale: 1.08 }}
      whileDrag={{ scale: 1.15, rotate: rotate + 8, zIndex: 40 }}
    >
      {children}
    </motion.div>
  );
}
