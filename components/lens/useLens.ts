"use client";

import { useSyncExternalStore } from "react";
import { isLens, LENS_KEY, type Lens } from "@/content/lens";

const EVENT = "lens-change";

function read(): Lens | null {
  const v = document.documentElement.dataset.lens;
  return isLens(v) ? v : null;
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}

/** Sets the lens on <html>, remembers it, and keeps ?for= in the address bar in step. */
export function setLens(lens: Lens | null) {
  const root = document.documentElement;
  if (lens) root.dataset.lens = lens;
  else delete root.dataset.lens;
  try {
    if (lens) localStorage.setItem(LENS_KEY, lens);
    else localStorage.removeItem(LENS_KEY);
  } catch {}
  const url = new URL(window.location.href);
  if (url.searchParams.has("for")) {
    if (lens) url.searchParams.set("for", lens);
    else url.searchParams.delete("for");
    window.history.replaceState(null, "", url);
  }
  window.dispatchEvent(new Event(EVENT));
}

/** The current lens, or null when the visitor hasn't picked one. */
export function useLens(): Lens | null {
  return useSyncExternalStore(subscribe, read, () => null);
}
