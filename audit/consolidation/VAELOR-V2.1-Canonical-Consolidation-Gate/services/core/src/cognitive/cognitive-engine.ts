import { ContextEngine } from "../context/context-engine.js";
import { MemoryStore } from "../memory/memory-store.js";
import { WorldModel } from "../world/world-model.js";
import { PlanningEngine } from "../planning/planner.js";
import type { ToolDefinition } from "../../../../packages/types/src/tools.js";
import type { MissionNode } from "../../../../packages/types/src/mission-kernel.js";
import type { ContextItem, ContextRequest } from "../../../../packages/types/src/context.js";
import type {
  CognitiveRequest,
  CognitiveResult,
  InferenceProvider
} from "./types.js";

export class CognitiveEngine {
  constructor(
    private readonly provider: InferenceProvider,
    private readonly context: ContextEngine,
    private readonly memory: MemoryStore,
    private readonly world: WorldModel,
    private readonly planning: PlanningEngine
  ) {}

  async think(
    objective: MissionNode,
    tools: ToolDefinition[] = []
  ): Promise<CognitiveResult> {
    const memory = this.memory.search(objective.scope);

    const contextItems: ContextItem[] = memory.map(record => ({
  id: record.id,
  objectiveId: objective.id,
  sourceId: record.id,
  sourceType: "MEMORY",
  content: record.content,
  relevance: 1,
  confidence: record.confidence,
  authorized: true
}));
    const contextRequest: ContextRequest = {
      objectiveId: objective.id,
      requiredScopes: objective.scope,
      maxItems: 50
    };

    const contextPack = this.context.build(contextRequest, contextItems);

    const worldItems = objective.scope
      .map(scope => this.world.get(scope))
      .filter(Boolean)
      .map(entity => `${entity!.id}: ${JSON.stringify(entity!.attributes)}`);

    const request: CognitiveRequest = {
      objective,
      context: contextPack.items.map(item => item.content),
      memory: memory.map(record => record.content),
      world: worldItems,
      availableTools: tools
    };

    const result = await this.provider.generate(request);

    const plan = this.planning.createPlan(result.plan);

    return {
      ...result,
      plan
    };
  }
}
