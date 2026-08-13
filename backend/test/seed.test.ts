import { getDriver, closeDriver } from "../src/db/driver";
// We don't want to actually run the real seed with all data, 
// just a small check that nodes merge idempotently. It requires DB running.

describe("Seed idempotency check", () => {
    let session: any;

    beforeAll(() => {
        // Assume DB is configured via .env
        const driver = getDriver();
        session = driver.session();
    });

    afterAll(async () => {
        if (session) await session.close();
        await closeDriver();
    });

    test("Running a MERGE constraint test twice behaves idempotently", async () => {
        await session.run(`CREATE CONSTRAINT IF NOT EXISTS FOR (p:Person) REQUIRE p.id IS UNIQUE`);

        // Insert first time
        await session.run(`MERGE (p:Person {id: 'test-p1'}) SET p.name = 'Test Person'`);

        // Insert second time (should merge)
        await session.run(`MERGE (p:Person {id: 'test-p1'}) SET p.name = 'Test Person Updated'`);

        // Check count
        const result = await session.run(`MATCH (p:Person {id: 'test-p1'}) RETURN count(p) as c`);
        const count = result.records[0].get("c").toNumber();
        expect(count).toBe(1);

        // Cleanup
        await session.run(`MATCH (p:Person {id: 'test-p1'}) DELETE p`);
    });
});
