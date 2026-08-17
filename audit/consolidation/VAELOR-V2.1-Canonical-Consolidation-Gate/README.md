# VÆLOR V2.1 — Canonical Integration Core + Persistent Runtime

This package advances the existing VÆLOR Integration Core without rebuilding its subsystems.

## Added in this gate

- Canonical contract primitives and convergence rules.
- Duplicate planning opportunity definitions removed in favor of canonical aliases.
- Versioned local persistent runtime state.
- Atomic `state.json` snapshots.
- Append-only `journal.ndjson` durability records.
- Restart restoration for Mission Kernel, Memory, World Model, and Trace state.
- Persistence restart integration test.
- Integration Gate 2 documentation.

## Runtime boundary

```text
Cognition → Mission Kernel → Governance → Tool Gateway → Execution
→ Verification → Recovery → Observability → Persistent State → Next Cycle
```

VÆLOR runtime does not require an external AI provider. Any future inference substrate remains replaceable behind the cognitive boundary.

## Build

```bash
tsc -b
```

## Test

```bash
node dist/tests/integration-smoke.test.js
node dist/tests/persistence-restart.test.js
```

## Start

```bash
node dist/services/core/src/runtime/main.js
```

Persistence is opt-in through `PersistentStateStore`; the next production gate will define the durable database boundary and encryption/secret-management requirements.
