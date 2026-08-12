import { getDriver } from "./driver";
import { GraphNode, Connection, SearchResult, NodeType, StatsResponse } from "../types";

// Helper to extract the primary label from a Neo4j node
function toNodeType(labels: string[]): NodeType {
    const validTypes: NodeType[] = ["Person", "Team", "Project", "Task", "Technology", "Document"];
    return (labels.find((l) => validTypes.includes(l as NodeType)) as NodeType) ?? "Person";
}

// Helper to map a Neo4j record's node to our GraphNode shape
function toGraphNode(record: any, key: string = "n"): GraphNode {
    const node = record.get(key);
    const labels: string[] = record.has("types") ? record.get("types") : node.labels;
    const props = node.properties;
    return {
        type: toNodeType(labels),
        id: props.id,
        name: props.name ?? props.title ?? "Untitled",
        ...(props.role && { role: props.role }),
        ...(props.status && { status: props.status }),
        ...(props.title && { title: props.title }),
    };
}

/**
 * Query 1 — Direct connections (1-hop)
 * Powers the entity detail page. Returns the center node and all its immediate neighbors.
 */
export async function getEntityWithConnections(id: string) {
    const driver = getDriver();
    const session = driver.session();
    try {
        // First get the node itself
        const nodeResult = await session.run(
            `MATCH (n {id: $id}) RETURN n, labels(n) AS types`,
            { id }
        );

        if (nodeResult.records.length === 0) {
            return null;
        }

        const nodeRecord = nodeResult.records[0];
        const node = toGraphNode(nodeRecord);

        // Then get all direct connections
        const connResult = await session.run(
            `MATCH (n {id: $id})-[r]-(connected)
       RETURN type(r) AS relType,
              CASE WHEN startNode(r) = n THEN 'out' ELSE 'in' END AS direction,
              connected,
              labels(connected) AS connectedTypes`,
            { id }
        );

        const connections: Connection[] = connResult.records.map((rec: any) => {
            const connectedNode = rec.get("connected");
            const connectedProps = connectedNode.properties;
            const connectedLabels: string[] = rec.get("connectedTypes");

            return {
                relationship: rec.get("relType"),
                direction: rec.get("direction") as "in" | "out",
                node: {
                    type: toNodeType(connectedLabels),
                    id: connectedProps.id,
                    name: connectedProps.name ?? connectedProps.title ?? "Untitled",
                    ...(connectedProps.role && { role: connectedProps.role }),
                    ...(connectedProps.status && { status: connectedProps.status }),
                    ...(connectedProps.title && { title: connectedProps.title }),
                },
            };
        });

        return { node, connections };
    } finally {
        await session.close();
    }
}

/**
 * Query 2 — Search across all node types
 * Matches on name or title properties, case-insensitive.
 */
export async function searchAll(query: string): Promise<SearchResult[]> {
    const driver = getDriver();
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (n)
       WHERE toLower(n.name) CONTAINS toLower($query)
          OR toLower(n.title) CONTAINS toLower($query)
       RETURN n, labels(n) AS types
       LIMIT 20`,
            { query }
        );

        // For each result, build context by checking its relationships
        const results: SearchResult[] = [];
        for (const record of result.records) {
            const graphNode = toGraphNode(record);

            // Get a single relationship for context
            const contextResult = await session.run(
                `MATCH (n {id: $id})-[r]-(other)
         RETURN type(r) AS relType, other.name AS otherName, labels(other) AS otherTypes
         LIMIT 1`,
                { id: graphNode.id }
            );

            let context = "";
            if (contextResult.records.length > 0) {
                const cr = contextResult.records[0];
                const rel = cr.get("relType");
                const otherName = cr.get("otherName");
                const otherType = toNodeType(cr.get("otherTypes"));

                // Build human-readable context
                if (rel === "MEMBER_OF") context = `Member of ${otherName}`;
                else if (rel === "WORKS_ON") context = `Works on ${otherName}`;
                else if (rel === "OWNS") context = `Owned by ${otherName}`;
                else if (rel === "HAS_TASK") context = `Part of ${otherName}`;
                else if (rel === "ASSIGNED_TO") context = `Assigned to ${otherName}`;
                else if (rel === "USES") context = `Uses ${otherName}`;
                else if (rel === "DOCUMENTED_BY") context = `Documented by ${otherName}`;
                else if (rel === "DEPENDS_ON") context = `Depends on ${otherName}`;
                else context = `Connected to ${otherName}`;
            }

            results.push({
                type: graphNode.type,
                id: graphNode.id,
                name: graphNode.name,
                context,
            });
        }

        return results;
    } finally {
        await session.close();
    }
}

/**
 * Query 3 — Multi-hop: technologies a project's tasks use (2 hops)
 * Demonstrates a traversal that would need two JOINs in SQL.
 */
export async function getProjectTechnologies(projectId: string): Promise<GraphNode[]> {
    const driver = getDriver();
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (p:Project {id: $id})-[:HAS_TASK]->(t:Task)-[:USES]->(tech:Technology)
       RETURN DISTINCT tech, labels(tech) AS types`,
            { id: projectId }
        );

        return result.records.map((rec: any) => {
            const props = rec.get("tech").properties;
            return { type: "Technology" as NodeType, id: props.id, name: props.name };
        });
    } finally {
        await session.close();
    }
}

