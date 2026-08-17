import type { MemoryRecord } from "../../../../packages/types/src/memory.js";

export class MemoryPolicy {
  canRead(record: MemoryRecord, allowedScopes: string[], maxSensitivity: MemoryRecord["sensitivity"]): boolean {
    const levels = { PUBLIC: 0, PRIVATE: 1, RESTRICTED: 2 };
    return levels[record.sensitivity] <= levels[maxSensitivity]
      && record.scope.some(s => allowedScopes.includes(s));
  }
}
