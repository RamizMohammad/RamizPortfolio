import type { Metadata } from "next";
import Store from "@/components/winstore/Store";
import { storeApps } from "@/content/store";

export const metadata: Metadata = {
  title: "Win Store",
  description: "Windows apps and developer extensions built by Mohammad Ramiz: Snapy, bakup, Linkium, Backup Engine and more. Free downloads from GitHub Releases.",
  alternates: { canonical: "/winstore" },
};

export default function WinStorePage() {
  const apps = storeApps.filter((a) => a.kind === "app").length;
  const extensions = storeApps.length - apps;
  return (
    <main id="main" className="edge pb-24 pt-[var(--nav-h)]">
      <header className="grid gap-6 pb-14 pt-20 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="grid gap-5">
          <p className="t-label muted">~/winstore</p>
          <h1 className="t-display">Win Store</h1>
        </div>
        <div className="grid max-w-[40ch] gap-4">
          <p className="voice-sm">Windows apps and developer extensions I build. Free, no sign-in, downloaded straight from each project&rsquo;s GitHub Releases.</p>
          <p className="flex flex-wrap gap-2">
            <span className="t-micro rounded-full border-[1.5px] border-ink bg-card px-3 py-1.5">{apps} apps</span>
            <span className="t-micro rounded-full border-[1.5px] border-ink bg-card px-3 py-1.5">{extensions} extensions</span>
            <span className="t-micro rounded-full border-[1.5px] border-ink bg-lime px-3 py-1.5">All free</span>
          </p>
        </div>
      </header>
      <Store apps={storeApps} />
    </main>
  );
}
