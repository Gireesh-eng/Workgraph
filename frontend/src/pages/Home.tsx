import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { getStats, getAllNodes } from "../api/client";
import type { StatsResponse, GraphNode } from "../types";
import { useInView, useCountUp } from "../hooks/useAnimatedStats";

function AnimatedNumber({
  value,
  duration = 800,
  trigger,
}: {
  value: number;
  duration?: number;
  trigger: boolean;
}) {
  const count = useCountUp(value, duration, trigger);
  return <>{count}</>;
}

const protocols = [
  {
    code: "Search",
    title: "Graph Search",
    desc: "Instantly locate people, projects, tasks, and technologies with our full-text search engine.",
    features: ["Instant Results", "Auto-complete", "Global Indexing"],
    link: "/search",
  },
  {
    code: "Path",
    title: "PathFinder",
    desc: "Discover how any two entities are connected using our shortest-path graph traversal algorithm.",
    features: ["BFS Traversal", "Shared Context", "Directional Flow"],
    link: "/path",
  },
  {
    code: "Explore",
    title: "Relationship Map",
    desc: "Visualize every connection radiating from a single entity in our interactive radial view.",
    features: ["Interactive SVG", "Node Inspection", "360° Traversal"],
    link: "/search",
  },
  {
    code: "Inspect",
    title: "Entity Profiles",
    desc: "Access granular details, custom properties, and metadata for any node within your organization.",
    features: ["Type Classification", "Dynamic Properties", "Shareable Links"],
    link: "/search",
  },
];

const entityTypesMeta = [
  {
    key: "people" as const,
    label: "People",
    color: "var(--person)",
    icon: "👤",
  },
  { key: "teams" as const, label: "Teams", color: "var(--team)", icon: "👥" },
  {
    key: "projects" as const,
    label: "Projects",
    color: "var(--project)",
    icon: "📁",
  },
  { key: "tasks" as const, label: "Tasks", color: "var(--task)", icon: "✅" },
  {
    key: "technologies" as const,
    label: "Technologies",
    color: "var(--technology)",
    icon: "⚙️",
  },
  {
    key: "documents" as const,
    label: "Documents",
    color: "var(--document)",
    icon: "📄",
  },
];

const dbSpecs = [
  {
    label: "Database Engine",
    value: "CognoDB / Neo4j",
    detail: "Graph-native storage",
  },
  {
    label: "Query Language",
    value: "Cypher",
    detail: "Declarative pattern matching",
  },
  {
    label: "Max Traversal Depth",
    value: "10 Hops",
    detail: "Variable-length paths",
  },
  {
    label: "Connection Types",
    value: "8 Types",
    detail: "WORKS_ON, OWNS, USES…",
  },
];

