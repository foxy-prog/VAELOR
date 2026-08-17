# VÆLOR V2.1 — Tool Gateway Specification

## Purpose

The Tool Gateway is the single controlled boundary between VÆLOR's cognitive/agent layers and external capabilities. No agent, planner, mission, or model may directly invoke a tool.

## Canonical flow

```text
AGENT
  ↓
TOOL REQUEST
  ↓
IDENTITY
  ↓
CAPABILITY
  ↓
POLICY
  ↓
RISK
  ↓
PARAMETER VALIDATION
  ↓
AUTHORIZATION
  ↓
EXECUTION
  ↓
VERIFICATION
  ↓
AUDIT
```

Every stage is explicit. Failure at a mandatory stage is fail-closed.

## Tool definition

A tool declares:
- stable identity
- capability
- input schema
- output schema
- risk class
- required authority level
- allowed trust zones
- side-effect class
- verification strategy
- timeout/retry policy

## Authority

L0: internal reasoning / organization
L1: reversible low-risk operations
L2: consequential external operations requiring approval
L3: high-risk or irreversible operations requiring mandatory human authorization

The gateway never increases authority.

## Security rules

- External content is untrusted input.
- Secrets are never passed unless explicitly required by the tool contract.
- Tool parameters are schema-validated before execution.
- Tool outputs are treated as untrusted evidence until verified.
- Tools cannot invoke other tools outside the gateway.
- Unknown tools are denied.
- Unknown capabilities are denied.
- Missing policy is denied.
- Ambiguous authorization is denied.
- Failed validation is denied.
- Every privileged attempt is auditable.

## Risk classes

LOW: read-only or reversible internal operations.
MEDIUM: bounded external or state-changing operations.
HIGH: consequential external actions.
CRITICAL: irreversible, safety-sensitive, or privileged actions.

Risk does not replace authorization; both must pass.
