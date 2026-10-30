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
    <section id="about" aria-labelledby="about-title" className="border-t border-rule py-24 md:py-32">
      <div className="wrap grid gap-12 md:grid-cols-12">
        <div className="grid content-start gap-12 md:col-span-7 lg:col-span-6">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="label eyebrow" data-reveal>Personal</p>
              <p className="mt-3" data-reveal style={{ ["--rd" as string]: "80ms" }}><span className="tape text-[12px]" style={{ ["--tilt" as string]: "-2deg" }}>{taglines.about}</span></p>
              <h2 id="about-title" className="display mt-4 text-[clamp(44px,7vw,96px)]" data-reveal="mask">
                About
              </h2>
            </div>
            {/* Halftone portrait peeking over the edge of a crate; rises when the section scrolls in. */}
            <div className="peek-box relative h-36 w-44 shrink-0 md:h-48 md:w-60" data-reveal>
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src="/images/portrait-cut.webp"
                  alt={profile.portrait.alt}
                  width={640}
                  height={640}
                  sizes="240px"
                  className="peek halftone absolute left-1/2 top-2 w-[112%] max-w-none"
                />
              </div>
              <div aria-hidden="true" className="absolute -inset-x-3 bottom-0 h-10 border-t-2 border-tape bg-panel shadow-[0_-12px_30px_-10px_rgb(0_0_0/0.8)]">
                <div className="absolute inset-x-0 top-2 h-px bg-violet/40" />
                <div className="absolute left-1/2 top-0 h-full w-14 -translate-x-1/2 bg-tape/90" />
              </div>
              <span className="tape absolute -right-3 -top-2 text-[12px]" style={{ ["--tilt" as string]: "6deg" }} aria-hidden="true">
                hi, that&rsquo;s me
              </span>
            </div>
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
