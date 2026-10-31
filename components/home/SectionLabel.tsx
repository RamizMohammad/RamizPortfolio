/** "01 — Systems", followed by a hairline that draws across to the edge as it scrolls into view. */
export default function SectionLabel({ n, children }: { n: number; children: React.ReactNode }) {
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
