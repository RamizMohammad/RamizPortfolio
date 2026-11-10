"use client";

import { DropdownMenu } from "radix-ui";
import { LENSES } from "@/content/lens";
import { setLens, useLens } from "./useLens";

/**
 * The "Hiring for" lens as a header dropdown, beside the Résumé button. The trigger shows the
 * chosen role; the menu lists each role with the one line the site will lead with for it.
 */
export default function LensMenu({ className = "" }: { className?: string }) {
  const lens = useLens();
  const chosen = LENSES.find((l) => l.id === lens);
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger className={`lens-trigger btn-ghost btn-sm group ${className}`} aria-label={`Hiring for: ${chosen ? chosen.label : "any role"}. Change`}>
        <span className="muted group-hover:text-inherit group-data-[state=open]:text-inherit">Hiring</span>
        <span className="flex items-center gap-1.5">
          {chosen && <span aria-hidden="true" className="dot !h-1.5 !w-1.5 !bg-pink-deep" />}
          {chosen ? chosen.short : "Any"}
        </span>
        <svg aria-hidden="true" viewBox="0 0 12 12" className="h-2.5 w-2.5 transition-transform duration-300 group-data-[state=open]:rotate-180">
          <path d="M2 4.5 6 8.5 10 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={10}
          className="lens-menu z-[80] w-[300px] rounded-[22px] border-[1.5px] border-ink bg-card p-2 text-ink shadow-[6px_6px_0_0_var(--color-ink)]"
        >
          <DropdownMenu.Label className="t-micro muted px-3 pb-2 pt-2">Hiring for… the site leans that way</DropdownMenu.Label>
          <DropdownMenu.RadioGroup value={lens ?? "any"} onValueChange={(v) => setLens(v === "any" ? null : (v as typeof lens))}>
            {[{ id: "any", label: "Any role", pitch: "Everything at full brightness." }, ...LENSES].map((l) => (
              <DropdownMenu.RadioItem
                key={l.id}
                value={l.id}
                className="lens-item group grid cursor-pointer grid-cols-[18px_1fr] gap-x-2 rounded-[14px] px-3 py-2.5 outline-none data-[highlighted]:bg-paper data-[state=checked]:bg-ink data-[state=checked]:text-card"
              >
                <span className="grid h-[18px] place-items-center">
                  <span className="grid h-3.5 w-3.5 place-items-center rounded-full border-[1.5px] border-current">
                    <span className="h-1.5 w-1.5 scale-0 rounded-full bg-lime transition-transform duration-200 group-data-[state=checked]:scale-100" />
                  </span>
                </span>
                <span className="t-label">{l.label}</span>
                <span className="col-start-2 text-[13px] leading-snug opacity-70">{l.pitch}</span>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
