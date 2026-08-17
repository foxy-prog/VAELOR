import type { MemoryRecord } from "../../../../packages/types/src/memory.js";

export class MemoryStore {
  private records = new Map<string, MemoryRecord>();

  write(record: MemoryRecord): void {
    if (!record.id || !record.content || !record.layer) throw new Error("Invalid memory record.");
    if (record.confidence < 0 || record.confidence > 1) throw new Error("Confidence must be 0..1.");
    if (record.layer === "L5_PREDICTION" && record.verification === "VERIFIED") {
      throw new Error("Predictions must remain hypotheses until independently resolved.");
    }
    this.records.set(record.id, Object.freeze({...record}));
  }

  get(id: string): MemoryRecord | undefined {
    return this.records.get(id);
  }

  search(scope: string[], layer?: MemoryRecord["layer"]): MemoryRecord[] {
    return [...this.records.values()].filter(r =>
      (!layer || r.layer === layer) &&
      (scope.length === 0 || r.scope.some(s => scope.includes(s)))
    );
  }

  exportState(): MemoryRecord[] {
    return [...this.records.values()].map(r => ({ ...r }));
  }

  importState(records: MemoryRecord[]): void {
    this.records.clear();
    for (const record of records) this.records.set(record.id, Object.freeze({ ...record }));
  }
}
