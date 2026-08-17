# VÆLOR V2.1 — Execution Engine Specification

## Purpose

The Execution Engine converts an authorized plan node into a controlled action attempt. It is not an autonomous authority layer and cannot bypass Governance or the Tool Gateway.

## Canonical execution flow

```text
PLAN NODE
   ↓
PRECONDITION CHECK
   ↓
AUTHORIZATION CHECK
   ↓
DISPATCH
   ↓
TOOL GATEWAY
   ↓
EXECUTE
   ↓
OBSERVE RESULT
   ↓
HAND OFF TO VERIFICATION
```

## Action lifecycle

```text
PLANNED → READY → AUTHORIZING → AUTHORIZED → EXECUTING
                                  ↓
             ┌────────────────────┼───────────────────┐
             ↓                    ↓                   ↓
          SUCCEEDED            FAILED             UNCERTAIN
             ↓                    ↓                   ↓
          VERIFY              RECOVERY            ESCALATE
```

Execution state is distinct from mission state. An action may succeed while the mission remains incomplete.

## Preconditions

Before execution:
- the referenced plan node exists
- dependencies are satisfied
- required capability exists
- authority is sufficient
- policy permits execution
- trust-zone constraints are satisfied
- required authorization is present
- parameters are validated
- the action is within scope

Failure of a mandatory precondition is fail-closed.

## Idempotency and retries

Each action has an execution identifier and idempotency strategy where applicable. Retries are permitted only when the operation is classified retry-safe and policy allows it.

The engine never assumes that a failed network call means the external action did not occur.

## Side effects

Execution records expected side effects before dispatch and observed side effects afterward. Consequential operations require verification.

## No direct model execution

Inference output may propose an action, but the Execution Engine accepts only structured, validated action requests from authorized system components.
