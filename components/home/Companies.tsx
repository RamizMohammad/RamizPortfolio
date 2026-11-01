import Image from "next/image";
import Words from "@/components/Words";
import { companies, type Company } from "@/content/companies";
import SectionLabel from "./SectionLabel";

// Written out in full so Tailwind sees every class.
const TONE: Record<Company["tone"], string> = {
  pink: "bg-pink",
  lime: "bg-lime",
  blue: "bg-blue text-card",
  sun: "bg-sun",
  violet: "bg-violet",
  mint: "bg-mint",
};

/** The site's host, shown on the website button: "loopax.online". */
const host = (url: string) => new URL(url).hostname.replace(/^www\./, "");

function CompanyCard({ c, i }: { c: Company; i: number }) {
  return (
    <article
      className={`pop-in grid content-start gap-6 rounded-[32px] border-[1.5px] border-ink p-6 md:p-9 ${TONE[c.tone]}`}
      data-reveal
      style={{ ["--rd" as string]: `${i * 120}ms` }}
    >
      <div className="flex items-center gap-4">
        {c.logo ? (
          <Image src={c.logo.src} alt={c.logo.alt} width={c.logo.width} height={c.logo.height} className="h-16 w-16 shrink-0 rounded-[18px] border-[1.5px] border-[#121016] md:h-20 md:w-20" />
        ) : (
          <span aria-hidden="true" className="grid h-16 w-16 shrink-0 place-items-center rounded-[18px] border-[1.5px] border-[#121016] bg-white font-display text-[34px] text-[#121016] md:h-20 md:w-20 md:text-[44px]">
            {c.name[0]}
          </span>
        )}
        <div className="grid gap-1">
          <h3 className="t-h2 !text-[clamp(28px,3vw,44px)]">{c.name}</h3>
          <p className="t-label">
            {c.role}
            {c.since ? ` · since ${c.since}` : ""}
          </p>
        </div>
      </div>

      <p className="voice max-w-[24ch]">{c.tagline}</p>
      <p className="max-w-[52ch] text-[16px] leading-relaxed">{c.about}</p>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <a href={c.url} target="_blank" rel="noopener noreferrer" className="btn-pill btn-sm">
          {host(c.url)} ↗
        </a>
        {c.links.map((l) => (
          <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="btn-ghost btn-sm">
            {l.label} ↗
          </a>
        ))}
      </div>
    </article>
  );
}

/** Companies: the ventures I founded or run, each on its own colour block with its site and socials. */
export default function Companies() {
  if (!companies.length) return null;
  return (
    <section id="companies" aria-labelledby="companies-title" className="edge pb-24">
      <SectionLabel n={10}>Companies</SectionLabel>
      <div className="grid gap-4 pb-12 pt-16 lg:grid-cols-[1fr_auto] lg:items-end">
        <h2 id="companies-title" className="t-h1 split" data-reveal>
          <Words text="Things I run." />
        </h2>
        <p className="voice-sm muted ink-in max-w-[44ch]" data-reveal>
          Beyond the day job: the companies I founded and the products they ship.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {companies.map((c, i) => (
          <CompanyCard key={c.name} c={c} i={i} />
        ))}
      </div>
    </section>
  );
}
