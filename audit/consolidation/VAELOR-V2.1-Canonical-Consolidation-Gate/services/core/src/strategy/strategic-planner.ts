import type { StrategicPlan } from "../../../../packages/types/src/strategy.js";

export interface PlanningAssessment {
  feasibility: number;
  alignment: number;
  resourceFit: number;
  risk: number;
  confidence: number;
}

export class StrategicPlanner {
  evaluate(plan: StrategicPlan, assessment: PlanningAssessment): StrategicPlan {
    const quality =
      assessment.feasibility +
      assessment.alignment +
      assessment.resourceFit +
      assessment.confidence -
      assessment.risk;

    return {
      ...plan,
      state: quality >= 20 ? "PROPOSED" : "DRAFT",
      confidence: Math.max(0, Math.min(100, quality * 5))
    };
  }

  activate(plan: StrategicPlan, authorized: boolean): StrategicPlan {
    if (!authorized) throw new Error("Plan activation requires authorization.");
    if (plan.state !== "PROPOSED" && plan.state !== "APPROVED") {
      throw new Error("Plan is not ready for activation.");
    }
    return {...plan, state: "ACTIVE"};
  }

  assessValidity(
    plan: StrategicPlan,
    worldChanged: boolean,
    assumptionsBroken: boolean
  ): StrategicPlan {
    if (assumptionsBroken) return {...plan, state: "INVALIDATED"};
    if (worldChanged) return {...plan, state: "DEGRADED"};
    return plan;
  }
}
