import type { MissionNode, MissionTransition } from "../../../../packages/types/src/mission-kernel.js";
import type { MemoryRecord } from "../../../../packages/types/src/memory.js";
import type { WorldEntity, WorldRelation } from "../../../../packages/types/src/world.js";
import type { Trace } from "../../../../packages/types/src/trace.js";

export interface RuntimeState {
  missions: { nodes: MissionNode[]; history: MissionTransition[] };
  memory: MemoryRecord[];
  world: { entities: WorldEntity[]; relations: WorldRelation[] };
  traces: Trace[];
}

export interface DataCommitEvent {
  /** Stable idempotency key for exactly-once commit intent. */
  eventId?: string;
  type: string;
  runId?: string;
  traceId?: string;
  payload: Record<string, unknown>;
}

export class DurabilityError extends Error {
  readonly code = "DURABILITY_FAILURE";
  constructor(message: string, options?: { cause?: unknown }) { super(message); this.name = "DurabilityError"; if (options?.cause) (this as Error & { cause?: unknown }).cause = options.cause; }
}

export interface ProductionDataStore {
  initialize(): Promise<void>;
  loadRuntimeState(): Promise<RuntimeState | undefined>;
  getVersion(): Promise<bigint>;
  commitRuntimeState(state: RuntimeState, event: DataCommitEvent, expectedVersion: bigint): Promise<bigint>;
  appendEvent(event: DataCommitEvent): Promise<void>;
  health(): Promise<{ ok: boolean; latencyMs?: number; detail?: string }>;
  close(): Promise<void>;
}

export function emptyRuntimeState(): RuntimeState {
  return {
    missions: { nodes: [], history: [] },
    memory: [],
    world: { entities: [], relations: [] },
    traces: []
  };
}
