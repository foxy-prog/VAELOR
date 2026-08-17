# VÆLOR V2.1 — Canonical Contract

## Purpose

This document establishes the convergence rule for the VÆLOR runtime. New modules must use the canonical primitives and lifecycle contracts rather than introducing parallel representations.

## Canonical primitives

- Authority: `0..3`; authority is a ceiling, never a permission by itself.
- Trust zones: `CORE`, `LOCAL`, `SANDBOX`, `EXTERNAL`, `REMOTE`.
- Risk: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`.
- Evidence and verification are first-class references.
- Every consequential operation carries actor identity, run/trace identity, authority context, and verification expectations.

## Canonical work hierarchy

`OBJECTIVE → INITIATIVE → PROJECT → MISSION → TASK → ACTION`

The Mission Kernel is authoritative for work-node lifecycle state. Planning creates plans; it does not own execution state. Opportunity and Initiative engines discover/evaluate candidates; they do not silently commit them.

## Canonical execution boundary

`AGENT → TOOL REQUEST → IDENTITY → CAPABILITY → POLICY → AUTHORITY → RISK → PARAMETER VALIDATION → EXECUTION → VERIFICATION → EVIDENCE → AUDIT`

No execution path may bypass the Tool Gateway.

## Canonical outcome states

Verification produces `PASS`, `PARTIAL`, `FAIL`, or `UNCERTAIN`. `UNCERTAIN` is not success and must escalate or replan according to policy.

## Persistence contract

The local runtime maintains a versioned atomic snapshot plus an append-only durability journal. This is a persistence foundation, not yet a full event-sourced database. Production migration to PostgreSQL/event-log infrastructure is a later maturity gate.

## Compatibility rule

Legacy module-local types may remain temporarily for compatibility, but they must map to the canonical contract at integration boundaries. No new duplicate lifecycle or authority model may be introduced.
