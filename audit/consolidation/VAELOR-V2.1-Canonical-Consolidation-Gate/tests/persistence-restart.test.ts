import { mkdtemp, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { VaelorRuntime } from "../services/core/src/runtime/vaelor-runtime.js";
import { PersistentStateStore } from "../services/core/src/persistence/state-store.js";
import type { MissionNode } from "../packages/types/src/mission-kernel.js";

const root = await mkdtemp(join(tmpdir(), "vaelor-v21-"));
try {
  const mission: MissionNode = {
    id: "mission.persistence.001",
    kind: "MISSION",
    title: "Persistence continuity test",
    ownerId: "operator",
    state: "DRAFT",
    authorityCeiling: 0,
    risk: "LOW",
    scope: ["test"],
    constraints: [],
    dependencies: [],
    successCriteria: ["runtime restarts with mission state intact"],
    verificationCriteria: ["mission state is SUCCEEDED after restart"],
    evidence: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const first = new VaelorRuntime({ persistence: new PersistentStateStore(root) });
  await first.restore();
  const result = await first.runMission({ mission, actions: [] });
  if (result.status !== "SUCCEEDED") throw new Error(`Expected SUCCEEDED, got ${result.status}`);

  const second = new VaelorRuntime({ persistence: new PersistentStateStore(root) });
  await second.restore();
  const restored = second.missionKernel.get(mission.id);
  if (!restored || restored.state !== "SUCCEEDED") throw new Error("Mission state was not restored.");

  const snapshot = JSON.parse(await readFile(join(root, "state.json"), "utf8"));
  if (snapshot.schemaVersion !== 1) throw new Error("Unexpected snapshot schema.");

  const journal = await second.persistence!.journal();
  if (journal.length < 1) throw new Error("Durability journal is empty.");

  console.log("PASS: VÆLOR persistent restart continuity");
} finally {
  await rm(root, { recursive: true, force: true });
}
