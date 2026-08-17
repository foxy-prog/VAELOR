# VÆLOR V2.1 — Canonical Source Policy

## Status
Candidate canonical engineering baseline.

## Rule
This repository is the single source candidate for the VÆLOR V2.1 runtime. Other gate archives are treated as evidence, test fixtures, or historical implementation snapshots until explicitly merged and validated here.

## Precedence
1. VÆLOR V2.1 constitutional architecture.
2. Approved system/data/security contracts.
3. This repository's validated implementation.
4. Gate archives only as implementation references.

## No silent divergence
A component may not be copied into this repository merely because a newer archive contains it. Any merge must identify the source, contract impact, tests added/changed, and acceptance result.

## External AI boundary
External AI tools may assist development. They are not runtime dependencies, sources of authority, memory, policy, or identity for VÆLOR.
