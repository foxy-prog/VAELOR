# VÆLOR V2.1 — Cognitive Runtime Gate

This gate converts the previously defined cognitive architecture into an
explicit orchestration runtime.

Canonical cycle:

OBSERVE → INTERPRET → CONTEXT → BELIEF_UPDATE → OBJECTIVES → PRIORITIZE
→ PLAN → AUTHORIZE → EXECUTE → VERIFY → UPDATE_STATE → LEARN → ANTICIPATE
→ OBSERVE

Rules:
- Inference is a replaceable substrate, not VÆLOR's identity.
- Authorization is mandatory before consequential execution.
- Verification is independent of execution.
- Uncertain verification escalates rather than silently succeeding.
- Denied authority never becomes permission through agent reasoning.
- The runtime owns the cycle; agents and inference are bounded participants.

This gate tests orchestration with deterministic components. Model quality and
production autonomy require later validation gates.
