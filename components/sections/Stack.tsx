import { stack } from "@/content/stack";
import { LAYERS } from "@/content/types";

export default function Stack() {
  return (
    <section id="stack" aria-labelledby="stack-title" className="border-t border-rule py-24 md:py-32">
      <div className="wrap grid gap-14">
        <div className="grid min-h-[50svh] content-start gap-6 md:w-1/2">
          <p className="label">Technology</p>
          <h2 id="stack-title" className="display text-[clamp(44px,7vw,96px)]">
            Stack
          </h2>
          <p className="max-w-[44ch] text-fg-2">
            The constellation groups every tool by the layer it works in. The same groups are listed below.
          </p>
        </div>
        <div className="grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-5">
          {LAYERS.map((l, i) => (
            <div key={l.id} className="grid content-start gap-4 bg-ink p-5">
              <h3 className="flex items-baseline gap-3">
                <span className="data text-fg-3">L{i + 1}</span>
                <span className="title text-[18px]">{l.label}</span>
              </h3>
              <ul className="grid gap-1.5 text-[15px] text-fg-2">
                {stack[l.id].map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