/**
 * Query 4 — Dependency chain (variable depth, 1-5 hops)
 * The standout "awkward in SQL" query: [:DEPENDS_ON*1..5] follows the relationship
 * 1 to 5 times at whatever depth exists. SQL would need a recursive CTE.
 */
export async function getDependencyChain(taskId: string): Promise<GraphNode[]> {
    const driver = getDriver();
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH path = (t:Task {id: $id})-[:DEPENDS_ON*1..5]-(blocker:Task)
       RETURN DISTINCT blocker, labels(blocker) AS types`,
            { id: taskId }
        );

        return result.records.map((rec: any) => {
            const props = rec.get("blocker").properties;
            return {
                type: "Task" as NodeType,
                id: props.id,
                name: props.name ?? props.title ?? "Untitled",
                ...(props.status && { status: props.status }),
                ...(props.title && { title: props.title }),
            };
        });
    } finally {
        await session.close();
    }
}

/**
 * Query 5 — Cross-team context (multi-hop through ownership)
 * Find all people on the team that owns a given project.
 */
export async function getProjectTeamMembers(projectId: string): Promise<GraphNode[]> {
    const driver = getDriver();
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (proj:Project {id: $id})<-[:OWNS]-(team:Team)<-[:MEMBER_OF]-(person:Person)
       RETURN DISTINCT person, labels(person) AS types`,
            { id: projectId }
        );

        return result.records.map((rec: any) => {
            const props = rec.get("person").properties;
            return {
                type: "Person" as NodeType,
                id: props.id,
                name: props.name,
                ...(props.role && { role: props.role }),
            };
        });
    } finally {
        await session.close();
    }
}

/**
 * Stats — aggregate counts for the homepage
 */
export async function getStats(): Promise<StatsResponse> {
    const driver = getDriver();
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (n)
       WITH labels(n)[0] AS label
       RETURN label, count(*) AS count`
        );

        const counts: Record<string, number> = {};
        result.records.forEach((rec: any) => {
            counts[rec.get("label")] = rec.get("count").toNumber
                ? rec.get("count").toNumber()
                : Number(rec.get("count"));
        });

        return {
            people: counts["Person"] ?? 0,
            projects: counts["Project"] ?? 0,
            tasks: counts["Task"] ?? 0,
            technologies: counts["Technology"] ?? 0,
        };
    } finally {
        await session.close();
    }
}

/**
 * Shortest path between two nodes
 */
export async function findShortestPath(fromId: string, toId: string) {
    const driver = getDriver();
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (a {id: $from}), (b {id: $to}),
             path = shortestPath((a)-[*..10]-(b))
       RETURN nodes(path) AS nodes, relationships(path) AS rels`,
            { from: fromId, to: toId }
        );

        if (result.records.length === 0) {
            return null;
        }

        const record = result.records[0];
        const nodes = record.get("nodes");
        const rels = record.get("rels");

        const hops = nodes.map((node: any, i: number) => {
            const props = node.properties;
            const hop: any = {
                node: {
                    type: toNodeType(node.labels),
                    id: props.id,
                    name: props.name ?? props.title ?? "Untitled",
                    ...(props.role && { role: props.role }),
                    ...(props.status && { status: props.status }),
                    ...(props.title && { title: props.title }),
                },
            };

            if (i < rels.length) {
                hop.relationship = rels[i].type;
                hop.direction = rels[i].start.toString() === node.elementId ? "out" : "in";
            }

            return hop;
        });

        return { path: hops };
    } finally {
        await session.close();
    }
}

/**
 * Get all nodes (used for path finder dropdowns)
 */
export async function getAllNodes(): Promise<GraphNode[]> {
    const driver = getDriver();
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (n) RETURN n, labels(n) AS types ORDER BY labels(n)[0], n.name LIMIT 100`
        );

        return result.records.map((rec: any) => toGraphNode(rec));
    } finally {
        await session.close();
    }
}
