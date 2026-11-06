import Image from "next/image";
import type { StoreApp } from "@/content/store";

/**
 * A glimpse of each platform's own look, used only on that platform's tab: the site's theme stays
 * in charge everywhere else. Every mark here is drawn generically (window buttons, a terminal,
 * an editor), never a vendor's logo.
 */
export type Platform = "windows" | "macos" | "linux" | "vscode" | "pip" | "chrome";

const SEGOE = { fontFamily: '"Segoe UI Variable", "Segoe UI", system-ui, sans-serif' };
const SF = { fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif' };
const UBUNTU = { fontFamily: 'Ubuntu, "Cantarell", system-ui, sans-serif' };

/** Python import lines for the REPL banner; anything not listed falls back to `import <slug>`. */
const IMPORTS: Record<string, string> = {
  fastreact: "from fastreact import FastReact",
  leakyspanner: "from leakyspanner import leakyspanner",
};

function MiniIcon({ a, size = 32 }: { a: StoreApp; size?: number }) {
  return a.logo ? (
    <Image src={a.logo.src} alt="" width={size} height={size} className="rounded-[8px] bg-white object-cover" style={{ width: size, height: size }} />
  ) : (
    <span className="grid place-items-center rounded-[8px] bg-white font-display text-[#121016]" style={{ width: size, height: size, fontSize: size * 0.55 }}>
      {a.name[0].toUpperCase()}
    </span>
  );
}

const Lights = () => (
  <span className="flex gap-1.5" aria-hidden="true">
    <i className="h-3 w-3 rounded-full bg-[#ff5f57]" />
    <i className="h-3 w-3 rounded-full bg-[#febc2e]" />
    <i className="h-3 w-3 rounded-full bg-[#28c840]" />
  </span>
);

/** The thin title bar a card wears on its platform's tab. */
export function CardChrome({ tab, a }: { tab: Platform; a: StoreApp }) {
  const base = "flex h-8 shrink-0 items-center gap-2 border-b-[1.5px] border-ink px-3 text-[12px]";
  switch (tab) {
    case "windows":
      return (
        <div className={`${base} justify-between bg-white text-[#1b1b1b]`} style={SEGOE} aria-hidden="true">
          <span className="truncate">{a.name}</span>
          <span className="flex items-center gap-4 text-[13px] text-[#5d5d5d]">
            <span>—</span>
            <span className="text-[11px]">▢</span>
            <span className="transition-colors group-hover:text-[#c42b1c]">✕</span>
          </span>
        </div>
      );
    case "macos":
      return (
        <div className={`${base} relative bg-[#ececec] text-[#3a3a3a]`} style={SF} aria-hidden="true">
          <Lights />
          <span className="absolute inset-x-0 text-center font-medium">{a.name}</span>
        </div>
      );
    case "linux":
      return (
        <div className={`${base} relative justify-end bg-[#2c2c2c] text-[#eee]`} style={UBUNTU} aria-hidden="true">
          <span className="absolute inset-x-0 text-center font-medium">ramiz@shipyard: ~/{a.slug}</span>
          <span className="relative flex gap-1.5">
            <i className="h-3.5 w-3.5 rounded-full bg-[#4a4a4a]" />
            <i className="h-3.5 w-3.5 rounded-full bg-[#4a4a4a]" />
            <i className="h-3.5 w-3.5 rounded-full bg-[#e95420]" />
          </span>
        </div>
      );
    case "vscode":
      return (
        <div className={`${base} !gap-0 !px-0 bg-[#252526] text-[#cccccc]`} aria-hidden="true">
          <span className="flex h-full items-center gap-2 border-t-2 border-[#3794ff] bg-[#1e1e1e] px-3 font-mono text-[11.5px] text-white">
            {a.slug}.vsix <span className="text-[#8b8b8b]">×</span>
          </span>
        </div>
      );
    case "pip":
      return (
        <div className={`${base} bg-[#1b2733] font-mono text-[11.5px] text-[#e7eef5]`} aria-hidden="true">
          <span className="text-[#ffd43b]">&gt;&gt;&gt;</span>
          <span className="truncate">import {a.slug.replace(/-/g, "_")}</span>
        </div>
      );
    case "chrome":
      return (
        <div className={`${base} items-end !pb-0 bg-[#dee1e6] text-[#3c4043]`} aria-hidden="true">
          <span className="flex h-6 items-center gap-1.5 rounded-t-[8px] bg-white px-3 text-[11.5px]">
            <span className="text-[13px]">🧩</span>
            {a.name}
          </span>
        </div>
      );
  }
}

function Frame({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <section aria-hidden="true" className={`store-card relative mb-8 overflow-hidden rounded-[28px] border-[1.5px] border-ink ${className}`}>{children}</section>;
}

/** The banner at the top of a platform's tab. */
export function TabBanner({ tab, apps }: { tab: Platform; apps: StoreApp[] }) {
  switch (tab) {
    case "windows":
      return (
        <Frame className="h-[240px] md:h-[280px]">
          <div className="absolute inset-0" style={{ background: "radial-gradient(120% 90% at 78% 115%, #0a4fd6 0%, #3f8cff 26%, #9cc3ff 50%, #e6efff 76%, #f6f9ff 100%)" }} />
          <div className="absolute left-5 top-5 w-[min(420px,calc(100%-40px))] overflow-hidden rounded-[8px] border border-black/10 bg-white/85 shadow-[0_16px_40px_rgb(0_40_120/0.25)] backdrop-blur" style={SEGOE}>
            <div className="flex h-8 items-center justify-between px-3 text-[12px] text-[#1b1b1b]">
              <span>Shipyard — Windows apps</span>
              <span className="flex gap-4 text-[#5d5d5d]">
                <span>—</span>
                <span className="text-[11px]">▢</span>
                <span>✕</span>
              </span>
            </div>
            <p className="px-4 pb-4 pt-1 text-[14px] leading-snug text-[#1b1b1b]">
              {apps.length} installers for Windows 10 and 11. Download, run, done.
            </p>
          </div>
          {/* Taskbar */}
          <div className="absolute inset-x-0 bottom-0 flex h-12 items-center justify-center gap-2 border-t border-white/60 bg-white/70 backdrop-blur-md">
            <span className="grid h-8 w-8 grid-cols-2 gap-[2px] p-[7px]">
              <i className="rounded-[1px] bg-[#0067c0]" />
              <i className="rounded-[1px] bg-[#0067c0]" />
              <i className="rounded-[1px] bg-[#0067c0]" />
              <i className="rounded-[1px] bg-[#0067c0]" />
            </span>
            {apps.map((a, i) => (
              <span key={a.slug} className="relative grid h-9 w-9 place-items-center rounded-[6px] hover:bg-white/80">
                <MiniIcon a={a} size={26} />
                {i === 0 && <i className="absolute -bottom-0.5 h-[3px] w-3 rounded-full bg-[#0067c0]" />}
              </span>
            ))}
          </div>
        </Frame>
      );

    case "macos":
      return (
        <Frame className="h-[240px] md:h-[280px]">
          <div className="absolute inset-0" style={{ background: "linear-gradient(140deg, #3b2a8a 0%, #8a3fa4 38%, #e2678d 68%, #f7b26a 100%)" }} />
          <div className="absolute inset-x-0 top-0 flex h-7 items-center gap-5 bg-white/25 px-4 text-[12.5px] text-white backdrop-blur-md" style={SF}>
            <b className="font-semibold">Shipyard</b>
            <span>File</span>
            <span>Edit</span>
            <span>View</span>
            <span className="hidden sm:inline">Window</span>
          </div>
          <div className="absolute left-1/2 top-12 w-[min(380px,calc(100%-40px))] -translate-x-1/2 overflow-hidden rounded-[12px] bg-[#f5f5f7]/90 shadow-[0_20px_50px_rgb(30_0_60/0.35)] backdrop-blur" style={SF}>
            <div className="relative flex h-8 items-center px-3">
              <Lights />
              <span className="absolute inset-x-0 text-center text-[12.5px] font-medium text-[#3a3a3a]">Mac apps</span>
            </div>
            <p className="px-4 pb-4 text-center text-[14px] text-[#3a3a3a]">
              {apps.length ? `${apps.length} apps, ready for macOS.` : "Native builds are being packed. Check back soon."}
            </p>
          </div>
          {/* Dock */}
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-end gap-2 rounded-[18px] border border-white/40 bg-white/30 px-3 py-2 backdrop-blur-md">
            {(apps.length ? apps : [null, null, null]).map((a, i) =>
              a ? (
                <MiniIcon key={a.slug} a={a} size={40} />
              ) : (
                <span key={i} className="h-10 w-10 rounded-[10px] border-2 border-dashed border-white/70" />
              ),
            )}
          </div>
        </Frame>
      );

    case "linux": {
      const lines = apps.flatMap((a) => {
        const f = a.osDownloads?.linux ?? a.download;
        return f.file.endsWith(".deb")
          ? [`sudo apt install ./${f.file}`, `Setting up ${a.slug} (${a.version ?? "latest"}) ...`]
          : [`./${f.file}`];
      });
      return (
        <Frame className="bg-[#300a24]">
          <div className="relative flex h-9 items-center justify-end bg-[#2c2c2c] px-3 text-[13px] text-[#eee]" style={UBUNTU}>
            <span className="absolute inset-x-0 text-center font-medium">ramiz@shipyard: ~/Downloads</span>
            <span className="relative flex gap-2">
              <i className="h-4 w-4 rounded-full bg-[#4a4a4a]" />
              <i className="h-4 w-4 rounded-full bg-[#4a4a4a]" />
              <i className="h-4 w-4 rounded-full bg-[#e95420]" />
            </span>
          </div>
          <pre className="overflow-x-auto px-5 py-5 font-mono text-[13px] leading-relaxed text-[#eeeeec]">
            {lines.map((l, i) =>
              l.startsWith("Setting up") ? (
                <span key={i} className="block text-[#c6c6c2]">
                  {l}
                </span>
              ) : (
                <span key={i} className="block">
                  <span className="font-bold text-[#8ae234]">ramiz@shipyard</span>:<span className="font-bold text-[#729fcf]">~/Downloads</span>$ {l}
                </span>
              ),
            )}
            <span className="block">
              <span className="font-bold text-[#8ae234]">ramiz@shipyard</span>:<span className="font-bold text-[#729fcf]">~/Downloads</span>$ <i className="term-caret inline-block h-[1.05em] w-[0.6em] translate-y-[3px] bg-[#eeeeec]" />
            </span>
          </pre>
        </Frame>
      );
    }

    case "vscode":
      return (
        <Frame className="bg-[#1e1e1e] text-[#cccccc]">
          <div className="flex">
            {/* Activity bar */}
            <div className="hidden w-12 shrink-0 flex-col items-center gap-4 bg-[#333333] py-4 sm:flex">
              {[0, 1, 2, 3].map((i) => (
                <i key={i} className={`h-5 w-5 rounded-[4px] ${i === 3 ? "bg-[#cccccc]" : "border-2 border-[#858585]"}`} />
              ))}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex h-9 bg-[#252526]">
                {apps.map((a, i) => (
                  <span key={a.slug} className={`flex items-center gap-2 px-4 font-mono text-[12px] ${i === 0 ? "border-t-2 border-[#3794ff] bg-[#1e1e1e] text-white" : "text-[#969696]"}`}>
                    {a.slug}.vsix <span className="text-[#8b8b8b]">×</span>
                  </span>
                ))}
              </div>
              <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-relaxed">
                <span className="block">
                  <span className="mr-5 inline-block w-4 text-right text-[#858585]">1</span>
                  <span className="text-[#6a9955]"># Install from the terminal, or press Get on a card</span>
                </span>
                {apps.map((a, i) => (
                  <span key={a.slug} className="block">
                    <span className="mr-5 inline-block w-4 text-right text-[#858585]">{i + 2}</span>
                    <span className="text-[#dcdcaa]">code</span> <span className="text-[#9cdcfe]">--install-extension</span> <span className="text-[#ce9178]">MohammadRamiz.{a.slug}</span>
                  </span>
                ))}
              </pre>
            </div>
          </div>
          <div className="flex h-6 items-center gap-4 bg-[#007acc] px-3 font-mono text-[11.5px] text-white">
            <span>⎇ main</span>
            <span>✓ {apps.length} extensions</span>
            <span className="ml-auto hidden sm:inline">UTF-8 · Python</span>
          </div>
        </Frame>
      );

    case "pip":
      return (
        <Frame className="bg-[#1b2733] text-[#e7eef5]">
          <div className="flex h-9 items-center gap-2 border-b border-white/10 bg-[#223140] px-4 font-mono text-[12px]">
            <i className="h-3 w-3 rounded-full bg-[#3776ab]" />
            <i className="h-3 w-3 rounded-full bg-[#ffd43b]" />
            <span className="ml-2 text-[#9fb3c6]">python3</span>
          </div>
          <pre className="overflow-x-auto px-5 py-5 font-mono text-[13px] leading-relaxed">
            <span className="block">
              <span className="text-[#9fb3c6]">$</span> pip install {apps.map((a) => a.slug).join(" ")}
            </span>
            <span className="block text-[#8fd18f]">Successfully installed {apps.map((a) => `${a.slug}-${a.version ?? ""}`).join(" ")}</span>
            <span className="block text-[#9fb3c6]">$ python3</span>
            {apps.map((a) => (
              <span key={a.slug} className="block">
                <span className="text-[#ffd43b]">&gt;&gt;&gt;</span> <span className="text-[#7fb2e5]">{IMPORTS[a.slug] ?? `import ${a.slug.replace(/-/g, "_")}`}</span>
              </span>
            ))}
            <span className="block">
              <span className="text-[#ffd43b]">&gt;&gt;&gt;</span> <i className="term-caret inline-block h-[1.05em] w-[0.6em] translate-y-[3px] bg-[#e7eef5]" />
            </span>
          </pre>
        </Frame>
      );

    case "chrome":
      return (
        <Frame className="bg-white text-[#202124]">
          <div className="flex h-10 items-end gap-1 bg-[#dee1e6] px-3">
            <span className="flex h-8 items-center gap-2 rounded-t-[10px] bg-white px-4 text-[12.5px]">🧩 Extensions</span>
            <span className="mb-2 ml-1 text-[18px] text-[#5f6368]">+</span>
          </div>
          <div className="flex items-center gap-3 border-b border-[#dadce0] px-3 py-2">
            <span className="text-[#5f6368]">←</span>
            <span className="text-[#5f6368]">→</span>
            <span className="flex-1 rounded-full bg-[#f1f3f4] px-4 py-1.5 text-[13px] text-[#202124]">chrome://extensions</span>
          </div>
          <div className="grid gap-3 px-5 py-4">
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-medium">Extensions</span>
              <span className="flex items-center gap-2 text-[12.5px] text-[#5f6368]">
                Developer mode
                <i className="relative h-[14px] w-[30px] rounded-full bg-[#8ab4f8]">
                  <i className="absolute -top-[3px] right-0 h-5 w-5 rounded-full bg-[#1a73e8] shadow" />
                </i>
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Load unpacked", "Pack extension", "Update"].map((b, i) => (
                <span key={b} className={`rounded-[4px] border px-3 py-1 text-[12.5px] ${i === 0 ? "border-[#1a73e8] text-[#1a73e8]" : "border-[#dadce0] text-[#5f6368]"}`}>
                  {b}
                </span>
              ))}
            </div>
          </div>
        </Frame>
      );
  }
}
