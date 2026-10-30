import type { ReactNode } from "react";

type Props = { n: number; kicker: string; title: string; id: string; children?: ReactNode };

/**
 * A centred chapter opener: a handwritten-style kicker on tape, the chapter number in LED dots on a
 * yellow paper block, and the title. Numbers mark the real order of the four work chapters.
 */
export default function ChapterHead({ n, kicker, title, id, children }: Props) {
  return (
    <div className="grid justify-items-center gap-5 text-center">
      <span className="tape text-[clamp(16px,1.8vw,24px)] italic" style={{ ["--tilt" as string]: "-1deg" }} data-reveal>
        {kicker}
      </span>
      <span
        className="led bg-tape px-6 pb-1 pt-3 text-[clamp(64px,9vw,124px)] leading-none text-fg shadow-[6px_6px_0_var(--color-fg)]"
        style={{ transform: "rotate(1.5deg)" }}
        aria-hidden="true"
        data-reveal
      >
        {String(n).padStart(2, "0")}
      </span>
      <h2 id={id} className="display text-[clamp(44px,8vw,112px)]" data-reveal="mask">
        <span className="sr-only">Chapter {n}: </span>
        {title}
      </h2>
      {children}
    </div>
  );
}
