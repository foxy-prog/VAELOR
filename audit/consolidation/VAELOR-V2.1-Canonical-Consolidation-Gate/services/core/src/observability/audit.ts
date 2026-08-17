import type { TraceEvent } from "../../../../packages/types/src/trace.js";
import { TraceStore } from "./trace-store.js";

export class AuditService {
  constructor(private readonly store: TraceStore) {}

  record(event: TraceEvent): void {
    if (!event.eventId || !event.runId || !event.traceId || !event.actor) {
      throw new Error("Audit event missing mandatory identity.");
    }
    this.store.append(event);
  }
}
