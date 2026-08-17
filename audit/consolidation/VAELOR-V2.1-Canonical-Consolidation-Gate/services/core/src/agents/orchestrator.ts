import type { AgentDefinition, AgentResult, DelegationEnvelope } from "../../../../packages/types/src/agents.js";

export class AgentOrchestrator {
  private readonly agents = new Map<string, AgentDefinition>();
  private readonly delegations = new Map<string, DelegationEnvelope>();

  register(agent: AgentDefinition): AgentDefinition {
    if (this.agents.has(agent.id)) throw new Error("Agent already registered.");
    this.agents.set(agent.id, agent);
    return agent;
  }

  get(id: string): AgentDefinition | undefined {
    return this.agents.get(id);
  }

  delegate(request: DelegationEnvelope): DelegationEnvelope {
    const parent = this.agents.get(request.parentAgentId);
    const target = this.agents.get(request.targetAgentId);
    if (!parent || !target) throw new Error("Unknown agent.");
    if (request.allowedCapabilities.some(c => !target.capabilities.includes(c))) {
      throw new Error("Delegation exceeds target capabilities.");
    }
    if (request.memoryScope.some(s => !target.memoryScope.includes(s))) {
      throw new Error("Delegation exceeds target memory scope.");
    }
    if (Math.max(...request.allowedCapabilities.map(() => target.authorityCeiling), 0) > parent.authorityCeiling) {
      throw new Error("Delegation cannot exceed parent authority.");
    }
    this.delegations.set(request.id, request);
    target.status = "ASSIGNED";
    return request;
  }

  complete(delegationId: string, result: AgentResult): AgentResult {
    if (!this.delegations.has(delegationId)) throw new Error("Unknown delegation.");
    if (result.confidence < 0 || result.confidence > 1) throw new Error("Confidence must be 0..1.");
    return result;
  }
}
