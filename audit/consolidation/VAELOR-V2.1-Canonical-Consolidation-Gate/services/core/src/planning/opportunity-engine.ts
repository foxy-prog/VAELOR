import type { OpportunityCandidate } from "../../../../packages/types/src/opportunity.js";

/** Compatibility adapter. New opportunity logic belongs to the canonical OpportunityEngine. */
export class PlanningOpportunityAdapter {
  score(candidate: OpportunityCandidate): number {
    return candidate.value + candidate.alignment + candidate.urgency + candidate.strategicFit + candidate.confidence - candidate.risk - candidate.effort;
  }
}
