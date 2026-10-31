import Image from "next/image";
import { profile } from "@/content/profile";
import SectionLabel from "./SectionLabel";

const details = [
  { term: "Name", value: profile.name },
  { term: "Role", value: `${profile.role}, ${profile.company}` },
  { term: "Based in", value: profile.location },
  { term: "Education", value: profile.education },
  { term: "Email", value: profile.email, href: `mailto:${profile.email}`, nc: true },
  { term: "Phone", value: profile.phone.display, href: profile.phone.href },
];

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="edge">
      <SectionLabel n={1}>About</SectionLabel>
      <div className="void">
        <h2 id="about-title" className="t-h1" data-reveal>
          Behind the systems.
        </h2>
        <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-[28px] border-[1.5px] border-ink bg-sun" data-reveal style={{ ["--rd" as string]: "80ms" }}>
          <Image src={profile.portrait.src} alt={profile.portrait.alt} width={profile.portrait.width} height={profile.portrait.height} sizes="(min-width: 1024px) 420px, 90vw" className="h-auto w-full mix-blend-multiply" />
        </div>
        <p className="voice" data-reveal style={{ ["--rd" as string]: "160ms" }}>
          I&rsquo;m a software engineer at {profile.company}. I like the scripts that remove manual work, the APIs that connect systems, and the servers they run on. I build the apps on top too, mostly Android and the web.
        </p>
      </div>
      <div className="grid gap-[41px] pb-24 lg:grid-cols-2">
        <dl className="grid">
          {details.map((d) => (
            <div key={d.term} className="dash-t grid grid-cols-[120px_1fr] gap-4 py-3.5" data-reveal>
              <dt className="t-label muted">{d.term}</dt>
              <dd className={`t-sub break-words ${d.nc ? "nc" : ""}`}>
                {d.href ? <a href={d.href} className="link">{d.value}</a> : d.value}
              </dd>
            </div>
          ))}
        </dl>
        <div className="grid content-start">
          <h3 className="t-label muted dash-t py-3.5">What I work on</h3>
          <ol className="grid">
            {profile.interests.map((it, i) => (
              <li key={it} className="dash-t t-sub grid grid-cols-[48px_1fr] py-3.5" data-reveal>
                <span className="muted">{String(i + 1).padStart(2, "0")}</span>
                {it}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
