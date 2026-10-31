import Terminal from "@/components/Terminal";
import { profile } from "@/content/profile";

const d = (ms: number) => ({ ["--d" as string]: `${ms}ms` });

/** Context mode: the name across the top, the brief and actions in the lower left, the terminal as the object on the right. */
export default function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-title" className="edge grid min-h-[100svh] content-between gap-x-[41px] gap-y-12 pb-8 pt-[calc(var(--nav-h)+40px)] lg:grid-cols-2">
      <div className="grid content-start gap-5 lg:col-span-2">
        <p className="t-label rise" style={d(0)}>
          {profile.role} at {profile.company} — Greater Noida, India
        </p>
        <h1 id="hero-title" className="t-display rise" style={d(80)}>
          {profile.firstName} {profile.lastName}
        </h1>
      </div>

      <div className="grid content-end gap-8 lg:col-start-1 lg:row-start-2">
        <div className="rise grid max-w-[520px] gap-4 rounded-[12px] border border-cork p-6" style={d(360)}>
          <p className="t-label">Builds automation, backends and the infrastructure they run on.</p>
          <span className="dash-t" />
          <p className="voice-sm">{profile.summary}</p>
        </div>
        <div className="rise grid justify-items-start gap-4" style={d(480)}>
          <div className="flex flex-wrap gap-3">
            <a href="#work" className="btn-pill">View work</a>
            <a href="#contact" className="btn-ghost">Contact</a>
          </div>
          <p className="t-micro text-ember">* Open to engineering roles and freelance work</p>
        </div>
      </div>

      <div className="rise lg:col-start-2 lg:row-start-2 lg:self-end" style={d(240)}>
        <Terminal />
      </div>
    </section>
  );
}
