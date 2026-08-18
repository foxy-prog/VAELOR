import { CognitiveEngine } from "../cognitive/cognitive-engine.js";
import { DeterministicProvider } from "../cognitive/deterministic-provider.js";
import { AgentOrchestrator } from "../agents/orchestrator.js";
import { ContextEngine } from "../context/context-engine.js";
import { ExecutionEngine } from "../execution/execution-engine.js";
import { InitiativeEngine } from "../initiative/initiative-engine.js";
import { LearningEngine } from "../learning/learning-engine.js";
import { MemoryStore } from "../memory/memory-store.js";
import { MissionKernel } from "../mission/mission-kernel.js";
import { TraceStore } from "../observability/trace-store.js";
import { OpportunityEngine } from "../opportunity/opportunity-engine.js";
import { PlanningEngine } from "../planning/planner.js";
import { StrategicPlanner } from "../strategy/strategic-planner.js";
import { ToolGateway } from "../tools/tool-gateway.js";
import { RecoveryEngine } from "../verification/recovery.js";
import { VerificationEngine } from "../verification/verifier.js";
import { WorldModel } from "../world/world-model.js";
import type { TraceEvent } from "../../../../packages/types/src/trace.js";
import type { ToolRequest } from "../../../../packages/types/src/tools.js";
import type { MissionState } from "../../../../packages/types/src/mission-kernel.js";
import { ToolExecutorRegistry } from "./tool-executor-registry.js";
import type { MissionRunRequest, MissionRunResult } from "./types.js";
import { PersistentStateStore } from "../persistence/state-store.js";
import { DurabilityError } from "../data/production-data-core.js";
import type {
  ProductionDataStore,
  RuntimeState
} from "../data/production-data-core.js";

/**
 * Canonical VÆLOR integration runtime.
 *
 * This is the integration boundary, not a foundation-model implementation.
 * No external AI provider is required. Reasoning/inference remains replaceable
 * behind the cognitive layer while authority, missions, tools, verification,
 * recovery, evidence, and observability remain owned by VÆLOR.
 */
export interface VaelorRuntimeOptions {
  /** Development/offline persistence. */
  persistence?: PersistentStateStore;

  /** Production canonical persistence boundary. */
  dataStore?: ProductionDataStore;
}

export class VaelorRuntime {
  readonly missionKernel = new MissionKernel();
  readonly agents = new AgentOrchestrator();
  readonly context = new ContextEngine();
  readonly memory = new MemoryStore();
  readonly world = new WorldModel();
  readonly opportunity = new OpportunityEngine();
  readonly initiative = new InitiativeEngine();
  readonly planning = new PlanningEngine();

  readonly cognitive = new CognitiveEngine(
    new DeterministicProvider(),
    this.context,
    this.memory,
    this.world,
    this.planning
  );

  readonly strategy = new StrategicPlanner();
  readonly gateway = new ToolGateway();
  readonly executors = new ToolExecutorRegistry();
  readonly execution = new ExecutionEngine(this.gateway);
  readonly verification = new VerificationEngine();
  readonly recovery = new RecoveryEngine();
  readonly learning = new LearningEngine();
  readonly trace = new TraceStore();

  readonly persistence: PersistentStateStore | undefined;
  readonly dataStore: ProductionDataStore | undefined;

  private dataVersion = 0n;
  private commitSequence = 0;

  constructor(options: VaelorRuntimeOptions = {}) {
    this.persistence = options.persistence;
    this.dataStore = options.dataStore;
  }

  async restore(): Promise<void> {
    const production = this.dataStore
      ? await this.dataStore.loadRuntimeState()
      : undefined;

    if (production) {
      this.importRuntimeState(production);
      this.dataVersion = await this.dataStore!.getVersion();
      return;
    }

    if (!this.persistence) return;

    const snapshot = await this.persistence.load();
    if (!snapshot) return;

    this.importRuntimeState(
      snapshot.state as unknown as RuntimeState
    );
  }

  private importRuntimeState(state: RuntimeState): void {
    if (state.missions) {
      this.missionKernel.importState(state.missions);
    }

    if (Array.isArray(state.memory)) {
      this.memory.importState(state.memory);
    }

    if (state.world) {
      this.world.importState(state.world);
    }

    if (Array.isArray(state.traces)) {
      this.trace.importState(state.traces);
    }
  }

