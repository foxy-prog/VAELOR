import type { Plan } from "../../../../packages/types/src/planning.js";
import type { MissionNode } from "../../../../packages/types/src/mission-kernel.js";
import type { ToolDefinition } from "../../../../packages/types/src/tools.js";

export interface CognitiveRequest {
  objective: MissionNode;
  context?: string[];
  memory?: string[];
  world?: string[];
  availableTools?: ToolDefinition[];
}

export interface CognitiveResult {
  plan: Plan;
  reasoning: string[];
  confidence: number;
  unresolvedDecisions: string[];
}

export interface InferenceProvider {
  generate(request: CognitiveRequest): Promise<CognitiveResult>;
}
