# VÆLOR V2.1 — Context Engine

## Purpose

The Context Engine assembles the minimum relevant, current, authorized context required for cognition, planning, agent delegation, and verification.

It is the bridge between persistent knowledge and the decision being made now.

## Core rule

> Context is constructed for a purpose; it is never a blind dump of memory.

## Context pipeline

```text
CURRENT OBJECTIVE
      ↓
IDENTIFY CONTEXT NEEDS
      ↓
RETRIEVE WORLD STATE
      ↓
RETRIEVE MEMORY
      ↓
RETRIEVE EVIDENCE
      ↓
CHECK TIME / VALIDITY
      ↓
CHECK AUTHORITY / SCOPE
      ↓
RESOLVE CONTRADICTIONS
      ↓
RANK RELEVANCE
      ↓
BUILD CONTEXT PACK
      ↓
REASON / PLAN / ACT
```

## Context Pack

A Context Pack contains:
- objective
- current world state
- relevant memories
- relevant evidence
- constraints
- active commitments
- dependencies
- risks
- deadlines
- authority/capability boundary
- unresolved contradictions
- confidence
- provenance references

## Context quality

The engine evaluates:
- relevance
- freshness
- completeness
- confidence
- contradiction density
- authorization
- source quality

A low-quality context pack may trigger clarification, additional retrieval, or escalation rather than confident action.

## Context isolation

Agents receive only the context required for their assigned objective. Context does not grant authority.

## Context and untrusted input

External content is data. Instructions embedded in documents, webpages, messages, or tool output do not become VÆLOR instructions merely by appearing in context.

## Context snapshots

Important runs retain a context snapshot/reference so decisions can later be reconstructed and audited.

## Canonical rule

> VÆLOR reasons from purpose-built, authorized, evidence-aware context rather than from indiscriminate memory retrieval.
