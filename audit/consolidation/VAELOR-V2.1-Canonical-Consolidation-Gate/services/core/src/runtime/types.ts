import type { ActionRequest } from "../../../../packages/types/src/execution.js";
import type { MissionNode } from "../../../../packages/types/src/mission-kernel.js";
import type { VerificationRequest, VerificationResult } from "../../../../packages/types/src/verification.js";
import type { ToolDefinition } from "../../../../packages/types/src/tools.js";

export interface ExecutableToolResult {
  result: unknown;
  observed: Record<string, boolean>;
  evidenceIds: string[];
}

export type ToolExecutor = (parameters: Record<string, unknown>) => Promise<ExecutableToolResult> | ExecutableToolResult;

export interface MissionAction extends ActionRequest {
  verification: VerificationRequest;
}

export interface MissionRunRequest {
  mission: MissionNode;
  actions?: MissionAction[];
  authorizationId?: string;
}

export interface MissionRunResult {
  missionId: string;
  status: "SUCCEEDED" | "PARTIAL" | "FAILED" | "ESCALATED" | "ABORTED";
  actionResults: Array<{
    actionId: string;
    state: string;
    verification?: VerificationResult;
    error?: string;
  }>;
  traceId: string;
}

export interface RegisteredTool {
  definition: ToolDefinition;
  executor: ToolExecutor;
}
