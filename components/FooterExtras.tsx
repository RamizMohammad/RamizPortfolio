"use client";

import { useEffect, useState } from "react";

/** My local time, live — so a visitor knows whether I'm likely awake. */
export function LocalTime() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });
    const tick = () => setNow(fmt.format(new Date()));
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 15000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);
  return <span suppressHydrationWarning>{now ?? "--:--"} IST</span>;
}

export function BackToTop() {
  return (
    <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} data-cursor="fly up" className="btn-ghost group">
      Back to top
      <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:-translate-y-1">↑</span>
    </button>
  );
}

/** A hello for anyone who opens the console. */
export function ConsoleHello() {
  useEffect(() => {
    console.log(
      "%c hi, fellow dev 👋 %c\nThis site is Next.js + Tailwind, built from Postgres tables at deploy time.\nCurious about something? ramizanas6@gmail.com",
      "background:#d4f25b;color:#121016;font:600 14px sans-serif;padding:4px 8px;border-radius:6px",
      "color:inherit;font:13px sans-serif",
    );
  }, []);
  return null;
}
