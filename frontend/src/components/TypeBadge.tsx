import type { NodeType } from "../types";
import { nodeTypeColors } from "../types";
const styles: Record<string, string> = { person: "bg-person/10 text-person", team: "bg-team/10 text-team", project: "bg-project/10 text-project", task: "bg-task/10 text-task", technology: "bg-technology/10 text-technology", document: "bg-document/10 text-document" };
export default function TypeBadge({ type, children }: { type: NodeType; children?: string }) { return <span className={`entity-badge ${styles[nodeTypeColors[type]]}`}>{children ?? type}</span>; }
