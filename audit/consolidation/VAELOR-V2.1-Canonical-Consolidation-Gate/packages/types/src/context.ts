export interface ContextRequest {
  objectiveId: string;
  agentId?: string;
  requiredScopes: string[];
  requiredEntities?: string[];
  maxItems?: number;
}

export interface ContextItem {
  sourceType: "MEMORY" | "WORLD" | "EVIDENCE" | "CONSTRAINT" | "RISK";
  sourceId: string;
  content: string;
  relevance: number;
  confidence: number;
  authorized: boolean;
  observedAt?: string;
}

export interface ContextPack {
  id: string;
  objectiveId: string;
  items: ContextItem[];
  unresolvedContradictions: string[];
  completeness: number;
  confidence: number;
  createdAt: string;
}
