import HeroStage from "@/components/HeroStage";
import HeroStickers from "@/components/HeroStickers";
import { taglines } from "@/content/personality";
import { profile } from "@/content/profile";

const d = (ms: number) => ({ ["--d" as string]: `${ms}ms` });

export default function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-title" className="relative">
      <div className="wrap grid min-h-[calc(100svh-64px)] grid-cols-1 md:grid-cols-12">
        <div className="flex flex-col justify-between gap-12 py-14 md:col-span-7 md:py-20 lg:col-span-6">
          <div>
            <p className="label eyebrow fade-up" style={d(0)}>
              {profile.role} · {profile.company}
            </p>
            <h1 id="hero-title" className="display mt-6 text-[clamp(40px,11.5vw,148px)]">
              <span className="reveal">
                <span style={d(80)}>{profile.firstName}</span>
              </span>
              <span className="reveal">
                <span style={d(200)} className="accent-text">{profile.lastName}</span>
              </span>
            </h1>
            <p className="fade-up mt-6 grid gap-1 text-[clamp(15px,1.4vw,19px)]" style={d(380)}>
              <span className="tape tape-line" style={{ ["--tilt" as string]: "-2deg" }}>{taglines.hero[0]}</span>
              <span className="tape tape-line ml-6" style={{ ["--tilt" as string]: "1.5deg" }}>{taglines.hero[1]}</span>
            </p>
            <p className="fade-up mt-8 max-w-[44ch] text-[18px] leading-[1.55] text-fg-2 md:text-[19px]" style={d(520)}>
              {profile.summary}
            </p>
            <div className="fade-up mt-10 flex flex-wrap gap-3" style={d(680)}>
              <a href="#systems" className="btn btn-solid">
                Explore systems <span aria-hidden="true">→</span>
              </a>
              <a href="#contact" className="btn">
                Contact
              </a>
            </div>
          </div>
          <ul className="label fade-up flex flex-wrap gap-x-6 gap-y-2" style={d(860)} aria-label="Focus areas">
            <li>Greater Noida, India</li>
            <li>Python</li>
            <li>FastAPI</li>
            <li>Docker</li>
            <li>Nginx</li>
            <li>Android</li>
          </ul>
        </div>
        <HeroStage />
      </div>
      <HeroStickers />
    </section>
  );
}
