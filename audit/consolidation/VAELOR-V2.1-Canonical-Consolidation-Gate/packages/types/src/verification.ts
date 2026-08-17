export type VerificationStatus = "PENDING" | "PASS" | "PARTIAL" | "FAIL" | "UNCERTAIN";
export type RecoveryState = "NONE" | "CLASSIFY" | "RETRY" | "ALTERNATIVE" | "ROLLBACK" | "ESCALATE" | "COMPLETE";

export interface VerificationCriterion {
  id: string;
  description: string;
  required: boolean;
  tolerance?: string;
}

export interface VerificationRequest {
  id: string;
  actionId: string;
  expectedOutcome: string;
  criteria: VerificationCriterion[];
  evidenceIds: string[];
  method: "SOURCE_CHECK" | "STATE_CHECK" | "CROSS_CHECK" | "HUMAN_CONFIRMATION";
}

export interface VerificationResult {
  requestId: string;
  status: VerificationStatus;
  satisfiedCriteria: string[];
  failedCriteria: string[];
  evidenceIds: string[];
  rationale: string;
  confidence: number;
}

export interface RecoveryRecord {
  actionId: string;
  state: RecoveryState;
  failureClass?: string;
  attempt: number;
  rationale: string;
}
