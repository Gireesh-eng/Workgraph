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
    const load = () => { if (!type || !id) return; setLoading(true); setError(null); getEntity(type, id).then(setData).catch((err) => setError(err.message)).finally(() => setLoading(false)); };
    useEffect(load, [type, id]);

    const properties = useMemo(() => data ? Object.entries(data.node).filter(([key, value]) => !["name", "id", "type"].includes(key) && value) : [], [data]);

    return <div className="min-h-screen bg-paper"><AppHeader />
        <main className="mx-auto max-w-[1360px] px-6 py-8 lg:px-10">
            {loading ? <LoadingState type="detail" /> : error ? <ErrorState message={error === "Not found" ? "This entity doesn't exist." : "Couldn't reach the server."} onRetry={load} /> : data ? <>
                <nav className="mb-5 flex items-center gap-2 text-[13px] font-medium text-ink-600"><Link className="hover:text-ink-900" to="/">Home</Link><span className="text-ink-400">/</span><Link className="hover:text-ink-900" to="/search">Search</Link><span className="text-ink-400">/</span><span className="truncate text-ink-900">{data.node.name}</span></nav>
                <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
                    <aside className="xl:sticky xl:top-20 xl:h-fit"><section className="card overflow-hidden"><div className="h-1.5" style={{ backgroundColor: `var(--${nodeTypeColors[data.node.type]})` }} /><div className="p-6"><p className="eyebrow text-person">Entity profile</p><h1 className="mt-2 text-[30px] font-semibold leading-9 tracking-[-.025em] text-ink-900">{data.node.name}</h1><div className="mt-4 flex flex-wrap items-center gap-3"><TypeBadge type={data.node.type} /><span className="font-mono text-[12px] text-ink-400">{data.node.id}</span></div>{properties.length > 0 && <div className="mt-6 border-t border-border pt-5"><p className="eyebrow">Properties</p><dl className="mt-3">{properties.map(([key, value]) => <div key={key} className="grid grid-cols-[110px_1fr] gap-4 border-b border-border py-3.5"><dt className="font-mono text-[11px] font-medium uppercase tracking-[.04em] text-ink-600">{key}</dt><dd className="text-[15px] font-medium leading-5 text-ink-900">{value}</dd></div>)}</dl></div>}<div className="mt-6 border-t border-border pt-5"><p className="eyebrow">System Metadata</p><dl className="mt-3"><div className="grid grid-cols-[110px_1fr] gap-4 border-b border-border py-3.5"><dt className="font-mono text-[11px] font-medium uppercase tracking-[.04em] text-ink-600">SOURCE</dt><dd className="text-[14px] font-medium text-ink-900">WorkGraph Store</dd></div><div className="grid grid-cols-[110px_1fr] gap-4 py-3.5"><dt className="font-mono text-[11px] font-medium uppercase tracking-[.04em] text-ink-600">SYNC STATE</dt><dd className="flex items-center gap-2 text-[14px] font-medium text-ink-900"><span className="h-2 w-2 rounded-full bg-technology"></span>Up to date</dd></div></dl></div><div className="mt-6 flex flex-col gap-2.5"><button onClick={() => setShowEditModal(true)} className="flex w-full items-center justify-center rounded-control bg-ink-900 py-2.5 text-[14px] font-semibold text-paper transition-all hover:bg-ink-800 active:scale-[0.98]">Edit Profile</button><button onClick={() => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="flex w-full items-center justify-center rounded-control border border-border bg-surface py-2.5 text-[14px] font-semibold text-ink-700 transition-all hover:bg-[#F3EBE1] active:scale-[0.98]">{copied ? "Copied!" : "Share Link"}</button></div></div></section></aside>
                    <section className="min-w-0"><div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="eyebrow text-person">Context map</p><h2 className="mt-1 text-[27px] font-semibold tracking-[-.02em]">How {data.node.name} connects</h2><p className="mt-1 text-[15px] text-ink-600">Inspect a relationship or open an entity to keep exploring.</p></div><span className="rounded-control border border-border bg-surface px-3 py-2 font-mono text-[12px] text-ink-600">{data.connections.length} connections</span></div>{data.connections.length ? <GraphView centerNode={data.node} connections={data.connections} /> : <EmptyState title="No connections yet" description="This entity has no relationships in the graph." />}</section>
                </div>
            </> : null}
        </main>
        {showEditModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#252321]/40 p-4 backdrop-blur-[2px] transition-all"><div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-xl"><h3 className="text-[19px] font-semibold tracking-[-.015em] text-ink-900">Editing disabled</h3><p className="mt-2 text-[14px] leading-relaxed text-ink-600">The WorkGraph prototype is currently running in read-only visualization mode to preserve the sample dataset.</p><div className="mt-6 flex justify-end"><button onClick={() => setShowEditModal(false)} className="rounded-control bg-ink-900 px-5 py-2.5 text-[14px] font-semibold text-paper transition-all hover:bg-ink-800 active:scale-[.98]">Got it</button></div></div></div>}
    </div>;
}
