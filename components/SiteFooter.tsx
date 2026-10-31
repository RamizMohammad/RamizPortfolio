import Image from "next/image";
import { profile } from "@/content/profile";
import { BackToTop, ConsoleHello, LocalTime } from "./FooterExtras";

// Rendered at build time, so this is the date the site was last built.
const built = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default function SiteFooter() {
  return (
    <footer className="edge" style={{ paddingBottom: "max(24px, env(safe-area-inset-bottom, 0px))" }}>
      <div className="grid gap-8 rounded-[32px] border-[1.5px] border-ink bg-card p-7 md:grid-cols-[auto_1fr_auto] md:items-center md:p-10">
        <Image src="/images/mascot-face.webp" alt="" width={96} height={96} className="wave h-20 w-20 rounded-full border-[2px] border-ink bg-sun md:h-24 md:w-24" />
        <div className="grid gap-2">
          <p className="t-h1 !text-[clamp(32px,4vw,56px)]">Thanks for scrolling.</p>
          <p className="t-label muted">
            Greater Noida, India · <LocalTime /> · <span className="text-pink-deep">open to work</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-3 md:justify-end">
          <a href={`mailto:${profile.email}`} className="btn-pill">Email me</a>
          <BackToTop />
        </div>
      </div>
      <div className="t-label flex flex-wrap items-center justify-between gap-4 pt-6">
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <ul className="flex flex-wrap gap-6">
          {profile.links.map((l) => (
            <li key={l.label}>
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="link">
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a href={profile.resume} className="link">Résumé</a>
          </li>
        </ul>
        <p className="muted">Last build {built}</p>
      </div>
      <ConsoleHello />
    </footer>
  );
}
