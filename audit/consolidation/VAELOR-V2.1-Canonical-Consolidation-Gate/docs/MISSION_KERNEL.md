# VÆLOR V2.1 — Mission Kernel Specification

## Purpose

The Mission Kernel is the controlled bridge between cognition and execution. It converts authorized objectives into explicit, traceable work while preserving scope, dependencies, success criteria, verification criteria, authority ceilings, and failure handling.

## Canonical hierarchy

```text
OBJECTIVE
   ↓
INITIATIVE
   ↓
PROJECT
   ↓
MISSION
   ↓
TASK
   ↓
ACTION
```

Discovery may propose an Initiative. Planning may decompose an Objective into work. Governance determines whether consequential work may proceed. The Mission Kernel owns lifecycle state; it does not bypass governance.

## Required mission properties

Every executable mission must have:
- owner
- objective
- scope
- constraints
- dependencies
- success criteria
- verification criteria
- authority ceiling
- risk classification
- deadline where applicable
- evidence references
- lifecycle state

## Lifecycle

```text
DRAFT
  ↓
PLANNED
  ↓
AUTHORIZED
  ↓
READY
  ↓
RUNNING
  ├── BLOCKED
  ├── PAUSED
  ├── FAILED → RECOVERY
  └── VERIFYING
          ├── SUCCEEDED
          ├── PARTIAL → REPLAN
          └── UNCERTAIN → ESCALATE
```

A mission cannot transition directly from planning to execution without required authorization.

## Commitment boundary

Opportunity discovery and initiative generation do not create commitments. Commitment occurs only when an authorized policy/user decision promotes the work into an executable mission.

## Dependency rule

A task/action cannot become READY while required predecessors remain incomplete or invalid.

## Completion rule

A mission is not SUCCEEDED because an action returned successfully. It becomes SUCCEEDED only after its defined verification criteria pass.
