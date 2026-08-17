export type ActionState =
  | "PLANNED" | "READY" | "AUTHORIZING" | "AUTHORIZED"
  | "EXECUTING" | "SUCCEEDED" | "FAILED" | "UNCERTAIN"
  | "VERIFYING" | "VERIFIED" | "RECOVERY" | "ESCALATED" | "ABORTED";

export interface ActionRequest {
  id: string;
  missionId: string;
  taskId: string;
  toolId: string;
  capability: string;
  authority: 0 | 1 | 2 | 3;
  trustZone: string;
  parameters: Record<string, unknown>;
  preconditions: string[];
  expectedSideEffects: string[];
  idempotencyKey?: string;
}

export interface ExecutionRecord {
  actionId: string;
  state: ActionState;
  startedAt?: string;
  completedAt?: string;
  result?: unknown;
  observedSideEffects: string[];
  error?: string;
  retryCount: number;
  verificationRequired: boolean;
}
