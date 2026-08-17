# VÆLOR V2.1 — Observability, Audit & Replay Specification

## Purpose

Observability makes every meaningful VÆLOR operation reconstructable. It is an operational control surface, not merely logging.

## Canonical trace

```text
RUN
 ↓
TRACE
 ↓
EVENTS
 ↓
CONTEXT / MEMORY REFERENCES
 ↓
POLICY DECISIONS
 ↓
AGENT DECISIONS
 ↓
TOOL CALLS
 ↓
EXECUTION RESULTS
 ↓
VERIFICATION
 ↓
RECOVERY
 ↓
FINAL OUTCOME
```

## Trace requirements

Every meaningful operation receives:
- run_id
- trace_id
- event_id
- timestamp
- component
- actor/agent identity
- action or decision type
- input/context references
- policy/authority decision
- tool invocation references
- result status
- verification status
- error/failure classification

Sensitive payloads should be referenced or redacted according to policy rather than indiscriminately copied into logs.

## Audit

Audit records answer:
- Who or what acted?
- Under whose authority?
- What was requested?
- What policy was applied?
- What capability was used?
- What changed?
- What evidence supports the result?
- Was the result verified?
- What recovery occurred?

## Replay

Replay reconstructs the logical sequence of a run using recorded events, versions, state references, and evidence. Replay is for diagnosis and review; it must not silently re-execute real-world side effects.

## Integrity

Audit records should be append-oriented and tamper-evident. Production implementation should define retention, access control, redaction, integrity protection, and export procedures.

## Observability boundaries

Observability must not become a privilege bypass. Viewing traces is governed by authorization and sensitive data policy.

## Operational signals

The system should expose:
- active runs
- stalled runs
- failed actions
- repeated failures
- policy denials
- authorization requests
- verification uncertainty
- recovery activity
- resource/health signals

The observability layer reports reality; it does not rewrite it.
