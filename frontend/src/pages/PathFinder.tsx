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
    getAllNodes()
      .then((data) => setNodes(data.nodes))
      .catch((err) => setError(err.message))
      .finally(() => setNodesLoading(false));
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
    if (
      searchParams.get("from") &&
      searchParams.get("to") &&
      newFrom &&
      newTo &&
      newFrom !== newTo
    ) {
      setSearchParams({ from: newFrom, to: newTo });
    }
  };

  return (
    <div className="min-h-screen bg-transparent relative">
      <div className="relative z-10">
        <AppHeader />
        <main className="mx-auto max-w-[1280px] px-6 py-10 lg:px-10">
          <div className="mx-auto max-w-[940px]">
            <section className="bg-white border border-black overflow-visible relative">
              <div className="border-b-4 border-black bg-white px-6 py-7 sm:px-8">
                <p className="font-mono text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2">[ RELATIONSHIP EXPLORER ]</p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold uppercase tracking-tighter text-black leading-none break-words">
                  Find The Shortest Path
                </h1>
                <p className="mt-4 max-w-[670px] font-mono text-sm uppercase leading-relaxed text-black/70 border-l-2 border-black pl-4">
                  Choose two entities and WorkGraph will show the clearest chain
                  of relationships between them.
                </p>
              </div>
              <div className="p-6 sm:p-8">
                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_44px_minmax(0,1fr)]">
                  <PathEntityPicker
                    label="Start with"
                    value={from}
                    onChange={setFrom}
                    nodes={nodes}
                    disabled={nodesLoading}
                  />
                  <div className="flex items-end justify-center">
                    <button
                      onClick={swap}
                      disabled={!from && !to}
                      aria-label="Swap selected entities"
                      className="icon-button h-12 w-11 px-0 text-[19px] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      ⇄
                    </button>
                  </div>
                  <PathEntityPicker
                    label="Connect to"
                    value={to}
                    onChange={setTo}
                    nodes={nodes}
                    disabled={nodesLoading}
                  />
                </div>
                <div className="mt-8 flex flex-col gap-4 border-t border-black pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-mono text-[11px] font-bold uppercase text-gray-600">
                    {nodesLoading
                      ? "[ LOADING GRAPH ENTITIES ]"
                      : `[ ${nodes.length} ENTITIES AVAILABLE TO EXPLORE ]`}
                  </p>
                  <button
                    onClick={run}
                    disabled={
                      !from || !to || from === to || loading || nodesLoading
                    }
                    className="h-12 border border-black bg-black px-6 font-mono text-[12px] font-bold uppercase text-white transition-colors hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500 cursor-pointer"
                  >
                    {loading ? "FINDING PATH…" : "FIND SHORTEST PATH"}
                  </button>
                </div>
              </div>
            </section>
            {loading ? (
              <div className="mt-7">
                <LoadingState rows={4} />
              </div>
            ) : error && !nodesLoading ? (
              <ErrorState message={error} onRetry={run} />
            ) : path?.length === 0 ? (
              <EmptyState
                title="No path found"
                description="These entities may not be connected in the current graph."
              />
            ) : path ? (
              <PathResults path={path} />
            ) : (
              <section className="bg-white border border-black mt-8 p-6 sm:p-7">
                <p className="font-mono text-[10px] uppercase font-bold tracking-widest text-gray-500">WHAT YOU WILL SEE</p>
                <div className="mt-6 grid gap-6 sm:grid-cols-3">
                  <InfoCard
                    number="01"
                    title="STARTING POINT"
                    body="The selected entity begins the chain."
                  />
                  <InfoCard
                    number="02"
                    title="RELATIONSHIP CONTEXT"
                    body="Each step includes the link that joins it to the next entity."
                  />
                  <InfoCard
                    number="03"
                    title="A WAY FORWARD"
                    body="Open any entity to continue exploring its direct connections."
                  />
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function InfoCard({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <div className="border-l-4 border-black pl-4">
      <span className="font-mono text-[24px] font-bold text-black border border-black px-1 leading-none inline-block mb-2">
        {number}
      </span>
      <h2 className="text-[14px] font-display font-bold uppercase">{title}</h2>
      <p className="mt-2 font-mono text-[12px] leading-snug uppercase text-gray-600">{body}</p>
    </div>
  );
}

function PathResults({ path }: { path: PathHop[] }) {
  return (
    <section className="mt-8">
      <div className="flex items-end justify-between border-b border-black pb-4">
        <div>
          <p className="font-mono text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2">[ SHORTEST CONNECTION ]</p>
          <h2 className="text-3xl font-display font-bold uppercase leading-none text-black">
            {path.length} {path.length === 1 ? "ENTITY" : "ENTITIES"} IN PATH
          </h2>
        </div>
        <span className="border border-black bg-white px-3 py-2 font-mono text-[11px] font-bold uppercase text-black whitespace-nowrap">
          {Math.max(path.length - 1, 0)} HOPS
        </span>
      </div>
      <div className="mt-5">
        {path.map((hop, index) => {
          const prevHop = index > 0 ? path[index - 1] : null;
          return (
            <div key={`${hop.node.id}-${index}`}>
              {index > 0 && prevHop && (
                <div className="relative ml-[23px] flex h-14 items-center">
                  <svg
                    className="absolute top-0 -left-[5px] h-full w-[10px] text-black"
                    preserveAspectRatio="none"
                    viewBox="0 0 10 40"
                    fill="none"
                  >
                    <path
                      d="M5 0V38"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    {prevHop.direction === "in" ? (
                      <path
                        d="M5 16L10 24L5 21L0 24L5 16Z"
                        fill="currentColor"
                      />
                    ) : (
                      <path
                        d="M5 24L0 16L5 19L10 16L5 24Z"
                        fill="currentColor"
                      />
                    )}
                  </svg>
                  {prevHop.relationship && (
                    <span className="ml-[22px]">
                      <TypeBadge
                        type={hop.node.type}
                      >{`${prevHop.direction === "in" ? "↑ " : ""}${prevHop.relationship.replaceAll("_", " ").toUpperCase()}${prevHop.direction !== "in" ? " ↓" : ""}`}</TypeBadge>
                    </span>
                  )}
                </div>
              )}
              <Link
                to={`/entity/${hop.node.type}/${hop.node.id}`}
                className="bg-white border border-black hover:bg-black hover:text-white transition-colors group flex min-h-[84px] sm:min-h-[96px] items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 relative overflow-hidden"
              >
                <span
                  className="absolute inset-y-0 left-0 w-[4px]"
                  style={{
                    backgroundColor: `var(--${nodeTypeColors[hop.node.type]})`,
                  }}
                />
                <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center border border-current bg-transparent font-mono text-[13px] sm:text-[14px] font-bold text-current">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1 ml-1 sm:ml-2">
                  <p className="truncate font-display font-medium text-lg sm:text-xl uppercase">
                    {hop.node.name}
                  </p>
                  <p className="mt-1 font-mono text-[11px] sm:text-[12px] opacity-60 uppercase">
                    ID: {hop.node.id}
                  </p>
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
            </div>
          );
        })}
      </div>
    </section>
  );
}
