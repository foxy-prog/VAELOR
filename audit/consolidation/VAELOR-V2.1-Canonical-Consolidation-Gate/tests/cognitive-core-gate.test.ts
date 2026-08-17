import { CognitiveRuntime } from "../services/core/src/runtime/cognitive/cognitive-runtime.js";
import { NativeInferenceEngine } from "../services/core/src/runtime/cognitive/native-inference.js";
import type { CognitivePorts } from "../services/core/src/runtime/cognitive/cognitive-runtime.js";
import type { CognitiveObservation, CognitiveContext } from "../services/core/src/runtime/cognitive/types.js";

const observation: CognitiveObservation = {
  source: "local.test",
  data: { objective: "validate-cognition" },
  observedAt: new Date().toISOString(),
  trust: "AUTHORIZED"
};

const context: CognitiveContext = {
  objectiveIds: ["objective.validate-cognition"],
  activeMissionIds: [],
  memoryRefs: [],
  worldEntityRefs: [],
  constraints: ["no-external-ai-runtime"]
};

const ports: CognitivePorts = {
  async observe() { return observation; },
  async buildContext() { return context; },
  async updateBeliefs() {},
  async identifyObjectives() { return context.objectiveIds; },
  async prioritize(objectives) { return objectives; },
  async plan(objectives, ctx, inference) {
    const interpreted = await inference.interpret(observation);
    return inference.propose(interpreted.interpretation, ctx);
  },
  async authorize() { return "APPROVED"; },
  async execute(plan) { return { plan, evidenceIds: ["evidence:cognitive-test"] }; },
  async verify() { return "PASS"; },
  async updateState() {},
  async learn() {}
};

const runtime = new CognitiveRuntime(ports, new NativeInferenceEngine());
const cycle = await runtime.runCycle();
if (cycle.status !== "COMPLETED") throw new Error(`Expected COMPLETED, got ${cycle.status}`);
if (cycle.phase !== "OBSERVE") throw new Error(`Expected cycle to return to OBSERVE, got ${cycle.phase}`);
console.log("PASS: VÆLOR native cognitive core gate");
