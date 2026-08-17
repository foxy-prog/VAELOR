# VÆLOR V2.1 — Persistent Runtime

## Objective

Convert the integrated runtime from process-local state to restart-safe local state without prematurely coupling VÆLOR to a remote service.

## Design

```text
VÆLOR Runtime
     │
     ├── Canonical State
     │    ├── Missions + transitions
     │    ├── Memory
     │    ├── World model
     │    └── Traces
     │
     ▼
PersistentStateStore
     ├── state.json      ← atomic versioned snapshot
     └── journal.ndjson  ← append-only durability record
```

## Guarantees

- Atomic snapshot replacement using temporary-file + rename.
- Versioned state schema.
- Restart restoration for canonical operational state.
- Journal sequence numbers for durability evidence.
- Local-first operation with no external AI dependency.

## Deliberate non-goals

This layer is not yet a distributed database, event-sourcing implementation, encrypted secret store, or multi-user synchronization service. Those belong behind later security and production maturity gates.
