export type MissionState =
  | "DRAFT" | "PLANNED" | "AUTHORIZED" | "READY" | "RUNNING"
  | "BLOCKED" | "PAUSED" | "VERIFYING" | "SUCCEEDED"
  | "PARTIAL" | "FAILED" | "ESCALATED" | "CANCELLED" | "RECOVERING";

export type WorkKind = "OBJECTIVE" | "INITIATIVE" | "PROJECT" | "MISSION" | "TASK" | "ACTION";

export interface MissionNode {
  id: string;
  kind: WorkKind;
  title: string;
  description?: string;
  parentId?: string;
  ownerId: string;
  state: MissionState;
  authorityCeiling: 0 | 1 | 2 | 3;
  risk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  scope: string[];
  constraints: string[];
  dependencies: string[];
  successCriteria: string[];
  verificationCriteria: string[];
  evidence: string[];
  deadline?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MissionTransition {
  from: MissionState;
  to: MissionState;
  reason: string;
  actorId: string;
  timestamp: string;
}
