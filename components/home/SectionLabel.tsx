import { SECTIONS } from "@/components/nav";

/**
 * "01 — Systems", followed by a hairline that draws across to the edge as it scrolls into view.
 * The number is the section's place on the page (components/nav.ts), so adding or hiding a section
 * renumbers the rest.
 */
export default function SectionLabel({ id, children }: { id: string; children: React.ReactNode }) {
  const n = SECTIONS.findIndex((s) => s.id === id) + 1;
  return (
    <div className="section-label t-label flex items-center gap-4" aria-hidden="true" data-reveal>
      <span className="overflow-hidden">
        <span className="section-label-text inline-block">
          {String(n).padStart(2, "0")} — {children}
        </span>
      </span>
      <span className="section-label-line dash-t flex-1" />
    </div>
  );
}
