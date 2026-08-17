/**
 * Contract-level validation for the cognitive cycle.
 * It uses deterministic ports/inference so this gate tests orchestration,
 * not model quality.
 */
import { CognitiveRuntime } from "../../src/runtime/cognitive/cognitive-runtime.js";
import { InferencePort } from "../../src/runtime/cognitive/inference-port.js";

const inference: InferencePort = {
  async interpret() { return { interpretation: "test", confidence: 0.9 }; },
  async propose() { return { rationale: "test", confidence: 0.9 }; },
  async anticipate() { return { signals: [], confidence: 0.8 }; }
};

const seen: string[] = [];
const ports = {
  async observe() { seen.push("OBSERVE"); return { source: "test", data: {}, observedAt: new Date().toISOString(), trust: "VERIFIED" as const }; },
  async buildContext() { seen.push("CONTEXT"); return { objectiveIds: ["o1"], activeMissionIds: [], memoryRefs: [], worldEntityRefs: [], constraints: [] }; },
  async updateBeliefs() { seen.push("BELIEF_UPDATE"); },
  async identifyObjectives() { seen.push("OBJECTIVES"); return ["o1"]; },
  async prioritize(o: string[]) { seen.push("PRIORITIZE"); return o; },
  async plan() { seen.push("PLAN"); return { objective: "o1" }; },
  async authorize() { seen.push("AUTHORIZE"); return "APPROVED" as const; },
  async execute() { seen.push("EXECUTE"); return { ok: true }; },
  async verify() { seen.push("VERIFY"); return "PASS" as const; },
  async updateState() { seen.push("UPDATE_STATE"); },
  async learn() { seen.push("LEARN"); }
};

(async () => {
  const runtime = new CognitiveRuntime(ports, inference);
  const cycle = await runtime.runCycle();
  const required = ["OBSERVE","CONTEXT","BELIEF_UPDATE","OBJECTIVES","PRIORITIZE","PLAN","AUTHORIZE","EXECUTE","VERIFY","UPDATE_STATE","LEARN"];
  for (const phase of required) {
    if (!seen.includes(phase)) throw new Error(`Missing phase: ${phase}`);
  }
  if (cycle.status !== "COMPLETED") throw new Error(`Unexpected status: ${cycle.status}`);
  console.log("PASS: cognitive runtime deterministic contract");
})();
