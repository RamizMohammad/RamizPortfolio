"use client";

import { useEffect, useState } from "react";

type Status = "up" | "down" | "unknown";
type Service = { id: string; label: string; description: string; kind: string; domain: string | null; status: Status; cpu: number | null; memoryMb: number | null };
type Snapshot = {
  generatedAt: string;
  sampledAt: string | null;
  host: { name: string; status: string; uptimeSeconds: number | null; cpu: number | null; memory: number | null; disk: number | null; cores: number | null; load: number[] | null };
  proxy: { label: string; description: string };
  services: Service[];
};

const POLL_MS = 15000;

const LED: Record<Status, string> = { up: "bg-[#28c840] shadow-[0_0_10px_#28c840]", down: "bg-[#ff5f57] shadow-[0_0_10px_#ff5f57]", unknown: "bg-[#8a8799]" };
const KIND_TONE: Record<string, string> = { web: "bg-pink", api: "bg-violet", db: "bg-sun", data: "bg-sun", monitoring: "bg-mint", bot: "bg-lime", worker: "bg-lime" };

function uptime(s: number | null) {
  if (s == null) return "—";
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  return d ? `${d}d ${h}h` : `${h}h ${Math.floor((s % 3600) / 60)}m`;
}

function ago(iso: string, now: number) {
  const s = Math.max(0, Math.round((now - Date.parse(iso)) / 1000));
  return s < 60 ? `${s}s ago` : `${Math.round(s / 60)}m ago`;
}

/** A labelled bar for a percentage; amber past 70%, red past 90%. */
function Meter({ label, value }: { label: string; value: number | null }) {
  const v = value ?? 0;
  const tone = v >= 90 ? "bg-[#ff5f57]" : v >= 70 ? "bg-sun" : "bg-lime";
  return (
    <div className="grid gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className="t-micro opacity-70">{label}</span>
        <span className="font-display text-[28px] leading-none">{value == null ? "—" : `${Math.round(v)}%`}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full border-[1.5px] border-current/30">
        <div className={`h-full rounded-full transition-[width] duration-700 ${tone}`} style={{ width: `${Math.min(100, v)}%` }} />
      </div>
    </div>
  );
}

/** A service as one unit in the rack: LED, name, where it is served, and what it costs the server. */
function Blade({ s, maxMem }: { s: Service; maxMem: number }) {
  return (
    <li className="infra-blade grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-[14px] border border-white/10 bg-white/[0.04] px-4 py-3">
      <span className={`h-2.5 w-2.5 rounded-full ${LED[s.status]} ${s.status === "up" ? "infra-led" : ""}`} aria-hidden="true" />
      <span className="grid min-w-0 gap-0.5">
        <span className="flex flex-wrap items-center gap-2">
          <span className="truncate text-[15px] font-semibold">{s.label}</span>
          <span className={`t-micro rounded-full px-2 py-0.5 text-[#121016] ${KIND_TONE[s.kind] ?? "bg-card"}`}>{s.kind}</span>
          <span className="sr-only">{s.status === "up" ? "running" : s.status === "down" ? "not running" : "status unknown"}</span>
        </span>
        <span className="truncate font-mono text-[11.5px] opacity-60">{s.domain ?? s.description}</span>
      </span>
      <span className="grid w-[120px] gap-1 text-right font-mono text-[11.5px]">
        <span>{s.cpu == null ? "—" : `${s.cpu.toFixed(1)}% cpu`}</span>
        <span className="flex items-center justify-end gap-2">
          <span className="h-1.5 w-12 overflow-hidden rounded-full bg-white/10">
            <span className="block h-full rounded-full bg-violet" style={{ width: `${s.memoryMb == null ? 0 : Math.max(4, (s.memoryMb / maxMem) * 100)}%` }} />
          </span>
          {s.memoryMb == null ? "—" : `${Math.round(s.memoryMb)} MB`}
        </span>
      </span>
    </li>
  );
}

