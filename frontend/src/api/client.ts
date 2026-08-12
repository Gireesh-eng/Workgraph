import type {
    StatsResponse,
    SearchResponse,
    EntityResponse,
    PathResponse,
    GraphNode,
} from "../types";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:3001";

async function apiGet<T>(path: string): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error?.message ?? "Something went wrong");
    }
    return res.json();
}

export async function getStats(): Promise<StatsResponse> {
    return apiGet<StatsResponse>("/api/stats");
}

export async function search(query: string): Promise<SearchResponse> {
    return apiGet<SearchResponse>(`/api/search?q=${encodeURIComponent(query)}`);
}

export async function getEntity(type: string, id: string): Promise<EntityResponse> {
    return apiGet<EntityResponse>(`/api/entity/${encodeURIComponent(type)}/${encodeURIComponent(id)}`);
}

export async function findPath(fromId: string, toId: string): Promise<PathResponse> {
    return apiGet<PathResponse>(`/api/path?from=${encodeURIComponent(fromId)}&to=${encodeURIComponent(toId)}`);
}

export async function getAllNodes(): Promise<{ nodes: GraphNode[] }> {
    return apiGet<{ nodes: GraphNode[] }>("/api/path/nodes");
}
