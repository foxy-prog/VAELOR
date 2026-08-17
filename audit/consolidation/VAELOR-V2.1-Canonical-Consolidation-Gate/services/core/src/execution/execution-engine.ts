import type { ActionRequest, ExecutionRecord } from "../../../../packages/types/src/execution.js";
import { ToolGateway } from "../tools/tool-gateway.js";

export class ExecutionEngine {
  constructor(private readonly gateway: ToolGateway) {}

  prepare(action: ActionRequest): ExecutionRecord {
    if (!action.id || !action.missionId || !action.taskId || !action.toolId) {
      throw new Error("Missing execution identity.");
    }
    if (action.authority < 0 || action.authority > 3) throw new Error("Invalid authority.");
    return {
      actionId: action.id,
      state: "PLANNED",
      observedSideEffects: [],
      retryCount: 0,
      verificationRequired: true
    };
  }

  authorize(action: ActionRequest): ExecutionRecord {
    const decision = this.gateway.evaluate({
      id: action.id,
      agentId: "execution-engine",
      missionId: action.missionId,
      toolId: action.toolId,
      capability: action.capability,
      authority: action.authority,
      trustZone: action.trustZone,
      parameters: action.parameters,
      idempotencyKey: action.idempotencyKey
    } as any);

    if (!decision.allowed) {
      return {
        actionId: action.id,
        state: decision.authorizationRequired ? "AUTHORIZING" : "ABORTED",
        observedSideEffects: [],
        retryCount: 0,
        verificationRequired: true,
        error: decision.reason
      };
    }

    return {
      actionId: action.id,
      state: "AUTHORIZED",
      observedSideEffects: [],
      retryCount: 0,
      verificationRequired: true
    };
  }
}
