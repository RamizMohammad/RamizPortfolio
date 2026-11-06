import type { Metadata } from "next";
import LiveInfra from "@/components/infra/LiveInfra";

export const metadata: Metadata = {
  title: "Live infra",
  description: "The server behind mohammadramiz.in, live: the Docker services it runs behind nginx, whether each is up, and how hard it is working.",
  alternates: { canonical: "/infra" },
};

export default function InfraPage() {
  return (
    <main id="main" className="edge pb-24 pt-[var(--nav-h)]">
      <header className="grid gap-6 pb-14 pt-20 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="grid gap-5">
          <p className="t-label muted">~/infra</p>
          <h1 className="t-display">Live infra</h1>
        </div>
        <p className="voice-sm max-w-[42ch]">
          One VPS I run myself: Docker services behind a single nginx reverse proxy, watched by Beszel. This page reads it live, so what you see is what is running right now.
        </p>
      </header>
      <LiveInfra url={process.env.NEXT_PUBLIC_INFRA_URL} />
    </main>
  );
}
