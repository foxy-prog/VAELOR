import type { InferencePort } from "../inference-port.js";
import type { CognitiveContext } from "../types.js";

export interface EvidenceRecord {
  evidenceId: string;
  runId: string;
  traceId: string;
  source: string;
  claim: string;
  observedAt: string;
  verificationStatus: "PASS" | "PARTIAL" | "FAIL" | "UNCERTAIN";
  provenance: string[];
}

export interface GovernanceDecision {
  allowed: boolean;
  reason: string;
  evidence: EvidenceRecord[];
}

export class GovernedCognitiveCore {
  constructor(private readonly inference: InferencePort) {}

  async evaluate(
    objective: string,
    context: CognitiveContext,
    runId: string,
    traceId: string
  ): Promise<GovernanceDecision> {
    const interpretation = await this.inference.interpret({
      objective,
      context
    } as any);

    const evidence: EvidenceRecord = {
      evidenceId: `evidence_${Date.now()}`,
      runId,
      traceId,
      source: "native-inference",
      claim: JSON.stringify(interpretation),
      observedAt: new Date().toISOString(),
      verificationStatus: "UNCERTAIN",
      provenance: ["native-inference"]
    };

    return {
      allowed: false,
      reason: "Cognitive output requires independent verification before governance acceptance.",
      evidence: [evidence]
    };
  }
}	
