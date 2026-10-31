/** "01 — Systems", followed by a dashed hairline running to the edge. */
export default function SectionLabel({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="t-label flex items-center gap-4" aria-hidden="true">
      <span>
        {String(n).padStart(2, "0")} — {children}
      </span>
      <span className="dash-t flex-1" />
    </div>
  );
}
