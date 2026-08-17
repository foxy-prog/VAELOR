import type { ContextItem, ContextPack, ContextRequest } from "../../../../packages/types/src/context.js";

export class ContextEngine {
  build(request: ContextRequest, items: ContextItem[]): ContextPack {
    const authorized = items
      .filter(i => i.authorized)
      .filter(i => i.relevance > 0)
      .sort((a, b) => (b.relevance * b.confidence) - (a.relevance * a.confidence))
      .slice(0, request.maxItems ?? 50);

    const contradictions = this.findContradictions(authorized);
    const confidence = authorized.length
      ? authorized.reduce((sum, i) => sum + i.confidence, 0) / authorized.length
      : 0;

    return {
      id: `ctx_${request.objectiveId}_${Date.now()}`,
      objectiveId: request.objectiveId,
      items: authorized,
      unresolvedContradictions: contradictions,
      completeness: Math.min(1, authorized.length / Math.max(1, request.requiredScopes.length)),
      confidence,
      createdAt: new Date().toISOString()
    };
  }

  private findContradictions(items: ContextItem[]): string[] {
    const contradictions: string[] = [];
    const bySource = new Map<string, ContextItem[]>();

    for (const item of items) {
      const list = bySource.get(item.sourceId) ?? [];
      list.push(item);
      bySource.set(item.sourceId, list);
    }

    for (const [id, list] of bySource) {
      const contents = new Set(list.map(x => x.content));
      if (contents.size > 1) contradictions.push(id);
    }

    return contradictions;
  }
}
