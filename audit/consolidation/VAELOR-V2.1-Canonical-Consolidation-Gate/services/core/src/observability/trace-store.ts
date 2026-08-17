import type { Trace, TraceEvent } from "../../../../packages/types/src/trace.js";

export class TraceStore {
  private traces = new Map<string, Trace>();

  start(runId: string, traceId: string): Trace {
    const trace: Trace = {
      traceId, runId, startedAt: new Date().toISOString(),
      status: "RUNNING", events: []
    };
    this.traces.set(traceId, trace);
    return trace;
  }

  append(event: TraceEvent): void {
    const trace = this.traces.get(event.traceId);
    if (!trace) throw new Error("Unknown trace.");
    trace.events.push(Object.freeze({...event}) as TraceEvent);
  }

  complete(traceId: string, status: Trace["status"]): void {
    const trace = this.traces.get(traceId);
    if (!trace) throw new Error("Unknown trace.");
    trace.status = status;
    trace.completedAt = new Date().toISOString();
  }

  get(traceId: string): Trace | undefined {
    return this.traces.get(traceId);
  }

  exportState(): Trace[] {
    return [...this.traces.values()].map(t => ({ ...t, events: [...t.events] }));
  }

  importState(traces: Trace[]): void {
    this.traces.clear();
    for (const trace of traces) this.traces.set(trace.traceId, { ...trace, events: [...trace.events] });
  }
}
