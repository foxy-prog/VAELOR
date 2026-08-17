/** Canonical concurrency/idempotency rules for VÆLOR durable state. */
export class ConcurrencyConflictError extends Error {
  readonly code = "CONCURRENCY_CONFLICT";
  constructor(readonly expectedVersion: bigint, readonly actualVersion: bigint) {
    super(`Durable state version conflict: expected ${expectedVersion}, actual ${actualVersion}.`);
    this.name = "ConcurrencyConflictError";
  }
}

export class IdempotencyConflictError extends Error {
  readonly code = "IDEMPOTENCY_CONFLICT";
  constructor(readonly key: string) {
    super(`Commit ${key} has already been applied.`);
    this.name = "IdempotencyConflictError";
  }
}

export interface VersionedState {
  version: bigint;
}

export class CommitCoordinator {
  assertExpectedVersion(expected: bigint, actual: bigint): void {
    if (expected !== actual) throw new ConcurrencyConflictError(expected, actual);
  }

  nextVersion(current: bigint): bigint {
    if (current < 0n) throw new Error("State version cannot be negative.");
    return current + 1n;
  }

  assertCommitKey(key: string): void {
    if (!/^[A-Za-z0-9._:-]{8,200}$/.test(key)) throw new Error("Invalid commit idempotency key.");
  }
}
