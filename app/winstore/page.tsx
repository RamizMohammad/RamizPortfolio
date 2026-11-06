import type { Metadata } from "next";
import Store from "@/components/winstore/Store";
import { storeApps } from "@/content/store";

export const metadata: Metadata = {
  title: "Win Store",
  description: "Windows apps, VS Code extensions and developer tools built by Mohammad Ramiz: Snapy, bakup, Linkium, SecretShield, CodeFlow Mapper and more. All free.",
  alternates: { canonical: "/winstore" },
};

export default function WinStorePage() {
  const apps = storeApps.filter((a) => a.kind === "app").length;
  const vscode = storeApps.filter((a) => a.kind === "vscode").length;
  const other = storeApps.length - apps - vscode;
  return (
    <main id="main" className="edge pb-24 pt-[var(--nav-h)]">
      <header className="grid gap-6 pb-14 pt-20 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="grid gap-5">
          <p className="t-label muted">~/winstore</p>
          <h1 className="t-display">Win Store</h1>
        </div>
        <div className="grid max-w-[40ch] gap-4">
          <p className="voice-sm">Windows apps, VS Code extensions and developer tools I build. Free and no sign-in: apps download straight from GitHub Releases, extensions install from the VS Code Marketplace.</p>
          <p className="flex flex-wrap gap-2">
            <span className="t-micro rounded-full border-[1.5px] border-ink bg-card px-3 py-1.5">{apps} apps</span>
            {vscode > 0 && <span className="t-micro rounded-full border-[1.5px] border-ink bg-card px-3 py-1.5">{vscode} VS Code extensions</span>}
            {other > 0 && <span className="t-micro rounded-full border-[1.5px] border-ink bg-card px-3 py-1.5">{other} other tools</span>}
            <span className="t-micro rounded-full border-[1.5px] border-ink bg-lime px-3 py-1.5">All free</span>
          </p>
        </div>
      </header>
      <Store apps={storeApps} />
    </main>
  );
}
