import { CommitCoordinator, ConcurrencyConflictError } from "../services/core/src/data/consistency.js";

const c = new CommitCoordinator();
if (c.nextVersion(0n) !== 1n) throw new Error("version increment failed");
c.assertExpectedVersion(4n, 4n);
let conflict = false;
try { c.assertExpectedVersion(4n, 5n); } catch (error) { conflict = error instanceof ConcurrencyConflictError; }
if (!conflict) throw new Error("optimistic concurrency conflict was not detected");
c.assertCommitKey("run:trace:mission_succeeded");
console.log("PASS: VÆLOR consistency gate contract");
