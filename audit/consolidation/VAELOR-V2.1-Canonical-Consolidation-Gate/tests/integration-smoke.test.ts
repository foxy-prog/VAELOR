import { VaelorRuntime } from "../services/core/src/runtime/vaelor-runtime.js";
import type { MissionNode } from "../packages/types/src/mission-kernel.js";
import type { ToolDefinition } from "../packages/types/src/tools.js";

const runtime = new VaelorRuntime();
const tool: ToolDefinition = {
  id: "system.echo", capability: "system.echo", inputSchema: {type:"object"}, outputSchema: {type:"object"},
  risk: "LOW", requiredAuthority: 0, allowedTrustZones: ["LOCAL_TRUSTED"], sideEffect: "NONE",
  verificationStrategy: "STATE_CHECK", timeoutMs: 1000, retryable: true
};
runtime.registerTool(tool, parameters => ({result: parameters, observed: {echoed: true}, evidenceIds: ["evidence:echo"]}));
const now = new Date().toISOString();
const mission: MissionNode = {
  id:"mission.integration.smoke", kind:"MISSION", title:"Integration smoke mission", ownerId:"operator", state:"DRAFT",
  authorityCeiling:1, risk:"LOW", scope:["integration"], constraints:[], dependencies:[], successCriteria:["echoed"],
  verificationCriteria:["echoed"], evidence:[], createdAt:now, updatedAt:now
};
const result = await runtime.runMission({mission, actions:[{
  id:"action.integration.echo", missionId:mission.id, taskId:"task.integration.echo", toolId:tool.id, capability:tool.capability,
  authority:0, trustZone:"LOCAL_TRUSTED", parameters:{message:"VÆLOR"}, preconditions:[], expectedSideEffects:[],
  verification:{id:"verification.integration.echo", actionId:"action.integration.echo", expectedOutcome:"echo succeeds",
    criteria:[{id:"echoed",description:"Tool reports echo success",required:true}], evidenceIds:[], method:"STATE_CHECK"}
}]});
if (result.status !== "SUCCEEDED") throw new Error(`Expected SUCCEEDED, got ${result.status}`);
if (runtime.missionKernel.get(mission.id)?.state !== "SUCCEEDED") throw new Error("Mission did not reach SUCCEEDED");
if (runtime.trace.get(result.traceId)?.status !== "SUCCEEDED") throw new Error("Trace did not reach SUCCEEDED");
console.log("PASS: VÆLOR integration smoke test");
