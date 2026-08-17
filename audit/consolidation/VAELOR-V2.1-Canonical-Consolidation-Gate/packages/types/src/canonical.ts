/** Canonical VÆLOR contract primitives. All runtime modules should converge on these types. */
export type AuthorityLevel = 0 | 1 | 2 | 3;
export type TrustZone = "CORE" | "LOCAL" | "SANDBOX" | "EXTERNAL" | "REMOTE";
export type Sensitivity = "PUBLIC" | "PRIVATE" | "RESTRICTED";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type EntityId = string;
export type RunId = string;
export type TraceId = string;
export type EvidenceId = string;

export interface CanonicalEnvelope<T> {
  schemaVersion: 1;
  id: string;
  createdAt: string;
  actorId: string;
  data: T;
}

export interface AuthorizationContext {
  actorId: string;
  authority: AuthorityLevel;
  capabilities: string[];
  trustZone: TrustZone;
  policyIds: string[];
  authorizationId?: string;
}

export interface VerificationContract {
  successCriteria: string[];
  verificationCriteria: string[];
  independent: boolean;
  evidenceRequired: boolean;
}

export interface CanonicalRuntimeState {
  schemaVersion: 1;
  savedAt: string;
  missions: unknown[];
  missionTransitions: unknown[];
  memory: unknown[];
  worldEntities: unknown[];
  worldRelations: unknown[];
  traces: unknown[];
}
