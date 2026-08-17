export type AgentRole =
  | "CHIEF_OF_STAFF" | "ACADEMIC" | "CAREER" | "ENGINEERING"
  | "RESEARCH" | "COMMUNICATIONS" | "PROJECT_MANAGER"
  | "SCHEDULING" | "PERSONAL_OPERATIONS";

export type AgentStatus = "IDLE" | "ASSIGNED" | "RUNNING" | "WAITING" | "FAILED" | "COMPLETED" | "ESCALATED";

export interface AgentDefinition {
  id: string;
  role: AgentRole;
  status: AgentStatus;
  objectiveScope: string[];
  memoryScope: string[];
  capabilities: string[];
  tools: string[];
  authorityCeiling: 0 | 1 | 2 | 3;
  policyIds: string[];
  verificationRequired: boolean;
  escalationRules: string[];
}

export interface DelegationEnvelope {
  id: string;
  missionId: string;
  parentAgentId: string;
  targetAgentId: string;
  objective: string;
  context: string[];
  constraints: string[];
  expectedOutput: string[];
  deadline?: string;
  allowedCapabilities: string[];
  memoryScope: string[];
  verificationCriteria: string[];
}

export interface AgentResult {
  delegationId: string;
  status: "SUCCESS" | "PARTIAL" | "FAILED" | "UNCERTAIN" | "ESCALATE";
  summary: string;
  evidence: string[];
  confidence: number;
  actionsTaken: string[];
  actionsNotTaken: string[];
  failures: string[];
  recommendations: string[];
}
