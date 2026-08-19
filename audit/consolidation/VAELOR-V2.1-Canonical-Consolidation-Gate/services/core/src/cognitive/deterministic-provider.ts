import type {
  CognitiveRequest,
  CognitiveResult,
  InferenceProvider
} from "./types.js";

export class DeterministicProvider implements InferenceProvider {
  async generate(request: CognitiveRequest): Promise<CognitiveResult> {
    const objective = request.objective;
    const objectiveText =
      `${objective.title} ${objective.description ?? ""} ${objective.scope.join(" ")}`
        .toLowerCase();

    const actionTool =
      request.availableTools?.find(tool => {
        const capability = tool.capability.toLowerCase().replace(/_/g, " ");
        const toolId = tool.id.toLowerCase().replace(/_/g, " ");

        return (
          objectiveText.includes(capability) ||
          objectiveText.includes(toolId) ||
          (objectiveText.includes("diagnostic") &&
            capability.includes("diagnostic")) ||
          (objectiveText.includes("system") &&
            capability.includes("system"))
        );
      });

    const plan = {
      id: `plan_${Date.now()}`,
      level: "OPERATIONAL" as const,
      objectiveId: objective.id,
      nodes: [
        {
          id: `action_${Date.now()}`,
          type: "ACTION" as const,
          title: objective.title,
          dependsOn: [],
          successCriteria: objective.successCriteria,
          verificationCriteria: objective.verificationCriteria,
          requiredCapabilities: actionTool
            ? [actionTool.capability]
            : []
        }
      ],
      assumptions: [
        "Objective is sufficiently specified for deterministic planning."
      ],
      risks: [
        `Mission risk classified as ${objective.risk}.`
      ],
      recoveryPaths: [
        "Escalate when execution or verification cannot safely continue."
      ],
      unresolvedDecisions: actionTool
        ? []
        : ["No compatible registered tool is currently available."],
      confidence: actionTool ? 0.8 : 0.35
    };

    return {
      plan,
      reasoning: [
        "Objective received.",
        `Risk evaluated as ${objective.risk}.`,
        actionTool
          ? `Compatible tool selected: ${actionTool.id}.`
          : "No compatible tool selected."
      ],
      confidence: plan.confidence,
      unresolvedDecisions: plan.unresolvedDecisions
    };
  }
}
