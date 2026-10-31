import { Fragment } from "react";

/**
 * A heading whose words rise one by one from behind a mask when its parent gets `.in`
 * (RevealObserver). Rendered on the server, so the full text is always in the HTML.
 */
export default function Words({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <Fragment key={i}>
          {/* The space sits outside the clipped box so it is never collapsed away. */}
          <span className="w">
            <span style={{ ["--wi" as string]: i }}>{w}</span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </>
  );
}
