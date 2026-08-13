import type { NodeType } from "../types";

export default function TypeBadge({ type, children }: { type: NodeType; children?: string }) { return <span className="entity-badge bg-white text-black border-black transition-colors">{children ?? type}</span>; }
