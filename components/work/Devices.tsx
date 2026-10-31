import Image from "next/image";
import { profile } from "@/content/profile";
import type { System } from "@/content/types";

const host = (href: string) => {
  try {
    return new URL(href).host.replace(/^www\./, "");
  } catch {
    return href;
  }
};

/** A phone showing the app's store listing: icon, name, developer, install button, screens, about. */
export function Phone({ s }: { s: System }) {
  const store = s.links?.find((l) => l.href.includes("play.google.com"));
  return (
    <div className="mx-auto w-[280px] shrink-0 rounded-[44px] border-[3px] border-[#0f0f12] bg-[#0f0f12] p-[10px] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.7)]">
      <div className="relative h-[560px] overflow-hidden rounded-[34px] bg-white text-[#202124]">
        <div className="flex items-center justify-between px-6 pb-1 pt-3 text-[11px] font-semibold">
          <span>9:41</span>
          <span className="h-4 w-20 rounded-full bg-[#0f0f12]" aria-hidden="true" />
          <span aria-hidden="true">● ●</span>
        </div>
        <div className="h-full overflow-y-auto px-4 pb-16 pt-2">
          <div className="flex items-center gap-2 pb-3 text-[13px] text-[#5f6368]">
            <span aria-hidden="true">←</span>
            <span className="flex-1 rounded-full bg-[#f1f3f4] px-3 py-1.5">Search apps</span>
          </div>
          <div className="flex gap-3">
            {s.logo && <Image src={s.logo} alt="" width={64} height={64} className="h-16 w-16 rounded-[16px] border border-black/10" />}
            <div className="grid content-center gap-0.5">
              <p className="text-[19px] font-semibold leading-tight">{s.name}</p>
              <p className="text-[13px] font-medium text-[#01875f]">{profile.name}</p>
            </div>
          </div>
          <a
            href={store?.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block rounded-full bg-[#01875f] py-2 text-center text-[14px] font-semibold text-white hover:bg-[#016d4d]"
          >
            Install
          </a>
          {s.screen && (
            <div className="-mx-4 mt-4 overflow-x-auto px-4">
              <Image src={s.screen.src} alt={`Screens of ${s.name}`} width={s.screen.width} height={s.screen.height} className="h-[210px] w-auto max-w-none rounded-[10px]" />
            </div>
          )}
          <p className="mt-4 text-[15px] font-semibold">About this app</p>
          <p className="mt-1 text-[13px] leading-snug text-[#5f6368]">{s.summary}</p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {s.stack.map((t) => (
              <li key={t} className="rounded-full border border-[#dadce0] px-2.5 py-1 text-[11px] text-[#3c4043]">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** A browser window on the live site: address bar, then the screenshot (or the logo if there isn't one). */
export function Browser({ s }: { s: System }) {
  const link = s.links?.[0];
  return (
    <div className="w-full overflow-hidden rounded-[14px] border border-black/40 bg-[#f6f6f7] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.7)]">
      <div className="flex items-center gap-3 border-b border-black/10 bg-[#e9e9ec] px-3 py-2">
        <span className="flex gap-1.5" aria-hidden="true">
          <i className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <i className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <i className="h-3 w-3 rounded-full bg-[#28c840]" />
        </span>
        <a href={link?.href} target="_blank" rel="noopener noreferrer" className="flex-1 truncate rounded-md bg-white px-3 py-1 text-center text-[12px] text-[#3c3c43] hover:underline">
          🔒 {link ? host(link.href) : s.slug}
        </a>
      </div>
      {s.screen ? (
        <Image src={s.screen.src} alt={`Screenshot of ${s.name}`} width={s.screen.width} height={s.screen.height} sizes="(min-width: 1024px) 34vw, 90vw" className="h-auto w-full" />
      ) : (
        <div className="grid aspect-[16/10] place-items-center bg-white">
          <div className="grid justify-items-center gap-3">
            {s.logo && <Image src={s.logo} alt="" width={96} height={96} className="h-20 w-20 rounded-[20px]" />}
            <p className="text-[18px] font-semibold text-[#202124]">{s.name}</p>
            {link && <p className="text-[12px] text-[#5f6368]">Open {host(link.href)} to try it</p>}
          </div>
        </div>
      )}
    </div>
  );
}

/** A desktop app window with its icon, name and release link. */
export function DesktopWindow({ s }: { s: System }) {
  const link = s.links?.[0];
  return (
    <div className="w-full overflow-hidden rounded-[12px] border border-black/40 bg-[#ececec] text-[#202124] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.7)]">
      <div className="relative flex items-center border-b border-black/10 bg-[#dcdcdc] px-3 py-2">
        <span className="flex gap-1.5" aria-hidden="true">
          <i className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <i className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <i className="h-3 w-3 rounded-full bg-[#28c840]" />
        </span>
        <p className="absolute inset-x-0 text-center text-[12px] font-semibold">{s.name}</p>
      </div>
      <div className="grid justify-items-center gap-4 px-6 py-10 text-center">
        {s.logo && <Image src={s.logo} alt="" width={96} height={96} className="h-20 w-20 rounded-[20px] shadow-md" />}
        <div className="grid gap-1">
          <p className="text-[20px] font-semibold">{s.name}</p>
          <p className="text-[13px] text-[#5f6368]">{s.shipsAs}</p>
        </div>
        <p className="max-w-[34ch] text-[13px] leading-snug text-[#3c4043]">{s.summary}</p>
        {link && (
          <a href={link.href} target="_blank" rel="noopener noreferrer" className="rounded-md bg-[#2f5bea] px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-[#2449c6]">
            {link.label} ↗
          </a>
        )}
      </div>
    </div>
  );
}
