"use client";

import Link from "next/link";
import { LENSES } from "@/content/lens";
import { profile } from "@/content/profile";
import { useLens } from "./useLens";

/** The header's Résumé button: the PDF by default, or the résumé tailored to the chosen lens. */
export default function ResumeButton({ className }: { className: string }) {
  const lens = useLens();
  if (!lens) {
    return (
      <a href={profile.resume} className={className}>
        Résumé
      </a>
    );
  }
  return (
    <Link href={`/resume?for=${lens}`} className={className} title={`Résumé for ${LENSES.find((l) => l.id === lens)!.label} roles`}>
      Résumé · {LENSES.find((l) => l.id === lens)!.short}
    </Link>
  );
}
