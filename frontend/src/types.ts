// Frontend types — mirrors backend/src/types.ts

export type NodeType = "Person" | "Team" | "Project" | "Task" | "Technology" | "Document";

export interface GraphNode {
    type: NodeType;
    id: string;
    name: string;
    role?: string;
    status?: string;
    title?: string;
    [key: string]: string | undefined;
}

export interface Connection {
    relationship: string;
    direction: "in" | "out";
    node: GraphNode;
}

export interface EntityResponse {
    node: GraphNode;
    connections: Connection[];
}

export interface SearchResult {
    type: NodeType;
    id: string;
    name: string;
    context: string;
}

export interface SearchResponse {
    results: SearchResult[];
}

export interface StatsResponse {
    people: number;
    teams: number;
    projects: number;
    tasks: number;
    technologies: number;
    documents: number;
    relationships: number;
}

export interface PathHop {
    node: GraphNode;
    relationship?: string;
    direction?: "in" | "out";
}

export interface PathResponse {
    path: PathHop[];
}

// Map node types to their Tailwind color class prefixes
export const nodeTypeColors: Record<NodeType, string> = {
    Person: "person",
    Team: "team",
    Project: "project",
    Task: "task",
    Technology: "technology",
    Document: "document",
};

// Map node types to display icons (simple emoji for now)
export const nodeTypeIcons: Record<NodeType, string> = {
    Person: "👤",
    Team: "👥",
    Project: "📁",
    Task: "✅",
    Technology: "⚙️",
    Document: "📄",
};
