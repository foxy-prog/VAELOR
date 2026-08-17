export type MemoryLayer =
  | "L1_FACT" | "L2_PREFERENCE" | "L3_DECISION" | "L4_PATTERN" | "L5_PREDICTION"
  | "OPERATIONAL" | "EPISODIC" | "PROCEDURAL" | "WORKING";

export type VerificationStatus = "UNVERIFIED" | "SUPPORTED" | "VERIFIED" | "CONTRADICTED" | "EXPIRED";

export interface MemoryRecord {
  id: string;
  layer: MemoryLayer;
  content: string;
  source: string;
  evidenceIds: string[];
  confidence: number;
  verification: VerificationStatus;
  scope: string[];
  sensitivity: "PUBLIC" | "PRIVATE" | "RESTRICTED";
  createdAt: string;
  updatedAt: string;
  validUntil?: string;
  supersedes?: string[];
  contradicts?: string[];
}
