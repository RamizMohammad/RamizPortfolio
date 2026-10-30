import Image from "next/image";
import { taglines } from "@/content/personality";
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
    <section id="about" aria-labelledby="about-title" className="stop">
      <div className="grid gap-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="label eyebrow" data-reveal>Personal</p>
            <p className="mt-3" data-reveal style={{ ["--rd" as string]: "80ms" }}>
              <span className="tape text-[12px]" style={{ ["--tilt" as string]: "-2deg" }}>{taglines.about}</span>
            </p>
            <h2 id="about-title" className="display mt-4 text-[clamp(44px,5vw,76px)]" data-reveal="mask">
              About
            </h2>
          </div>
          <div className="relative w-28 shrink-0 rotate-3 border-[1.5px] border-fg bg-panel p-1.5 shadow-[4px_4px_0_var(--color-fg)] md:w-32" data-reveal>
            <Image src="/images/portrait-cut.webp" alt={profile.portrait.alt} width={640} height={640} sizes="128px" className="w-full" />
            <span className="tape absolute -left-4 -top-3 text-[11px]" style={{ ["--tilt" as string]: "-8deg" }} aria-hidden="true">
              hi, that&rsquo;s me
            </span>
          </div>
        </div>

        <p className="max-w-[52ch] text-[17px] leading-[1.6] text-fg-2" data-reveal style={{ ["--rd" as string]: "120ms" }}>
          I&rsquo;m a software engineer at {profile.company}. I like the parts of software most people never see: the scripts that remove manual work, the APIs that connect systems, and the servers they run on. I build the apps on top too, mostly Android and the web.
        </p>

        <dl className="grid border-t-[1.5px] border-fg sm:grid-cols-2">
          {details.map((d, i) => (
            <div key={d.term} className="grid gap-1 border-b border-rule py-3.5 sm:pr-5" data-reveal style={{ ["--rd" as string]: `${i * 60}ms` }}>
              <dt className="label">{d.term}</dt>
              <dd className="break-words text-[15px]">
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

        <div className="grid gap-3">
          <h3 className="label eyebrow">What I work on</h3>
          <ul className="grid border-t border-rule">
            {profile.interests.map((it, i) => (
              <li key={it} className="group flex items-baseline gap-4 border-b border-rule py-2.5 text-[15px] text-fg-2 transition-colors hover:text-fg" data-reveal style={{ ["--rd" as string]: `${i * 60}ms` }}>
                <span className="data text-[11px] text-cyan transition-transform group-hover:translate-x-1">0{i + 1}</span>
                {it}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
