# VÆLOR V2.1 — World Model

## Purpose

The World Model is VÆLOR's structured representation of the current operating environment. It connects persistent memory, active state, missions, projects, commitments, resources, events, risks, constraints, relationships, deadlines, dependencies, and opportunities.

Memory answers "what does VÆLOR know?" The World Model answers "what is the current state of the world relevant to VÆLOR?"

## Core principle

> The World Model is a maintained belief/state representation, not reality itself.

Every important assertion must retain provenance, confidence, temporal validity, and contradiction information.

## Canonical entities

```text
PERSON
GOAL
COMMITMENT
PROJECT
INITIATIVE
MISSION
TASK
ACTION
RESOURCE
EVENT
DEADLINE
CONSTRAINT
RISK
RELATIONSHIP
OPPORTUNITY
EVIDENCE
```

## Relationships

Examples:

```text
GOAL
 ├── motivates → INITIATIVE
 ├── contains → PROJECT
 └── constrained_by → CONSTRAINT

PROJECT
 ├── contains → MISSION
 ├── depends_on → PROJECT
 ├── uses → RESOURCE
 └── exposed_to → RISK

MISSION
 ├── decomposes_to → TASK
 ├── requires → RESOURCE
 ├── constrained_by → POLICY
 └── verified_by → EVIDENCE

EVENT
 └── changes → WORLD_STATE
```

## State model

The World Model separates:
- durable knowledge
- current operational state
- external observations
- predictions/hypotheses

A stale observation must not silently overwrite a newer verified state.

## Update pipeline

```text
OBSERVATION
    ↓
SOURCE / PROVENANCE
    ↓
NORMALIZE
    ↓
IDENTIFY ENTITY
    ↓
COMPARE CURRENT STATE
    ↓
CONTRADICTION / STALENESS CHECK
    ↓
CONFIDENCE
    ↓
POLICY CHECK
    ↓
UPDATE WORLD STATE
    ↓
EMIT EVENT
```

## Temporal integrity

State is time-aware. Important records may contain:
- observed_at
- effective_from
- effective_until
- updated_at

This allows VÆLOR to distinguish "was true" from "is true."

## Confidence

Confidence belongs to claims and observations, not to reality itself.

A low-confidence observation may inform planning but should not silently become a hard constraint.

## Contradictions

When sources disagree, VÆLOR records the conflict and preserves competing claims until resolved. Resolution may come from stronger evidence, newer observations, explicit user confirmation, or policy.

## World Model and memory

Memory stores validated knowledge and experience. The World Model assembles relevant knowledge into a current operational picture.

```text
MEMORY + EVIDENCE + EVENTS
            ↓
       WORLD MODEL
            ↓
         CONTEXT
            ↓
      PLANNING / ACTION
```

## Security

World Model access is capability-scoped. Agents receive only the entities and relationships required for their mission. Sensitive entities remain protected even if they are related to otherwise accessible data.

## No autonomous reality fabrication

Inference may propose a state. It cannot make the state true merely by generating it. External observations, verified execution results, or authorized user input must support consequential state changes.

## Canonical rule

> VÆLOR acts on verified or explicitly qualified beliefs about the world, never on unqualified generated assumptions.
