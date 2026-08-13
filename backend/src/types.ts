// Shared TypeScript interfaces for the WorkGraph data model

export type NodeType = "Person" | "Team" | "Project" | "Task" | "Technology" | "Document";

export interface GraphNode {
    type: NodeType;
    id: string;
    name: string;
    [key: string]: string | undefined; // additional properties like role, status, title
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

export interface ErrorBody {
    error: {
        message: string;
        code: string;
    };
}
