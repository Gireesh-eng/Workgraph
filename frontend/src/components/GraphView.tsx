import { useMemo, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Connection, GraphNode, NodeType } from "../types";
import { nodeTypeColors } from "../types";
import TypeBadge from "./TypeBadge";

const typeLabels: Record<NodeType, string> = {
  Person: "People", Team: "Teams", Project: "Projects", Task: "Tasks", Technology: "Technologies", Document: "Documents",
};

export default function GraphView({ centerNode, connections }: { centerNode: GraphNode; connections: Connection[] }) {
  const navigate = useNavigate();
  const graphContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [view, setView] = useState<"map" | "list">("map");

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      graphContainerRef.current?.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };
  const selected = selectedIndex === null ? null : connections[selectedIndex];
  const activeIndex = hoveredIndex ?? selectedIndex;
  const scale = connections.length <= 10 ? 1 : 1 + (connections.length - 10) * 0.04;
  const cx = 560 * scale;
  const cy = 360 * scale;
  const rx = 410 * scale;
  const ry = 265 * scale;
  const vw = 1120 * scale;
  const vh = 720 * scale;

  const points = useMemo(() => connections.map((_, index) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / connections.length;
    return { x: cx + rx * Math.cos(angle), y: cy + ry * Math.sin(angle), angle };
  }), [connections, cx, cy, rx, ry]);
  const counts = connections.reduce<Partial<Record<NodeType, number>>>((acc, connection) => {
    acc[connection.node.type] = (acc[connection.node.type] ?? 0) + 1;
    return acc;
  }, {});

  return <section className="card overflow-hidden">
    <div className="flex flex-col gap-4 border-b border-border bg-[#FCF9F5] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="eyebrow text-person">Connection explorer</p>
        <h2 className="mt-1 text-[21px] font-semibold leading-7 text-ink-900">Relationship map</h2>
        <p className="mt-1 text-[14px] text-ink-600">{connections.length} direct connections from this entity</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex rounded-control border border-border bg-surface p-1" role="group" aria-label="Choose graph view">
          <button onClick={() => setView("map")} className={`rounded-[7px] px-3 py-1.5 text-[13px] font-semibold ${view === "map" ? "bg-surface-sunken text-ink-900" : "text-ink-600"}`}>Map</button>
          <button onClick={() => setView("list")} className={`rounded-[7px] px-3 py-1.5 text-[13px] font-semibold ${view === "list" ? "bg-surface-sunken text-ink-900" : "text-ink-600"}`}>List</button>
        </div>
        <button onClick={() => setSelectedIndex(null)} className="icon-button">Clear selection</button>
      </div>
    </div>

    <div className="flex flex-wrap gap-x-5 gap-y-2 border-b border-border bg-surface px-6 py-3.5">
      {(Object.entries(counts) as [NodeType, number][]).map(([type, count]) => <span key={type} className="flex items-center gap-2 text-[13px] text-ink-600"><i className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: `var(--${nodeTypeColors[type]})` }} /><span>{typeLabels[type]}</span><b className="font-mono text-[12px] font-medium text-ink-900">{count}</b></span>)}
    </div>

    {view === "map" ? <div>
      <div ref={graphContainerRef} className={`relative overflow-hidden bg-[radial-gradient(circle_at_50%_50%,rgba(200,102,71,.055),transparent_44%)] ${isFullscreen ? "h-screen w-screen bg-[#F7F5F2]" : connections.length <= 3 ? "h-[500px] sm:h-[540px]" : "h-[640px] sm:h-[700px]"}`}>
        <div className="absolute left-5 top-5 z-10 rounded-control border border-border bg-surface/95 px-3 py-2 shadow-sm backdrop-blur">
          <p className="text-[12px] font-semibold text-ink-900">Click a node to inspect</p>
          <p className="mt-0.5 text-[11px] text-ink-600">Double-click to open its full page</p>
        </div>

        <button
          onClick={toggleFullscreen}
          className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-control border border-border bg-surface/95 text-ink-600 shadow-sm backdrop-blur transition-colors hover:text-ink-900"
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isFullscreen ? (
              <path d="M9 3v6H3M15 3v6h6M9 21v-6H3M15 21v-6h6" />
            ) : (
              <path d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4" />
            )}
          </svg>
        </button>

        <svg viewBox={`0 0 ${vw} ${vh}`} className="h-full w-full" role="img" aria-label={`Connections for ${centerNode.name}`}>
          <defs>
            {connections.map((_, index) => { const point = points[index]; return <clipPath key={`clip-def-${index}`} id={`node-clip-${index}`}><rect x={point.x - 108} y={point.y - 34} width="216" height="68" rx="11" /></clipPath>; })}
            <clipPath id="center-node-clip"><rect x={cx - 150} y={cy - 51} width="300" height="102" rx="14" /></clipPath>
          </defs>
          {connections.map((connection, index) => {
            const point = points[index];
            const isActive = index === activeIndex;
            const midX = (cx + point.x) / 2;
            const midY = (cy + point.y) / 2;
            const labelText = relationshipTitle(connection.relationship).toUpperCase();
            const rectWidth = labelText.length * 6.5 + 16;

            // Calculate exact visual gap positioning
            const dx = point.x - cx;
            const dy = point.y - cy;
            const arrowRatio = connection.direction === "out" ? 0.61 : 0.39;
            const arrowX = cx + dx * arrowRatio;
            const arrowY = cy + dy * arrowRatio;
            const arrowAngle = (Math.atan2(dy, dx) * 180) / Math.PI + (connection.direction === "in" ? 180 : 0);

            return <g key={`edge-${connection.node.id}-${index}`}>
              <line x1={cx} y1={cy} x2={point.x} y2={point.y} stroke={isActive ? "#B5522E" : "#9E9089"} strokeWidth={isActive ? "2.6" : "1.7"} />
              <g transform={`translate(${arrowX}, ${arrowY}) rotate(${arrowAngle})`}>
                <path d="M-5,-6 L7,0 L-5,6 Z" fill={isActive ? "#B5522E" : "#9E9089"} />
              </g>
              <rect x={midX - rectWidth / 2} y={midY - 11} width={rectWidth} height="22" rx="11" fill="#FFFDF9" stroke={isActive ? "#C86647" : "#111111"} strokeWidth={isActive ? "1.5" : "1"} />
              <text x={midX} y={midY + 3.5} fill={isActive ? "#C86647" : "#111111"} fontFamily="IBM Plex Mono" fontSize="9.5" fontWeight="600" textAnchor="middle">{labelText}</text>
            </g>;
          })}
          {connections.map((connection, index) => {
            const point = points[index];
            const isActive = index === activeIndex;
            const color = `var(--${nodeTypeColors[connection.node.type]})`;
            return <g key={`node-${connection.node.id}-${index}`} className="cursor-pointer" onClick={() => setSelectedIndex(index)} onDoubleClick={() => navigate(`/entity/${connection.node.type}/${connection.node.id}`)} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
              <rect x={point.x - 108} y={point.y - 34} width="216" height="68" rx="11" fill="#FFFDF9" stroke={isActive ? "#C86647" : "#E3DDD5"} strokeWidth={isActive ? "2.15" : "1.25"} />
              <rect x={point.x - 108} y={point.y - 34} width="5" height="68" clipPath={`url(#node-clip-${index})`} fill={color} />
              <text x={point.x - 89} y={point.y - 4} fill="#252321" fontFamily="Manrope" fontSize="15.5" fontWeight="600">{truncate(connection.node.name, 21)}</text>
              <text x={point.x - 89} y={point.y + 18} fill="#6B625B" fontFamily="IBM Plex Mono" fontSize="10.5" fontWeight="500">{connection.node.type.toUpperCase()}</text>
            </g>;
          })}
          <rect x={cx - 150} y={cy - 51} width="300" height="102" rx="14" fill="#FFF9F5" stroke="#C86647" strokeWidth="2.25" />
          <rect x={cx - 150} y={cy - 51} width="6" height="102" clipPath="url(#center-node-clip)" fill={`var(--${nodeTypeColors[centerNode.type]})`} />
          <text x={cx - 119} y={cy - 6} fill="#252321" fontFamily="Manrope" fontSize="20" fontWeight="600">{truncate(centerNode.name, 25)}</text>
          <text x={cx - 119} y={cy + 23} fill="#6B625B" fontFamily="IBM Plex Mono" fontSize="11.5" fontWeight="500">FOCUSED {centerNode.type.toUpperCase()}</text>
        </svg>
      </div>
      {selected && <ConnectionInspector selected={selected} onOpen={() => navigate(`/entity/${selected.node.type}/${selected.node.id}`)} />}
    </div> : <ConnectionList connections={connections} selectedIndex={selectedIndex} onSelect={setSelectedIndex} onOpen={(connection) => navigate(`/entity/${connection.node.type}/${connection.node.id}`)} />}
  </section>;
}

