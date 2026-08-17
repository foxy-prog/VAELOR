import type { Plan, PlanNode } from "../../../../packages/types/src/planning.js";

export class PlanningEngine {
  createPlan(input: {
    id: string;
    level: Plan["level"];
    objectiveId: string;
    nodes: PlanNode[];
    assumptions?: string[];
    risks?: string[];
    recoveryPaths?: string[];
    unresolvedDecisions?: string[];
    confidence?: number;
  }): Plan {
    const ids = new Set(input.nodes.map(n => n.id));

    for (const node of input.nodes) {
      for (const dep of node.dependsOn) {
        if (!ids.has(dep)) throw new Error(`Unknown dependency: ${dep}`);
      }
    }

    if (input.nodes.some(n => n.id === input.objectiveId)) {
      throw new Error("Objective cannot be a plan node.");
    }

    const confidence = input.confidence ?? 0;
    if (confidence < 0 || confidence > 1) throw new Error("Confidence must be 0..1.");

    return {
      id: input.id,
      level: input.level,
      objectiveId: input.objectiveId,
      nodes: input.nodes,
      assumptions: input.assumptions ?? [],
      risks: input.risks ?? [],
      recoveryPaths: input.recoveryPaths ?? [],
      unresolvedDecisions: input.unresolvedDecisions ?? [],
      confidence
    };
  }
}
