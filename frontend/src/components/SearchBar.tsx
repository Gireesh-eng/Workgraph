import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { search } from "../api/client";
import type { SearchResult } from "../types";
import { nodeTypeColors } from "../types";

export default function SearchBar({ initialQuery = "", autoFocus = false, dark = false }: { initialQuery?: string; autoFocus?: boolean; dark?: boolean }) {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();
  const ref = useRef<HTMLInputElement>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => { if (autoFocus) ref.current?.focus(); }, [autoFocus]);
  useEffect(() => setQuery(initialQuery), [initialQuery]);

  useEffect(() => {
    if (query.trim().length > 1) {
      search(query).then(data => setResults(data.results.slice(0, 5))).catch(() => setResults([]));
    } else {
      setResults([]);
    }
  }, [query]);

  return <div className="relative w-full" onFocus={() => setShowSuggestions(true)} onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}>
    <form onSubmit={e => { e.preventDefault(); setShowSuggestions(false); if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`); }} className="w-full">
      <div className={`flex h-11 items-center rounded-control border shadow-inner focus-within:ring-[3px] ${dark ? "border-white/[.15] bg-white/[.1] focus-within:border-white/40 focus-within:ring-white/10" : "border-border bg-surface-sunken shadow-[#6c5140]/[.03] focus-within:border-ink-900 focus-within:ring-ink-900/10"}`}>
        <svg className={`ml-3.5 h-4 w-4 shrink-0 ${dark ? "text-white/40" : "text-ink-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>
        <input ref={ref} value={query} onChange={e => setQuery(e.target.value)} placeholder="Search people, projects, tasks…" className={`h-full min-w-0 flex-1 bg-transparent px-3 text-[14px] font-medium outline-none ${dark ? "text-white placeholder:text-white/40" : "text-ink-900 placeholder:font-normal placeholder:text-ink-400"}`} />
        {query && <button type="button" onClick={() => { setQuery(""); setResults([]); }} aria-label="Clear search" className={`mr-2 ${dark ? "text-white/40 hover:text-white" : "text-ink-400 hover:text-ink-900"}`}>×</button>}
      </div>
    </form>

    {showSuggestions && (
      <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-xl border border-border bg-paper shadow-xl motion-safe:animate-fade-up" style={{ animationDuration: "150ms" }}>
        {query.trim().length < 2 ? (
          <div className="px-4 py-3">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-ink-400">Suggested Searches</p>
            <ul className="-mx-2">
              {[
                { name: "Priya Sharma", type: "Person", icon: "Person" },
                { name: "Data Pipeline v2", type: "Project", icon: "Project" },
                { name: "Platform Engineering", type: "Team", icon: "Team" },
                { name: "GraphQL", type: "Technology", icon: "Technology" }
              ].map((suggestion, i) => (
                <li key={i}>
                  <button type="button" onMouseDown={(e) => { e.preventDefault(); navigate(`/search?q=${encodeURIComponent(suggestion.name)}`); setShowSuggestions(false); }} className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-surface-hover">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-sunken">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: `var(--${nodeTypeColors[suggestion.type as any]})` }} />
                    </div>
                    <span className="text-[14px] font-medium text-ink-900">{suggestion.name}</span>
                    <span className="ml-auto font-mono text-[10px] text-ink-400 uppercase">{suggestion.type}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : results.length > 0 ? (
          <ul className="py-2">
            {results.map((item) => (
              <li key={item.id}>
                <Link to={`/entity/${item.type}/${item.id}`} onMouseDown={(e) => { e.preventDefault(); navigate(`/entity/${item.type}/${item.id}`); setShowSuggestions(false); }} onClick={(e) => e.preventDefault()} className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-surface-hover">
                  <div className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: `var(--${nodeTypeColors[item.type]})` }} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold text-ink-900">{item.name}</p>
                  </div>
                  <span className="font-mono text-[11px] font-medium text-ink-400">{item.type.toUpperCase()}</span>
                </Link>
              </li>
            ))}
            <li className="border-t border-border mt-1">
              <button type="button" onMouseDown={(e) => { e.preventDefault(); navigate(`/search?q=${encodeURIComponent(query.trim())}`); setShowSuggestions(false); }} onClick={(e) => e.preventDefault()} className="w-full px-4 py-2.5 text-left text-[13px] font-medium text-person transition-colors hover:bg-surface-hover">See all results for "{query}" &rarr;</button>
            </li>
          </ul>
        ) : (
          <div className="px-4 py-3 text-[13px] text-ink-600">No matching entities found.</div>
        )}
      </div>
    )}
  </div>;
}
