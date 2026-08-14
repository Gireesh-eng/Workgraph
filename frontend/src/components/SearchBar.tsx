import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { search } from "../api/client";
import type { SearchResult } from "../types";
import { nodeTypeColors } from "../types";

const SUGGESTED_SEARCHES = ["Alex Chen", "Data Pipeline", "Authentication", "React", "Platform Engineering"];

export default function SearchBar({ initialQuery = "", autoFocus = false, dark = false }: { initialQuery?: string; autoFocus?: boolean; dark?: boolean }) {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();
  const ref = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const preventAutoSuggest = useRef(autoFocus);

  useEffect(() => {
    if (autoFocus) {
      ref.current?.focus();
      // Allow subsequent focus events to trigger suggestions
      setTimeout(() => {
        preventAutoSuggest.current = false;
      }, 100);
    } else {
      preventAutoSuggest.current = false;
    }
  }, [autoFocus]);

  useEffect(() => setQuery(initialQuery), [initialQuery]);

  useEffect(() => {
    if (query.trim().length > 1) {
      search(query).then(data => setResults(data.results.slice(0, 5))).catch(() => setResults([]));
    } else {
      setResults([]);
    }
  }, [query]);

  useEffect(() => {
    if (showSuggestions) {
      const handleScroll = () => {
        setShowSuggestions(false);
        ref.current?.blur();
      };

      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setShowSuggestions(false);
        }
      };

      window.addEventListener("scroll", handleScroll, { passive: true, capture: true });
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        window.removeEventListener("scroll", handleScroll, { capture: true });
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showSuggestions]);

  return <div className="relative w-full" ref={containerRef}
    onFocus={() => {
      if (!preventAutoSuggest.current) {
        setShowSuggestions(true);
      }
    }}
    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
    onClick={() => {
      // If user explicitly clicks the searchbar, always show suggestions
      preventAutoSuggest.current = false;
      setShowSuggestions(true);
    }}
  >
    <form onSubmit={e => { e.preventDefault(); setShowSuggestions(false); if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`); }} className="w-full">
      <div className={`flex h-11 items-center border focus-within:ring-1 ${dark ? "border-white/20 bg-[#0A0A0A] focus-within:ring-white" : "border-black bg-white focus-within:ring-black"}`}>
        <svg className={`ml-3.5 h-4 w-4 shrink-0 ${dark ? "text-white/70" : "text-black"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>
        <input ref={ref} value={query} onChange={e => { setQuery(e.target.value); setShowSuggestions(true); }} placeholder="SEARCH ENTITIES, TASKS, TEAMS…" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" className={`h-full min-w-0 flex-1 bg-transparent px-2 sm:px-3 text-[12px] sm:text-[14px] font-mono outline-none ${dark ? "text-white placeholder:text-white/70" : "text-black placeholder:text-gray-500"}`} />
        {query && <button type="button" onClick={() => { setQuery(""); setResults([]); }} aria-label="Clear search" className={`mr-2 font-mono text-base sm:text-lg font-bold ${dark ? "text-white/70 hover:text-white" : "text-gray-500 hover:text-black"}`}>×</button>}
      </div>
    </form>

    {
      showSuggestions && query.trim().length <= 1 && (
        <div onMouseDown={(e) => e.preventDefault()} className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden border border-black bg-white text-black shadow-none motion-safe:animate-fade-up" style={{ animationDuration: "150ms" }}>
          <div className="px-4 py-3 text-[11px] font-mono font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">Suggested Searches</div>
          <ul className="py-2 pt-0">
            {SUGGESTED_SEARCHES.map((term) => (
              <li key={term}>
                <button type="button" onClick={() => { setQuery(term); navigate(`/search?q=${encodeURIComponent(term)}`); setShowSuggestions(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-[13px] font-mono font-medium text-black transition-colors hover:bg-black hover:text-white">
                  <svg className="h-4 w-4 shrink-0 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>
                  {term}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )
    }

    {
      showSuggestions && query.trim().length > 1 && (
        <div onMouseDown={(e) => e.preventDefault()} className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden border border-black bg-white text-black shadow-none motion-safe:animate-fade-up" style={{ animationDuration: "150ms" }}>
          {results.length > 0 ? (
            <ul className="py-2">
              {results.map((item) => (
                <li key={item.id}>
                  <Link to={`/entity/${item.type}/${item.id}`} onClick={() => setShowSuggestions(false)} className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-black hover:text-white group">
                    <div className="h-2 w-2 shrink-0 border border-current" style={{ backgroundColor: `var(--${nodeTypeColors[item.type]})` }} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-mono font-medium">{item.name}</p>
                    </div>
                    <span className="font-mono text-[11px] font-medium opacity-50">{item.type.toUpperCase()}</span>
                  </Link>
                </li>
              ))}
              <li className="border-t border-gray-200 mt-1">
                <button type="button" onClick={() => { navigate(`/search?q=${encodeURIComponent(query.trim())}`); setShowSuggestions(false); }} className="w-full px-4 py-2.5 text-left text-[12px] font-mono font-bold uppercase tracking-wider text-black transition-colors hover:bg-black hover:text-white">See all results for "{query}" &rarr;</button>
              </li>
            </ul>
          ) : (
            <div className="px-4 py-3 text-[13px] font-mono text-gray-500">No matching entities found.</div>
          )}
        </div>
      )
    }
  </div >;
}
