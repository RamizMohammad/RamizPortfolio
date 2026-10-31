import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="edge grid min-h-[100svh] content-center gap-8 pt-[var(--nav-h)]">
      <p className="t-label muted">HTTP 404</p>
      <h1 className="t-display">Route not found.</h1>
      <p className="voice max-w-[32ch]">This address doesn&rsquo;t exist. Every system and case study is linked from the home page.</p>
      <Link href="/" className="t-label link w-fit">Back home</Link>
    </main>
  );
}