export default function Home() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [exampleNodeMap, setExampleNodeMap] = useState<GraphNode | null>(null);
  const [exampleNodeProfile, setExampleNodeProfile] =
    useState<GraphNode | null>(null);

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(() => undefined);

    getAllNodes()
      .then((data) => {
        if (data.nodes && data.nodes.length > 0) {
          const person = data.nodes.find((n) => n.type === "Person");
          const project = data.nodes.find((n) => n.type === "Project");
          setExampleNodeMap(person || data.nodes[0]);
          setExampleNodeProfile(project || data.nodes[1] || data.nodes[0]);
        }
      })
      .catch(() => undefined);
  }, []);

  const totalNodes = stats
    ? stats.people +
      stats.teams +
      stats.projects +
      stats.tasks +
      stats.technologies +
      stats.documents
    : 0;

  const { ref: statsRef, isInView: statsInView } = useInView({
    threshold: 0.1,
  });

  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      {/* ═══════════════════════════════════════════════════
          SECTION 1 — HERO (Full viewport, dark, brutalist)
      ═══════════════════════════════════════════════════ */}
      <section className="relative min-h-screen bg-[#0A0A0A] text-white flex flex-col justify-between p-6 overflow-hidden">
        {/* Grid overlay */}
        <div className="absolute inset-0 grid-bg-brutal-dark opacity-40 pointer-events-none" />

        {/* Header bar */}
        <header className="relative z-10 flex justify-between items-start border-b border-white/15 pb-4">
          <div>
            <h1 className="font-display font-bold text-4xl tracking-tighter">
              Work<span style={{ color: "var(--person)" }}>Graph</span>
            </h1>
            <span className="text-xs mt-1 opacity-50 uppercase tracking-widest">
              Organization Explorer
            </span>
          </div>
          <div className="text-right text-xs leading-tight opacity-50 uppercase">
            <div>SYS.STATUS: ONLINE</div>
            <div>GRAPH DATABASE</div>
            <div>NODES: {stats ? totalNodes : "—"}</div>
          </div>
        </header>

        {/* Main hero content */}
        <div className="flex-1 flex items-center relative z-10">
          <div className="w-full flex flex-col md:flex-row md:items-start md:justify-between gap-12 pt-12 md:pt-0">
            <div>
              <div className="font-display text-huge font-black uppercase mix-blend-difference opacity-90 leading-none mt-2">
                Work
                <br />
                Graph
              </div>
              <div className="mt-8 max-w-lg border-l-2 border-white/40 pl-6 ml-2">
                <p className="text-sm uppercase leading-relaxed opacity-60">
                  Map your entire organization. Explore relationships between
                  people, projects, tasks, technology, and documents — all from
                  one searchable graph.
                </p>
              </div>
            </div>
            <div className="w-full max-w-[540px] shrink-0 mb-8 md:mb-0">
              <div className="text-[10px] font-mono tracking-widest uppercase text-white/50 mb-3 ml-1">
                [ INITIATE ENTITY SEARCH ]
              </div>
              <SearchBar autoFocus dark />
            </div>
          </div>
        </div>

        {/* Footer bar */}
        <footer className="relative z-10 flex justify-between items-end pt-4 border-t border-white/15">
          <div className="text-xs opacity-30 uppercase">
            WorkGraph —
            <br />
            Navigate Your Company
          </div>
          <Link to="/search" className="group flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs uppercase tracking-widest mb-1 opacity-50 group-hover:opacity-100 transition-opacity">
                Initialize Search
              </div>
              <div className="font-display font-bold text-xl uppercase">
                Enter System →
              </div>
            </div>
          </Link>
        </footer>
      </section>

      <div className="relative bg-white text-gray-900 border-t border-gray-200">
        <div className="absolute inset-0 grid-bg-brutal pointer-events-none" />

        {/* ═══════════════════════════════════════════════════
          SECTION 2 — DATABASE OVERVIEW (Stats Dashboard)
      ═══════════════════════════════════════════════════ */}
        <section className="relative z-10" ref={statsRef}>
          <div className="relative z-10 max-w-[1280px] mx-auto p-6 lg:p-12">
            {/* Section header */}
            <header className="mb-10">
              <div className="flex items-baseline gap-4 mb-2">
                <span className="font-mono text-[10px] tracking-widest uppercase text-gray-500">
                  [ SECTION 02 ]
                </span>
                <span className="font-mono text-[10px] tracking-widest uppercase text-gray-500">
                  DATABASE OVERVIEW
                </span>
              </div>
              <h2 className="font-display text-5xl lg:text-6xl font-medium uppercase leading-tight">
                Live
                <span className="font-light italic text-gray-600 ml-4">
                  Statistics
                </span>
              </h2>
            </header>

            {/* Main stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200 border border-gray-200 mb-8">
              {/* Nodes */}
              <div className="bg-white p-6 lg:p-8 flex flex-col justify-between min-h-[140px]">
                <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
                  Total Nodes
                </span>
                <div className="mt-4">
                  <span className="font-display text-5xl lg:text-6xl font-black text-gray-900">
                    {stats ? (
                      <AnimatedNumber
                        value={totalNodes}
                        trigger={statsInView}
                      />
                    ) : (
                      "—"
                    )}
                  </span>
                </div>
              </div>
              {/* Relationships */}
              <div className="bg-white p-6 lg:p-8 flex flex-col justify-between min-h-[140px]">
                <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
                  Relationships
                </span>
                <div className="mt-4">
                  <span className="font-display text-5xl lg:text-6xl font-black text-gray-900">
                    {stats ? (
                      <AnimatedNumber
                        value={stats.relationships}
                        trigger={statsInView}
                      />
                    ) : (
                      "—"
                    )}
                  </span>
                </div>
              </div>
              {/* Entity Types */}
              <div className="bg-white p-6 lg:p-8 flex flex-col justify-between min-h-[140px]">
                <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
                  Entity Types
                </span>
                <div className="mt-4">
                  <span className="font-display text-5xl lg:text-6xl font-black text-gray-900">
                    <AnimatedNumber value={6} trigger={statsInView} />
                  </span>
                </div>
              </div>
              {/* Avg connections */}
              <div className="bg-white p-6 lg:p-8 flex flex-col justify-between min-h-[140px]">
                <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
                  Avg Connections
                </span>
                <div className="mt-4">
                  <span className="font-display text-5xl lg:text-6xl font-black text-gray-900">
                    {stats && totalNodes > 0
                      ? ((stats.relationships * 2) / totalNodes).toFixed(1)
                      : "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Per-type breakdown */}
            <div className="border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white text-gray-900">
                <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
                  Entity Breakdown
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
                  [ BY TYPE ]
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-gray-200">
                {entityTypesMeta.map((et) => {
                  const count = stats ? stats[et.key] : 0;
                  const pct =
                    stats && totalNodes > 0
                      ? Math.round((count / totalNodes) * 100)
                      : 0;
                  return (
                    <div
                      key={et.key}
                      className="bg-white p-5 flex flex-col gap-3 group hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 border border-gray-200"
                          style={{ backgroundColor: et.color }}
                        />
                        <span className="font-mono text-[10px] uppercase tracking-widest text-gray-600">
                          {et.label}
                        </span>
                      </div>
                      <span className="font-display text-3xl font-bold text-gray-900">
                        {stats ? (
                          <AnimatedNumber value={count} trigger={statsInView} />
                        ) : (
                          "—"
                        )}
                      </span>
                      {/* Mini bar */}
                      <div className="w-full h-1 bg-gray-100 mt-auto">
                        <div
                          className="h-full transition-all duration-700"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: et.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
          SECTION 3 — GRAPH DATABASE HIGHLIGHTS
      ═══════════════════════════════════════════════════ */}
        <section className="relative z-10 border-t border-gray-600">
          <div className="relative z-10 max-w-[1280px] mx-auto p-6 lg:p-12">
            <header className="mb-10">
              <div className="flex items-baseline gap-4 mb-2">
                <span className="font-mono text-[10px] tracking-widest uppercase text-gray-500">
                  [ SECTION 03 ]
                </span>
                <span className="font-mono text-[10px] tracking-widest uppercase text-gray-500">
                  SPECIFICATIONS
                </span>
              </div>
              <h2 className="font-display text-5xl lg:text-6xl font-medium uppercase leading-tight text-gray-900">
                Graph Database
                <br />
                <span className="font-light italic text-gray-500">
                  Highlights
                </span>
              </h2>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 border border-gray-200">
              {dbSpecs.map((spec) => (
                <div
                  key={spec.label}
                  className="bg-white p-6 lg:p-8 flex flex-col justify-between min-h-[180px]"
                >
                  <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
                    {spec.label}
                  </span>
                  <div className="mt-4">
                    <div className="font-display text-2xl font-bold uppercase text-gray-900">
                      {spec.value}
                    </div>
                    <p className="mt-2 font-mono text-[11px] text-gray-600 uppercase">
                      {spec.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
          SECTION 4 — PROTOCOLS (Feature cards)
      ═══════════════════════════════════════════════════ */}
        <section className="relative z-10 border-t border-gray-600">
          <div className="relative z-10 max-w-[1280px] mx-auto p-6 lg:p-12">
            {/* Section header */}
            <header className="mb-16 relative">
              <div className="absolute -left-4 top-0 w-px h-full bg-gray-600 hidden lg:block" />
              <h2 className="font-display text-6xl lg:text-7xl font-medium uppercase leading-tight mb-8">
                Architecting
                <br />
                <span className="font-light italic text-gray-400">
                  Your Work Map
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <p className="text-sm uppercase leading-relaxed text-gray-600">
                  WorkGraph operates at the intersection of data and
                  relationships. We don't just store entities; we connect them.
                  From team structures to technology stacks, WorkGraph provides
                  the toolkit for organizational intelligence.
                </p>
              </div>
            </header>

            {/* Protocol cards label */}
            <div className="flex items-end justify-between border-b border-gray-600 pb-4 mb-[40px] h-[80px]">
              <h3 className="font-display text-3xl uppercase">
                Core Capabilities
              </h3>
              <span className="text-xs opacity-50">[ EXPLORE GRAPH ]</span>
            </div>

            {/* 2×2 card grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 relative z-10 border-t border-l border-gray-400">
              {protocols.map((p) => {
                let href = p.link;
                if (p.code === "Explore" && exampleNodeMap) {
                  href = `/entity/${exampleNodeMap.type}/${exampleNodeMap.id}`;
                } else if (p.code === "Inspect" && exampleNodeProfile) {
                  href = `/entity/${exampleNodeProfile.type}/${exampleNodeProfile.id}`;
                }

                return (
                  <Link
                    key={p.code}
                    to={href}
                    className="bg-transparent p-10 hover:bg-black hover:text-white transition-colors group flex flex-col justify-between h-[320px] border-b border-r border-gray-400 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 grid-bg-brutal-dark pointer-events-none hidden group-hover:block" />
                    <div className="relative z-10 block">
                      <div className="flex justify-end mb-6">
                        <svg
                          className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="square"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </div>
                      <h4 className="font-display text-2xl uppercase mb-4 font-bold">
                        {p.title}
                      </h4>
                      <p className="text-sm text-gray-800 group-hover:text-gray-300 transition-colors">
                        {p.desc}
                      </p>
                    </div>
                    <ul className="text-xs space-y-3 group-hover:border-white/20 pt-4 transition-colors relative z-10 block">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-current mr-3" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* ═══════════════════════════════════════════════════
          FOOTER — Brutalist minimal
      ═══════════════════════════════════════════════════ */}
      <footer className="bg-[#0A0A0A] text-white border-t border-white/10 border-t-8 border-t-black mt-auto">
        <div className="max-w-[1280px] mx-auto px-6 py-12 lg:px-12 lg:py-20 grid grid-cols-1 md:grid-cols-4 gap-12 text-xs uppercase">
          <div className="col-span-2">
            <h5 className="font-bold mb-4 font-display text-xl tracking-tighter">
              Work<span style={{ color: "var(--person)" }}>Graph</span>
            </h5>
            <p className="max-w-xs text-white/50 leading-relaxed mt-4">
              Organization Explorer
              <br />
              Graph-powered relationship mapping
              <br />
              for modern teams.
            </p>
          </div>
          <div>
            <h5 className="font-bold mb-4">Navigate</h5>
            <ul className="space-y-2 text-white/50">
              <li>
                <Link
                  to="/search"
                  className="hover:text-white transition-colors"
                >
                  Search
                </Link>
              </li>
              <li>
                <Link to="/path" className="hover:text-white transition-colors">
                  PathFinder
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4">System</h5>
            <ul className="space-y-2 text-white/50">
              <li>Status: Online</li>
              <li>Database: Neo4j</li>
              <li>v.1.0.0</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 px-6 lg:px-12 text-center text-xs text-white/40 uppercase tracking-widest">
          WorkGraph — Modern Database Navigation
        </div>
      </footer>
    </div>
  );
}
