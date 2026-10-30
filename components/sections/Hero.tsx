import { taglines } from "@/content/personality";
import { profile } from "@/content/profile";

const d = (ms: number) => ({ ["--d" as string]: `${ms}ms` });

/** The first stop: who I am, beside the town square. */
export default function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-title" className="stop !border-t-0 lg:min-h-[calc(100svh-64px)]">
      <div className="grid justify-items-start gap-7">
        <p className="label eyebrow fade-up" style={d(0)}>
          {profile.role} · {profile.company}
        </p>
        <h1 id="hero-title" className="display text-[clamp(48px,5vw,84px)]">
          <span className="reveal">
            <span style={d(80)}>{profile.firstName}</span>
          </span>
          <span className="reveal">
            <span style={d(200)} className="accent-text">{profile.lastName}</span>
          </span>
        </h1>
        <p className="fade-up flex flex-wrap gap-3 text-[clamp(15px,1.3vw,18px)]" style={d(380)}>
          <span className="tape" style={{ ["--tilt" as string]: "-2deg" }}>{taglines.hero[0]}</span>
          <span className="tape" style={{ ["--tilt" as string]: "1.5deg" }}>{taglines.hero[1]}</span>
        </p>
        <p className="fade-up max-w-[46ch] text-[17px] leading-[1.6] text-fg-2" style={d(520)}>
          {profile.summary}
        </p>
        <div className="fade-up flex flex-wrap gap-3" style={d(680)}>
          <a href="#systems" className="btn btn-solid">
            Explore systems <span aria-hidden="true">→</span>
          </a>
          <a href="#contact" className="btn">
            Contact
          </a>
        </div>
        <ul className="label fade-up flex flex-wrap gap-x-5 gap-y-2" style={d(860)} aria-label="Focus areas">
          <li>Greater Noida, India</li>
          <li>Python</li>
          <li>FastAPI</li>
          <li>Docker</li>
          <li>Nginx</li>
          <li>Android</li>
        </ul>
        <p className="data fade-up hidden text-[12px] text-fg-3 lg:block" style={d(1000)}>
          Scroll to walk through the town →
        </p>
      </div>
    </section>
  );
}
