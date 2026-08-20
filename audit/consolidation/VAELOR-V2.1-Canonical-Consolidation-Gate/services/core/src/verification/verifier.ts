import type {
  VerificationRequest,
  VerificationResult,
} from "../../../../packages/types/src/verification.js";

export class VerificationEngine {
  evaluate(
    request: VerificationRequest,
    observed: Record<string, boolean>,
    evidenceIds: string[],
  ): VerificationResult {
    const criteria = request.criteria;

    if (criteria.length === 0) {
      return {
        requestId: request.id,
        status: "UNCERTAIN",
        satisfiedCriteria: [],
        failedCriteria: [],
        evidenceIds,
        rationale: "No verification criteria were defined.",
        confidence: 0,
      };
    }

    const satisfiedCriteria = criteria
      .filter((criterion) => observed[criterion.id] === true)
      .map((criterion) => criterion.id);

    const failedCriteria = criteria
      .filter((criterion) => observed[criterion.id] !== true)
      .map((criterion) => criterion.id);

    const requiredCriteria = criteria.filter(
      (criterion) => criterion.required,
    );

    const failedRequiredCriteria = requiredCriteria.filter(
      (criterion) => observed[criterion.id] !== true,
    );

    const satisfiedRequiredCriteria = requiredCriteria.filter(
      (criterion) => observed[criterion.id] === true,
    );

    let status: VerificationResult["status"];

    if (failedRequiredCriteria.length === 0) {
      status = "PASS";
    } else if (satisfiedRequiredCriteria.length > 0) {
      status = "PARTIAL";
    } else {
      status = "FAIL";
    }

    if (evidenceIds.length === 0) {
      status = "UNCERTAIN";
    }

    const confidence =
      status === "UNCERTAIN"
        ? 0
        : requiredCriteria.length === 0
          ? 1
          : satisfiedRequiredCriteria.length / requiredCriteria.length;

    let rationale: string;

    switch (status) {
      case "PASS":
        rationale = "All required verification criteria satisfied.";
        break;

      case "PARTIAL":
        rationale =
          "Some required verification criteria were satisfied, but one or more required criteria failed.";
        break;

      case "FAIL":
        rationale =
          "No required verification criteria were satisfied.";
        break;

      case "UNCERTAIN":
        rationale =
          "Verification could not be established because no evidence was supplied.";
        break;
    }

    return {
      requestId: request.id,
      status,
      satisfiedCriteria,
      failedCriteria,
      evidenceIds,
      rationale,
      confidence,
    };
  }
}
