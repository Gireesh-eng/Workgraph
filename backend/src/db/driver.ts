import neo4j, { Driver } from "neo4j-driver";
import dotenv from "dotenv";

dotenv.config();

let driver: Driver | null = null;

// Lazy singleton — created on first call, reused after that
export function getDriver(): Driver {
    if (!driver) {
        const uri = process.env.NEO4J_URI;
        const user = process.env.NEO4J_USER;
        const password = process.env.NEO4J_PASSWORD;

        if (!uri || !user || !password) {
            throw new Error(
                "Missing database credentials. Set NEO4J_URI, NEO4J_USER, and NEO4J_PASSWORD in .env",
            );
        }

        driver = neo4j.driver(uri, neo4j.auth.basic(user, password), {
            maxConnectionPoolSize: Number(process.env.NEO4J_POOL_SIZE ?? 50),
            connectionTimeout: Number(process.env.NEO4J_CONN_TIMEOUT_MS ?? 30000),
        });
    }
    return driver;
}

export async function closeDriver(): Promise<void> {
    if (driver) {
        await driver.close();
        driver = null;
    }
}
