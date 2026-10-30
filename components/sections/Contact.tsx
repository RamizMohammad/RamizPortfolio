import CopyEmail from "@/components/CopyEmail";
import { profile } from "@/content/profile";

export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="border-t border-rule">
      <div className="wrap grid min-h-[calc(100svh-64px)] content-between gap-16 py-24 md:py-32">
        <div className="grid gap-10 md:w-[58%]">
          <div>
            <p className="label">Contact</p>
            <h2 id="contact-title" className="display mt-4 text-[clamp(44px,7vw,96px)]">
              Let&rsquo;s build the system.
            </h2>
            <p className="mt-6 max-w-[44ch] text-fg-2">
              Open to engineering roles and freelance work in automation, backends and infrastructure. Email reaches me fastest.
            </p>
          </div>
          <CopyEmail email={profile.email} />
        </div>
        <ul className="grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {profile.links.map((l) => (
            <li key={l.label} className="bg-ink">
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="group grid gap-1 p-5 no-underline transition-colors hover:bg-fg hover:text-ink">
                <span className="label group-hover:text-ink">{l.label} ↗</span>
                <span className="text-[15px]">{l.handle}</span>
              </a>
            </li>
          ))}
          <li className="bg-ink">
            <a href={profile.resume} className="group grid gap-1 p-5 no-underline transition-colors hover:bg-fg hover:text-ink">
              <span className="label group-hover:text-ink">Résumé · PDF</span>
              <span className="text-[15px]">Download</span>
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
