export type WorldEntityType =
  | "PERSON" | "GOAL" | "COMMITMENT" | "PROJECT" | "INITIATIVE"
  | "MISSION" | "TASK" | "ACTION" | "RESOURCE" | "EVENT" | "DEADLINE"
  | "CONSTRAINT" | "RISK" | "RELATIONSHIP" | "OPPORTUNITY" | "EVIDENCE";

export interface WorldEntity {
  id: string;
  type: WorldEntityType;
  name: string;
  attributes: Record<string, unknown>;
  confidence: number;
  sourceIds: string[];
  observedAt: string;
  effectiveFrom?: string;
  effectiveUntil?: string;
  updatedAt: string;
}

export interface WorldRelation {
  id: string;
  from: string;
  relation: string;
  to: string;
  confidence: number;
  sourceIds: string[];
  observedAt: string;
}

export interface WorldObservation {
  sourceId: string;
  entityId?: string;
  type: WorldEntityType;
  name: string;
  attributes: Record<string, unknown>;
  confidence: number;
  observedAt: string;
}
