import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="page">
      <div className="wrap grid min-h-[70svh] content-center gap-8 py-20">
        <p className="label">Error 404</p>
        <h1 className="display text-[clamp(56px,10vw,140px)]">Not found.</h1>
        <p className="max-w-[44ch] text-fg-2">This address does not exist on the site. The systems and case studies are all linked from the home page.</p>
        <div>
          <Link href="/" className="btn btn-solid">Back to home</Link>
        </div>
      </div>
    </main>
  );
}
