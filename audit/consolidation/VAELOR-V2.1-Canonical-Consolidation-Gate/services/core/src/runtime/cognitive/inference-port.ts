import { CognitiveContext, CognitiveObservation, CognitiveProposal } from "./types.js";

export interface InferencePort {
  interpret(input: CognitiveObservation): Promise<{ interpretation: unknown; confidence: number }>;
  propose(
    interpretation: unknown,
    context: CognitiveContext
  ): Promise<CognitiveProposal>;
  anticipate(
    context: CognitiveContext
  ): Promise<{ signals: unknown[]; confidence: number }>;
}

/**
 * VÆLOR does not depend on a named external AI provider.
 * The runtime owns the cognitive loop; an inference implementation is an
 * interchangeable substrate behind this contract.
 */
