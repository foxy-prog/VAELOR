import { mkdir, readFile, rename, writeFile, appendFile } from "node:fs/promises";
import { join } from "node:path";

export interface DurableRuntimeSnapshot {
  schemaVersion: 1;
  savedAt: string;
  state: Record<string, unknown>;
}

export interface JournalRecord {
  schemaVersion: 1;
  sequence: number;
  timestamp: string;
  type: string;
  runId?: string;
  traceId?: string;
  payload: Record<string, unknown>;
}

/**
 * Local-first durable state boundary.
 * Snapshot writes are atomic; the journal preserves a durable record of commits.
 * This is intentionally not full event sourcing yet: replay semantics are a later
 * production gate, while snapshots already provide restart continuity.
 */
export class PersistentStateStore {
  private readonly snapshotPath: string;
  private readonly journalPath: string;
  private sequence = 0;

  constructor(private readonly directory: string) {
    this.snapshotPath = join(directory, "state.json");
    this.journalPath = join(directory, "journal.ndjson");
  }

  async initialize(): Promise<void> {
    await mkdir(this.directory, { recursive: true });
    try {
      const journal = await readFile(this.journalPath, "utf8");
      this.sequence = journal.split("\n").filter(Boolean).length;
    } catch {
      this.sequence = 0;
    }
  }

  async load(): Promise<DurableRuntimeSnapshot | undefined> {
    await this.initialize();
    try {
      const raw = await readFile(this.snapshotPath, "utf8");
      const parsed = JSON.parse(raw) as DurableRuntimeSnapshot;
      if (parsed.schemaVersion !== 1 || !parsed.state) throw new Error("Unsupported VÆLOR state schema.");
      return parsed;
    } catch (error) {
      const code = (error as { code?: string }).code;
      if (code === "ENOENT") return undefined;
      throw error;
    }
  }

  async commit(state: Record<string, unknown>, event: Omit<JournalRecord, "schemaVersion" | "sequence" | "timestamp">): Promise<void> {
    await this.initialize();
    const timestamp = new Date().toISOString();
    const record: JournalRecord = {
      schemaVersion: 1,
      sequence: ++this.sequence,
      timestamp,
      ...event
    };
    await appendFile(this.journalPath, JSON.stringify(record) + "\n", "utf8");

    const snapshot: DurableRuntimeSnapshot = {
      schemaVersion: 1,
      savedAt: timestamp,
      state
    };
    const tmp = `${this.snapshotPath}.tmp`;
    await writeFile(tmp, JSON.stringify(snapshot, null, 2), "utf8");
    await rename(tmp, this.snapshotPath);
  }

  async journal(): Promise<JournalRecord[]> {
    await this.initialize();
    try {
      const raw = await readFile(this.journalPath, "utf8");
      return raw.split("\n").filter(Boolean).map(line => JSON.parse(line) as JournalRecord);
    } catch (error) {
      const code = (error as { code?: string }).code;
      if (code === "ENOENT") return [];
      throw error;
    }
  }
}
