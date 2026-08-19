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
      return this.command("MISSION", raw, 0.96, true);
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

    if (/\b(clear|clean)\b.*\b(screen|terminal)\b/.test(text) || text === "clear") {
      return this.command("CLEAR", raw, 0.99);
    }

    if (/\b(help|commands|what can i say)\b/.test(text)) {
      return this.command("HELP", raw, 0.99);
    }

    if (/\b(exit|quit|shutdown|shut down|terminate|stop vaelor)\b/.test(text)) {
      return this.command("EXIT", raw, 0.99);
    }

    return this.unknown(raw);
  }

  private command(
    intent: CommandIntent,
    raw: string,
    confidence: number,
    requiresAuthorization = false,
  ): CognitiveCommand {
    return {
      intent,
      raw,
      confidence,
      parameters: {},
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
