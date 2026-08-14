import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import { search } from "../api/client";
import type { NodeType, SearchResult } from "../types";
import { nodeTypeColors } from "../types";

const types: NodeType[] = [
  "Person",
  "Team",
  "Project",
  "Task",
  "Technology",
  "Document",
];

export default function Search() {
  const [params] = useSearchParams();
  const query = params.get("q") ?? "";
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<NodeType | "All">("All");

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    search(query)
      .then((data) => setResults(data.results))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [query]);

  const filtered = useMemo(
    () =>
      activeType === "All"
        ? results
        : results.filter((item) => item.type === activeType),
    [activeType, results],
  );
  const grouped = useMemo(
    () =>
      filtered.reduce<Record<string, SearchResult[]>>((groups, item) => {
        (groups[item.type] ??= []).push(item);
        return groups;
      }, {}),
    [filtered],
  );

  return (
    <div className="min-h-screen bg-transparent relative">
      <div className="relative z-10">
        <AppHeader query={query} />
        <main className="mx-auto max-w-[1280px] px-6 py-10 lg:px-10">
          <div className="border-b border-black pb-8 mb-8">
            <p className="font-mono text-xs uppercase tracking-widest text-black/50 mb-2">[ GRAPH SEARCH ]</p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none text-black">
              Search
              <br />
              Directory
            </h1>
            <p className="mt-6 max-w-lg font-mono text-sm uppercase leading-relaxed text-black/70 border-l-2 border-black pl-4">
              Find an entity, then open its relationship map to explore the surrounding work.
            </p>
            {query && (
              <p className="mt-8 font-mono text-xs uppercase bg-black text-white inline-block px-3 py-1.5">
                <span className="font-bold">{results.length}</span> RESULT{results.length === 1 ? "" : "S"} FOR “{query}”
              </p>
            )}
          </div>

          {loading ? (
            <div className="mt-6">
              <LoadingState rows={5} />
            </div>
          ) : error ? (
            <ErrorState
              message="Couldn't reach the server. Check your connection and retry."
              onRetry={() => location.reload()}
            />
          ) : !results.length ? (
            query ? (
              <EmptyState
                title={`No results for “${query}”`}
                description="Search by a name, project, task, team, technology, or document."
              />
            ) : null
          ) : (
            <>
              <div className="mt-7 flex flex-wrap items-center gap-px bg-black border border-black p-px">
                <button
                  onClick={() => setActiveType("All")}
                  className={`flex-1 min-w-[100px] px-4 py-2 text-[11px] font-mono font-bold uppercase transition-colors ${activeType === "All" ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"}`}
                >
                  All{" "}
                  <span className="ml-1 opacity-50">
                    [{results.length}]
                  </span>
                </button>
                {types
                  .filter((type) =>
                    results.some((result) => result.type === type),
                  )
                  .map((type) => (
                    <button
                      key={type}
                      onClick={() => setActiveType(type)}
                      className={`flex-1 min-w-[120px] px-4 py-2 text-[11px] font-mono font-bold uppercase transition-colors flex justify-center items-center gap-2 ${activeType === type ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"}`}
                    >
                      <span
                        className="inline-block h-1.5 w-1.5 border border-current"
                        style={{
                          backgroundColor: `var(--${nodeTypeColors[type]})`,
                        }}
                      />
                      {type}
                    </button>
                  ))}
              </div>
              <div className="mt-8 space-y-12">
                {Object.entries(grouped).map(([type, items]) => (
                  <section key={type}>
                    <div className="flex justify-between items-baseline border-b border-black pb-2 mb-4">
                      <span className="font-display font-bold text-2xl uppercase">{type}s</span>
                      <span className="font-mono text-xs opacity-50">
                        [ {items.length} MATCH{items.length === 1 ? "" : "ES"} ]
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-px bg-black border border-black">
                      {items.map((item, index) => (
                        <Link
                          key={item.id}
                          to={`/entity/${item.type}/${item.id}`}
                          className="bg-white hover:bg-black hover:text-white transition-colors group flex min-h-[84px] sm:min-h-[96px] items-center px-4 sm:px-6 py-4 sm:py-5 motion-safe:animate-fade-up relative overflow-hidden"
                          style={{ animationDelay: `${index * 30}ms` }}
                        >
                          <span
                            className="absolute inset-y-0 left-0 w-[4px]"
                            style={{
                              backgroundColor: `var(--${nodeTypeColors[item.type]})`,
                            }}
                          />
                          <div className="min-w-0 flex-1 ml-2">
                            <p className="font-display font-medium text-lg sm:text-xl uppercase truncate">
                              {item.name}
                            </p>
                            {item.context && (
                              <p className="mt-1.5 truncate font-mono text-xs opacity-60 uppercase">
                                {item.context}
                              </p>
                            )}
                          </div>
                          <div className="ml-2 hidden sm:flex shrink-0 items-center justify-end sm:min-w-[32px]">
                            <svg
                              className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity rotate-[-45deg]"
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
                        </Link>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
