"use client";

import { useRef, useState } from "react";

/** The one filled button of the contact screen, plus the address itself as a plain link. */
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
    <div className="grid justify-items-start gap-5">
      <a href={`mailto:${email}`} className="t-h2 nc link break-all">
        <span ref={text}>{email}</span>
      </a>
      <div className="flex flex-wrap items-center gap-4">
        <button type="button" onClick={copy} data-cursor="Copy" className="btn-pill">
          {state === "copied" ? "Copied" : "Copy email"}
        </button>
        <span role="status" className="t-label muted">
          {state === "copied" ? "Address copied" : state === "select" ? "Copying is blocked here — the address is selected" : ""}
        </span>
      </div>
    </div>
  );
}
