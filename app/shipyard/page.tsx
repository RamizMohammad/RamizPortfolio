import type { Metadata } from "next";
import Store from "@/components/shipyard/Store";
import { storeApps } from "@/content/store";

export const metadata: Metadata = {
  title: "Shipyard",
  description: "Desktop apps, VS Code extensions, Python libraries and Chrome extensions built by Mohammad Ramiz: Snapy, bakup, Linkium, SecretShield, CodeFlow Mapper, FastReact and more. All free.",
  alternates: { canonical: "/shipyard" },
};

export default function ShipyardPage() {
  const apps = storeApps.filter((a) => a.kind === "app").length;
  const vscode = storeApps.filter((a) => a.kind === "vscode").length;
  const pip = storeApps.filter((a) => a.kind === "pip").length;
  const chrome = storeApps.filter((a) => a.kind === "chrome").length;
  return (
    <main id="main" className="edge pb-24 pt-[var(--nav-h)]">
      <header className="grid gap-6 pb-14 pt-20 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="grid gap-5">
          <p className="t-label muted">~/shipyard</p>
          <h1 className="t-display">Shipyard</h1>
        </div>
        <div className="grid max-w-[40ch] gap-4">
          <p className="voice-sm">Desktop apps for Windows, Mac and Linux, VS Code extensions, Python libraries and Chrome extensions I build. All free, no sign-in.</p>
          <p className="flex flex-wrap gap-2">
            <span className="t-micro rounded-full border-[1.5px] border-ink bg-card px-3 py-1.5">{apps} apps</span>
            {vscode > 0 && <span className="t-micro rounded-full border-[1.5px] border-ink bg-card px-3 py-1.5">{vscode} VS Code extensions</span>}
            {pip > 0 && <span className="t-micro rounded-full border-[1.5px] border-ink bg-card px-3 py-1.5">{pip} Python libraries</span>}
            {chrome > 0 && <span className="t-micro rounded-full border-[1.5px] border-ink bg-card px-3 py-1.5">{chrome} Chrome {chrome === 1 ? "extension" : "extensions"}</span>}
            <span className="t-micro rounded-full border-[1.5px] border-ink bg-lime px-3 py-1.5">All free</span>
          </p>
        </div>
      </header>
      <Store apps={storeApps} />
    </main>
  );
}
