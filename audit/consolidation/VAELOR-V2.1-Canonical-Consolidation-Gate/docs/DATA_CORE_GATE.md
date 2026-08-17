# VÆLOR V2.1 — Production Data Core Gate

## Gate objective
Move VÆLOR from restart-safe local persistence to a real transactional production data boundary.

## Required outcomes
- PostgreSQL schema exists and is versioned.
- Canonical runtime state can be loaded and committed.
- Commit is atomic across mission, memory, world and trace state.
- Runtime event evidence is durable.
- Database failure fails closed rather than silently reverting to an unapproved store.
- Credentials remain outside model-visible state.
- Migration is repeatable and version checked.

## Not yet claimed
This gate does **not** claim high availability, distributed consensus, automatic backups, encryption-at-rest configuration, disaster recovery, or multi-user tenancy. Those are later production hardening concerns and must be explicitly validated before production deployment.
