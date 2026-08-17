# VÆLOR V2.1 — Real PostgreSQL Validation Gate

This gate is the next maturity step after the consistency/recovery foundation.

## Completion criterion

The gate is NOT considered complete merely because the harness compiles.
It becomes complete only when the scenarios in `TEST-MATRIX.md` pass against
a disposable real PostgreSQL instance.

## Run

1. Start the disposable database:
   `docker compose -f infrastructure/postgres-validation/docker-compose.yml up -d`
2. Set:
   `DATABASE_URL=postgres://vaelor_test:vaelor_test@localhost:55432/vaelor_validation`
3. Apply the normal VÆLOR migrations.
4. Run the validation harness.
5. Record PASS/FAIL evidence.
6. Perform backup/restore and outage drills before promoting the data layer.

## Non-negotiable

Never use a production database for destructive validation.
