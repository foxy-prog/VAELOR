import { randomUUID } from "node:crypto";
import { CognitiveContext, CognitiveCycle, CognitiveObservation, CognitivePhase } from "./types.js";
import { InferencePort } from "./inference-port.js";

export interface CognitivePorts {
  observe(): Promise<CognitiveObservation>;
  buildContext(observation: CognitiveObservation): Promise<CognitiveContext>;
  updateBeliefs(observation: CognitiveObservation, context: CognitiveContext): Promise<void>;
  identifyObjectives(context: CognitiveContext): Promise<string[]>;
  prioritize(objectives: string[], context: CognitiveContext): Promise<string[]>;
  plan(objectives: string[], context: CognitiveContext, inference: InferencePort): Promise<unknown>;
  authorize(plan: unknown, context: CognitiveContext): Promise<"APPROVED" | "PENDING" | "DENIED">;
  execute(plan: unknown, context: CognitiveContext): Promise<unknown>;
  verify(result: unknown, plan: unknown, context: CognitiveContext): Promise<"PASS" | "PARTIAL" | "FAIL" | "UNCERTAIN">;
  updateState(result: unknown, context: CognitiveContext): Promise<void>;
  learn(result: unknown, verification: string, context: CognitiveContext): Promise<void>;
}

const phases: CognitivePhase[] = [
  "OBSERVE", "INTERPRET", "CONTEXT", "BELIEF_UPDATE", "OBJECTIVES",
  "PRIORITIZE", "PLAN", "AUTHORIZE", "EXECUTE", "VERIFY",
  "UPDATE_STATE", "LEARN", "ANTICIPATE"
];

export class CognitiveRuntime {
  constructor(
    private readonly ports: CognitivePorts,
    private readonly inference: InferencePort
  ) {}

  async runCycle(): Promise<CognitiveCycle> {
    const now = new Date().toISOString();
    const cycle: CognitiveCycle = {
      id: randomUUID(),
      phase: "OBSERVE",
      status: "RUNNING",
      startedAt: now,
      updatedAt: now,
      evidenceRefs: [],
      errors: []
    };

    try {
      cycle.phase = "OBSERVE";
      const observation = await this.ports.observe();
      cycle.observation = observation;

      cycle.phase = "INTERPRET";
      const interpretation = await this.inference.interpret(observation);

      cycle.phase = "CONTEXT";
      const context = await this.ports.buildContext(observation);
      cycle.context = context;

      cycle.phase = "BELIEF_UPDATE";
      await this.ports.updateBeliefs(observation, context);

      cycle.phase = "OBJECTIVES";
      const objectives = await this.ports.identifyObjectives(context);

      cycle.phase = "PRIORITIZE";
      const prioritized = await this.ports.prioritize(objectives, context);

      cycle.phase = "PLAN";
      const plan = await this.ports.plan(prioritized, context, this.inference);

      cycle.phase = "AUTHORIZE";
      const authorization = await this.ports.authorize(plan, context);
      if (authorization === "PENDING") {
        cycle.status = "WAITING_AUTHORIZATION";
        cycle.updatedAt = new Date().toISOString();
        return cycle;
      }
      if (authorization === "DENIED") {
        cycle.status = "ESCALATED";
        cycle.errors.push("Plan denied by governance.");
        cycle.updatedAt = new Date().toISOString();
        return cycle;
      }

      cycle.phase = "EXECUTE";
      const result = await this.ports.execute(plan, context);

      cycle.phase = "VERIFY";
      const verification = await this.ports.verify(result, plan, context);

      if (verification === "FAIL") {
        cycle.status = "FAILED";
        cycle.errors.push("Execution failed independent verification.");
        return cycle;
      }

      if (verification === "UNCERTAIN") {
        cycle.status = "ESCALATED";
        cycle.errors.push("Verification uncertain; autonomous continuation blocked.");
        return cycle;
      }

      cycle.phase = "UPDATE_STATE";
      await this.ports.updateState(result, context);

      cycle.phase = "LEARN";
      await this.ports.learn(result, verification, context);

      cycle.phase = "ANTICIPATE";
      await this.inference.anticipate(context);

      cycle.phase = "OBSERVE";
      cycle.status = verification === "PARTIAL" ? "RUNNING" : "COMPLETED";
      cycle.updatedAt = new Date().toISOString();
      return cycle;
    } catch (error) {
      cycle.status = "ESCALATED";
      cycle.errors.push(String(error));
      cycle.updatedAt = new Date().toISOString();
      return cycle;
    }
  }
}
