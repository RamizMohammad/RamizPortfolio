import Terminal from "@/components/Terminal";
import Words from "@/components/Words";
import { stack } from "@/content/stack";
import { LAYERS } from "@/content/types";
import SectionLabel from "./SectionLabel";

/** The layers as a stack: what people touch on top, what everything runs on at the bottom. */
export default function Stack() {
  return (
    <section id="stack" aria-labelledby="stack-title" className="edge">
      <SectionLabel n={6}>Stack</SectionLabel>
      <div className="grid gap-[41px] py-24 lg:grid-cols-[3fr_7fr]">
        <div className="grid content-start gap-8">
          <h2 id="stack-title" className="t-h1 split" data-reveal>
            <Words text="Tools, by layer." />
          </h2>
          <p className="voice" data-reveal>
            Every tool sits in the layer it works in.
          </p>
          <div data-reveal>
            <Terminal />
          </div>
        </div>
        <ol className="dash-b">
          {LAYERS.map((l, i) => (
            <li key={l.id} className="dash-t grid gap-3 py-6 md:grid-cols-[minmax(200px,2fr)_5fr] md:gap-6" data-reveal style={{ ["--rd" as string]: `${i * 60}ms` }}>
              <h3 className="t-h2">
                <span className="t-label muted mr-3 align-middle">L{i + 1}</span>
                {l.label}
              </h3>
              <p className="t-sub leading-[1.5]">{stack[l.id].join(" · ")}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
