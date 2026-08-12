import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import TypeBadge from "../components/TypeBadge";

import { search } from "../api/client";
import type { NodeType, SearchResult } from "../types";
import { nodeTypeColors } from "../types";

const types: NodeType[] = ["Person", "Team", "Project", "Task", "Technology", "Document"];

export default function Search() {
  const [params] = useSearchParams();
  const query = params.get("q") ?? "";
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<NodeType | "All">("All");

  useEffect(() => {
    if (!query.trim()) { setResults([]); setLoading(false); return; }
    setLoading(true); setError(null);
    search(query).then((data) => setResults(data.results)).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, [query]);

  const filtered = useMemo(() => activeType === "All" ? results : results.filter((item) => item.type === activeType), [activeType, results]);
  const grouped = useMemo(() => filtered.reduce<Record<string, SearchResult[]>>((groups, item) => { (groups[item.type] ??= []).push(item); return groups; }, {}), [filtered]);

  return <div className="min-h-screen bg-paper"><AppHeader query={query} />
    <main className="mx-auto max-w-[1000px] px-6 py-10 lg:px-10">
      <div className="rounded-2xl border border-border bg-surface px-6 py-7 sm:px-8 sm:py-8 motion-safe:animate-fade-up"><p className="eyebrow text-person">Graph search</p><h1 className="mt-1 text-[32px] font-semibold leading-10 tracking-[-.025em]">Search the organization</h1><p className="mt-2 text-[16px] leading-6 text-ink-600">Find an entity, then open its relationship map to explore the surrounding work.</p>{query && <p className="mt-5 border-t border-border pt-4 text-[14px] text-ink-600"><span className="font-semibold text-ink-900">{results.length}</span> result{results.length === 1 ? "" : "s"} for <span className="font-semibold text-ink-900">“{query}”</span></p>}</div>

      {loading ? <div className="mt-6"><LoadingState rows={5} /></div> : error ? <ErrorState message="Couldn't reach the server. Check your connection and retry." onRetry={() => location.reload()} /> : !results.length ? (query ? <EmptyState title={`No results for “${query}”`} description="Search by a name, project, task, team, technology, or document." /> : null) : <>
        <div className="mt-7 flex flex-wrap items-center gap-2"><button onClick={() => setActiveType("All")} className={`rounded-pill border px-4 py-2 text-[13px] font-semibold transition-colors ${activeType === "All" ? "border-ink-900 bg-ink-900 text-paper" : "border-border bg-surface text-ink-600 hover:text-ink-900"}`}>All <span className="ml-1 font-mono text-[11px] opacity-75">{results.length}</span></button>{types.filter((type) => results.some((result) => result.type === type)).map((type) => <button key={type} onClick={() => setActiveType(type)} className={`rounded-pill border px-4 py-2 text-[13px] font-semibold transition-colors ${activeType === type ? "border-ink-900 bg-ink-900 text-paper" : "border-border bg-surface text-ink-600 hover:text-ink-900"}`}><span className="mr-2 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: `var(--${nodeTypeColors[type]})` }} />{type}</button>)}</div>
        <div className="mt-8 space-y-9">{Object.entries(grouped).map(([type, items]) => <section key={type}><div className="sticky top-16 z-10 -mx-2 mb-3 flex h-8 items-center bg-paper/95 px-2 backdrop-blur"><span className="eyebrow text-ink-600">{type}s</span><span className="ml-2 font-mono text-[12px] text-ink-400">{items.length}</span></div><div className="space-y-3">{items.map((item, index) => <Link key={item.id} to={`/entity/${item.type}/${item.id}`} className="card group flex min-h-[86px] items-center pl-7 pr-4 py-4 sm:pl-8 sm:pr-5 sm:py-5 transition-all duration-120 hover:-translate-y-px hover:shadow-[0_10px_24px_rgba(55,43,33,.07)] motion-safe:animate-fade-up" style={{ animationDelay: `${index * 30}ms` }}><span className="absolute inset-y-0 left-0 w-[5px]" style={{ backgroundColor: `var(--${nodeTypeColors[item.type]})` }} /><span className="mr-4 h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: `var(--${nodeTypeColors[item.type]})` }} /><div className="min-w-0 flex-1"><p className="truncate text-[17px] font-semibold leading-6 text-ink-900">{item.name}</p>{item.context && <p className="mt-1 truncate text-[14px] text-ink-600">{item.context}</p>}</div><div className="ml-4 flex shrink-0 items-center gap-3"><TypeBadge type={item.type} /><span className="hidden text-[20px] text-ink-400 transition-transform duration-120 group-hover:translate-x-1 sm:block">→</span></div></Link>)}</div></section>)}</div>
      </>}
    </main>
  </div>;
}
