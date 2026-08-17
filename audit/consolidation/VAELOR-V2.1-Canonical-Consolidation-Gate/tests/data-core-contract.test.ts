import { PostgresDataStore } from "../services/core/src/data/postgres-data-store.js";

class FakeClient {
  public statements: string[] = [];
  async query<T = Record<string, unknown>>(sql: string, _params?: unknown[]): Promise<{ rows: T[]; rowCount: number }> {
    this.statements.push(sql);
    return { rows: [], rowCount: 0 };
  }
  release(): void {}
}
class FakePool extends FakeClient {
  readonly client = new FakeClient();
  async connect(): Promise<FakeClient> { return this.client; }
  async end(): Promise<void> {}
}

async function main(): Promise<void> {
  const pool = new FakePool();
  const store = new PostgresDataStore(pool);
  await store.initialize();
  await store.migrate([{ version: 1, sql: "CREATE TABLE test ();" }]);
  await store.commitRuntimeState({
    missions: { nodes: [], history: [] }, memory: [], world: { entities: [], relations: [] }, traces: []
  }, { eventId: "test:commit:001", type: "TEST_COMMIT", payload: { ok: true } }, 0n);
  if (!pool.client.statements.includes("BEGIN") || !pool.client.statements.includes("COMMIT")) throw new Error("Transactional commit contract failed.");
  console.log("PASS: production data-core transaction contract");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
