"use client";

import { useRef, useState } from "react";

export default function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "copied" | "select">("idle");
  const text = useRef<HTMLSpanElement>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      // Clipboard blocked: select the address so it can be copied by hand.
      const sel = window.getSelection();
      if (sel && text.current) {
        const range = document.createRange();
        range.selectNodeContents(text.current);
        sel.removeAllRanges();
        sel.addRange(range);
      }
      setState("select");
    }
    window.setTimeout(() => setState("idle"), 2400);
  };

  return (
    <div className="grid justify-items-center gap-4">
      <a href={`mailto:${email}`} className="heading block break-all text-[clamp(28px,5vw,64px)] no-underline hover:underline">
        <span ref={text}>{email}</span>
      </a>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <a href={`mailto:${email}`} className="btn btn-solid">
          Write an email
        </a>
        <button type="button" onClick={copy} className="btn">
          {state === "copied" ? "Copied" : "Copy address"}
        </button>
        <span role="status" className="label normal-case tracking-normal">
          {state === "copied" ? "Address copied to clipboard." : state === "select" ? "Copying is blocked here. The address is selected, press Ctrl+C or ⌘C." : ""}
        </span>
      </div>
    </div>
  );
}
