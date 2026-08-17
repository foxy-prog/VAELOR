# VÆLOR V2.1 — Production Data Core

## Purpose
The Production Data Core establishes PostgreSQL as the production persistence boundary for VÆLOR's canonical runtime state. It replaces file snapshots as the target production store while preserving local-first operation and a driver-neutral runtime interface.

## Canonical responsibilities
- Durable missions and mission transitions.
- L1–L5 and operational/episodic/procedural/working memory records.
- World entities and relations.
- Trace records and trace events.
- Durable runtime commit events.
- Transactional state commits.
- Schema versioning and migrations.
- Health checks and controlled shutdown.

## Transaction rule
A runtime state commit and its corresponding runtime event are committed in one database transaction. Failure causes rollback; partial state must not be published.

## Security rule
Database credentials are infrastructure secrets. They never enter prompts, memory records, trace payloads, or tool parameters. Database access is restricted to the persistence service boundary.

## Consistency rule
Mission lifecycle remains owned by Mission Kernel. The database persists authoritative state; it does not invent transitions or bypass governance.

## Current deployment boundary
- Development: file-backed PersistenceStateStore remains available for offline work.
- Production: PostgresDataStore is the canonical durable boundary.
- Migration: `npm run migrate` with `VAELOR_DATABASE_URL`.

## Acceptance gate
Before this component is considered production-ready, run:
1. migration against a real PostgreSQL instance;
2. concurrent commit tests;
3. crash/rollback tests;
4. restart/load tests;
5. backup/restore test;
6. authorization and secret-isolation tests;
7. retention and deletion-policy tests;
8. long-run trace growth tests.
