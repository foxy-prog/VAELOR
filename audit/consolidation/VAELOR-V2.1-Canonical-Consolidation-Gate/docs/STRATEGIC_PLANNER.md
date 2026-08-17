# VÆLOR V2.1 — Strategic Planner

## Purpose

The Strategic Planner converts authorized strategic direction and evaluated initiatives into coherent, constraint-aware plans. It connects long-term intent to operational objectives without directly executing actions.

## Separation of concerns

```text
STRATEGY     = where / why
OBJECTIVE    = measurable outcome
PLAN         = how the outcome will be approached
MISSION      = authorized executable pursuit
ACTION       = individual operation
```

The planner does not grant authority and does not bypass the Mission Kernel or Governance Plane.

## Planning hierarchy

```text
VISION / GOALS
      ↓
STRATEGIC OBJECTIVES
      ↓
STRATEGIC INITIATIVES
      ↓
PHASES
      ↓
OPERATIONAL OBJECTIVES
      ↓
MISSIONS
      ↓
TASKS
      ↓
ACTIONS
```

## Planning inputs

The planner may use:
- verified world state
- validated memory
- active commitments
- authorized initiatives
- constraints
- resources
- deadlines
- dependencies
- risk information
- historical experience
- evidence and confidence

## Planning outputs

A strategic plan contains:
- objective
- rationale
- desired outcomes
- assumptions
- constraints
- phases
- dependencies
- milestones
- resources
- risks
- alternatives
- success criteria
- verification criteria
- review points
- confidence
- expiry/replanning conditions

## Dynamic planning

Plans are not treated as permanent truth. Significant changes in world state, constraints, evidence, deadlines, failures, or authority can trigger reassessment.

```text
PLAN
 ↓
EXECUTION / OBSERVATION
 ↓
STATE CHANGE
 ↓
PLAN VALIDITY CHECK
 ├── VALID → CONTINUE
 ├── DEGRADED → ADAPT
 └── INVALID → REPLAN
```

## Commitment boundary

The planner may propose a route to an objective. It cannot:
- authorize itself
- create consequential external commitments
- exceed resource authority
- silently change strategic goals
- execute tools directly
- convert recommendations into missions without the required decision boundary

## Plan quality

A plan should be:
- goal-aligned
- feasible
- dependency-aware
- resource-aware
- risk-aware
- measurable
- verifiable
- reversible where practical
- explainable
- resilient to expected failure

## Canonical rule

> VÆLOR plans toward authorized objectives, continuously tests whether the plan remains valid, and replans when reality invalidates assumptions.
