import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import GraphView from "../components/GraphView";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import TypeBadge from "../components/TypeBadge";
import { getEntity } from "../api/client";
import type { EntityResponse } from "../types";
import { nodeTypeColors } from "../types";

export default function EntityDetail() {
  const { type, id } = useParams();
  const [data, setData] = useState<EntityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const load = () => {
    if (!type || !id) return;
    setLoading(true);
    setError(null);
    getEntity(type, id)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, [type, id]);

  const properties = useMemo(
    () =>
      data
        ? Object.entries(data.node).filter(
          ([key, value]) => !["name", "id", "type"].includes(key) && value,
        )
        : [],
    [data],
  );

  return (
    <div className="min-h-screen bg-transparent relative">
      <div className="relative z-10">
        <AppHeader />
        <main className="mx-auto max-w-[1280px] px-6 py-8 lg:px-10">
          {loading ? (
            <LoadingState type="detail" />
          ) : error ? (
            <ErrorState
              message={
                error === "Not found"
                  ? "This entity doesn't exist."
                  : "Couldn't reach the server."
              }
              onRetry={load}
            />
          ) : data ? (
            <>
              <nav className="mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-widest text-black/50 overflow-hidden">
                <Link className="hover:text-black transition-colors shrink-0" to="/">
                  [HOME]
                </Link>
                <span className="text-black/30 shrink-0">/</span>
                <Link className="hover:text-black transition-colors shrink-0" to="/search">
                  [SEARCH]
                </Link>
                <span className="text-black/30 shrink-0">/</span>
                <span className="truncate text-black min-w-0">[{data.node.name}]</span>
              </nav>
              <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
                <aside className="xl:sticky xl:top-20 xl:h-fit">
                  <section className="bg-white border border-black relative">
                    <div
                      className="h-2 w-full border-b border-black absolute top-0 left-0"
                      style={{
                        backgroundColor: `var(--${nodeTypeColors[data.node.type]})`,
                      }}
                    />
                    <div className="p-6 pt-10">
                      <p className="font-mono text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2">ENTITY PROFILE</p>
                      <h1 className="text-3xl sm:text-4xl font-display font-bold uppercase leading-none text-black break-words">
                        {data.node.name}
                      </h1>
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <TypeBadge type={data.node.type} />
                        <span className="font-mono text-[11px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 border border-gray-300">
                          ID: {data.node.id}
                        </span>
                      </div>
                      {properties.length > 0 && (
                        <div className="mt-8 border-t border-black pt-5">
                          <p className="font-mono text-[10px] uppercase font-bold tracking-widest text-gray-500">PROPERTIES</p>
                          <dl className="mt-4">
                            {properties.map(([key, value]) => (
                              <div
                                key={key}
                                className="grid grid-cols-[100px_1fr] gap-4 border-b border-gray-200 py-3"
                              >
                                <dt className="font-mono text-[11px] font-bold uppercase text-gray-500">
                                  {key}
                                </dt>
                                <dd className="font-mono text-[13px] font-bold uppercase text-black break-words">
                                  {value}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      )}
                      <div className="mt-8 border-t border-black pt-5">
                        <p className="font-mono text-[10px] uppercase font-bold tracking-widest text-gray-500">SYSTEM METADATA</p>
                        <dl className="mt-4">
                          <div className="grid grid-cols-[100px_1fr] gap-4 border-b border-gray-200 py-3">
                            <dt className="font-mono text-[11px] font-bold uppercase text-gray-500">
                              SOURCE
                            </dt>
                            <dd className="font-mono text-[13px] font-bold uppercase text-black">
                              WorkGraph Store
                            </dd>
                          </div>
                          <div className="grid grid-cols-[100px_1fr] gap-4 py-3">
                            <dt className="font-mono text-[11px] font-bold uppercase text-gray-500">
                              STATE
                            </dt>
                            <dd className="flex items-center gap-2 font-mono text-[13px] font-bold uppercase text-black">
                              <span className="h-2 w-2 border border-current bg-green-500"></span>
                              Up to date
                            </dd>
                          </div>
                        </dl>
                      </div>
                      <div className="mt-8 flex flex-col gap-3">
                        <button
                          onClick={() => setShowEditModal(true)}
                          className="flex w-full items-center justify-center border border-black bg-black py-3 px-4 font-mono text-[12px] font-bold uppercase text-white transition-colors hover:bg-white hover:text-black cursor-pointer"
                        >
                          [ EDIT RECORD ]
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                          className="flex w-full items-center justify-center border border-black bg-white py-3 px-4 font-mono text-[12px] font-bold uppercase text-black transition-colors hover:bg-gray-100 cursor-pointer"
                        >
                          {copied ? "[ COPIED! ]" : "[ SHARE LINK ]"}
                        </button>
                      </div>
                    </div>
                  </section>
                </aside>
                <section className="min-w-0">
                  <div className="mb-5 flex flex-col justify-between gap-3 border-b border-black pb-4 sm:flex-row sm:items-end">
                    <div>
                      <p className="font-mono text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2">CONTEXT MAP</p>
                      <h2 className="text-2xl sm:text-3xl font-display font-bold uppercase leading-none text-black break-words">
                        Connections For {data.node.name}
                      </h2>
                      <p className="mt-3 font-mono text-sm uppercase text-black/70">
                        Inspect a relationship to keep exploring.
                      </p>
                    </div>
                    <span className="border border-black bg-white px-3 py-1 font-mono text-[11px] font-bold uppercase text-black whitespace-nowrap">
                      {data.connections.length} CONNECTIONS
                    </span>
                  </div>
                  {data.connections.length ? (
                    <GraphView
                      centerNode={data.node}
                      connections={data.connections}
                    />
                  ) : (
                    <EmptyState
                      title="No connections yet"
                      description="This entity has no relationships in the graph."
                    />
                  )}
                </section>
              </div>
            </>
          ) : null}
        </main>
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all">
            <div className="w-full max-w-md border-2 border-black bg-white p-8 shadow-none relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-black"></div>
              <h3 className="font-display text-2xl font-bold uppercase text-black mt-2">
                Editing Disabled
              </h3>
              <p className="mt-4 font-mono text-sm uppercase text-gray-600 leading-relaxed border-l-2 border-black pl-4">
                The WorkGraph prototype is currently running in read-only
                visualization mode to preserve the sample dataset.
              </p>
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="border border-black bg-black px-6 py-3 font-mono text-[12px] font-bold uppercase text-white transition-colors hover:bg-white hover:text-black cursor-pointer"
                >
                  [ ACKNOWLEDGE ]
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
