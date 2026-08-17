export type LearningCandidateType =
  | "PROCEDURE" | "PREFERENCE" | "HEURISTIC" | "FAILURE_PATTERN"
  | "OPPORTUNITY_SIGNAL" | "CONFIDENCE_ADJUSTMENT";

export type LearningState =
  | "OBSERVED" | "CANDIDATE" | "VALIDATING" | "TESTING"
  | "PENDING_APPROVAL" | "DEPLOYED" | "MONITORING" | "REJECTED" | "ROLLED_BACK";

export interface Experience {
  id: string;
  runId: string;
  outcome: "SUCCESS" | "PARTIAL" | "FAILURE" | "UNCERTAIN";
  evidenceIds: string[];
  traceId: string;
  summary: string;
}

export interface LearningCandidate {
  id: string;
  type: LearningCandidateType;
  state: LearningState;
  sourceExperienceIds: string[];
  proposedChange: string;
  confidence: number;
  securityImpact: "NONE" | "LOW" | "HIGH";
  authorityImpact: "NONE" | "HIGH";
  requiresApproval: boolean;
}
