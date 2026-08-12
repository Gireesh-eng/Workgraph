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

        // --- Nodes ---

        console.log("Creating Person nodes...");
        for (const person of people) {
            await session.run(
                `MERGE (p:Person {id: $id}) SET p.name = $name, p.role = $role`,
                person
            );
        }
        console.log(`  ✓ ${people.length} people`);

        console.log("Creating Team nodes...");
        for (const team of teams) {
            await session.run(
                `MERGE (t:Team {id: $id}) SET t.name = $name`,
                team
            );
        }
        console.log(`  ✓ ${teams.length} teams`);

        console.log("Creating Project nodes...");
        for (const project of projects) {
            await session.run(
                `MERGE (p:Project {id: $id}) SET p.name = $name, p.status = $status`,
                project
            );
        }
        console.log(`  ✓ ${projects.length} projects`);

        console.log("Creating Task nodes...");
        for (const task of tasks) {
            // MERGE not CREATE — re-running the seed script is always safe
            await session.run(
                `MERGE (t:Task {id: $id}) SET t.title = $title, t.status = $status, t.name = $title`,
                task
            );
        }
        console.log(`  ✓ ${tasks.length} tasks`);

        console.log("Creating Technology nodes...");
        for (const tech of technologies) {
            await session.run(
                `MERGE (t:Technology {id: $id}) SET t.name = $name`,
                tech
            );
        }
        console.log(`  ✓ ${technologies.length} technologies`);

        console.log("Creating Document nodes...");
        for (const doc of documents) {
            await session.run(
                `MERGE (d:Document {id: $id}) SET d.title = $title, d.name = $title`,
                doc
            );
        }
        console.log(`  ✓ ${documents.length} documents`);

        // --- Relationships ---

        console.log("\nCreating relationships...");
        for (const rel of relationships) {
            // Using parameterized MATCH with dynamic relationship type
            // The relationship type must be part of the Cypher string (not a parameter),
            // but the node IDs are always parameterized to prevent injection.
            const validTypes = [
                "MEMBER_OF", "WORKS_ON", "OWNS", "HAS_TASK",
                "ASSIGNED_TO", "USES", "DOCUMENTED_BY", "DEPENDS_ON",
            ];

            if (!validTypes.includes(rel.type)) {
                console.warn(`  ⚠ Skipping unknown relationship type: ${rel.type}`);
                continue;
            }

            await session.run(
                `MATCH (a {id: $from}), (b {id: $to})
         MERGE (a)-[:${rel.type}]->(b)`,
                { from: rel.from, to: rel.to }
            );
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
