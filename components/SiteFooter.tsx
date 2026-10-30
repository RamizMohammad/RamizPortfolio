import { profile } from "@/content/profile";

export default function SiteFooter() {
  return (
    <footer className="border-t border-rule">
      <div className="wrap flex flex-wrap items-center justify-between gap-4 py-8" style={{ paddingBottom: "max(32px, env(safe-area-inset-bottom, 0px))" }}>
        <p className="label normal-case tracking-normal">
          © {new Date().getFullYear()} {profile.name}. Built with Next.js and three.js; the town is modelled in code.
        </p>
        <ul className="label flex gap-6">
          {profile.links.map((l) => (
            <li key={l.label}>
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="hover:text-fg">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
