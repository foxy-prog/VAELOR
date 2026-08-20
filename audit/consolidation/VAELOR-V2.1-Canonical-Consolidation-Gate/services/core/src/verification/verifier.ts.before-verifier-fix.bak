import type { VerificationRequest, VerificationResult } from "../../../../packages/types/src/verification.js";

export class VerificationEngine {
  evaluate(request: VerificationRequest, observed: Record<string, boolean>, evidenceIds: string[]): VerificationResult {
    const satisfied = request.criteria.filter(c => observed[c.id] === true).map(c => c.id);
    const failed = request.criteria.filter(c => observed[c.id] !== true).map(c => c.id);
    const requiredFailed = request.criteria.some(c => c.required && observed[c.id] !== true);

    let status: VerificationResult["status"] = "PASS";
    if (requiredFailed && satisfied.length > 0) status = "PARTIAL";
    if (requiredFailed && satisfied.length === 0) status = "FAIL";
    if (!request.criteria.length || !evidenceIds.length) status = "UNCERTAIN";

    return {
      requestId: request.id,
      status,
      satisfiedCriteria: satisfied,
      failedCriteria: failed,
      evidenceIds,
      rationale: status === "PASS" ? "All required criteria satisfied." : "Verification criteria require further action.",
      confidence: status === "UNCERTAIN" ? 0 : satisfied.length / request.criteria.length
    };
  }
}
