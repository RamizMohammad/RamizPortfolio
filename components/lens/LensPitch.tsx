import { LENSES } from "@/content/lens";

/**
 * One line per lens, plus the default; CSS shows only the one that matches data-lens, so it works
 * in server components and never flashes the wrong line.
 */
export default function LensPitch({ fallback, className = "" }: { fallback: string; className?: string }) {
  return (
    <>
      <span data-lens-pitch="any" className={className}>
        {fallback}
      </span>
      {LENSES.map((l) => (
        <span key={l.id} data-lens-pitch={l.id} className={className}>
          {l.pitch}
        </span>
      ))}
    </>
  );
}
