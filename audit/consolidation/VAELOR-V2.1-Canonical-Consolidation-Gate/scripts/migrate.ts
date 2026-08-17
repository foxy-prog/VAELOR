import { readFile } from "node:fs/promises";
import { PostgresDataStore } from "../services/core/src/data/postgres-data-store.js";

interface PgPoolLike { connect(): Promise<any>; query(sql: string, params?: unknown[]): Promise<any>; end(): Promise<void>; }

async function main(): Promise<void> {
  const url = process.env.VAELOR_DATABASE_URL;
  if (!url) throw new Error("VAELOR_DATABASE_URL is required.");
  const pg = await import("pg") as { Pool: new (options: { connectionString: string }) => PgPoolLike };
  const pool = new pg.Pool({ connectionString: url });
  const store = new PostgresDataStore(pool);
  const sql = await readFile(new URL("../migrations/001_production_data_core.sql", import.meta.url), "utf8");
  await store.migrate([{ version: 1, sql }]);
  console.log("VÆLOR Production Data Core migration complete.");
  await store.close();
}
main().catch(error => { console.error(error); process.exitCode = 1; });
