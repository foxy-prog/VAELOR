import type { RecoveryRecord } from "../../../../packages/types/src/verification.js";

export class RecoveryEngine {
  classify(actionId: string, failureClass: string): RecoveryRecord {
    return { actionId, state: "CLASSIFY", failureClass, attempt: 0, rationale: "Failure classified before recovery." };
  }

  next(record: RecoveryRecord, options: {
    retrySafe: boolean;
    alternativeAvailable: boolean;
    rollbackAvailable: boolean;
  }): RecoveryRecord {
    if (options.retrySafe) return {...record, state: "RETRY", attempt: record.attempt + 1, rationale: "Retry classified as safe."};
    if (options.alternativeAvailable) return {...record, state: "ALTERNATIVE", rationale: "Alternative recovery path available."};
    if (options.rollbackAvailable) return {...record, state: "ROLLBACK", rationale: "Rollback path available."};
    return {...record, state: "ESCALATE", rationale: "No safe automated recovery path."};
  }
}
