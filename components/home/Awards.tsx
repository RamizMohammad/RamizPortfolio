import Link from "next/link";
import Words from "@/components/Words";
import { achievements, type Achievement } from "@/content/achievements";
import SectionLabel from "./SectionLabel";

const awards = achievements.filter((a) => a.kind === "Award");
const results = achievements.filter((a) => a.kind === "Hackathon" || a.kind === "Competition");
const RIBBONS = ["bg-pink", "bg-blue", "bg-lime", "bg-violet", "bg-mint", "bg-sun"];

/** The medal face: the placing itself, shortened to fit (6th, F, SF, L1, ★). */
function face(status: string) {
  const place = status.match(/(\d+)(st|nd|rd|th)/i);
  if (place) return { big: place[1], small: place[2].toLowerCase() };
  if (/semi/i.test(status)) return { big: "SF", small: "" };
  if (/finalist/i.test(status)) return { big: "F", small: "" };
  if (/level (\d+)/i.test(status)) return { big: `L${status.match(/level (\d+)/i)![1]}`, small: "" };
  return { big: "★", small: "" };
}

function Trophy() {
  return (
    <svg viewBox="0 0 120 140" className="trophy h-full w-full overflow-visible" aria-hidden="true">
      <g stroke="#121016" strokeWidth="5" strokeLinejoin="round">
        <path d="M28 18h64v34a32 32 0 0 1-64 0z" fill="#ffcf3a" />
        <path d="M28 26H12c0 22 10 30 20 32M92 26h16c0 22-10 30-20 32" fill="none" strokeLinecap="round" />
        <path d="M52 84h16v18H52z" fill="#ffcf3a" />
        <path d="M34 102h52l6 18H28z" fill="#d4f25b" />
        <rect x="22" y="120" width="76" height="12" rx="3" fill="#121016" />
      </g>
      <path d="M42 28v22" stroke="#fff6cf" strokeWidth="6" strokeLinecap="round" />
      <path className="trophy-star" d="M60 36l4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z" fill="#c93a63" stroke="#121016" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Sparkles that twinkle around the cup */}
      {[
        [8, 6, 0],
        [106, 2, 0.6],
        [114, 80, 1.2],
      ].map(([x, y, d]) => (
        <path key={`${x}`} className="sparkle" style={{ animationDelay: `${d}s` }} d={`M${x} ${y}l3 7 7 3-7 3-3 7-3-7-7-3 7-3z`} fill="#d4f25b" />
      ))}
    </svg>
  );
}

function Spotlight({ a }: { a: Achievement }) {
  // The award's own figures: OTIF moved from below 50% to over 70%.
  return (
    <article className="pop-in relative grid gap-8 overflow-hidden rounded-[32px] border-[1.5px] border-ink bg-ink p-7 text-card md:grid-cols-[220px_1fr] md:p-10" data-reveal>
      <div aria-hidden="true" className="award-rays pointer-events-none absolute -left-24 -top-24 h-[420px] w-[420px] opacity-40" />
      <div className="relative mx-auto w-40 md:w-full">
        <Trophy />
      </div>
      <div className="relative grid content-center gap-5">
        <p className="t-label text-lime">
          {a.org} · {a.year}
        </p>
        <h3 className="t-display !text-[clamp(44px,5.4vw,88px)]">{a.title}</h3>
        {a.detail && <p className="voice-sm max-w-[60ch] opacity-90">{a.detail}</p>}
        <figure className="grid gap-2" aria-label="Tata Steel OTIF before and after: below 50% to over 70%">
          <figcaption className="t-label flex justify-between opacity-80">
            <span>Tata Steel OTIF</span>
            <span>
              below 50% → <span className="text-lime">over 70%</span>
            </span>
          </figcaption>
          <div className="relative h-5 overflow-hidden rounded-full border-[1.5px] border-card/60" aria-hidden="true">
            <span className="absolute inset-y-0 left-0 w-1/2 bg-card/25" />
            <span className="otif-fill absolute inset-y-0 left-0 w-[70%] rounded-full bg-lime" />
            <span className="absolute inset-y-0 left-1/2 w-[2px] bg-card/80" />
          </div>
          <div className="t-micro flex justify-between opacity-70" aria-hidden="true">
            <span>0%</span>
            <span className="-ml-6">50%</span>
            <span>100%</span>
          </div>
        </figure>
      </div>
    </article>
  );
}

/** Awards: the Moglix award in the spotlight, then a wall of medals for every hackathon and competition result. */
export default function Awards() {
  return (
    <section id="awards" aria-labelledby="awards-title" className="edge pb-24">
      <SectionLabel n={7}>Awards</SectionLabel>
      <div className="grid gap-4 pb-12 pt-16 lg:grid-cols-[1fr_auto] lg:items-end">
        <h2 id="awards-title" className="t-h1 split" data-reveal>
          <Words text="Awards & wins." />
        </h2>
        <p className="voice-sm muted max-w-[44ch]" data-reveal>
          Recognised at work, placed at hackathons. Every result below comes with a certificate on the achievements page.
        </p>
      </div>

      <div className="grid gap-12">
        {awards.map((a) => (
          <Spotlight key={a.title} a={a} />
        ))}

        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-6" aria-label="Hackathon and competition results">
          {results.map((a, i) => {
            const f = face(a.status);
            return (
              <li key={a.title} className="medal grid justify-items-center gap-3 text-center" data-reveal style={{ ["--rd" as string]: `${i * 110}ms` }}>
                <div className="medal-swing grid justify-items-center" aria-hidden="true">
                  {/* Ribbon */}
                  <div className="flex">
                    <span className={`h-14 w-6 origin-bottom -skew-x-12 border-[1.5px] border-ink ${RIBBONS[i % RIBBONS.length]}`} />
                    <span className={`h-14 w-6 origin-bottom skew-x-12 border-[1.5px] border-l-0 border-ink ${RIBBONS[(i + 2) % RIBBONS.length]}`} />
                  </div>
                  {/* Medal */}
                  <span className="medal-face -mt-2 grid h-24 w-24 place-items-center rounded-full border-[2px] border-ink bg-sun shadow-[inset_0_-6px_0_rgb(0_0_0/0.12)]">
                    <span className="grid h-[72px] w-[72px] place-items-center rounded-full border-[1.5px] border-dashed border-ink/50 font-display text-[30px] leading-none text-[#121016]">
                      <span>
                        {f.big}
                        <sup className="text-[14px]">{f.small}</sup>
                      </span>
                    </span>
                  </span>
                </div>
                <div className="grid gap-1">
                  <p className="t-label">{a.status}</p>
                  <h3 className="text-[15px] font-semibold leading-snug">{a.title}</h3>
                  <p className="t-micro muted">
                    {a.org} · {a.year}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        <Link href="/achievements" className="btn-ghost w-fit">
          All achievements and certificates →
        </Link>
      </div>
    </section>
  );
}
