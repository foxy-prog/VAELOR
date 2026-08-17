# VÆLOR V2.1 — Canonical Source Consolidation Gate

## Objective
Turn the existing V2.1 package set into one reproducible runtime without silently mixing incompatible generations.

## Gate criteria
- [ ] One repository is designated canonical.
- [ ] Every retained component maps to a V2.1 contract.
- [ ] Duplicate implementations are removed from the runtime path.
- [ ] TypeScript source builds cleanly.
- [ ] Runtime tests execute from source-built `dist` output.
- [ ] Persistence restart passes.
- [ ] Tool authorization denies unauthorized requests.
- [ ] Mission state transitions remain legal.
- [ ] Verification gates mission completion.
- [ ] Recovery and escalation are observable.
- [ ] Trace is reconstructable.
- [ ] No external AI provider is required by the runtime.

## Current decision
The latest Cognitive Runtime Gate is the baseline candidate. Older package archives remain references until individually reconciled.
