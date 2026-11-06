"use client";

import { LENSES } from "@/content/lens";
import { useLens } from "./useLens";

/** Saves the résumé as it is lensed right now: the browser's print dialog, "Save as PDF". */
export default function PrintButton() {
  const lens = useLens();
  if (!lens) return null;
  return (
    <button type="button" onClick={() => window.print()} className="btn-ghost w-fit">
      Save {LENSES.find((l) => l.id === lens)!.short} résumé as PDF
    </button>
  );
}
