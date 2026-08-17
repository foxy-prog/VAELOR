export type InitiativeState =
  | "CANDIDATE" | "ASSESSING" | "EVALUATED" | "RECOMMENDED"
  | "WATCHING" | "EXPLORING" | "COMMITTED" | "REJECTED" | "EXPIRED";

export interface InitiativeCandidate {
  id: string;
  opportunityId: string;
  title: string;
  objective: string;
  expectedOutcome: string;
  rationale: string[];
  requiredResources: string[];
  dependencies: string[];
  conflicts: string[];
  risk: number;
  effort: number;
  expectedValue: number;
  confidence: number;
  state: InitiativeState;
  successCriteria: string[];
  verificationCriteria: string[];
  recommendedDecision: "REJECT" | "WATCH" | "EXPLORE" | "COMMIT";
  reviewAt?: string;
}
