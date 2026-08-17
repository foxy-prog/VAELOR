import type { WorldEntity, WorldObservation, WorldRelation } from "../../../../packages/types/src/world.js";

export class WorldModel {
  private entities = new Map<string, WorldEntity>();
  private relations = new Map<string, WorldRelation>();

  apply(observation: WorldObservation): WorldEntity {
    if (observation.confidence < 0 || observation.confidence > 1) {
      throw new Error("Confidence must be 0..1.");
    }

    const id = observation.entityId ?? `${observation.type.toLowerCase()}_${observation.sourceId}`;
    const previous = this.entities.get(id);

    // A weaker observation must not silently erase a stronger current state.
    if (previous && previous.confidence > observation.confidence) return previous;

    const entity: WorldEntity = {
      id,
      type: observation.type,
      name: observation.name,
      attributes: observation.attributes,
      confidence: observation.confidence,
      sourceIds: [...new Set([...(previous?.sourceIds ?? []), observation.sourceId])],
      observedAt: observation.observedAt,
      updatedAt: new Date().toISOString()
    };

    this.entities.set(id, Object.freeze(entity));
    return entity;
  }

  get(id: string) {
    return this.entities.get(id);
  }

  relate(relation: WorldRelation): void {
    this.relations.set(relation.id, Object.freeze({...relation}));
  }

  relatedTo(entityId: string): WorldRelation[] {
    return [...this.relations.values()].filter(r => r.from === entityId || r.to === entityId);
  }

  exportState(): { entities: WorldEntity[]; relations: WorldRelation[] } {
    return {
      entities: [...this.entities.values()].map(e => ({ ...e })),
      relations: [...this.relations.values()].map(r => ({ ...r }))
    };
  }

  importState(state: { entities: WorldEntity[]; relations: WorldRelation[] }): void {
    this.entities.clear();
    this.relations.clear();
    for (const entity of state.entities) this.entities.set(entity.id, Object.freeze({ ...entity }));
    for (const relation of state.relations) this.relations.set(relation.id, Object.freeze({ ...relation }));
  }
}
