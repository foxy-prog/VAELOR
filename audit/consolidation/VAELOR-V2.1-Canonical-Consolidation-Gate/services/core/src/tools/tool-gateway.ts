import type { ToolDecision, ToolDefinition, ToolRequest } from "../../../../packages/types/src/tools.js";

const rank = { LOW: 0, MEDIUM: 1, HIGH: 2, CRITICAL: 3 } as const;

export class ToolGateway {
  private readonly tools = new Map<string, ToolDefinition>();

  register(tool: ToolDefinition): ToolDefinition {
    if (this.tools.has(tool.id)) throw new Error("Tool already registered.");
    this.tools.set(tool.id, tool);
    return tool;
  }

  evaluate(request: ToolRequest): ToolDecision {
    const tool = this.tools.get(request.toolId);
    if (!tool) return this.deny("Unknown tool.", "CRITICAL", false);

    if (tool.capability !== request.capability) {
      return this.deny("Capability mismatch.", tool.risk, false);
    }

    if (!tool.allowedTrustZones.includes(request.trustZone)) {
      return this.deny("Trust-zone violation.", tool.risk, false);
    }

    if (request.authority < tool.requiredAuthority) {
      return this.deny("Insufficient authority.", tool.risk, tool.requiredAuthority >= 2);
    }

    if (rank[tool.risk] >= 2 && !request.authorizationId) {
      return this.deny("Explicit authorization required.", tool.risk, true);
    }

    return {
      allowed: true,
      reason: "All gateway checks passed.",
      risk: tool.risk,
      authorizationRequired: false
    };
  }

  private deny(reason: string, risk: ToolDefinition["risk"], authorizationRequired: boolean): ToolDecision {
    return { allowed: false, reason, risk, authorizationRequired };
  }
}
