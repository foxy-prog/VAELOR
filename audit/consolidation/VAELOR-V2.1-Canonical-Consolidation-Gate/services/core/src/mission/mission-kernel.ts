import type { MissionNode, MissionState, MissionTransition, WorkKind } from "../../../../packages/types/src/mission-kernel.js";

const transitions: Record<MissionState, MissionState[]> = {
  DRAFT: ["PLANNED", "CANCELLED"],
  PLANNED: ["AUTHORIZED", "CANCELLED"],
  AUTHORIZED: ["READY", "CANCELLED", "ESCALATED"],
  READY: ["RUNNING", "BLOCKED", "CANCELLED"],
  RUNNING: ["PAUSED", "BLOCKED", "VERIFYING", "FAILED", "ESCALATED"],
  BLOCKED: ["READY", "CANCELLED", "ESCALATED", "FAILED"],
  PAUSED: ["READY", "CANCELLED", "ESCALATED"],
  VERIFYING: ["SUCCEEDED", "PARTIAL", "FAILED", "ESCALATED"],
  PARTIAL: ["PLANNED", "RECOVERING", "ESCALATED", "CANCELLED"],
  FAILED: ["RECOVERING", "ESCALATED", "CANCELLED"],
  RECOVERING: ["READY", "RUNNING", "FAILED", "ESCALATED"],
  SUCCEEDED: [],
  ESCALATED: ["PLANNED", "CANCELLED"],
  CANCELLED: [],
};

export class MissionKernel {
  private readonly nodes = new Map<string, MissionNode>();
  private readonly history: MissionTransition[] = [];

  register(node: MissionNode): MissionNode {
    if (this.nodes.has(node.id)) throw new Error("Mission node already exists.");
    if (node.parentId && !this.nodes.has(node.parentId)) {
      throw new Error("Parent node must exist.");
    }
    this.nodes.set(node.id, node);
    return node;
  }

  get(id: string): MissionNode | undefined {
    return this.nodes.get(id);
  }

  transition(id: string, to: MissionState, actorId: string, reason: string): MissionNode {
    const node = this.nodes.get(id);
    if (!node) throw new Error("Mission node not found.");

    const allowed = transitions[node.state];
    if (!allowed.includes(to)) {
      throw new Error(`Invalid mission transition: ${node.state} -> ${to}`);
    }

    if (to === "READY" && node.dependencies.some(dep => {
      const d = this.nodes.get(dep);
      return !d || d.state !== "SUCCEEDED";
    })) {
      throw new Error("Mission dependencies are not satisfied.");
    }

    if (to === "SUCCEEDED" && node.verificationCriteria.length === 0) {
      throw new Error("Cannot succeed without verification criteria.");
    }

    const timestamp = new Date().toISOString();
    this.history.push({ from: node.state, to, reason, actorId, timestamp });
    node.state = to;
    node.updatedAt = timestamp;
    return node;
  }

  children(parentId: string): MissionNode[] {
    return [...this.nodes.values()].filter(n => n.parentId === parentId);
  }

  transitions(): MissionTransition[] {
    return [...this.history];
  }

  exportState(): { nodes: MissionNode[]; history: MissionTransition[] } {
    return {
      nodes: [...this.nodes.values()].map(n => ({ ...n })),
      history: [...this.history].map(h => ({ ...h }))
    };
  }

  importState(state: { nodes: MissionNode[]; history: MissionTransition[] }): void {
    this.nodes.clear();
    this.history.length = 0;
    for (const node of state.nodes) this.nodes.set(node.id, { ...node });
    this.history.push(...state.history.map(h => ({ ...h })));
  }
}
