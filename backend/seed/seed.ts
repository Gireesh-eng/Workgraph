import dotenv from "dotenv";
import { getDriver, closeDriver } from "../src/db/driver";
import {
    people,
    teams,
    projects,
    tasks,
    technologies,
    documents,
    relationships,
} from "./data";

dotenv.config();

async function seed() {
    const driver = getDriver();
    const session = driver.session();

    try {
        console.log("🌱 Seeding WorkGraph database...\n");

        console.log("Ensuring uniqueness constraints...");
        const constraints = [
            `CREATE CONSTRAINT person_id_unique IF NOT EXISTS FOR (p:Person) REQUIRE p.id IS UNIQUE`,
            `CREATE CONSTRAINT team_id_unique IF NOT EXISTS FOR (t:Team) REQUIRE t.id IS UNIQUE`,
            `CREATE CONSTRAINT project_id_unique IF NOT EXISTS FOR (pr:Project) REQUIRE pr.id IS UNIQUE`,
            `CREATE CONSTRAINT task_id_unique IF NOT EXISTS FOR (ta:Task) REQUIRE ta.id IS UNIQUE`,
            `CREATE CONSTRAINT technology_id_unique IF NOT EXISTS FOR (te:Technology) REQUIRE te.id IS UNIQUE`,
            `CREATE CONSTRAINT document_id_unique IF NOT EXISTS FOR (d:Document) REQUIRE d.id IS UNIQUE`,
        ];

        for (const query of constraints) {
            await session.run(query);
        }
        console.log("  ✓ Constraints ensured\n");

        // --- Nodes ---

        const batchSize = 1000;

        const batchCreateNodes = async (
            label: string,
            items: any[],
            queryBuilder: (l: string) => string,
        ) => {
            console.log(`Creating ${label} nodes...`);
            for (let i = 0; i < items.length; i += batchSize) {
                const batch = items.slice(i, i + batchSize);
                await session.writeTransaction(async (tx) => {
                    await tx.run(queryBuilder(label), { batch });
                });
            }
            console.log(`  ✓ ${items.length} ${label.toLowerCase()}`);
        };

        await batchCreateNodes(
            "Person",
            people,
            (l: string) =>
                `UNWIND $batch AS p MERGE (n:${l} {id: p.id}) SET n.name = p.name, n.role = p.role`,
        );
        await batchCreateNodes(
            "Team",
            teams,
            (l: string) =>
                `UNWIND $batch AS p MERGE (n:${l} {id: p.id}) SET n.name = p.name`,
        );
        await batchCreateNodes(
            "Project",
            projects,
            (l: string) =>
                `UNWIND $batch AS p MERGE (n:${l} {id: p.id}) SET n.name = p.name, n.status = p.status`,
        );
        await batchCreateNodes(
            "Task",
            tasks,
            (l: string) =>
                `UNWIND $batch AS p MERGE (n:${l} {id: p.id}) SET n.title = p.title, n.status = p.status, n.name = p.title`,
        );
        await batchCreateNodes(
            "Technology",
            technologies,
            (l: string) =>
                `UNWIND $batch AS p MERGE (n:${l} {id: p.id}) SET n.name = p.name`,
        );
        await batchCreateNodes(
            "Document",
            documents,
            (l: string) =>
                `UNWIND $batch AS p MERGE (n:${l} {id: p.id}) SET n.title = p.title, n.name = p.title`,
        );

        // --- Relationships ---

        console.log("\nCreating relationships...");
        const validTypes = [
            "MEMBER_OF",
            "WORKS_ON",
            "OWNS",
            "HAS_TASK",
            "ASSIGNED_TO",
            "USES",
            "DOCUMENTED_BY",
            "DEPENDS_ON",
        ];

        const relsByType: Record<string, any[]> = {};
        for (const rel of relationships) {
            if (!validTypes.includes(rel.type)) {
                console.warn(`  ⚠ Skipping unknown relationship type: ${rel.type}`);
                continue;
            }
            if (!relsByType[rel.type]) relsByType[rel.type] = [];
            relsByType[rel.type].push({ from: rel.from, to: rel.to });
        }

        for (const type of Object.keys(relsByType)) {
            const relBatch = relsByType[type];
            for (let i = 0; i < relBatch.length; i += batchSize) {
                const batch = relBatch.slice(i, i + batchSize);
                await session.writeTransaction(async (tx) => {
                    await tx.run(
                        `UNWIND $batch AS rel
                         MATCH (a {id: rel.from}), (b {id: rel.to})
                         MERGE (a)-[:${type}]->(b)`,
                        { batch },
                    );
                });
            }
        }
        console.log(`  ✓ ${relationships.length} relationships`);

        console.log("\n✅ Seed complete!");
    } catch (error) {
        console.error("❌ Seed failed:", error);
        process.exit(1);
    } finally {
        await session.close();
        await closeDriver();
    }
}

seed();
