# VÆLOR V2.1 — Authorization & Capability Engine

## Purpose

The Authorization & Capability Engine is VÆLOR's access-control layer.

It answers:

> "Is this authenticated identity permitted to perform this specific capability on this resource under the current conditions?"

It is distinct from authentication, Zero Trust, and Governance.

## Security Position

VÆLANCE
→ Identity & Authentication
→ Device Trust
→ Zero Trust
→ Authorization & Capability Engine
→ Governance
→ Tool Gateway
→ Execution
→ Verification
→ Audit / Recovery

## Core Principles

- Single-user identity model.
- No unnecessary Owner/Operator/Admin role hierarchy.
- Least privilege.
- Capability-based authorization.
- Explicit resource and action boundaries.
- Context-aware decisions.
- Risk-aware decisions.
- Governance-aware decisions.
- Default deny.
- Fail closed.
- No implicit authorization from authentication.
- No AI component may grant itself authority.
- Tool Gateway must enforce the authorization decision.

## Authorization Decision

Every protected request should evaluate:

1. Identity
2. Device trust
3. Session validity
4. Requested capability
5. Target resource
6. Current context
7. Applicable policy
8. Risk level
9. Autonomy level
10. Approval requirements

The engine returns exactly one primary decision:

- `ALLOW`
- `DENY`
- `REQUIRE_APPROVAL`

## Example

Identity:
`PRIMARY`

Device:
`TRUSTED`

Capability:
`memory.write`

Resource:
`production_memory`

Context:
`active_mission`

Policy:
`PERMITTED`

Risk:
`MEDIUM`

Autonomy:
`L2`

Decision:

`ALLOW`

## Denial Example

Identity:
`PRIMARY`

Device:
`UNKNOWN`

Capability:
`system.execute`

Resource:
`production_host`

Context:
`no_active_mission`

Risk:
`HIGH`

Decision:

`DENY`

## Approval Example

Identity:
`PRIMARY`

Device:
`TRUSTED`

Capability:
`high_impact.execute`

Risk:
`HIGH`

Policy:
`APPROVAL_REQUIRED`

Decision:

`REQUIRE_APPROVAL`

## Enforcement

Authorization must be enforced at the capability boundary.

The preferred enforcement point is:

`Authorization Engine → Tool Gateway`

The Tool Gateway must reject execution when:

- authorization is missing,
- authorization has expired,
- the authorization context has changed,
- the device/session is no longer trusted,
- Governance denies the action,
- required approval is absent,
- the requested capability exceeds the granted capability.

## Default-Deny Model

Unknown capabilities, unknown resources, malformed authorization requests, unavailable policy evaluation, and ambiguous security state must fail closed.

No component should interpret an authorization failure as permission.

## Auditability

Every authorization decision should produce an auditable decision record containing, where applicable:

- request ID
- identity reference
- device reference
- session reference
- capability
- resource
- context
- policy reference
- risk assessment
- autonomy level
- decision
- reason
- timestamp
- trace ID

Do not store sensitive credentials or private keys in authorization records.

## Relationship With Governance

Authorization does not replace Governance.

Authorization determines whether the requested capability is permitted under the evaluated conditions.

Governance remains responsible for higher-level authority, policy, autonomy, mission constraints, and safety boundaries.

A successful authentication or authorization decision must never override Governance.

## Relationship With Zero Trust

Zero Trust continuously evaluates whether the conditions surrounding a request remain trustworthy.

Authorization consumes those trust signals as part of its decision.

Therefore:

`Authenticated ≠ Authorized`

and:

`Authorized once ≠ Permanently Authorized`

## Relationship With VÆLANCE

VÆLANCE establishes the authenticated single-user identity and trusted-device/session state.

It does not provide unrestricted access.

`VÆLANCE → prove identity`

`Authorization → determine capability access`

`Governance → determine permitted authority`

## Engineering Requirements

The implementation should provide:

- deterministic authorization decisions
- capability registry
- resource/action definitions
- policy evaluation interface
- contextual decision input
- approval integration
- decision expiration
- revocation support
- audit events
- testable enforcement contracts
- fail-closed behavior
- Tool Gateway enforcement

## Security Boundary

The Authorization Engine is a security boundary, not a conversational or cognitive component.

Cognitive systems may request actions.

They may not authorize themselves.

All privileged execution must pass through the authorization and governance chain.

## V2.1 Maturity Boundary

This package defines the canonical authorization contract and enforcement boundary.

It does not claim that the complete authorization implementation is already integrated into every existing VÆLOR package.

Integration is complete only after:

1. capability registry is implemented,
2. authorization decisions are enforced,
3. Governance integration is validated,
4. Tool Gateway enforcement is validated,
5. denial/approval/revocation tests pass,
6. audit records are generated,
7. end-to-end mission tests demonstrate that unauthorized execution is impossible through supported interfaces.