function ConnectionInspector({ selected, onOpen }: { selected: Connection; onOpen: () => void }) {
  const node = selected.node;
  return <aside className="border-t border-border bg-[#FCF9F5] px-6 py-5"><div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-center"><div><p className="eyebrow">Selected connection</p><div className="mt-2 flex items-center gap-3"><span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: `var(--${nodeTypeColors[node.type]})` }} /><div className="min-w-0"><h3 className="truncate text-[18px] font-semibold text-ink-900">{node.name}</h3><p className="mt-0.5 font-mono text-[12px] text-ink-400">{node.id}</p></div><TypeBadge type={node.type} /></div></div><div className="border-l-0 border-border md:border-l md:pl-5"><p className="eyebrow">Relationship</p><p className="mt-2 text-[15px] font-semibold text-ink-900">{relationshipTitle(selected.relationship)}</p><p className="mt-1 text-[13px] leading-5 text-ink-600">This connection links the focused entity and {node.name}.</p></div><button onClick={onOpen} className="h-11 rounded-control bg-ink-900 px-5 text-[14px] font-semibold text-paper transition-transform duration-120 hover:scale-[1.01] active:scale-[.98]">Open {node.type}</button></div></aside>;
}

function ConnectionList({ connections, selectedIndex, onSelect, onOpen }: { connections: Connection[]; selectedIndex: number | null; onSelect: (index: number) => void; onOpen: (connection: Connection) => void }) {
  return <div className="divide-y divide-border">{connections.map((connection, index) => {
    return (
      <div key={`${connection.node.id}-${index}`} className={`flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center ${selectedIndex === index ? "bg-person/[.045]" : "bg-surface"}`}>
        <button onClick={() => onSelect(index)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
          <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: `var(--${nodeTypeColors[connection.node.type]})` }} />
          <div className="min-w-0">
            <p className="truncate text-[16px] font-semibold text-ink-900">{connection.node.name}</p>
            <p className="mt-1 font-mono text-[12px] text-ink-400">{connection.node.id}</p>
          </div>
        </button>
        <div className="sm:w-[160px]">
          <TypeBadge type={connection.node.type}>{relationshipTitle(connection.relationship)}</TypeBadge>
        </div>
        <button className="icon-button self-start sm:self-auto" onClick={() => onOpen(connection)}>Open</button>
      </div>
    );
  })}</div>;
}

function relationshipTitle(value: string) {
  let cleaned = value.replace(/^(HAS_|HAVE_|IS_)/, "").replaceAll("_", " ").toLowerCase();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}
function truncate(value: string, max: number) { return value.length > max ? `${value.slice(0, max - 1)}…` : value; }
