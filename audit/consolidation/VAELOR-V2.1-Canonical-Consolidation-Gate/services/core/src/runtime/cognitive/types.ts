export type CognitivePhase =
  | "OBSERVE" | "INTERPRET" | "CONTEXT" | "BELIEF_UPDATE"
  | "OBJECTIVES" | "PRIORITIZE" | "PLAN" | "AUTHORIZE"
  | "EXECUTE" | "VERIFY" | "UPDATE_STATE" | "LEARN" | "ANTICIPATE";

export type CycleStatus = "RUNNING" | "WAITING_AUTHORIZATION" | "COMPLETED" | "FAILED" | "ESCALATED";

export interface CognitiveObservation {
  source: string;
  data: unknown;
  observedAt: string;
  trust: "UNTRUSTED" | "AUTHORIZED" | "VERIFIED";
}

export interface CognitiveContext {
  objectiveIds: string[];
  activeMissionIds: string[];
  memoryRefs: string[];
  worldEntityRefs: string[];
  constraints: string[];
}

export interface CognitiveProposal {
  objective?: string;
  plan?: unknown;
  requestedAuthority?: "L0" | "L1" | "L2" | "L3";
  actions?: unknown[];
  rationale: string;
  confidence: number;
}

export interface CognitiveCycle {
  id: string;
  phase: CognitivePhase;
  status: CycleStatus;
  startedAt: string;
  updatedAt: string;
  observation?: CognitiveObservation;
  context?: CognitiveContext;
  proposal?: CognitiveProposal;
  evidenceRefs: string[];
  errors: string[];
}
