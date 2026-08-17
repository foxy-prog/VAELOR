# VÆLOR V2.1 — Production Memory Engine

## Purpose

The Production Memory Engine provides persistent, typed, provenance-aware memory for VÆLOR. Memory is evidence-linked state, not an undifferentiated chat transcript.

## Memory hierarchy

| Layer | Meaning | Default treatment |
|---|---|---|
| L1 | Facts | Stable, evidence-backed |
| L2 | Preferences | User-operating preferences |
| L3 | Decisions | Explicit choices and commitments |
| L4 | Patterns | Repeated behavioral observations |
| L5 | Predictions | Hypotheses; never facts |
| Operational | Current state | Active and time-sensitive |
| Episodic | Experiences | What happened |
| Procedural | Procedures | Validated ways of doing things |
| Working | Current reasoning context | Short-lived |

## Memory record

Every persistent memory item should contain:
- stable identity
- type/layer
- content
- provenance/evidence references
- confidence
- source
- created/updated timestamps
- validity window where applicable
- verification status
- contradiction status
- scope
- sensitivity classification

## Write policy

Memory is not written blindly from model output.

```text
INPUT
 ↓
CLASSIFY
 ↓
PROVENANCE
 ↓
CONTRADICTION CHECK
 ↓
CONFIDENCE
 ↓
POLICY
 ↓
STORE / REJECT / HOLD
```

Predictions require stronger separation and must remain explicitly hypothetical.

## Contradictions

Contradictory information is retained as competing claims until resolved by evidence, user confirmation, expiration, or a defined resolution policy. VÆLOR must not silently overwrite important prior decisions.

## Retrieval

Retrieval should consider:
- semantic relevance
- temporal relevance
- domain/project scope
- confidence
- verification
- recency
- relationship/dependency relevance
- sensitivity/authorization

## Forgetting and expiration

Not all memory is permanent. Records may expire, be superseded, archived, or deleted according to retention policy. Deletion must be auditable where required.

## Security

Memory access is capability-scoped. An agent receives only the memory necessary for its mission. Sensitive memory is never exposed merely because it exists.

## Canonical rule

> Memory informs cognition; memory does not grant authority.
