import { taglines } from "@/content/personality";
import CopyEmail from "@/components/CopyEmail";
import { profile } from "@/content/profile";

export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="border-t border-rule">
      <div className="wrap grid min-h-[calc(100svh-64px)] content-between gap-16 py-24 md:py-32">
        <div className="grid gap-10 md:w-[58%]">
          <div>
            <p className="label eyebrow" data-reveal>Contact</p>
            <p className="mt-3 grid gap-1 text-[13px]" data-reveal style={{ ["--rd" as string]: "80ms" }}>
              <span className="tape tape-line" style={{ ["--tilt" as string]: "-2deg" }}>{taglines.contact[0]}</span>
              <span className="tape tape-line ml-4" style={{ ["--tilt" as string]: "1.5deg" }}>{taglines.contact[1]}</span>
            </p>
            <h2 id="contact-title" className="display mt-4 text-[clamp(44px,7vw,96px)]" data-reveal="mask">
              Let&rsquo;s build <span className="accent-text">the system.</span>
            </h2>
            <p className="mt-6 max-w-[44ch] text-fg-2" data-reveal style={{ ["--rd" as string]: "120ms" }}>
              Open to engineering roles and freelance work in automation, backends and infrastructure. Email reaches me fastest.
            </p>
          </div>
          <CopyEmail email={profile.email} />
        </div>
        <ul className="grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {profile.links.map((l, i) => (
            <li key={l.label} className="bg-ink" data-reveal style={{ ["--rd" as string]: `${i * 70}ms` }}>
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="group grid gap-1 p-5 no-underline transition-colors hover:bg-cyan hover:text-ink">
                <span className="label group-hover:text-ink">{l.label} ↗</span>
                <span className="text-[15px]">{l.handle}</span>
              </a>
            </li>
          ))}
          <li className="bg-ink">
            <a href={profile.resume} className="group grid gap-1 p-5 no-underline transition-colors hover:bg-cyan hover:text-ink">
              <span className="label group-hover:text-ink">Résumé · PDF</span>
              <span className="text-[15px]">Download</span>
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
