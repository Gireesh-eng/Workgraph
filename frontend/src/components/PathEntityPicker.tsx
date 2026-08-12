import { useEffect, useMemo, useRef, useState } from "react";
import type { GraphNode } from "../types";
import { nodeTypeColors } from "../types";

interface PathEntityPickerProps {
  label: string;
  value: string;
  nodes: GraphNode[];
  disabled?: boolean;
  onChange: (value: string) => void;
}

export default function PathEntityPicker({ label, value, nodes, disabled = false, onChange }: PathEntityPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = nodes.find((node) => node.id === value);
  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return nodes.slice(0, 8);
    return nodes.filter((node) => `${node.name} ${node.type}`.toLowerCase().includes(normalized)).slice(0, 12);
  }, [nodes, query]);

  useEffect(() => {
    const close = (event: MouseEvent) => { if (!rootRef.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const choose = (node: GraphNode) => { onChange(node.id); setQuery(""); setOpen(false); };
  return <div ref={rootRef} className="relative"><label className="eyebrow block">{label}</label>
    <button type="button" disabled={disabled} onClick={() => setOpen((current) => !current)} className={`field-control mt-2 flex items-center justify-between text-left disabled:cursor-wait disabled:opacity-60 ${open ? "border-ink-900 ring-[3px] ring-ink-900/10" : ""}`} aria-haspopup="listbox" aria-expanded={open}>
      <span className="flex min-w-0 items-center gap-3">{selected ? <><i className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: `var(--${nodeTypeColors[selected.type]})` }} /><span className="truncate">{selected.name}</span><span className="hidden font-mono text-[11px] text-ink-400 sm:inline">{selected.type}</span></> : <span className="font-normal text-ink-400">Select an entity</span>}</span>
      <svg className={`ml-3 h-4 w-4 shrink-0 text-ink-600 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m5 7 5 5 5-5" /></svg>
    </button>
    {open && <div className="absolute z-40 mt-2 w-full overflow-hidden rounded-control border border-border-strong bg-surface shadow-[0_14px_32px_rgba(55,43,33,.16)]">
      <div className="border-b border-border p-3"><div className="flex h-10 items-center rounded-[8px] border border-border bg-paper px-3 focus-within:border-ink-900 focus-within:ring-[3px] focus-within:ring-ink-900/10"><svg className="h-4 w-4 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search entities…" className="h-full min-w-0 flex-1 bg-transparent px-2 text-[14px] outline-none placeholder:text-ink-400" /></div></div>
      <div role="listbox" className="max-h-[288px] overflow-y-auto p-1.5">{matches.length ? matches.map((node) => <button key={node.id} type="button" role="option" aria-selected={node.id === value} onClick={() => choose(node)} className={`flex w-full items-center gap-3 rounded-[8px] px-3 py-2.5 text-left transition-colors ${node.id === value ? "bg-surface-sunken" : "hover:bg-paper"}`}><i className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: `var(--${nodeTypeColors[node.type]})` }} /><span className="min-w-0 flex-1 truncate text-[14px] font-semibold text-ink-900">{node.name}</span><span className="font-mono text-[11px] text-ink-400">{node.type}</span></button>) : <p className="px-3 py-6 text-center text-[14px] text-ink-600">No matching entities.</p>}</div>
    </div>}
  </div>;
}
