import type { MissionNode } from "../../../../packages/types/src/mission-kernel.js";
import type { ToolDefinition } from "../../../../packages/types/src/tools.js";
import type { Plan } from "../../../../packages/types/src/planning.js";
import type { MissionAction } from "./types.js";

export class ActionMaterializer {
  materialize(
    mission: MissionNode,
    plan: Plan,
    tools: ToolDefinition[]
  ): MissionAction[] {
    return plan.nodes.flatMap((node, i) =>
      node.requiredCapabilities.map((capability, j) => {
        const tool = tools.find(t => t.capability === capability);
        if (!tool)
          throw new Error(
            `No registered tool satisfies planned capability: ${capability}`
          );

        const id = `action_${Date.now().toString(36)}_${i}_${j}`;

        return {
          id,
          missionId: mission.id,
          taskId: node.id,
          toolId: tool.id,
          capability: tool.capability,
          authority: tool.requiredAuthority,
          trustZone: tool.allowedTrustZones[0] ?? "CORE",
          parameters: {},
          preconditions: [],
          expectedSideEffects: [],
          verification: {
            id: `verification_${id}`,
            actionId: id,
            expectedOutcome:
              node.successCriteria[0] ??
              "Execution completes successfully.",
            criteria: node.verificationCriteria.map((description, k) => ({
              id: `criterion_${k}`,
              description,
              required: true
            })),
            evidenceIds: [],
            method: tool.verificationStrategy as "SOURCE_CHECK" | "STATE_CHECK" | "CROSS_CHECK" | "HUMAN_CONFIRMATION"
          }
        };
      })
    );
  }
}