  private currentRuntimeState(): RuntimeState {
    return {
      missions: this.missionKernel.exportState(),
      memory: this.memory.exportState(),
      world: this.world.exportState(),
      traces: this.trace.exportState()
    };
  }

  private async persist(
    reason: string,
    runId?: string,
    traceId?: string
  ): Promise<void> {
    const state = this.currentRuntimeState();

    const event = {
      type: "RUNTIME_STATE_COMMITTED",
      ...(runId ? { runId } : {}),
      ...(traceId ? { traceId } : {}),
      payload: { reason }
    };

    try {
      if (this.dataStore) {
        this.commitSequence += 1;

        this.dataVersion =
          await this.dataStore.commitRuntimeState(
            state,
            {
              ...event,
              eventId:
                `${runId ?? "run"}:` +
                `${traceId ?? "trace"}:` +
                `${this.commitSequence}:` +
                `${reason}`
            },
            this.dataVersion
          );

        return;
      }

      if (this.persistence) {
        await this.persistence.commit(
          state as unknown as Record<string, unknown>,
          event
        );
      }
    } catch (error) {
      throw new DurabilityError(
        `Runtime state could not be durably committed: ${reason}`,
        { cause: error }
      );
    }
  }

  private emit(
    event: Omit<TraceEvent, "eventId" | "timestamp">
  ): void {
    this.trace.append({
      ...event,
      eventId:
        `run_${Date.now()}_` +
        Math.random().toString(36).slice(2, 10),
      timestamp: new Date().toISOString()
    });
  }

  registerTool(
    definition: Parameters<ToolGateway["register"]>[0],
    executor: Parameters<ToolExecutorRegistry["register"]>[1]
  ): void {
    this.gateway.register(definition);
    this.executors.register(definition, executor);
  }

