import { useMemo, useState, useRef, useEffect, useCallback } from "react";
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

  // Zoom/pan state for fullscreen
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const panOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleFullscreenChange = () => {
      const fs = !!document.fullscreenElement;
      setIsFullscreen(fs);
      if (!fs) {
        // Reset zoom/pan on exit
        setZoom(1);
        setPan({ x: 0, y: 0 });
      }
    };
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

  // Zoom handler (wheel)
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!isFullscreen) return;
    e.preventDefault();
    setZoom(prev => {
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      return Math.min(4, Math.max(0.3, prev + delta));
    });
  }, [isFullscreen]);

  // Pan handlers (mouse drag)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isFullscreen) return;
    isPanning.current = true;
    panStart.current = { x: e.clientX, y: e.clientY };
    panOffset.current = { ...pan };
  }, [isFullscreen, pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning.current) return;
    setPan({
      x: panOffset.current.x + (e.clientX - panStart.current.x),
      y: panOffset.current.y + (e.clientY - panStart.current.y),
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  const selected = selectedIndex === null ? null : connections[selectedIndex];
  const activeIndex = hoveredIndex ?? selectedIndex;

  // Improved scaling: gentler curve, minimum spacing preserved
  const n = connections.length;
  const scale = n <= 6 ? 1 : n <= 12 ? 1 + (n - 6) * 0.06 : 1.36 + (n - 12) * 0.04;
  const cx = 560 * scale;
  const cy = 360 * scale;
  const rx = 410 * scale;
  const ry = 265 * scale;
  const vw = 1120 * scale;
  const vh = 720 * scale;

  // Dynamic container height that follows viewBox proportions
  const containerHeight = n <= 3 ? 500 : n <= 6 ? 560 : Math.min(900, Math.round(560 * scale));

  const points = useMemo(() => connections.map((_, index) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / connections.length;
    return { x: cx + rx * Math.cos(angle), y: cy + ry * Math.sin(angle), angle };
  }), [connections, cx, cy, rx, ry]);
  const counts = connections.reduce<Partial<Record<NodeType, number>>>((acc, connection) => {
    acc[connection.node.type] = (acc[connection.node.type] ?? 0) + 1;
    return acc;
  }, {});

  return <section className="border border-black bg-transparent relative">
    <div className="flex flex-col gap-4 border-b-4 border-black bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-mono text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2">[ CONNECTION EXPLORER ]</p>
        <h2 className="text-3xl font-display font-bold uppercase leading-none text-black">Relationship map</h2>
        <p className="mt-3 font-mono text-sm uppercase text-gray-600">{connections.length} DIRECT CONNECTIONS FROM THIS ENTITY</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex border-2 border-black bg-white" role="group" aria-label="Choose graph view">
          <button onClick={() => setView("map")} className={`px-4 py-2 font-mono text-[12px] font-bold uppercase transition-colors border-r-2 border-black ${view === "map" ? "bg-black text-white" : "text-black hover:bg-black hover:text-white"}`}>MAP</button>
          <button onClick={() => setView("list")} className={`px-4 py-2 font-mono text-[12px] font-bold uppercase transition-colors ${view === "list" ? "bg-black text-white" : "text-black hover:bg-black hover:text-white"}`}>LIST</button>
        </div>
        <button onClick={() => setSelectedIndex(null)} className="border border-black bg-white px-3 py-2 font-mono text-[12px] font-bold uppercase text-black hover:bg-black hover:text-white transition-colors cursor-pointer">[ CLEAR ]</button>
      </div>
    </div>

    <div className="flex flex-wrap gap-x-6 gap-y-3 border-b border-black bg-white px-6 py-4">
      {(Object.entries(counts) as [NodeType, number][]).map(([type, count]) => <span key={type} className="flex items-center gap-2 text-[12px] font-mono font-bold uppercase text-gray-500"><i className="h-2 w-2 border border-current" style={{ backgroundColor: `var(--${nodeTypeColors[type]})` }} /><span>{typeLabels[type]}</span><b className="border border-black bg-gray-100 px-1 ml-1 text-[11px] text-black">{count}</b></span>)}
    </div>

    {view === "map" ? <div>
      <div
        ref={graphContainerRef}
        className={`relative overflow-hidden ${isFullscreen ? "h-screen w-screen grid-bg-brutal bg-[#f4f4f4]" : "bg-transparent"}`}
        style={isFullscreen ? undefined : { height: `${containerHeight}px` }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="absolute left-6 top-6 z-10 border-2 border-black bg-white px-4 py-3 shadow-none">
          <p className="font-display text-[14px] font-bold uppercase text-black">CLICK A NODE TO INSPECT</p>
          <p className="mt-1 font-mono text-[10px] uppercase text-gray-500">DOUBLE-CLICK TO OPEN ITS FULL PAGE</p>
        </div>

        {/* Fullscreen controls */}
        <div className="absolute right-6 top-6 z-10 flex items-center gap-2">
          {isFullscreen && (
            <>
              <button
                onClick={() => setZoom(prev => Math.min(4, prev + 0.2))}
                className="flex h-11 w-11 items-center justify-center border-2 border-black bg-white text-black transition-colors hover:bg-black hover:text-white cursor-pointer font-bold text-lg"
                title="Zoom in"
              >+</button>
              <button
                onClick={() => setZoom(prev => Math.max(0.3, prev - 0.2))}
                className="flex h-11 w-11 items-center justify-center border-2 border-black bg-white text-black transition-colors hover:bg-black hover:text-white cursor-pointer font-bold text-lg"
                title="Zoom out"
              >−</button>
              <button
                onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
                className="flex h-11 items-center justify-center border-2 border-black bg-white text-black transition-colors hover:bg-black hover:text-white cursor-pointer px-3 font-mono text-[11px] font-bold uppercase"
                title="Reset zoom"
              >RESET</button>
            </>
          )}
          <button
            onClick={toggleFullscreen}
            className="flex h-11 w-11 items-center justify-center border-2 border-black bg-white text-black transition-colors hover:bg-black hover:text-white cursor-pointer"
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
              {isFullscreen ? (
                <path d="M9 3v6H3M15 3v6h6M9 21v-6H3M15 21v-6h6" />
              ) : (
                <path d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4" />
              )}
            </svg>
          </button>
        </div>

        {/* Zoom indicator in fullscreen */}
        {isFullscreen && (
          <div className="absolute left-6 bottom-6 z-10 border-2 border-black bg-white px-4 py-2">
            <span className="font-mono text-[11px] font-bold uppercase text-gray-600">ZOOM: {Math.round(zoom * 100)}%</span>
          </div>
        )}

        <svg
          viewBox={`0 0 ${vw} ${vh}`}
          className="h-full w-full"
          role="img"
          aria-label={`Connections for ${centerNode.name}`}
          style={isFullscreen ? {
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transformOrigin: "center center",
            cursor: isPanning.current ? "grabbing" : "grab",
            transition: isPanning.current ? "none" : "transform 0.1s ease-out",
          } : undefined}
        >
          <defs>
            {connections.map((_, index) => { const point = points[index]; return <clipPath key={`clip-def-${index}`} id={`node-clip-${index}`}><rect x={point.x - 108} y={point.y - 34} width="216" height="68" rx="0" /></clipPath>; })}
            <clipPath id="center-node-clip"><rect x={cx - 150} y={cy - 51} width="300" height="102" rx="0" /></clipPath>
          </defs>
          {connections.map((connection, index) => {
            const point = points[index];
            const isActive = index === activeIndex;
            const labelText = relationshipTitle(connection.relationship).toUpperCase();
            const rectWidth = labelText.length * 7.5 + 24;
            // Calculate bounding box intersections for dynamic placement
            const dx = point.x - cx;
            const dy = point.y - cy;

            // Avoid division by zero
            const absDx = Math.max(Math.abs(dx), 0.001);
            const absDy = Math.max(Math.abs(dy), 0.001);

            // Calculate intersection parameters (t = 0 is center, t = 1 is outer node)
            const tCentral = Math.min(165 / absDx, 65 / absDy);
            const tOuter = Math.min(125 / absDx, 48 / absDy);

            // Place label exactly in the middle of the visual line segment between node borders
            const tLabel = (tCentral + (1 - tOuter)) / 2;
            const labelX = cx + dx * tLabel;
            const labelY = cy + dy * tLabel;

            // Place arrow just outside the target node's bounding box padding
            const tArrow = connection.direction === "out" ? 1 - tOuter : tCentral;
            const arrowX = cx + dx * tArrow;
            const arrowY = cy + dy * tArrow;
            const arrowAngle = (Math.atan2(dy, dx) * 180) / Math.PI + (connection.direction === "in" ? 180 : 0);

            return <g key={`edge-${connection.node.id}-${index}`}>
              <line x1={cx} y1={cy} x2={point.x} y2={point.y} stroke={isActive ? "#000000" : "#999999"} strokeWidth={isActive ? "3" : "1"} />
              <g transform={`translate(${arrowX}, ${arrowY}) rotate(${arrowAngle})`}>
                <path d="M-5,-6 L7,0 L-5,6 Z" fill={isActive ? "#000000" : "#999999"} stroke={isActive ? "#000000" : "#999999"} strokeWidth="1" strokeLinejoin="miter" />
              </g>
              <rect x={labelX - rectWidth / 2} y={labelY - 12} width={rectWidth} height="24" rx="0" fill="#FFFFFF" stroke={isActive ? "#000000" : "#666666"} strokeWidth={isActive ? "2" : "1"} />
              <text x={labelX} y={labelY + 3.5} fill={isActive ? "#000000" : "#666666"} fontFamily="JetBrains Mono, monospace" fontSize="9" fontWeight="800" textAnchor="middle">{labelText}</text>
            </g>;
          })}
          {connections.map((connection, index) => {
            const point = points[index];
            const isActive = index === activeIndex;
            const color = `var(--${nodeTypeColors[connection.node.type]})`;
            return <g key={`node-${connection.node.id}-${index}`} className="cursor-pointer" onClick={() => setSelectedIndex(index)} onDoubleClick={() => navigate(`/entity/${connection.node.type}/${connection.node.id}`)} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
              <rect x={point.x - 108} y={point.y - 34} width="216" height="68" rx="0" fill="#FFFFFF" stroke={isActive ? "#000000" : "#000000"} strokeWidth={isActive ? "4" : "1"} />
              <rect x={point.x - 108} y={point.y - 34} width="6" height="68" clipPath={`url(#node-clip-${index})`} fill={color} />
              <text x={point.x - 89} y={point.y - 4} fill="#000000" fontFamily="Archivo, sans-serif" fontSize="16" fontWeight="700">{truncate(connection.node.name, 21)}</text>
              <text x={point.x - 89} y={point.y + 18} fill="#666666" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="600">{connection.node.type.toUpperCase()}</text>
            </g>;
          })}
          <rect x={cx - 150} y={cy - 51} width="300" height="102" rx="0" fill="#FFFFFF" stroke="#000000" strokeWidth="4" />
          <rect x={cx - 150} y={cy - 51} width="8" height="102" clipPath="url(#center-node-clip)" fill={`var(--${nodeTypeColors[centerNode.type]})`} />
          <text x={cx - 124} y={cy - 4} fill="#000000" fontFamily="Archivo, sans-serif" fontSize="22" fontWeight="800">{truncate(centerNode.name, 23)}</text>
          <text x={cx - 124} y={cy + 24} fill="#666666" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="700">FOCUSED {centerNode.type.toUpperCase()}</text>
        </svg>
      </div>
      {selected && <ConnectionInspector selected={selected} onOpen={() => navigate(`/entity/${selected.node.type}/${selected.node.id}`)} />}
    </div> : <ConnectionList connections={connections} selectedIndex={selectedIndex} onSelect={setSelectedIndex} onOpen={(connection) => navigate(`/entity/${connection.node.type}/${connection.node.id}`)} />}
  </section>;
}

function ConnectionInspector({ selected, onOpen }: { selected: Connection; onOpen: () => void }) {
  const node = selected.node;
  return <aside className="border-t-4 border-black bg-white px-6 py-5"><div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-center"><div><p className="font-mono text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">[ SELECTED CONNECTION ]</p><div className="mt-2 flex items-center gap-3"><span className="h-3 w-3 shrink-0 border border-current" style={{ backgroundColor: `var(--${nodeTypeColors[node.type]})` }} /><div className="min-w-0"><h3 className="truncate font-display text-2xl font-bold uppercase text-black">{node.name}</h3><p className="mt-0.5 font-mono text-[12px] opacity-60 uppercase">{node.id}</p></div><TypeBadge type={node.type} /></div></div><div className="border-l-0 border-black md:border-l-2 md:pl-6"><p className="font-mono text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">RELATIONSHIP</p><p className="font-mono text-[13px] font-bold uppercase text-black mt-2">{relationshipTitle(selected.relationship)}</p><p className="mt-2 font-mono text-xs uppercase text-gray-600 leading-snug">This connection links the focused entity and {node.name}.</p></div><button onClick={onOpen} className="border-2 border-black bg-black px-6 py-3 font-mono text-[12px] font-bold uppercase text-white transition-colors hover:bg-white hover:text-black cursor-pointer">[ OPEN {node.type.toUpperCase()} ]</button></div></aside>;
}

function ConnectionList({ connections, selectedIndex, onSelect, onOpen }: { connections: Connection[]; selectedIndex: number | null; onSelect: (index: number) => void; onOpen: (connection: Connection) => void }) {
  return <div className="divide-y divide-black">{connections.map((connection, index) => {
    return (
      <div key={`${connection.node.id}-${index}`} className={`flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center transition-colors group cursor-pointer ${selectedIndex === index ? "bg-black text-white" : "bg-white hover:bg-black hover:text-white"}`} onClick={() => onSelect(index)}>
        <div className="flex min-w-0 flex-1 items-center gap-4 text-left">
          <span className="h-4 w-4 shrink-0 border border-current" style={{ backgroundColor: `var(--${nodeTypeColors[connection.node.type]})` }} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-xl font-bold uppercase">{connection.node.name}</p>
            <p className="mt-1 font-mono text-[11px] opacity-60 uppercase">ID: {connection.node.id}</p>
          </div>
        </div>
        <div className="sm:w-[160px] flex shrink-0 items-center">
          <TypeBadge type={connection.node.type}>{relationshipTitle(connection.relationship).toUpperCase()}</TypeBadge>
        </div>
        <button className={`border px-4 py-2 font-mono text-[11px] font-bold uppercase transition-colors sm:self-auto ${selectedIndex === index ? "border-white text-white hover:bg-white hover:text-black" : "border-black text-black group-hover:border-white group-hover:text-white group-hover:hover:bg-white group-hover:hover:text-black"}`} onClick={(e) => { e.stopPropagation(); onOpen(connection); }}>[ OPEN ]</button>
      </div>
    );
  })}</div>;
}

function relationshipTitle(value: string) {
  let cleaned = value.replace(/^(HAS_|HAVE_|IS_)/, "").replaceAll("_", " ").toLowerCase();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}
function truncate(value: string, max: number) { return value.length > max ? `${value.slice(0, max - 1)}…` : value; }
