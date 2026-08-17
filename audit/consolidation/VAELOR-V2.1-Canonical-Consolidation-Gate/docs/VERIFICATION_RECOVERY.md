# VÆLOR V2.1 — Verification & Recovery Specification

## Purpose

Verification determines whether an intended outcome actually occurred. Recovery determines what VÆLOR may safely do when execution is failed, partial, uncertain, or degraded.

Execution output is never treated as proof of success.

## Verification model

```text
INTENDED STATE
      ↓
OBSERVED STATE
      ↓
EVIDENCE
      ↓
VERIFICATION
      ↓
PASS / PARTIAL / FAIL / UNCERTAIN
```

Verification should use an independent mechanism where practical. A tool reporting "success" is not sufficient evidence when an external state can be checked separately.

## Verification contract

Every consequential action defines:
- expected outcome
- observable indicators
- evidence requirements
- verification method
- tolerance/acceptance criteria
- timeout
- uncertainty policy

## Result semantics

PASS: required success criteria are satisfied.

PARTIAL: some criteria are satisfied; mission may require replanning.

FAIL: required outcome was not achieved.

UNCERTAIN: evidence is insufficient or contradictory; do not assume success.

## Recovery state machine

```text
FAIL / PARTIAL / UNCERTAIN
          ↓
       CLASSIFY
          ↓
    SAFE RETRY?
      /       \
    YES       NO
    ↓          ↓
 RETRY     ALTERNATIVE?
              /     \
            YES      NO
             ↓        ↓
        ALTERNATIVE  ROLLBACK?
                       /    \
                     YES     NO
                      ↓       ↓
                  ROLLBACK  ESCALATE
```

Recovery must preserve mission scope and authority.

## Recovery rules

- Never retry an unknown-side-effect action blindly.
- Never claim rollback unless rollback is verified.
- Never hide a partial outcome.
- Never expand scope solely because recovery is difficult.
- Escalate when evidence is contradictory, authority is insufficient, or safe recovery is unavailable.
- Every recovery attempt is independently traceable.

## Mission feedback

Verification feeds the Mission Kernel:

PASS → progress
PARTIAL → replan
FAIL → recovery
UNCERTAIN → evidence gathering or escalation

Verification is therefore part of mission control, not merely logging.