  async runMission(
    request: MissionRunRequest
  ): Promise<MissionRunResult> {
    const { mission } = request;

    const runId =
      `run_${Date.now()}_` +
      Math.random().toString(36).slice(2, 10);

    const traceId =
      `trace_${Date.now()}_` +
      Math.random().toString(36).slice(2, 10);

    this.trace.start(runId, traceId);

    this.emit({
      runId,
      traceId,
      type: "RUN_STARTED",
      actor: mission.ownerId,
      component: "runtime",
      summary: `Mission ${mission.id} started.`,
      references: [mission.id]
    });

    try {
      this.missionKernel.register({ ...mission });

      await this.persist(
        "mission_registered",
        runId,
        traceId
      );

      this.emit({
        runId,
        traceId,
        type: "CONTEXT_BOUND",
        actor: "vaelor.core",
        component: "mission-kernel",
        summary: "Mission registered in canonical runtime.",
        references: [mission.id]
      });

      this.transition(
        mission.id,
        "PLANNED",
        runId,
        traceId,
        "runtime"
      );

      this.transition(
        mission.id,
        "AUTHORIZED",
        runId,
        traceId,
        "runtime"
      );

      this.transition(
        mission.id,
        "READY",
        runId,
        traceId,
        "runtime"
      );

      this.transition(
        mission.id,
        "RUNNING",
        runId,
        traceId,
        "runtime"
      );

      const actionResults: MissionRunResult["actionResults"] = [];

      for (const action of request.actions) {
        const tool = this.executors.get(action.toolId);

        if (!tool) {
          throw new Error(
            `No executor registered for tool: ${action.toolId}`
          );
        }

        if (action.authority > mission.authorityCeiling) {
          this.emit({
            runId,
            traceId,
            type: "AUTHORIZATION_DENIED",
            actor: "vaelor.core",
            component: "runtime",
            summary:
              "Action exceeds mission authority ceiling.",
            references: [mission.id, action.id]
          });

          this.transition(
            mission.id,
            "ESCALATED",
            runId,
            traceId,
            "runtime"
          );

          this.trace.complete(
            traceId,
            "ESCALATED"
          );

          await this.persist(
            "mission_escalated",
            runId,
            traceId
          );

          return {
            missionId: mission.id,
            status: "ESCALATED",
            actionResults,
            traceId
          };
        }

        const toolRequest: ToolRequest = {
          id: action.id,
          agentId: "vaelor.core",
          missionId: action.missionId,
          toolId: action.toolId,
          capability: action.capability,
          authority: action.authority,
          trustZone: action.trustZone,
          parameters: action.parameters,
          ...(request.authorizationId
            ? { authorizationId: request.authorizationId }
            : {})
        };

        this.emit({
          runId,
          traceId,
          type: "POLICY_CHECKED",
          actor: "vaelor.core",
          component: "tool-gateway",
          summary:
            `Policy evaluated for ${action.toolId}.`,
          references: [action.id, action.toolId]
        });

        const decision =
          this.gateway.evaluate(toolRequest);

        if (!decision.allowed) {
          const type =
            decision.authorizationRequired
              ? "AUTHORIZATION_REQUESTED"
              : "AUTHORIZATION_DENIED";

          this.emit({
            runId,
            traceId,
            type,
            actor: "vaelor.core",
            component: "tool-gateway",
            summary: decision.reason,
            references: [action.id, action.toolId]
          });

          this.transition(
            mission.id,
            decision.authorizationRequired
              ? "ESCALATED"
              : "FAILED",
            runId,
            traceId,
            decision.reason
          );

          const status =
            decision.authorizationRequired
              ? "ESCALATED"
              : "ABORTED";

          this.trace.complete(
            traceId,
            status === "ESCALATED"
              ? "ESCALATED"
              : "ABORTED"
          );

          await this.persist(
            "tool_gate_decision",
            runId,
            traceId
          );

          return {
            missionId: mission.id,
            status,
            actionResults,
            traceId
          };
        }

        this.emit({
          runId,
          traceId,
          type: "AUTHORIZATION_GRANTED",
          actor: "vaelor.core",
          component: "tool-gateway",
          summary: "Tool request authorized.",
          references: [action.id]
        });

        this.emit({
          runId,
          traceId,
          type: "TOOL_CALLED",
          actor: "vaelor.core",
          component: "execution",
          summary:
            `Executing ${action.toolId}.`,
          references: [action.id, action.toolId]
        });

        try {
          const result =
            await tool.executor(action.parameters);

          this.emit({
            runId,
            traceId,
            type: "EXECUTION_RESULT",
            actor: "vaelor.core",
            component: "execution",
            summary:
              `Tool ${action.toolId} returned a result.`,
            references: [action.id],
            metadata: {
              evidenceCount: result.evidenceIds.length
            }
          });

          const verification =
            this.verification.evaluate(
              action.verification,
              result.observed,
              result.evidenceIds
            );

          this.emit({
            runId,
            traceId,
            type: "VERIFICATION_RESULT",
            actor: "vaelor.core",
            component: "verification",
            summary:
              `Verification: ${verification.status}.`,
            references: [
              action.id,
              ...verification.evidenceIds
            ]
          });

          actionResults.push({
            actionId: action.id,
            state:
              verification.status === "PASS"
                ? "VERIFIED"
                : verification.status,
            verification
          });

          if (verification.status === "FAIL") {
            this.emit({
              runId,
              traceId,
              type: "RECOVERY_STARTED",
              actor: "vaelor.core",
              component: "recovery",
              summary:
                "Action failed verification; recovery classification started.",
              references: [action.id]
            });

            const recovery =
              this.recovery.next(
                this.recovery.classify(
                  action.id,
                  "VERIFICATION_FAILURE"
                ),
                {
                  retrySafe: tool.definition.retryable,
                  alternativeAvailable: false,
                  rollbackAvailable:
                    tool.definition.sideEffect ===
                    "REVERSIBLE"
                }
              );

            if (recovery.state === "ESCALATE") {
              this.transition(
                mission.id,
                "ESCALATED",
                runId,
                traceId,
                recovery.rationale
              );

              this.trace.complete(
                traceId,
                "ESCALATED"
              );

              await this.persist(
                "verification_recovery_escalation",
                runId,
                traceId
              );

              return {
                missionId: mission.id,
                status: "ESCALATED",
                actionResults,
                traceId
              };
            }

            this.transition(
              mission.id,
              "RECOVERING",
              runId,
              traceId,
              recovery.rationale
            );

            this.trace.complete(
              traceId,
              "FAILED"
            );

            await this.persist(
              "verification_recovery_failure",
              runId,
              traceId
            );

            return {
              missionId: mission.id,
              status: "FAILED",
              actionResults,
              traceId
            };
          }

          if (verification.status === "UNCERTAIN") {
            this.transition(
              mission.id,
              "ESCALATED",
              runId,
              traceId,
              "Outcome could not be independently verified."
            );

            this.trace.complete(
              traceId,
              "ESCALATED"
            );

            await this.persist(
              "uncertain_verification",
              runId,
              traceId
            );

            return {
              missionId: mission.id,
              status: "ESCALATED",
              actionResults,
              traceId
            };
          }

          if (verification.status === "PARTIAL") {
            this.transition(
              mission.id,
              "PARTIAL",
              runId,
              traceId,
              "Mission action partially satisfied verification criteria."
            );

            this.trace.complete(
              traceId,
              "FAILED"
            );

            await this.persist(
              "partial_verification",
              runId,
              traceId
            );

            return {
              missionId: mission.id,
              status: "PARTIAL",
              actionResults,
              traceId
            };
          }
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : String(error);

          actionResults.push({
            actionId: action.id,
            state: "FAILED",
            error: message
          });

          const recovery =
            this.recovery.next(
              this.recovery.classify(
                action.id,
                "EXECUTION_FAILURE"
              ),
              {
                retrySafe: tool.definition.retryable,
                alternativeAvailable: false,
                rollbackAvailable:
                  tool.definition.sideEffect ===
                  "REVERSIBLE"
              }
            );

          this.emit({
            runId,
            traceId,
            type: "RECOVERY_STARTED",
            actor: "vaelor.core",
            component: "recovery",
            summary: recovery.rationale,
            references: [action.id]
          });

          this.transition(
            mission.id,
            recovery.state === "ESCALATE"
              ? "ESCALATED"
              : "FAILED",
            runId,
            traceId,
            message
          );

          this.trace.complete(
            traceId,
            recovery.state === "ESCALATE"
              ? "ESCALATED"
              : "FAILED"
          );

          await this.persist(
            "execution_failure",
            runId,
            traceId
          );

          return {
            missionId: mission.id,
            status:
              recovery.state === "ESCALATE"
                ? "ESCALATED"
                : "FAILED",
            actionResults,
            traceId
          };
        }
      }

      this.transition(
        mission.id,
        "VERIFYING",
        runId,
        traceId,
        "All actions completed; mission outcome verification."
      );

      this.transition(
        mission.id,
        "SUCCEEDED",
        runId,
        traceId,
        "All mission actions passed verification."
      );

      this.emit({
        runId,
        traceId,
        type: "RUN_COMPLETED",
        actor: "vaelor.core",
        component: "runtime",
        summary: "Mission succeeded.",
        references: [mission.id]
      });

      this.trace.complete(
        traceId,
        "SUCCEEDED"
      );

      await this.persist(
        "mission_succeeded",
        runId,
        traceId
      );

      return {
        missionId: mission.id,
        status: "SUCCEEDED",
        actionResults,
        traceId
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : String(error);

      if (error instanceof DurabilityError) {
        this.emit({
          runId,
          traceId,
          type: "RUN_ESCALATED",
          actor: "vaelor.core",
          component: "persistence",
          summary: message,
          references: [mission.id]
        });

        this.trace.complete(
          traceId,
          "ESCALATED"
        );

        return {
          missionId: mission.id,
          status: "ESCALATED",
          actionResults: [],
          traceId
        };
      }

      this.emit({
        runId,
        traceId,
        type: "RUN_FAILED",
        actor: "vaelor.core",
        component: "runtime",
        summary: message,
        references: [mission.id]
      });

      this.trace.complete(
        traceId,
        "FAILED"
      );

      try {
        await this.persist(
          "runtime_failure",
          runId,
          traceId
        );
      } catch {
        // Preserve original failure.
      }

      return {
        missionId: mission.id,
        status: "FAILED",
        actionResults: [],
        traceId
      };
    }
  }

  private transition(
    id: string,
    to: MissionState,
    runId: string,
    traceId: string,
    actorId: string
  ): void {
    this.missionKernel.transition(
      id,
      to,
      actorId,
      `Runtime transition: ${to}`
    );

    this.emit({
      runId,
      traceId,
      type: "EXECUTION_RESULT",
      actor: actorId,
      component: "mission-kernel",
      summary: `Mission transitioned to ${to}.`,
      references: [id],
      metadata: { state: to }
    });
  }
}
