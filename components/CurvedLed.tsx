/** A line of LED dot-matrix text set on an arc, like a label stamped across the top of a box. */
export default function CurvedLed({ text, className = "" }: { text: string; className?: string }) {
  return (
    <svg viewBox="0 0 600 150" className={className} aria-hidden="true">
      <defs>
        <path id="led-arc" d="M20 140 Q300 -20 580 140" />
      </defs>
      <text className="led" fontSize="54" fill="var(--color-cyan)" style={{ filter: "drop-shadow(0 0 10px rgb(59 232 255 / 0.55))" }}>
        <textPath href="#led-arc" startOffset="50%" textAnchor="middle">
          {text}
        </textPath>
      </text>
    </svg>
  );
}
