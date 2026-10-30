import type { ReactNode } from "react";

type Props = { n: number; kicker: string; title: string; id: string; children?: ReactNode };

/**
 * A chapter opener for the panel: the chapter number in LED dots on a yellow paper block, a
 * handwritten-style kicker on tape, then the title. Numbers mark the real order of the four work chapters.
 */
export default function ChapterHead({ n, kicker, title, id, children }: Props) {
  return (
    <div className="grid justify-items-start gap-5">
      <div className="flex flex-wrap items-center gap-4">
        <span
          className="led bg-tape px-3 pb-0.5 pt-2 text-[44px] leading-none text-fg shadow-[4px_4px_0_var(--color-fg)]"
          style={{ transform: "rotate(-2deg)" }}
          aria-hidden="true"
          data-reveal
        >
          {String(n).padStart(2, "0")}
        </span>
        <span className="tape text-[15px] italic" style={{ ["--tilt" as string]: "1deg" }} data-reveal>
          {kicker}
        </span>
      </div>
      <h2 id={id} className="display text-[clamp(44px,5vw,76px)]" data-reveal="mask">
        <span className="sr-only">Chapter {n}: </span>
        {title}
      </h2>
      {children}
    </div>
  );
}
