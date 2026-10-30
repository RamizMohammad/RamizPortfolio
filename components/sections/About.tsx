import Image from "next/image";
import { profile } from "@/content/profile";

const details = [
  { term: "Name", value: profile.name },
  { term: "Role", value: `${profile.role}, ${profile.company}` },
  { term: "Based in", value: profile.location },
  { term: "Education", value: profile.education },
  { term: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { term: "Phone", value: profile.phone.display, href: profile.phone.href },
];

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="border-t border-rule py-24 md:py-32">
      <div className="wrap grid gap-12 md:grid-cols-12">
        <div className="grid content-start gap-12 md:col-span-7 lg:col-span-6">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="label eyebrow" data-reveal>Personal</p>
              <h2 id="about-title" className="display mt-4 text-[clamp(44px,7vw,96px)]" data-reveal="mask">
                About
              </h2>
            </div>
            <Image
              src={profile.portrait.src}
              alt={profile.portrait.alt}
              width={profile.portrait.width}
              height={profile.portrait.height}
              sizes="140px"
              className="h-28 w-28 shrink-0 border border-cyan/40 object-cover shadow-[0_0_40px_-10px_var(--color-cyan)] md:h-36 md:w-36"
              data-reveal
            />
          </div>

          <p className="max-w-[52ch] text-[18px] leading-[1.6] text-fg-2" data-reveal style={{ ["--rd" as string]: "120ms" }}>
            I&rsquo;m a software engineer at {profile.company}. I like the parts of software most people never see: the scripts that remove manual work, the APIs that connect systems, and the servers they run on. I build the apps on top too, mostly Android and the web.
          </p>

          <dl className="grid border-t border-cyan/50 sm:grid-cols-2">
            {details.map((d, i) => (
              <div key={d.term} className="grid gap-1 border-b border-rule py-4 sm:pr-6" data-reveal style={{ ["--rd" as string]: `${i * 60}ms` }}>
                <dt className="label">{d.term}</dt>
                <dd className="break-words text-[16px]">
                  {d.href ? (
                    <a href={d.href} className="underline decoration-cyan/40 transition-colors hover:text-cyan hover:decoration-cyan">
                      {d.value}
                    </a>
                  ) : (
                    d.value
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <div className="grid gap-4">
            <h3 className="label eyebrow">What I work on</h3>
            <ul className="grid border-t border-rule">
              {profile.interests.map((it, i) => (
                <li key={it} className="group flex items-baseline gap-4 border-b border-rule py-3 text-[15px] text-fg-2 transition-colors hover:text-fg" data-reveal style={{ ["--rd" as string]: `${i * 60}ms` }}>
                  <span className="data text-[11px] text-cyan transition-transform group-hover:translate-x-1">0{i + 1}</span>
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
