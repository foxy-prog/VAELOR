import { VaelorRuntime } from "./vaelor-runtime.js";

const runtime = new VaelorRuntime();
console.log("VÆLOR V2.1 Integration Core");
console.log("Runtime: canonical integration boundary");
console.log("Inference: external AI provider not required");
console.log(`Mission kernel: ${runtime.missionKernel.constructor.name}`);
console.log(`Tool gateway: ${runtime.gateway.constructor.name}`);
console.log("Status: INTEGRATION CORE READY");
