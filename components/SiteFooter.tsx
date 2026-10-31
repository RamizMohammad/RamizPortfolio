import { profile } from "@/content/profile";

// Rendered at build time, so this is the date the site was last built.
const built = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default function SiteFooter() {
  return (
    <footer className="edge dash-t" style={{ paddingBottom: "max(24px, env(safe-area-inset-bottom, 0px))" }}>
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
        </ul>
        <p className="text-pink-deep">Built in Greater Noida</p>
      </div>
      <p className="t-micro muted mt-4">Last build {built}</p>
    </footer>
  );
}