export default function LiveInfra({ url }: { url?: string }) {
  const [data, setData] = useState<Snapshot | null>(null);
  const [error, setError] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!url) return;
    let alive = true;
    const load = async () => {
      if (document.hidden) return;
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const next = (await res.json()) as Snapshot;
        if (alive) {
          setData(next);
          setError(false);
        }
      } catch {
        if (alive) setError(true);
      }
    };
    load();
    const poll = window.setInterval(load, POLL_MS);
    const tick = window.setInterval(() => setNow(Date.now()), 1000);
    document.addEventListener("visibilitychange", load);
    return () => {
      alive = false;
      window.clearInterval(poll);
      window.clearInterval(tick);
      document.removeEventListener("visibilitychange", load);
    };
  }, [url]);

  if (!url) {
    return (
      <div className="grid gap-4 rounded-[28px] border-[1.5px] border-dashed border-ink p-8">
        <p className="t-h2">The live feed isn&rsquo;t connected yet</p>
        <p className="voice-sm muted max-w-[60ch]">Once the server&rsquo;s status endpoint is online, this page shows every service it runs, whether each one is up, and the CPU and memory it is using, refreshed every few seconds.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="grid min-h-[320px] place-items-center rounded-[28px] border-[1.5px] border-ink bg-ink text-card">
        <p className="t-label">{error ? "Can’t reach the server right now. Retrying…" : "Connecting to the server…"}</p>
      </div>
    );
  }

  const up = data.services.filter((s) => s.status === "up").length;
  const maxMem = Math.max(1, ...data.services.map((s) => s.memoryMb ?? 0));
  const hostUp = data.host.status === "up";

  return (
    <div className="grid gap-6">
      {/* Live strip */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="t-label flex items-center gap-2" aria-live="polite">
          <span className={`h-2.5 w-2.5 rounded-full ${error ? LED.unknown : hostUp ? `${LED.up} infra-led` : LED.down}`} aria-hidden="true" />
          {error ? "Reconnecting · showing the last reading" : `Live · updated ${ago(data.generatedAt, now)}`}
        </p>
        <p className="t-label muted">
          {up} of {data.services.length} services up
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        {/* The host */}
        <section aria-label="Host" className="grid content-start gap-6 rounded-[28px] border-[1.5px] border-ink bg-sun p-6 text-[#121016]">
          <div className="flex items-start justify-between gap-3">
            <div className="grid gap-1">
              <p className="t-micro opacity-70">Host</p>
              <h2 className="t-h2 !text-[34px]">{data.host.name}</h2>
            </div>
            <span className={`t-micro rounded-full border-[1.5px] border-[#121016] px-2.5 py-1 ${hostUp ? "bg-lime" : "bg-[#ff5f57]"}`}>{hostUp ? "Online" : data.host.status}</span>
          </div>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="t-micro opacity-70">Uptime</dt>
              <dd className="font-display text-[34px] leading-none">{uptime(data.host.uptimeSeconds)}</dd>
            </div>
            <div>
              <dt className="t-micro opacity-70">Load</dt>
              <dd className="font-display text-[34px] leading-none">{data.host.load?.[0]?.toFixed(2) ?? "—"}</dd>
            </div>
          </dl>
          <div className="grid gap-4">
            <Meter label={`CPU${data.host.cores ? ` · ${data.host.cores} cores` : ""}`} value={data.host.cpu} />
            <Meter label="Memory" value={data.host.memory} />
            <Meter label="Disk" value={data.host.disk} />
          </div>
        </section>

        {/* Internet → nginx → the rack */}
        <section aria-label="Services" className="grid gap-4 rounded-[28px] border-[1.5px] border-ink bg-ink p-5 text-[#f2eefb] md:p-6">
          <div className="grid items-center gap-3 md:grid-cols-[auto_1fr_auto_1fr]">
            <span className="t-micro w-fit rounded-full border border-white/25 px-3 py-1.5">🌐 Internet · HTTPS</span>
            <span className="infra-wire hidden h-px md:block" aria-hidden="true" />
            <span className="grid w-fit gap-0.5 rounded-[14px] bg-lime px-4 py-2 text-[#121016]">
              <span className="text-[14px] font-semibold">{data.proxy.label}</span>
              <span className="t-micro opacity-70">{data.proxy.description}</span>
            </span>
            <span className="infra-wire hidden h-px md:block" aria-hidden="true" />
          </div>
          <ul className="grid gap-2" aria-label={`${data.services.length} services`}>
            {data.services.map((s) => (
              <Blade key={s.id} s={s} maxMem={maxMem} />
            ))}
          </ul>
          <p className="t-micro opacity-50">CPU and memory are each container&rsquo;s share of the host, from the last one-minute sample.</p>
        </section>
      </div>
    </div>
  );
}
