import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import TypeBadge from "../components/TypeBadge";
import PathEntityPicker from "../components/PathEntityPicker";
import { findPath, getAllNodes } from "../api/client";
import type { GraphNode, PathHop } from "../types";
import { nodeTypeColors } from "../types";

export default function PathFinder() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [nodes, setNodes] = useState<GraphNode[]>([]);

  const [from, setFrom] = useState(searchParams.get("from") || "");
  const [to, setTo] = useState(searchParams.get("to") || "");

  const [path, setPath] = useState<PathHop[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [nodesLoading, setNodesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllNodes().then((data) => setNodes(data.nodes)).catch((err) => setError(err.message)).finally(() => setNodesLoading(false));
  }, []);

  useEffect(() => {
    const urlFrom = searchParams.get("from");
    const urlTo = searchParams.get("to");

    if (urlFrom !== from) setFrom(urlFrom || "");
    if (urlTo !== to) setTo(urlTo || "");

    if (urlFrom && urlTo && urlFrom !== urlTo) {
      setLoading(true);
      setError(null);
      setPath(null);
      findPath(urlFrom, urlTo)
        .then((data) => setPath(data.path))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    } else {
      setPath(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const run = () => {
    if (!from || !to || from === to) return;
    setSearchParams({ from, to });
  };

  const swap = () => {
    const newFrom = to;
    const newTo = from;
    setFrom(newFrom);
    setTo(newTo);
    if (searchParams.get("from") && searchParams.get("to") && newFrom && newTo && newFrom !== newTo) {
      setSearchParams({ from: newFrom, to: newTo });
    }
  };

  return <div className="min-h-screen bg-paper"><AppHeader />
    <main className="mx-auto max-w-[1180px] px-6 py-10 lg:px-10"><div className="mx-auto max-w-[940px]">
      <section className="surface-section overflow-visible"><div className="border-b border-border bg-[#FCF9F5] px-6 py-7 sm:px-8"><p className="eyebrow text-person">Relationship explorer</p><h1 className="mt-2 text-[34px] font-semibold leading-10 tracking-[-.03em] text-ink-900">Find the shortest path</h1><p className="mt-3 max-w-[670px] text-[16px] leading-7 text-ink-600">Choose two entities and WorkGraph will show the clearest chain of relationships between them.</p></div>
        <div className="p-6 sm:p-8"><div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_44px_minmax(0,1fr)]"><PathEntityPicker label="Start with" value={from} onChange={setFrom} nodes={nodes} disabled={nodesLoading} /><div className="flex items-end justify-center"><button onClick={swap} disabled={!from && !to} aria-label="Swap selected entities" className="icon-button h-12 w-11 px-0 text-[19px] disabled:cursor-not-allowed disabled:opacity-40">⇄</button></div><PathEntityPicker label="Connect to" value={to} onChange={setTo} nodes={nodes} disabled={nodesLoading} /></div><div className="mt-7 flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-[14px] text-ink-600">{nodesLoading ? "Loading graph entities…" : `${nodes.length} entities available to explore`}</p><button onClick={run} disabled={!from || !to || from === to || loading || nodesLoading} className="h-12 rounded-control bg-ink-900 px-6 text-[15px] font-semibold text-paper transition-transform duration-120 hover:scale-[1.02] active:scale-[.98] disabled:cursor-not-allowed disabled:bg-ink-400">{loading ? "Finding path…" : "Find shortest path"}</button></div></div>
      </section>
      {loading ? <div className="mt-7"><LoadingState rows={4} /></div> : error && !nodesLoading ? <ErrorState message={error} onRetry={run} /> : path?.length === 0 ? <EmptyState title="No path found" description="These entities may not be connected in the current graph." /> : path ? <PathResults path={path} /> : <section className="surface-section mt-7 p-6 sm:p-7"><p className="eyebrow">What you will see</p><div className="mt-5 grid gap-5 sm:grid-cols-3"><InfoCard number="01" title="A clear starting point" body="The selected entity begins the chain." /><InfoCard number="02" title="Relationship context" body="Each step includes the link that joins it to the next entity." /><InfoCard number="03" title="A way forward" body="Open any entity to continue exploring its direct connections." /></div></section>}
    </div></main>
  </div>;
}

function InfoCard({ number, title, body }: { number: string; title: string; body: string }) { return <div className="border-l-2 border-person pl-4"><span className="font-mono text-[12px] font-medium text-person">{number}</span><h2 className="mt-1 text-[16px] font-semibold">{title}</h2><p className="mt-1 text-[14px] leading-6 text-ink-600">{body}</p></div>; }

function PathResults({ path }: { path: PathHop[] }) {
  return (
    <section className="mt-7">
      <div className="flex items-end justify-between">
        <div><p className="eyebrow text-person">Shortest connection</p><h2 className="mt-1 text-[27px] font-semibold tracking-[-.02em]">{path.length} {path.length === 1 ? "entity" : "entities"} in this path</h2></div>
        <span className="rounded-control border border-border bg-surface px-3 py-2 font-mono text-[12px] text-ink-600">{Math.max(path.length - 1, 0)} hops</span>
      </div>
      <div className="mt-5">
        {path.map((hop, index) => {
          const prevHop = index > 0 ? path[index - 1] : null;
          return (
            <div key={`${hop.node.id}-${index}`}>
              {index > 0 && prevHop && (
                <div className="relative ml-[23px] flex h-14 items-center">
                  <svg className="absolute top-0 -left-[5px] h-full w-[10px] text-ink-300" preserveAspectRatio="none" viewBox="0 0 10 40" fill="none">
                    <path d="M5 0V38" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                    {prevHop.direction === "in" ? (
                      <path d="M5 16L10 24L5 21L0 24L5 16Z" fill="currentColor" />
                    ) : (
                      <path d="M5 24L0 16L5 19L10 16L5 24Z" fill="currentColor" />
                    )}
                  </svg>
                  {prevHop.relationship && <span className="ml-[22px]"><TypeBadge type={hop.node.type}>{`${prevHop.direction === "in" ? "↑ " : ""}${prevHop.relationship.replaceAll("_", " ").toUpperCase()}${prevHop.direction !== "in" ? " ↓" : ""}`}</TypeBadge></span>}
                </div>
              )}
              <Link to={`/entity/${hop.node.type}/${hop.node.id}`} className="card group flex min-h-[82px] items-center gap-4 pl-7 pr-4 py-4 transition-all duration-120 hover:-translate-y-px hover:shadow-[0_10px_24px_rgba(55,43,33,.07)]"><span className="absolute inset-y-0 left-0 w-[5px]" style={{ backgroundColor: `var(--${nodeTypeColors[hop.node.type]})` }} />
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper shadow-sm ring-1 ring-ink-900/5 font-mono text-[12px] font-medium text-ink-600">{String(index + 1).padStart(2, "0")}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[17px] font-semibold">{hop.node.name}</p>
                  <p className="mt-1 font-mono text-[12px] text-ink-400">{hop.node.id}</p>
                </div>
                <TypeBadge type={hop.node.type} />
                <span className="text-[20px] text-ink-400 transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
