import HeroStage from "@/components/HeroStage";
import HeroStickers from "@/components/HeroStickers";
import { taglines } from "@/content/personality";
import { profile } from "@/content/profile";

const d = (ms: number) => ({ ["--d" as string]: `${ms}ms` });

/** Centred like a box label: the name sits over the 3D core, the details and actions below it. */
export default function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-title" className="relative">
      <HeroStage />
      <div className="wrap pointer-events-none relative z-[2] grid min-h-[calc(100svh-64px)] content-between justify-items-center gap-[28vh] py-8 text-center md:py-10">
        <div className="grid justify-items-center">
          <p className="label eyebrow fade-up" style={d(0)}>
            {profile.role} · {profile.company}
          </p>
          <h1 id="hero-title" className="display mt-4 text-[clamp(44px,10.5vw,156px)]">
            <span className="reveal">
              <span style={d(80)}>{profile.firstName}</span>
            </span>
            <span className="reveal">
              <span style={d(200)} className="accent-text">{profile.lastName}</span>
            </span>
          </h1>
          <p className="fade-up mt-5 flex flex-wrap justify-center gap-3 text-[clamp(15px,1.4vw,19px)]" style={d(380)}>
            <span className="tape" style={{ ["--tilt" as string]: "-2deg" }}>{taglines.hero[0]}</span>
            <span className="tape" style={{ ["--tilt" as string]: "1.5deg" }}>{taglines.hero[1]}</span>
          </p>
        </div>

        <div className="pointer-events-auto grid justify-items-center gap-6">
          <p className="fade-up max-w-[52ch] text-[17px] leading-[1.55] text-fg-2 md:text-[18px]" style={d(520)}>
            {profile.summary}
          </p>
          <div className="fade-up flex flex-wrap justify-center gap-3" style={d(680)}>
            <a href="#systems" className="btn btn-solid">
              Explore systems <span aria-hidden="true">→</span>
            </a>
            <a href="#contact" className="btn">
              Contact
            </a>
          </div>
          <ul className="label fade-up flex flex-wrap justify-center gap-x-6 gap-y-2" style={d(860)} aria-label="Focus areas">
            <li>Greater Noida, India</li>
            <li>Python</li>
            <li>FastAPI</li>
            <li>Docker</li>
            <li>Nginx</li>
            <li>Android</li>
          </ul>
        </div>
      </div>
      <HeroStickers />
    </section>
  );
}
