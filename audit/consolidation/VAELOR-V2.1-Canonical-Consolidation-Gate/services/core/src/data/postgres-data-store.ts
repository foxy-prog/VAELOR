import type { ProductionDataStore, RuntimeState, DataCommitEvent } from "./production-data-core.js";
import { CommitCoordinator, ConcurrencyConflictError } from "./consistency.js";
import type { MissionNode, MissionTransition } from "../../../../packages/types/src/mission-kernel.js";
import type { MemoryRecord } from "../../../../packages/types/src/memory.js";
import type { WorldEntity, WorldRelation } from "../../../../packages/types/src/world.js";
import type { Trace } from "../../../../packages/types/src/trace.js";

export interface QueryResult<T = Record<string, unknown>> { rows: T[]; rowCount?: number; }
export interface SqlClient { query<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<QueryResult<T>>; release?(): void; }
export interface SqlPool { connect(): Promise<SqlClient>; query<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<QueryResult<T>>; end(): Promise<void>; }

/**
 * PostgreSQL production boundary. The runtime depends on this interface rather
 * than on a vendor-specific driver, keeping the database replaceable.
 * The supplied deployment uses node-postgres (`pg`).
 */
export class PostgresDataStore implements ProductionDataStore {
  private readonly coordinator = new CommitCoordinator();
  constructor(private readonly pool: SqlPool) {}

  async initialize(): Promise<void> {
    await this.pool.query(`CREATE TABLE IF NOT EXISTS vaelor_schema_migrations (
      version INTEGER PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`);
  }

