import type { OpportunityCandidate } from "../../../../packages/types/src/opportunity.js";

export class OpportunityEngine {
  evaluate(input: Omit<OpportunityCandidate, "score" | "state">): OpportunityCandidate {
    const score =
      input.value +
      input.alignment +
      input.urgency +
      input.strategicFit +
      input.confidence -
      input.risk -
      input.effort;

    return {
      ...input,
      score,
      state: "RANKED",
      rationale: [
        `value=${input.value}`,
        `alignment=${input.alignment}`,
        `urgency=${input.urgency}`,
        `strategicFit=${input.strategicFit}`,
        `confidence=${input.confidence}`,
        `risk=${input.risk}`,
        `effort=${input.effort}`
      ]
    };
  }

  recommend(candidate: OpportunityCandidate): OpportunityCandidate {
    return {...candidate, state: "RECOMMENDED"};
  }

  commit(candidate: OpportunityCandidate, authorized: boolean): OpportunityCandidate {
    if (!authorized) throw new Error("Opportunity commitment requires authorization.");
    return {...candidate, state: "COMMITTED"};
  }
}
