# VÆLOR V2.1 — Agent Runtime & Orchestration Specification

## Purpose

Agents are bounded specialist cognitive workers. They do not become independent VÆLOR instances and do not possess authority beyond their declared ceiling.

## Agent contract

Every agent has:
- immutable identity
- role
- objective scope
- allowed memory scope
- capabilities
- permitted tools
- authority ceiling
- policy set
- output contract
- verification requirements
- escalation rules

## Orchestration

```text
MISSION KERNEL
      ↓
AGENT ORCHESTRATOR
      ↓
SELECT / DECOMPOSE / DELEGATE
      ↓
BOUNDED AGENT
      ↓
STRUCTURED RESULT
      ↓
VERIFY
      ↓
MISSION KERNEL
```

Agents communicate through typed delegation envelopes, never unrestricted peer-to-peer control.

## Non-negotiable rules

1. An agent cannot increase its own authority.
2. An agent cannot grant authority to another agent.
3. Agent output is untrusted until validated.
4. Agents cannot directly bypass the Tool Gateway.
5. Memory access is scope-limited.
6. Delegation must preserve the parent mission's constraints.
7. Failed or uncertain work must be surfaced explicitly.
8. Agents cannot silently convert recommendations into commitments.

## Initial specialist roles

- Chief of Staff
- Academic
- Career
- Engineering
- Research
- Communications
- Project Manager
- Scheduling
- Personal Operations

Roles are capabilities, not personalities.
