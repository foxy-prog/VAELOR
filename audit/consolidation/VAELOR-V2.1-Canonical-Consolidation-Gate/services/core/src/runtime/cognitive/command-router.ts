export type CommandIntent =
  | "STATUS"
  | "MISSION"
  | "ARCHITECTURE"
  | "CAPABILITIES"
  | "DEMO"
  | "CLEAR"
  | "HELP"
  | "EXIT"
  | "UNKNOWN";

export interface CognitiveCommand {
  intent: CommandIntent;
  raw: string;
  confidence: number;
  parameters: Record<string, string>;
  requiresAuthorization: boolean;
}

export class CognitiveCommandRouter {
  route(raw: string): CognitiveCommand {
    const text = raw.trim().toLowerCase();
    const parameters = this.extractParameters(raw, text);

    if (!text) {
      return this.unknown(raw);
    }

    if (/\b(status|state|health|online|operational)\b/.test(text)) {
      return this.command("STATUS", raw, 0.98);
    }

    if (
      /\b(run|start|execute|launch|begin)\b.*\b(mission|objective|operation)\b/.test(text) ||
      /\bmission\b/.test(text)
    ) {
      return this.command("MISSION", raw, 0.96, true, parameters);
    }

    if (
      /\b(show|display|explain|view)\b.*\b(architecture|execution flow)\b/.test(text) ||
      /\barchitecture\b/.test(text)
    ) {
      return this.command("ARCHITECTURE", raw, 0.98);
    }

    if (
      /\b(capabilities|capability|abilities|what can you do|what can vaelor do)\b/.test(text)
    ) {
      return this.command("CAPABILITIES", raw, 0.99);
    }

    if (/\b(demo|demonstrate|demonstration)\b/.test(text)) {
      return this.command("DEMO", raw, 0.99);
    }

    if (
      /\b(clear|clean)\b.*\b(screen|terminal)\b/.test(text) ||
      text === "clear"
    ) {
      return this.command("CLEAR", raw, 0.99);
    }

    if (/\b(help|commands|what can i say)\b/.test(text)) {
      return this.command("HELP", raw, 0.99);
    }

    if (
      /\b(exit|quit|shutdown|shut down|terminate|stop vaelor)\b/.test(text)
    ) {
      return this.command("EXIT", raw, 0.99);
    }

    return this.unknown(raw);
  }

  private extractParameters(
    raw: string,
    text: string,
  ): Record<string, string> {
    const parameters: Record<string, string> = {
      priority: "NORMAL",
      executionMode: "STANDARD",
      verification: "optional",
    };

    // Target extraction.
    const target =
      raw.match(
        /(?:on|at|for|against|target(?:ing)?)\s+([A-Za-z0-9._-]+)/i,
      )?.[1];

    if (target) {
      parameters.target = target;
    }

    // Objective extraction.
    if (/\breconnaissance\b|\brecon\b/i.test(text)) {
      parameters.objective = "reconnaissance";
    } else if (
      /\banalys(?:e|is|ing)\b|\banalyze\b|\banalysis\b/i.test(text)
    ) {
      parameters.objective = "analysis";
    } else if (/\binspect\b|\binspection\b/i.test(text)) {
      parameters.objective = "inspection";
    } else if (/\bpatrol\b|\bpatrolling\b/i.test(text)) {
      parameters.objective = "patrol";
    } else if (/\bsearch\b|\bsearching\b/i.test(text)) {
      parameters.objective = "search";
    }

    // Verification requirement.
    if (
      /\bverify\b|\bverification\b|\bvalidate\b|\bvalidated\b|\bconfirm\b/.test(
        text,
      )
    ) {
      parameters.verification = "required";
    }

    // Priority.
    if (/\bcritical\b|\bemergency\b|\burgent\b/.test(text)) {
      parameters.priority = "CRITICAL";
    } else if (/\bhigh priority\b|\bhigh-priority\b|\bimmediately\b/.test(text)) {
      parameters.priority = "HIGH";
    } else if (/\blow priority\b|\blow-priority\b/.test(text)) {
      parameters.priority = "LOW";
    }

    // Execution mode.
    if (
      /\bcautious\b|\bcareful\b|\bconservative\b|\bmanual oversight\b/.test(
        text,
      )
    ) {
      parameters.executionMode = "CAUTIOUS";
    } else if (
      /\bautonomous\b|\bfully autonomous\b|\bwithout intervention\b/.test(
        text,
      )
    ) {
      parameters.executionMode = "AUTONOMOUS";
    }

    return parameters;
  }

  private command(
    intent: CommandIntent,
    raw: string,
    confidence: number,
    requiresAuthorization = false,
    parameters: Record<string, string> = {},
  ): CognitiveCommand {
    return {
      intent,
      raw,
      confidence,
      parameters,
      requiresAuthorization,
    };
  }

  private unknown(raw: string): CognitiveCommand {
    return {
      intent: "UNKNOWN",
      raw,
      confidence: 0,
      parameters: {},
      requiresAuthorization: false,
    };
  }
}
