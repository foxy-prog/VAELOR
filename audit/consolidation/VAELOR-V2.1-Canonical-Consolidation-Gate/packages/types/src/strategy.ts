export type PlanState =
  | "DRAFT" | "EVALUATING" | "PROPOSED" | "APPROVED"
  | "ACTIVE" | "DEGRADED" | "PAUSED" | "INVALIDATED"
  | "COMPLETED" | "CANCELLED";

export interface StrategicPlan {
  id: string;
  objectiveId: string;
  initiativeIds: string[];
  state: PlanState;
  desiredOutcomes: string[];
  assumptions: string[];
  constraints: string[];
  phases: PlanPhase[];
  dependencies: string[];
  milestones: string[];
  resources: string[];
  risks: string[];
  alternatives: string[];
  successCriteria: string[];
  verificationCriteria: string[];
  reviewTriggers: string[];
  confidence: number;
  createdAt: string;
}

export interface PlanPhase {
  id: string;
  title: string;
  objective: string;
  dependencies: string[];
  milestoneIds: string[];
}
