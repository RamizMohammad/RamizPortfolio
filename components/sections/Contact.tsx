import { taglines } from "@/content/personality";
import CopyEmail from "@/components/CopyEmail";
import { profile } from "@/content/profile";

export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="border-t border-rule">
      <div className="wrap grid min-h-[calc(100svh-64px)] content-between gap-16 py-24 text-center md:py-32">
        <div className="grid justify-items-center gap-10">
          <div className="grid justify-items-center">
            <p className="label eyebrow" data-reveal>Contact</p>
            <p className="mt-3 grid justify-items-center gap-1 text-[15px]" data-reveal style={{ ["--rd" as string]: "80ms" }}>
              <span className="tape tape-line" style={{ ["--tilt" as string]: "-2deg" }}>{taglines.contact[0]}</span>
              <span className="tape tape-line" style={{ ["--tilt" as string]: "1.5deg" }}>{taglines.contact[1]}</span>
            </p>
            <h2 id="contact-title" className="display mt-6 text-[clamp(44px,8vw,112px)]" data-reveal="mask">
              Let&rsquo;s build <span className="accent-text">the system.</span>
            </h2>
            <p className="mt-6 max-w-[44ch] text-fg-2" data-reveal style={{ ["--rd" as string]: "120ms" }}>
              Open to engineering roles and freelance work in automation, backends and infrastructure. Email reaches me fastest.
            </p>
          </div>
          <div aria-hidden="true" className="hidden h-[34svh] md:block" />
          <CopyEmail email={profile.email} />
        </div>
        <ul className="grid gap-px border-[1.5px] border-fg bg-fg text-left shadow-[8px_8px_0_var(--color-fg)] sm:grid-cols-2 lg:grid-cols-4">
          {profile.links.map((l, i) => (
            <li key={l.label} className="bg-ink" data-reveal style={{ ["--rd" as string]: `${i * 70}ms` }}>
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="group grid gap-1 p-5 no-underline transition-colors hover:bg-tape hover:text-fg">
                <span className="label group-hover:text-fg">{l.label} ↗</span>
                <span className="text-[15px]">{l.handle}</span>
              </a>
            </li>
          ))}
          <li className="bg-ink">
            <a href={profile.resume} className="group grid gap-1 p-5 no-underline transition-colors hover:bg-tape hover:text-fg">
              <span className="label group-hover:text-fg">Résumé · PDF</span>
              <span className="text-[15px]">Download</span>
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
