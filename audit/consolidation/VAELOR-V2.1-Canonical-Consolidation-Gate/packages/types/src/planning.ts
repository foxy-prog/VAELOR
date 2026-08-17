export type PlanLevel = "STRATEGIC" | "OPERATIONAL" | "TACTICAL";

export interface PlanNode {
  id: string;
  type: "MILESTONE" | "TASK" | "ACTION";
  title: string;
  dependsOn: string[];
  successCriteria: string[];
  verificationCriteria: string[];
  requiredCapabilities: string[];
}

export interface Plan {
  id: string;
  level: PlanLevel;
  objectiveId: string;
  nodes: PlanNode[];
  assumptions: string[];
  risks: string[];
  recoveryPaths: string[];
  unresolvedDecisions: string[];
  confidence: number;
}
