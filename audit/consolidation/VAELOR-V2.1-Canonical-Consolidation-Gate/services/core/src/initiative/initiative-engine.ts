import type { InitiativeCandidate } from "../../../../packages/types/src/initiative.js";

export interface InitiativeAssessment {
  goalAlignment: number;
  resourceFit: number;
  strategicFit: number;
  conflictPenalty: number;
  riskPenalty: number;
}

export class InitiativeEngine {
  assess(candidate: InitiativeCandidate, assessment: InitiativeAssessment): InitiativeCandidate {
    const score =
      candidate.expectedValue +
      assessment.goalAlignment +
      assessment.resourceFit +
      assessment.strategicFit +
      candidate.confidence -
      candidate.effort -
      candidate.risk -
      assessment.conflictPenalty -
      assessment.riskPenalty;

    const recommendation =
      score >= 20 ? "COMMIT" :
      score >= 12 ? "EXPLORE" :
      score >= 6 ? "WATCH" : "REJECT";

    return {
      ...candidate,
      state: "EVALUATED",
      recommendedDecision: recommendation,
      rationale: [
        ...candidate.rationale,
        `strategicScore=${score}`,
        `goalAlignment=${assessment.goalAlignment}`,
        `resourceFit=${assessment.resourceFit}`,
        `strategicFit=${assessment.strategicFit}`,
        `conflictPenalty=${assessment.conflictPenalty}`,
        `riskPenalty=${assessment.riskPenalty}`
      ]
    };
  }

  recommend(candidate: InitiativeCandidate): InitiativeCandidate {
    return {...candidate, state: "RECOMMENDED"};
  }

  commit(candidate: InitiativeCandidate, authorized: boolean): InitiativeCandidate {
    if (!authorized) throw new Error("Initiative commitment requires authorization.");
    return {...candidate, state: "COMMITTED"};
  }
}
