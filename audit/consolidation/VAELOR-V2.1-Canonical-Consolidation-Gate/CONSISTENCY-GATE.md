# VÆLOR V2.1 — Consistency + Recovery Gate

## Purpose

This gate hardens the production data boundary against concurrent writers, duplicate commit retries, and ambiguous durable state.

## Guarantees

- Canonical state commits are serialized at the database boundary.
- Every production state commit uses optimistic version checking.
- A stale runtime cannot overwrite newer canonical state.
- Commit intent has a stable idempotency key.
- Replaying an already-applied commit is treated as an idempotent success.
- State mutation and the corresponding runtime event are committed in one database transaction.
- Database durability failure is surfaced to the runtime as an escalation condition.
- Runtime state has a monotonically increasing `BIGINT` version.
- A checkpoint table is reserved for future backup/restore and integrity workflows.

## Trust Boundary

```text
Runtime
  ↓
ProductionDataStore
  ↓
PostgreSQL Transaction
  ├── advisory transaction lock
  ├── version check
  ├── canonical state mutation
  ├── runtime event
  └── version increment
  ↓
Durable State
```

## Failure Rules

| Condition | Required behavior |
|---|---|
| Stale state version | Reject commit; do not mutate state |
| Duplicate commit key | Return previously applied version; do not duplicate mutation |
| Transaction failure | Roll back the entire commit |
| Database unavailable | Escalate; never claim durable success |
| Invalid commit key | Reject before mutation |

## Important limitation

This gate is an implementation hardening layer, not proof of production readiness. A real PostgreSQL deployment must still pass concurrency, crash, rollback, backup/restore, corruption, outage, retention, and disaster-recovery testing before the runtime is considered production mission-critical.
