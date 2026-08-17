export type OpportunityState =
  | "DETECTED" | "EVALUATING" | "RANKED" | "RECOMMENDED"
  | "WATCHING" | "EXPLORING" | "COMMITTED" | "REJECTED" | "EXPIRED";

export interface OpportunityCandidate {
  id: string;
  title: string;
  description: string;
  state: OpportunityState;
  sourceIds: string[];
  domain: string;
  value: number;
  alignment: number;
  urgency: number;
  risk: number;
  effort: number;
  confidence: number;
  strategicFit: number;
  score: number;
  rationale: string[];
  expiresAt?: string;
  recommendedNextStep?: string;
}
