export type ToolRisk = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type SideEffect = "NONE" | "REVERSIBLE" | "EXTERNAL" | "IRREVERSIBLE";

export interface ToolDefinition {
  id: string;
  capability: string;
  inputSchema: Record<string, unknown>;
  outputSchema: Record<string, unknown>;
  risk: ToolRisk;
  requiredAuthority: 0 | 1 | 2 | 3;
  allowedTrustZones: string[];
  sideEffect: SideEffect;
  verificationStrategy: string;
  timeoutMs: number;
  retryable: boolean;
}

export interface ToolRequest {
  id: string;
  agentId: string;
  missionId: string;
  toolId: string;
  capability: string;
  authority: 0 | 1 | 2 | 3;
  trustZone: string;
  parameters: Record<string, unknown>;
  authorizationId?: string;
}

export interface ToolDecision {
  allowed: boolean;
  reason: string;
  risk: ToolRisk;
  authorizationRequired: boolean;
}
