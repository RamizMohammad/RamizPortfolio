import CopyEmail from "@/components/CopyEmail";
import Words from "@/components/Words";
import { profile } from "@/content/profile";
import SectionLabel from "./SectionLabel";

export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="edge">
      <SectionLabel n={9}>Contact</SectionLabel>
      <div className="grid gap-[41px] pb-20 pt-24 lg:grid-cols-2 lg:pt-32">
        <h2 id="contact-title" className="t-display split" data-reveal>
          <Words text="Let’s build the system." />
        </h2>
        <div className="grid content-end gap-10" data-reveal style={{ ["--rd" as string]: "120ms" }}>
          <p className="voice ink-in max-w-[30ch]">Open to engineering roles and freelance work in automation, backends and infrastructure. Email reaches me fastest.</p>
          <CopyEmail email={profile.email} />
          <ul className="t-label flex flex-wrap gap-x-6 gap-y-3">
            {profile.links.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="link">
                  {l.label} ↗
                </a>
              </li>
            ))}
            <li>
              <a href={profile.resume} className="link">Résumé PDF</a>
            </li>
            <li>
              <a href={profile.phone.href} className="link">{profile.phone.display}</a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
