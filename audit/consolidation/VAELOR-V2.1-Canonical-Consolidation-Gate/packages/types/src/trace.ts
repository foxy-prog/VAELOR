export type TraceEventType =
  | "RUN_STARTED" | "CONTEXT_BOUND" | "MEMORY_READ" | "POLICY_CHECKED"
  | "AUTHORIZATION_REQUESTED" | "AUTHORIZATION_GRANTED" | "AUTHORIZATION_DENIED"
  | "AGENT_DISPATCHED" | "TOOL_CALLED" | "EXECUTION_RESULT"
  | "VERIFICATION_RESULT" | "RECOVERY_STARTED" | "RUN_COMPLETED"
  | "RUN_FAILED" | "RUN_ESCALATED";

export interface TraceEvent {
  eventId: string;
  runId: string;
  traceId: string;
  timestamp: string;
  type: TraceEventType;
  actor: string;
  component: string;
  summary: string;
  references: string[];
  metadata?: Record<string, unknown>;
  sensitive?: boolean;
}

export interface Trace {
  traceId: string;
  runId: string;
  startedAt: string;
  completedAt?: string;
  status: "RUNNING" | "SUCCEEDED" | "FAILED" | "ESCALATED" | "ABORTED";
  events: TraceEvent[];
}
