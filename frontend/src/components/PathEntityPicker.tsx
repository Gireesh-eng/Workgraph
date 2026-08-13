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
  return <div ref={rootRef} className="relative"><label className="font-mono text-[10px] uppercase font-bold tracking-widest text-gray-500 block">{label}</label>
    <button type="button" disabled={disabled} onClick={() => setOpen((current) => !current)} className={`field-control mt-2 flex items-center justify-between text-left disabled:cursor-wait disabled:opacity-60 ${open ? "ring-2 ring-black border-black" : ""}`} aria-haspopup="listbox" aria-expanded={open}>
      <span className="flex min-w-0 items-center gap-3">{selected ? <><i className="h-1.5 w-1.5 shrink-0 border border-current" style={{ backgroundColor: `var(--${nodeTypeColors[selected.type]})` }} /><span className="truncate font-mono font-bold uppercase">{selected.name}</span><span className="hidden font-mono text-[11px] opacity-60 sm:inline uppercase">{selected.type}</span></> : <span className="font-mono uppercase text-gray-500">SELECT AN ENTITY</span>}</span>
      <svg className={`ml-3 h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m5 7 5 5 5-5" /></svg>
    </button>
    {open && <div className="absolute z-40 mt-1 w-full border-2 border-black bg-white shadow-none">
      <div className="border-b border-black p-2"><div className="flex h-10 items-center border border-black bg-[#f4f4f4] px-3 focus-within:ring-2 focus-within:ring-black"><svg className="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="SEARCH ENTITIES…" className="h-full min-w-0 flex-1 bg-transparent px-2 font-mono text-[12px] uppercase outline-none placeholder:text-gray-500" /></div></div>
      <div role="listbox" className="max-h-[288px] overflow-y-auto">{matches.length ? matches.map((node) => <button key={node.id} type="button" role="option" aria-selected={node.id === value} onClick={() => choose(node)} className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors border-b border-gray-200 last:border-0 cursor-pointer ${node.id === value ? "bg-black text-white" : "hover:bg-black hover:text-white"}`}><i className="h-1.5 w-1.5 shrink-0 border border-current" style={{ backgroundColor: `var(--${nodeTypeColors[node.type]})` }} /><span className="min-w-0 flex-1 truncate font-mono text-[13px] font-bold uppercase">{node.name}</span><span className="font-mono text-[11px] opacity-60 uppercase">{node.type}</span></button>) : <p className="px-3 py-6 text-center font-mono text-[12px] uppercase text-gray-500">No matching entities.</p>}</div>
    </div>}
  </div>;
}
