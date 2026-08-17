# VÆLOR V2.1 — Integration Core

## Purpose

The Integration Core is the canonical runtime boundary that composes the existing VÆLOR subsystem foundations into one controlled execution loop. It does not replace the Mission Kernel, Governance, Memory, World Model, Agent Runtime, Tool Gateway, Planning, Verification, Recovery, or Observability subsystems.

## Canonical flow

Observe/context → plan → mission → authority/policy → tool gateway → execution → verification → recovery/replan/escalation → trace/evidence → state update → next cycle.

## Security invariants

- No execution occurs without Tool Gateway evaluation.
- An action cannot exceed its mission authority ceiling.
- High/critical-risk tools require explicit authorization according to the gateway policy.
- Verification is independent of the executor's success claim.
- Uncertain outcomes escalate rather than being treated as success.
- Recovery is bounded by tool retryability and side-effect classification.
- Trace events are emitted around governance, execution, verification, recovery, and mission transitions.
- The runtime does not require an external AI provider.

## Current scope

This release is an integration foundation. It proves the end-to-end control path with registered tool executors. Persistent database-backed state, production authorization storage, real external tools, richer evidence ingestion, UI, and long-running scheduling remain later gates.