  async migrate(migrations: Array<{ version: number; sql: string }>): Promise<void> {
    await this.initialize();
    for (const migration of migrations.sort((a, b) => a.version - b.version)) {
      const existing = await this.pool.query<{ version: number }>(
        "SELECT version FROM vaelor_schema_migrations WHERE version = $1", [migration.version]
      );
      if (existing.rows.length) continue;
      const client = await this.pool.connect();
      try {
        await client.query("BEGIN");
        await client.query(migration.sql);
        await client.query("INSERT INTO vaelor_schema_migrations(version) VALUES($1)", [migration.version]);
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally { client.release?.(); }
    }
  }

  async loadRuntimeState(): Promise<RuntimeState | undefined> {
    const [missions, transitions, memory, entities, relations, traces, traceEvents] = await Promise.all([
      this.pool.query<MissionNodeRow>("SELECT payload FROM vaelor_missions ORDER BY updated_at ASC"),
      this.pool.query<MissionTransitionRow>("SELECT payload FROM vaelor_mission_transitions ORDER BY occurred_at ASC"),
      this.pool.query<PayloadRow>("SELECT payload FROM vaelor_memory ORDER BY updated_at ASC"),
      this.pool.query<PayloadRow>("SELECT payload FROM vaelor_world_entities ORDER BY updated_at ASC"),
      this.pool.query<PayloadRow>("SELECT payload FROM vaelor_world_relations ORDER BY observed_at ASC"),
      this.pool.query<TraceRow>("SELECT trace_id, run_id, started_at, completed_at, status FROM vaelor_traces ORDER BY started_at ASC"),
      this.pool.query<TraceEventRow>("SELECT trace_id, payload FROM vaelor_trace_events ORDER BY occurred_at ASC")
    ]);
    if (!missions.rows.length && !memory.rows.length && !entities.rows.length && !traces.rows.length) return undefined;

    const traceMap = new Map<string, Trace>();
    for (const row of traces.rows) traceMap.set(row.trace_id, {
      traceId: row.trace_id, runId: row.run_id, startedAt: row.started_at,
      ...(row.completed_at ? { completedAt: row.completed_at } : {}), status: row.status, events: []
    });
    for (const row of traceEvents.rows) traceMap.get(row.trace_id)?.events.push(row.payload as Trace["events"][number]);

    return {
      missions: { nodes: missions.rows.map(r => r.payload as MissionNode), history: transitions.rows.map(r => r.payload as MissionTransition) },
      memory: memory.rows.map(r => r.payload as MemoryRecord),
      world: { entities: entities.rows.filter(r => r.payload).map(r => r.payload as WorldEntity), relations: relations.rows.map(r => r.payload as WorldRelation) },
      traces: [...traceMap.values()]
    };
  }

  async getVersion(): Promise<bigint> {
    const result = await this.pool.query<{ version: string }>(
      "SELECT version::text AS version FROM vaelor_runtime_head WHERE id = 1"
    );
    return BigInt(result.rows[0]?.version ?? "0");
  }

  async commitRuntimeState(state: RuntimeState, event: DataCommitEvent, expectedVersion: bigint): Promise<bigint> {
    const commitKey = event.eventId ?? `${event.runId ?? "run"}:${event.traceId ?? "trace"}:${event.type}:${Date.now()}`;
    this.coordinator.assertCommitKey(commitKey);
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      // Serialize canonical commits and compare-and-swap the state version.
      await client.query("SELECT pg_advisory_xact_lock(hashtext('vaelor:runtime-state'))");
      const current = await client.query<{ version: string }>(
        "SELECT version::text AS version FROM vaelor_runtime_head WHERE id = 1 FOR UPDATE"
      );
      const actualVersion = BigInt(current.rows[0]?.version ?? "0");
      // Idempotent replay: an already-applied commit is a success, not a second mutation.
      const applied = await client.query<{ version: string }>(
        "SELECT state_version::text AS version FROM vaelor_runtime_events WHERE commit_key = $1", [commitKey]
      );
      if (applied.rows.length) {
        await client.query("COMMIT");
        return BigInt(applied.rows[0]!.version);
      }
      this.coordinator.assertExpectedVersion(expectedVersion, actualVersion);
      const nextVersion = this.coordinator.nextVersion(actualVersion);
      await this.replaceState(client, state);
      await client.query("UPDATE vaelor_runtime_head SET version = $1, updated_at = NOW() WHERE id = 1", [nextVersion.toString()]);
      await client.query(
        "INSERT INTO vaelor_runtime_events(commit_key,type,run_id,trace_id,state_version,payload) VALUES($1,$2,$3,$4,$5,$6)",
        [commitKey, event.type, event.runId ?? null, event.traceId ?? null, nextVersion.toString(), JSON.stringify(event.payload)]
      );
      await client.query("COMMIT");
      return nextVersion;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally { client.release?.(); }
  }

  async appendEvent(event: DataCommitEvent): Promise<void> {
    const commitKey = event.eventId ?? `${event.runId ?? "run"}:${event.traceId ?? "trace"}:${event.type}:${Date.now()}`;
    this.coordinator.assertCommitKey(commitKey);
    await this.pool.query(
      "INSERT INTO vaelor_runtime_events(commit_key,type,run_id,trace_id,state_version,payload) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT (commit_key) DO NOTHING",
      [commitKey, event.type, event.runId ?? null, event.traceId ?? null, null, JSON.stringify(event.payload)]
    );
  }

  private async replaceState(client: SqlClient, state: RuntimeState): Promise<void> {
    // The state commit is transactional: readers never observe a half-written runtime state.
    await client.query("TRUNCATE vaelor_missions, vaelor_mission_transitions, vaelor_memory, vaelor_world_entities, vaelor_world_relations, vaelor_traces, vaelor_trace_events");
    for (const node of state.missions.nodes) await client.query(
      `INSERT INTO vaelor_missions(id, kind, state, owner_id, authority_ceiling, risk, parent_id, deadline, updated_at, payload)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [node.id,node.kind,node.state,node.ownerId,node.authorityCeiling,node.risk,node.parentId ?? null,node.deadline ?? null,node.updatedAt,JSON.stringify(node)]
    );
    for (const transition of state.missions.history) await client.query(
      `INSERT INTO vaelor_mission_transitions(from_state,to_state,reason,actor_id,occurred_at,payload) VALUES($1,$2,$3,$4,$5,$6)`,
      [transition.from,transition.to,transition.reason,transition.actorId,transition.timestamp,JSON.stringify(transition)]
    );
    for (const record of state.memory) await client.query(
      `INSERT INTO vaelor_memory(id,layer,verification,sensitivity,confidence,updated_at,valid_until,payload) VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
      [record.id,record.layer,record.verification,record.sensitivity,record.confidence,record.updatedAt,record.validUntil ?? null,JSON.stringify(record)]
    );
    for (const entity of state.world.entities) await client.query(
      `INSERT INTO vaelor_world_entities(id,type,name,confidence,observed_at,updated_at,payload) VALUES($1,$2,$3,$4,$5,$6,$7)`,
      [entity.id,entity.type,entity.name,entity.confidence,entity.observedAt,entity.updatedAt,JSON.stringify(entity)]
    );
    for (const relation of state.world.relations) await client.query(
      `INSERT INTO vaelor_world_relations(id,from_entity,relation,to_entity,confidence,observed_at,payload) VALUES($1,$2,$3,$4,$5,$6,$7)`,
      [relation.id,relation.from,relation.relation,relation.to,relation.confidence,relation.observedAt,JSON.stringify(relation)]
    );
    for (const trace of state.traces) {
      await client.query(
        `INSERT INTO vaelor_traces(trace_id,run_id,started_at,completed_at,status) VALUES($1,$2,$3,$4,$5)`,
        [trace.traceId,trace.runId,trace.startedAt,trace.completedAt ?? null,trace.status]
      );
      for (const event of trace.events) await client.query(
        `INSERT INTO vaelor_trace_events(event_id,trace_id,run_id,occurred_at,type,actor,component,payload) VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
        [event.eventId,event.traceId,event.runId,event.timestamp,event.type,event.actor,event.component,JSON.stringify(event)]
      );
    }
  }

  async health(): Promise<{ ok: boolean; latencyMs?: number; detail?: string }> {
    const started = Date.now();
    try { await this.pool.query("SELECT 1"); return { ok: true, latencyMs: Date.now() - started }; }
    catch (error) { return { ok: false, latencyMs: Date.now() - started, detail: error instanceof Error ? error.message : String(error) }; }
  }

  async close(): Promise<void> { await this.pool.end(); }
}

type PayloadRow = { payload: unknown };
type MissionNodeRow = { payload: unknown };
type MissionTransitionRow = { payload: unknown };
type TraceRow = { trace_id: string; run_id: string; started_at: string; completed_at?: string; status: Trace["status"] };
type TraceEventRow = { trace_id: string; payload: unknown };
