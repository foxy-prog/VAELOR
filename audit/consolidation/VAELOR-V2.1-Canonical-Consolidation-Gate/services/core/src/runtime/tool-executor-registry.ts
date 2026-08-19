import type { ToolDefinition } from "../../../../packages/types/src/tools.js";
import type { RegisteredTool, ToolExecutor } from "./types.js";

export class ToolExecutorRegistry {
  private readonly entries = new Map<string, RegisteredTool>();

  register(definition: ToolDefinition, executor: ToolExecutor): void {
    if (this.entries.has(definition.id)) throw new Error(`Tool already registered: ${definition.id}`);
    this.entries.set(definition.id, { definition, executor });
  }

  get(toolId: string): RegisteredTool | undefined {
    return this.entries.get(toolId);
  }

  listDefinitions(): ToolDefinition[] {
    return Array.from(this.entries.values()).map(entry => entry.definition);
  }
}
