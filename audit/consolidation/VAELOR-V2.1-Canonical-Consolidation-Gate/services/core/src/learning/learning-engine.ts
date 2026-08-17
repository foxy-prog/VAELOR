import type { Experience, LearningCandidate } from "../../../../packages/types/src/learning.js";

export class LearningEngine {
  observe(experience: Experience): LearningCandidate {
    return {
      id: `lc_${experience.id}`,
      type: "HEURISTIC",
      state: "CANDIDATE",
      sourceExperienceIds: [experience.id],
      proposedChange: `Evaluate reusable learning from: ${experience.summary}`,
      confidence: experience.outcome === "SUCCESS" ? 0.5 : 0.2,
      securityImpact: "NONE",
      authorityImpact: "NONE",
      requiresApproval: true
    };
  }

  validate(candidate: LearningCandidate, repeatedEvidence: boolean): LearningCandidate {
    if (!repeatedEvidence || candidate.confidence < 0.7) {
      return {...candidate, state: "REJECTED"};
    }
    return {...candidate, state: "VALIDATING"};
  }
}
