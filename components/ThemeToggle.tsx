"use client";

const KEY = "ramiz-theme";

/** Stars fly out when night falls, sun rays when day breaks. */
function burst(x: number, y: number, night: boolean) {
  const n = night ? 14 : 12;
  for (let i = 0; i < n; i++) {
    const el = document.createElement("span");
    el.className = `theme-burst ${night ? "star" : "ray"}`;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    document.body.appendChild(el);
    const angle = (i / n) * 360 + Math.random() * 18;
    const dist = 70 + Math.random() * 90;
    const size = night ? 0.6 + Math.random() * 1.2 : 1;
    el.animate(
      [
        { transform: `rotate(${angle}deg) translateY(0) scale(0)`, opacity: 1 },
        { transform: `rotate(${angle}deg) translateY(-${dist * 0.7}px) scale(${size})`, opacity: 1, offset: 0.5 },
        { transform: `rotate(${angle + (night ? 90 : 0)}deg) translateY(-${dist}px) scale(0)`, opacity: 0 },
      ],
      { duration: 850 + Math.random() * 250, easing: "cubic-bezier(0.2, 0.8, 0.3, 1)" },
    ).onfinish = () => el.remove();
  }
}

/**
 * Switches day and night. With View Transitions, the new theme spreads from (x, y) in a growing
 * circle while the old page sinks back and dims; without them, or with reduced motion, it just switches.
 */
export function switchTheme(x = window.innerWidth / 2, y = window.innerHeight / 2) {
  const root = document.documentElement;
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  const apply = () => {
    root.dataset.theme = next;
    try {
      localStorage.setItem(KEY, next);
    } catch {}
  };
  const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
  if (!doc.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    apply();
    return;
  }
  burst(x, y, next === "dark");
  const end = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  const easing = "cubic-bezier(0.7, 0, 0.2, 1)";
  doc.startViewTransition(apply).ready.then(() => {
    root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] }, { duration: 950, easing, pseudoElement: "::view-transition-new(root)" });
    root.animate(
      { transform: ["scale(1)", "scale(0.93)"], filter: ["brightness(1) blur(0)", "brightness(0.55) blur(3px)"], borderRadius: ["0px", "28px"] },
      { duration: 950, easing, pseudoElement: "::view-transition-old(root)" },
    );
  });
}

/** Runs in <head> before first paint: the saved choice, otherwise the system setting. */
export const themeScript = `try{var t=localStorage.getItem('${KEY}')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t}catch(e){}`;

export default function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        switchTheme(r.left + r.width / 2, r.top + r.height / 2);
      }}
      aria-label="Switch between day and night mode"
      className="btn-ghost btn-sm !px-2.5"
    >
      <svg viewBox="0 0 24 24" className="theme-icon h-[18px] w-[18px]" aria-hidden="true">
        <mask id="theme-moon">
          <rect width="24" height="24" fill="white" />
          <circle className="shadow" cx="30" cy="-6" r="8" fill="black" />
        </mask>
        <circle className="core" cx="12" cy="12" r="5" fill="currentColor" mask="url(#theme-moon)" />
        <g className="rays" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line key={a} x1="12" y1="2.5" x2="12" y2="4.5" transform={`rotate(${a} 12 12)`} />
          ))}
        </g>
      </svg>
    </button>
  );
}
