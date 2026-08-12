import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import SearchBar from "../components/SearchBar";
import StatCard from "../components/StatCard";
import { getStats } from "../api/client";
import type { StatsResponse } from "../types";

const entryPoints = ["React", "Authentication", "Data Pipeline", "Alex Chen", "Platform Engineering"];

const entityTypes = [
  { label: "People", color: "var(--person)" },
  { label: "Teams", color: "var(--team)" },
  { label: "Projects", color: "var(--project)" },
  { label: "Tasks", color: "var(--task)" },
  { label: "Technologies", color: "var(--technology)" },
  { label: "Documents", color: "var(--document)" },
];

export default function Home() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  useEffect(() => { getStats().then(setStats).catch(() => undefined); }, []);

  return (
    <div
      style={{
        height: "100vh",
        overflowY: "scroll",
        scrollSnapType: "y proximity",
        scrollBehavior: "smooth",
        background: "#F7F5F2",
      }}
    >
      {/* ══════════════════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════════════════ */}
      <div
        style={{
          background: "linear-gradient(160deg, #1A1714 0%, #232018 55%, #1D1C1A 100%)",
          scrollSnapAlign: "start",
        }}
      >
        <AppHeader showSearch={false} transparent />
        <section className="relative overflow-hidden" style={{ minHeight: "calc(100vh - 64px)" }}>
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-32 -top-20 h-[500px] w-[500px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, var(--person) 0%, transparent 70%)", filter: "blur(80px)" }} />
            <div className="absolute -right-20 top-10 h-[400px] w-[400px] rounded-full opacity-15" style={{ background: "radial-gradient(circle, var(--project) 0%, transparent 70%)", filter: "blur(80px)" }} />
            <div className="absolute bottom-0 left-[40%] h-[300px] w-[300px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, var(--technology) 0%, transparent 70%)", filter: "blur(60px)" }} />
          </div>
          <div className="relative mx-auto flex min-h-[calc(100vh-64px)] max-w-[1280px] items-center px-6 py-16 lg:px-10">
            <div className="grid w-full items-center gap-12 lg:grid-cols-[minmax(0,1fr)_480px]">
              <div className="flex flex-col justify-center">
                <div className="mb-5 inline-flex self-start items-center gap-2 rounded-full border px-3.5 py-1.5" style={{ borderColor: "rgba(181,82,46,.35)", background: "rgba(181,82,46,.1)" }}>
                  <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "var(--person)" }} />
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[.1em]" style={{ color: "var(--person)" }}>Your organization, connected</span>
                </div>
                <h1 className="text-[42px] font-bold leading-[1.1] tracking-[-.04em] text-white sm:text-[56px] lg:text-[64px]">
                  Find the people<br />
                  <span className="text-transparent" style={{ WebkitTextStroke: "1.5px rgba(255,255,255,.25)" }}>and work behind</span><br />
                  <span style={{ background: "linear-gradient(90deg, var(--person), var(--team))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>every decision.</span>
                </h1>
                <p className="mt-6 max-w-[560px] text-[17px] leading-7" style={{ color: "rgba(255,255,255,.6)" }}>
                  WorkGraph turns your organization into an explorable map of people, projects, tasks, technology, and documents.
                </p>
                <div className="mt-8 max-w-[560px]">
                  <SearchBar autoFocus dark />
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Link to="/path" className="inline-flex h-11 items-center gap-2 rounded-control px-5 text-[14px] font-semibold text-white transition-all duration-120 hover:opacity-90 active:scale-[.98]" style={{ background: "linear-gradient(135deg, var(--person), var(--team))" }}>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><circle cx="5" cy="12" r="2.5" /><circle cx="19" cy="6" r="2.5" /><circle cx="19" cy="18" r="2.5" /><path d="M7.5 12h5a1 1 0 001-1V8M13.5 15v-.5a1 1 0 011-1h0" strokeLinecap="round" /></svg>
                    Find a path
                  </Link>
                  <span className="text-[13px]" style={{ color: "rgba(255,255,255,.45)" }}>Trace how any two entities are connected.</span>
                </div>
                <div className="mt-8 flex flex-wrap gap-2">
                  {entityTypes.map(({ label, color }) => (
                    <span key={label} className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium" style={{ background: "rgba(255,255,255,.07)", color: "rgba(255,255,255,.65)", border: "1px solid rgba(255,255,255,.1)" }}>
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />{label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative z-10 overflow-hidden rounded-2xl p-px" style={{ background: "linear-gradient(135deg, rgba(255,255,255,.12), rgba(255,255,255,.04))" }}>
                <div className="flex h-full flex-col rounded-2xl p-8" style={{ background: "rgba(255,255,255,.045)", backdropFilter: "blur(20px)" }}>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[.1em]" style={{ color: "var(--person)" }}>Designed for context</p>
                  <h2 className="mt-3 text-[24px] font-bold leading-[32px] tracking-[-.025em] text-white">One place to move from a question to an answer.</h2>
                  <div className="mt-8 space-y-5 flex-1">
                    {[
                      { title: "Search what you know", desc: "Start with a person, project, task, or technology.", color: "var(--person)" },
                      { title: "See what connects", desc: "Inspect direct relationships in a clear visual map.", color: "var(--project)" },
                      { title: "Trace the full path", desc: "Reveal the shortest connection across your graph.", color: "var(--technology)" },
                    ].map(({ title, desc, color }) => (
                      <div key={title} className="flex gap-4">
                        <div className="mt-1 h-6 w-[3px] shrink-0 rounded-full" style={{ background: color }} />
                        <div>
                          <p className="text-[15px] font-semibold text-white">{title}</p>
                          <p className="mt-1 text-[14px] leading-6" style={{ color: "rgba(255,255,255,.5)" }}>{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 rounded-xl p-5" style={{ background: "rgba(0,0,0,.2)" }}>
                    <svg viewBox="0 0 280 90" className="w-full" fill="none">
                      <circle cx="140" cy="48" r="16" stroke="var(--person)" strokeWidth="1.5" fill="rgba(181,82,46,.15)" />
                      <text x="140" y="52" textAnchor="middle" fill="rgba(255,255,255,.8)" fontSize="8" fontFamily="IBM Plex Mono" fontWeight="500">TEAM</text>
                      {[{ x: 50, y: 25, c: "var(--person)", l: "Person" }, { x: 40, y: 73, c: "var(--project)", l: "Project" }, { x: 230, y: 25, c: "var(--technology)", l: "Tech" }, { x: 236, y: 70, c: "var(--document)", l: "Doc" }, { x: 140, y: 14, c: "var(--task)", l: "Task" }].map(({ x, y, c, l }) => (
                        <g key={l}>
                          <line x1={x} y1={y} x2="140" y2="48" stroke="rgba(255,255,255,.12)" strokeWidth="1" strokeDasharray="3 3" />
                          <circle cx={x} cy={y} r="10" fill={`${c}30`} stroke={c} strokeWidth="1.2" />
                          <text x={x} y={y + 3} textAnchor="middle" fill="rgba(255,255,255,.6)" fontSize="6" fontFamily="IBM Plex Mono">{l.slice(0, 4)}</text>
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ══════════════════════════════════════════════════════
          SECTION 2 — GRAPH AT A GLANCE
          Layout: big pull-quote left  |  stats grid right
          + full-width quick-start row below
      ══════════════════════════════════════════════════════ */}
      <section
        style={{
          background: "#F7F5F2",
          minHeight: "100vh",
          scrollSnapAlign: "start",
          display: "flex",
          alignItems: "center",
          borderTop: "1px solid rgba(55,43,33,.07)",
        }}
      >
        <div className="mx-auto w-full max-w-[1280px] px-6 py-20 lg:px-10">

          {/* Top: eyebrow + giant statement left / stat grid right */}
          <div className="grid gap-12 lg:grid-cols-[1fr_420px] lg:gap-20 items-start">

            {/* Left — editorial copy block */}
            <div>
              <p className="eyebrow mb-4" style={{ color: "var(--person)" }}>Graph overview</p>
              <p
                className="font-bold leading-[1.05] tracking-[-.04em]"
                style={{ fontSize: "clamp(40px, 5.5vw, 68px)", color: "#1A1714" }}
              >
                Every person.<br />
                Every project.<br />
                <span style={{ color: "rgba(55,43,33,.22)" }}>One graph.</span>
              </p>
              <div className="mt-8 flex items-center gap-4" style={{ borderTop: "1px solid rgba(55,43,33,.1)", paddingTop: "1.5rem" }}>
                <Link to="/path" className="inline-flex h-10 items-center gap-2 rounded-control px-5 text-[13px] font-semibold text-white transition-all duration-120 hover:opacity-90" style={{ background: "linear-gradient(135deg, var(--person), var(--team))" }}>
                  Explore paths →
                </Link>
                <Link to="/search" className="text-[13px] font-semibold" style={{ color: "rgba(55,43,33,.5)" }}>
                  or search the graph
                </Link>
              </div>
            </div>

            {/* Right — stat cards */}
            <div className="grid grid-cols-2 gap-4">
              <StatCard label="People" value={stats?.people ?? null} delay={0} />
              <StatCard label="Projects" value={stats?.projects ?? null} delay={40} />
              <StatCard label="Tasks" value={stats?.tasks ?? null} delay={80} />
              <StatCard label="Technologies" value={stats?.technologies ?? null} delay={120} />
            </div>
          </div>

          {/* Bottom — quick-start entry points */}
          <div className="mt-12" style={{ borderTop: "1px solid rgba(55,43,33,.08)", paddingTop: "2rem" }}>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <p className="eyebrow" style={{ color: "rgba(55,43,33,.45)" }}>Jump back in</p>
              <span className="text-[13px]" style={{ color: "rgba(55,43,33,.4)" }}>Start exploring →</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {entryPoints.map((term) => (
                <Link
                  key={term}
                  to={`/search?q=${encodeURIComponent(term)}`}
                  className="rounded-control border bg-white px-4 py-2.5 text-[14px] font-semibold text-ink-900 transition-all duration-150 hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(55,43,33,.1)]"
                  style={{ borderColor: "rgba(55,43,33,.12)" }}
                >
                  {term} <span className="ml-1" style={{ color: "var(--person)" }}>→</span>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 3 — HOW IT WORKS
          Layout: large step number + copy left  |  card right
          Three rows, one per step — editorial magazine style
      ══════════════════════════════════════════════════════ */}
      <section
        style={{
          background: "#EFECE8",
          minHeight: "100vh",
          scrollSnapAlign: "start",
          display: "flex",
          alignItems: "center",
          borderTop: "1px solid rgba(55,43,33,.07)",
        }}
      >
        <div className="mx-auto w-full max-w-[1280px] px-6 py-20 lg:px-10">

          {/* Section header */}
          <div className="mb-14 flex items-end justify-between" style={{ borderBottom: "1px solid rgba(55,43,33,.09)", paddingBottom: "2rem" }}>
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[.12em]" style={{ color: "var(--person)" }}>How it works</p>
              <h2
                className="mt-2 font-bold leading-[1.1] tracking-[-.04em]"
                style={{ fontSize: "clamp(32px, 5vw, 56px)", color: "#1A1714" }}
              >
                Three steps.<br />
                <span style={{ color: "rgba(55,43,33,.22)" }}>Any answer.</span>
              </h2>
            </div>
            <Link to="/search" className="hidden text-[13px] font-semibold sm:block" style={{ color: "var(--person)" }}>
              Try it now →
            </Link>
          </div>

          {/* Three editorial rows */}
          <div className="space-y-0">
            {[
              {
                num: "01",
                title: "Search anything.",
                sub: "Name, project, tech, keyword.",
                desc: "Instantly surfaces people, projects, tasks, and technologies. Start anywhere.",
                color: "var(--person)",
                aside: "Every entity type, indexed.",
              },
              {
                num: "02",
                title: "See what connects.",
                sub: "Relationships, visualised.",
                desc: "Every node shows its direct neighbours — ownership, tech stacks, task dependencies.",
                color: "var(--project)",
                aside: "Visual graph explorer.",
              },
              {
                num: "03",
                title: "Trace the full path.",
                sub: "Any two things, connected.",
                desc: "PathFinder finds the shortest chain between any two entities across your entire org.",
                color: "var(--technology)",
                aside: "Shortest-path, real-time.",
              },
            ].map(({ num, title, sub, desc, color, aside }, i) => (
              <div
                key={num}
                className="grid gap-6 py-10 lg:grid-cols-[100px_1fr_220px] lg:gap-12 lg:items-center"
                style={{ borderBottom: i < 2 ? "1px solid rgba(55,43,33,.08)" : "none" }}
              >
                <p
                  className="font-bold leading-none tracking-tighter"
                  style={{ fontSize: "clamp(48px, 6vw, 72px)", color: `${color}28`, fontVariantNumeric: "tabular-nums" }}
                >
                  {num}
                </p>
                <div>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[.1em] mb-2" style={{ color }}>
                    {sub}
                  </p>
                  <h3
                    className="font-bold leading-[1.15] tracking-[-.03em]"
                    style={{ fontSize: "clamp(22px, 3vw, 32px)", color: "#1A1714" }}
                  >
                    {title}
                  </h3>
                  <p className="mt-3 max-w-[440px] text-[15px] leading-7" style={{ color: "rgba(55,43,33,.55)" }}>
                    {desc}
                  </p>
                </div>
                <div
                  className="rounded-xl p-4"
                  style={{ background: "rgba(55,43,33,.05)", border: "1px solid rgba(55,43,33,.08)" }}
                >
                  <div className="h-1.5 w-8 rounded-full mb-3" style={{ background: color }} />
                  <p className="text-[13px] font-medium leading-6" style={{ color: "rgba(55,43,33,.45)" }}>
                    {aside}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FOOTER — Typographic
      ══════════════════════════════════════════════════════ */}
      <footer style={{ background: "#1A1714", overflow: "hidden", scrollSnapAlign: "start", borderTop: "1px solid rgba(255,255,255,.06)" }}>
        <div className="relative select-none" style={{ borderBottom: "1px solid rgba(255,255,255,.06)" }}>
          <p
            className="whitespace-nowrap font-bold leading-none text-white"
            style={{
              fontSize: "clamp(72px, 18vw, 220px)",
              letterSpacing: "-0.04em",
              padding: "0.45em 0.2em 0.4em",
              opacity: 0.06,
              userSelect: "none",
            }}
          >
            WorkGraph
          </p>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="font-bold leading-tight text-white" style={{ fontSize: "clamp(22px, 4vw, 42px)", letterSpacing: "-0.03em" }}>
              Your organisation,<br />
              <span style={{ color: "rgba(255,255,255,.35)" }}>mapped and searchable.</span>
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              <Link to="/search" className="inline-flex h-10 items-center gap-1.5 rounded-control px-5 text-[13px] font-semibold text-white transition-opacity duration-120 hover:opacity-80" style={{ background: "linear-gradient(135deg, var(--person), var(--team))" }}>
                Start searching →
              </Link>
              <Link to="/path" className="inline-flex h-10 items-center gap-1.5 rounded-control border px-5 text-[13px] font-semibold text-white transition-opacity duration-120 hover:opacity-70" style={{ borderColor: "rgba(255,255,255,.18)" }}>
                Try PathFinder
              </Link>
            </div>
          </div>
        </div>
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-6 py-5 lg:px-10">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[.08em]" style={{ color: "rgba(255,255,255,.25)" }}>
            WorkGraph © {new Date().getFullYear()}
          </span>
          <div className="flex items-center gap-6">
            {[{ label: "Search", to: "/search" }, { label: "PathFinder", to: "/path" }, { label: "Graph", to: "/" }].map(({ label, to }) => (
              <Link key={label} to={to} className="text-[12px] font-medium transition-opacity duration-120 hover:opacity-70" style={{ color: "rgba(255,255,255,.3)" }}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
