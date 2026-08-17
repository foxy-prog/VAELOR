import type { InferencePort } from "./inference-port.js";
import type { CognitiveContext, CognitiveObservation, CognitiveProposal } from "./types.js";

/**
 * Deterministic, local inference substrate.
 *
 * This is deliberately not marketed as a foundation model or general AGI.
 * It provides a controlled internal reasoning primitive for structured inputs
 * while the VÆLOR architecture owns authority, memory, planning, execution,
 * verification, recovery, and policy.
 */
export class NativeInferenceEngine implements InferencePort {
  async interpret(input: CognitiveObservation): Promise<{ interpretation: unknown; confidence: number }> {
    const trustWeight = input.trust === "VERIFIED" ? 1 : input.trust === "AUTHORIZED" ? 0.8 : 0.35;
    return {
      interpretation: {
        source: input.source,
        trust: input.trust,
        data: input.data,
        observedAt: input.observedAt,
        classification: this.classify(input.data)
      },
      confidence: trustWeight
    };
  }

  async propose(interpretation: unknown, context: CognitiveContext): Promise<CognitiveProposal> {
    const objective = context.objectiveIds[0];
    const rationale = objective
      ? `Advance objective ${objective} using the currently authorized context.`
      : "No active objective was identified; recommendation remains non-committal.";

    return {
      ...(objective ? { objective } : {}),
      plan: { interpretation, constraints: context.constraints },
      requestedAuthority: "L0",
      actions: [],
      rationale,
      confidence: objective ? 0.7 : 0.25
    };
  }

  async anticipate(context: CognitiveContext): Promise<{ signals: unknown[]; confidence: number }> {
    const signals: unknown[] = [];
    if (context.objectiveIds.length === 0) signals.push({ type: "NO_ACTIVE_OBJECTIVE" });
    if (context.constraints.length > 0) signals.push({ type: "ACTIVE_CONSTRAINTS", count: context.constraints.length });
    return { signals, confidence: signals.length === 0 ? 0.5 : 0.7 };
  }

  private classify(data: unknown): string {
    if (data === null || data === undefined) return "EMPTY";
    if (Array.isArray(data)) return "COLLECTION";
    if (typeof data === "object") return "STRUCTURED";
    return typeof data;
  }
}
