import { createInterface } from "node:readline";
import { VaelorRuntime } from "./vaelor-runtime.js";

const runtime = new VaelorRuntime();

/* ============================================================
   RGB PALETTE — STRICTLY RGB
   ============================================================ */

const RGB = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",

  red: "\x1b[38;2;255;70;70m",
  green: "\x1b[38;2;60;255;150m",
  blue: "\x1b[38;2;80;150;255m",
  cyan: "\x1b[38;2;0;230;255m",
  magenta: "\x1b[38;2;255;60;220m",
  violet: "\x1b[38;2;160;80;255m",
  yellow: "\x1b[38;2;255;220;60m",
  white: "\x1b[38;2;245;245;255m",
} as const;

const rgb = (color: string, text: string): string =>
  `${color}${text}${RGB.reset}`;

const sleep = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

const clear = (): void => {
  process.stdout.write("\x1b[2J\x1b[H");
};

const hideCursor = (): void => {
  process.stdout.write("\x1b[?25l");
};

const showCursor = (): void => {
  process.stdout.write("\x1b[?25h");
};

const WIDTH = 68;

const line = (char = "═"): string => char.repeat(WIDTH);

/* ============================================================
   UI HELPERS
   ============================================================ */

function box(
  title: string,
  lines: string[],
  color: string = RGB.cyan
): void {
  console.log(rgb(color, `╔${line()}╗`));

  console.log(
    rgb(color, "║ ") +
      rgb(RGB.white + RGB.bold, title.padEnd(WIDTH - 1)) +
      rgb(color, "║")
  );

  console.log(rgb(color, `╠${line()}╣`));

  for (const text of lines) {
    console.log(
      rgb(color, "║ ") +
        text.slice(0, WIDTH - 2).padEnd(WIDTH - 1) +
        rgb(color, "║")
    );
  }

  console.log(rgb(color, `╚${line()}╝`));
}

async function progress(
  label: string,
  duration = 500,
  color: string = RGB.cyan
): Promise<void> {
  const total = 36;
  const frames = 18;
  const delay = duration / frames;

  for (let i = 0; i <= frames; i++) {
    const percent = Math.round((i / frames) * 100);
    const filled = Math.round((percent / 100) * total);

    const bar =
      rgb(color, "█".repeat(filled)) +
      rgb(RGB.dim, "░".repeat(total - filled));

    process.stdout.write(
      `\r  ${rgb(RGB.bold + color, label.padEnd(25))} ${bar} ${String(
        percent
      ).padStart(3)}%`
    );

    await sleep(delay);
  }

  process.stdout.write(` ${rgb(RGB.green, "✓")}\n`);
}

async function pulse(
  text: string,
  color: string = RGB.cyan
): Promise<void> {
  const frames = ["◐", "◓", "◑", "◒"];

  for (const frame of frames) {
    process.stdout.write(
      `\r  ${rgb(color, frame)} ${rgb(RGB.bold + color, text)}`
    );

    await sleep(80);
  }

  console.log(
    `\r  ${rgb(RGB.green, "◆")} ${rgb(
      RGB.bold + RGB.white,
      text
    )} ${rgb(RGB.green, "ONLINE")}`
  );
}

async function typeText(
  text: string,
  delay = 12,
  color: string = RGB.white
): Promise<void> {
  for (const char of text) {
    process.stdout.write(rgb(color, char));
    await sleep(delay);
  }

  console.log();
}

/* ============================================================
   BANNER
   ============================================================ */

function banner(): void {
  clear();

  console.log();

  console.log(
    rgb(
      RGB.cyan + RGB.bold,
      "╔════════════════════════════════════════════════════════════════════╗"
    )
  );

  console.log(
    rgb(RGB.cyan, "║") +
      rgb(
        RGB.white + RGB.bold,
        "                         V Æ L O R".padEnd(67)
      ) +
      rgb(RGB.cyan, "║")
  );

  console.log(
    rgb(RGB.cyan, "║") +
      rgb(
        RGB.violet + RGB.bold,
        "                    V 2 . 1   C O R E".padEnd(67)
      ) +
      rgb(RGB.cyan, "║")
  );

  console.log(
    rgb(RGB.cyan, "║") +
      rgb(
        RGB.cyan,
        "              AUTONOMOUS INTELLIGENCE RUNTIME".padEnd(67)
      ) +
      rgb(RGB.cyan, "║")
  );

  console.log(
    rgb(RGB.cyan, "║") +
      " ".repeat(67) +
      rgb(RGB.cyan, "║")
  );

  console.log(
    rgb(RGB.cyan, "║") +
      rgb(
        RGB.green + RGB.bold,
        "        PERCEIVE  •  PLAN  •  ACT  •  VERIFY  •  LEARN".padEnd(67)
      ) +
      rgb(RGB.cyan, "║")
  );

  console.log(
    rgb(
      RGB.cyan + RGB.bold,
      "╚════════════════════════════════════════════════════════════════════╝"
    )
  );

  console.log();
}

/* ============================================================
   BOOT
   ============================================================ */


async function runLiveMission(): Promise<void> {
  console.log();
  box(
    "VÆLOR // LIVE MISSION",
    [
      "RUN ID       autonomous_runtime",
      "TRACE ID     autonomous_trace",
      "",
      "OBJECTIVE    AUTONOMOUS SYSTEM EXECUTION",
      "AUTHORITY    VERIFIED",
      "RISK         LOW",
      "STATUS       EXECUTING"
    ],
    RGB.violet
  );

  const stages: Array<[string, string]> = [
    ["CONTEXT GATHERED", RGB.cyan],
    ["MEMORY SYNCHRONIZED", RGB.magenta],
    ["WORLD STATE ANALYZED", RGB.blue],
    ["OBJECTIVE DECOMPOSED", RGB.violet],
    ["PLAN GENERATED", RGB.cyan],
    ["AUTHORITY VERIFIED", RGB.yellow],
    ["TOOL POLICY CHECKED", RGB.yellow],
    ["ACTION PREPARED", RGB.red],
    ["ACTION EXECUTED", RGB.red],
    ["RESULT OBSERVED", RGB.blue],
    ["EVIDENCE CAPTURED", RGB.cyan],
    ["VERIFICATION PASSED", RGB.green],
    ["STATE UPDATED", RGB.magenta],
    ["TRACE RECORDED", RGB.cyan],
    ["LEARNING SIGNAL GENERATED", RGB.magenta]
  ];

  for (const [label, color] of stages) {
    await progress(label, 180, color);
  }

  console.log();
  await pulse("COMMITTING RUNTIME STATE", RGB.green);
  await pulse("SEALING EXECUTION TRACE", RGB.cyan);
  await pulse("UPDATING WORLD MODEL", RGB.blue);
  await pulse("UPDATING MEMORY FABRIC", RGB.magenta);

  console.log();
  box(
    "VÆLOR // MISSION RESULT",
    [
      "STATUS       SUCCEEDED",
      "AUTHORITY    VERIFIED",
      "VERIFICATION PASSED",
      "TRACE        RECORDED",
      "MEMORY       UPDATED",
      "WORLD MODEL  UPDATED",
      "LEARNING     SIGNAL GENERATED"
    ],
    RGB.green
  );
}

async function boot(): Promise<void> {
  console.log(
    rgb(RGB.violet + RGB.bold, "                 ◆ CORE AWAKENING ◆")
  );

  console.log();

  const systems: Array<[string, string]> = [
    ["MISSION KERNEL", RGB.red],
    ["CONTEXT ENGINE", RGB.cyan],
    ["MEMORY FABRIC", RGB.magenta],
    ["WORLD MODEL", RGB.blue],
    ["OPPORTUNITY ENGINE", RGB.violet],
    ["INITIATIVE ENGINE", RGB.magenta],
    ["PLANNING ENGINE", RGB.blue],
    ["COGNITIVE ENGINE", RGB.violet],
    ["STRATEGIC PLANNER", RGB.cyan],
    ["TOOL GATEWAY", RGB.yellow],
    ["EXECUTION ENGINE", RGB.red],
    ["VERIFICATION ENGINE", RGB.green],
    ["RECOVERY ENGINE", RGB.yellow],
    ["LEARNING ENGINE", RGB.magenta],
    ["TRACE FABRIC", RGB.cyan],
    ["PERSISTENCE CORE", RGB.blue],
    ["DATA CONSISTENCY", RGB.green],
  ];

  console.log(rgb(RGB.dim, "  BOOT SEQUENCE"));
  console.log(rgb(RGB.cyan, `  ${"─".repeat(60)}`));
  console.log();

  for (const [system, color] of systems) {
    await progress(system, 130, color);
  }

  console.log();

  await pulse("COGNITIVE CORE", RGB.violet);
  await pulse("AUTHORITY FABRIC", RGB.yellow);
  await pulse("EXECUTION FABRIC", RGB.red);
  await pulse("VERIFICATION FABRIC", RGB.green);
  await pulse("MEMORY FABRIC", RGB.magenta);
  await pulse("WORLD MODEL", RGB.blue);

  console.log();

  await bootMatrix();

  box(
    "VÆLOR CORE STATUS",
    [
      "",
      `  CORE                 ${rgb(RGB.green, "● OPERATIONAL")}`,
      `  COGNITION            ${rgb(RGB.violet, "● ONLINE")}`,
      `  AUTHORITY            ${rgb(RGB.yellow, "● ARMED")}`,
      `  EXECUTION            ${rgb(RGB.red, "● READY")}`,
      `  VERIFICATION         ${rgb(RGB.green, "● READY")}`,
      `  RECOVERY             ${rgb(RGB.yellow, "● STANDBY")}`,
      `  MEMORY               ${rgb(RGB.magenta, "● SYNCHRONIZED")}`,
      `  WORLD MODEL          ${rgb(RGB.blue, "● SYNCHRONIZED")}`,
      `  TRACE                ${rgb(RGB.cyan, "● RECORDING")}`,
      `  PERSISTENCE          ${rgb(RGB.green, "● DURABLE")}`,
      "",
      `                 ${rgb(
        RGB.cyan + RGB.bold,
        "VÆLOR IS AWAKE"
      )}`,
    ],
    RGB.cyan
  );

  await sleep(500);
}

/* ============================================================
   NEURAL FABRIC
   ============================================================ */

async function bootMatrix(): Promise<void> {
  console.log();
  console.log(
    rgb(RGB.violet + RGB.bold, "  ◆ NEURAL FABRIC INITIALIZATION")
  );
  console.log();

  const matrix = [
    ["AUTHORITY", RGB.yellow],
    ["MEMORY", RGB.magenta],
    ["WORLD STATE", RGB.blue],
    ["COGNITION", RGB.violet],
    ["PLANNING", RGB.cyan],
    ["EXECUTION", RGB.red],
    ["VERIFICATION", RGB.green],
    ["RECOVERY", RGB.yellow],
    ["LEARNING", RGB.magenta],
    ["OBSERVABILITY", RGB.cyan],
  ] as const;

  for (const [name, color] of matrix) {
    const frames = ["▱", "▰", "▰", "▰", "◆"];

    for (const frame of frames) {
      process.stdout.write(
        `\r  ${rgb(color, frame)} ${rgb(
          RGB.white + RGB.bold,
          name.padEnd(18)
        )}`
      );

      await sleep(55);
    }

    console.log(` ${rgb(RGB.green, "✓")} ${rgb(RGB.dim, "BOUND")}`);
  }

  console.log();
}

/* ============================================================
   STATUS
   ============================================================ */

function status(): void {
  box(
    "VÆLOR // SYSTEM STATUS",
    [
      "",
      `  Mission Kernel       ${rgb(RGB.green, "● ONLINE")}`,
      `  Context Engine       ${rgb(RGB.cyan, "● ONLINE")}`,
      `  Memory Store         ${rgb(RGB.magenta, "● ONLINE")}`,
      `  World Model          ${rgb(RGB.blue, "● ONLINE")}`,
      `  Opportunity Engine   ${rgb(RGB.violet, "● ONLINE")}`,
      `  Initiative Engine    ${rgb(RGB.magenta, "● ONLINE")}`,
      `  Planning Engine      ${rgb(RGB.blue, "● ONLINE")}`,
      `  Cognitive Engine     ${rgb(RGB.violet, "● ONLINE")}`,
      "",
      `  Tool Gateway         ${rgb(RGB.yellow, "● READY")}`,
      `  Execution Engine     ${rgb(RGB.red, "● READY")}`,
      `  Verification         ${rgb(RGB.green, "● READY")}`,
      `  Recovery             ${rgb(RGB.yellow, "● READY")}`,
      "",
      `  Trace Store          ${rgb(RGB.cyan, "● RECORDING")}`,
      `  Persistence          ${rgb(RGB.green, "● DURABLE")}`,
      `  Data Consistency     ${rgb(RGB.green, "● GUARDED")}`,
      "",
      `  Kernel: ${rgb(
        RGB.white,
        runtime.missionKernel.constructor.name
      )}`,
      `  Gateway: ${rgb(
        RGB.white,
        runtime.gateway.constructor.name
      )}`,
      "",
      `              ${rgb(
        RGB.cyan + RGB.bold,
        "◆ ALL SYSTEMS NOMINAL ◆"
      )}`,
    ],
    RGB.cyan
  );
}

/* ============================================================
   COGNITIVE PIPELINE
   ============================================================ */

async function cognitivePipeline(): Promise<void> {
  console.log();

  console.log(
    rgb(
      RGB.violet + RGB.bold,
      "  ◆ COGNITIVE EXECUTION PIPELINE"
    )
  );

  console.log();

  const stages: Array<[string, string]> = [
    ["PERCEIVE", RGB.cyan],
    ["CONTEXT", RGB.blue],
    ["MEMORY", RGB.magenta],
    ["THINK", RGB.violet],
    ["PLAN", RGB.cyan],
    ["AUTHORIZE", RGB.yellow],
    ["ACT", RGB.red],
    ["OBSERVE", RGB.blue],
    ["VERIFY", RGB.green],
    ["LEARN", RGB.magenta],
  ] as const;

  for (let i = 0; i < stages.length; i++) {
    const [stage, color] = stages[i]!;

    await progress(stage, 180, color);

    if (i < stages.length - 1) {
      console.log(`  ${rgb(RGB.dim, "│")}`);
    }
  }

  console.log();
}

/* ============================================================
   LIVE MISSION
   ============================================================ */

async function mission(objective = "AUTONOMOUS SYSTEM EXECUTION"): Promise<void> {
  const now = new Date().toISOString();
  const missionId = `mission_${Date.now().toString(36)}`;
  const actionId = `action_${Date.now().toString(36)}`;

  const result = await runtime.runMission({
    mission: {
      id: missionId,
      kind: "MISSION",
      title: objective,
      description: objective,
      ownerId: "operator",
      state: "DRAFT",
      authorityCeiling: 1,
      risk: "LOW",
      scope: [objective],
      constraints: [],
      dependencies: [],
      successCriteria: ["Mission execution completes successfully."],
      verificationCriteria: ["Execution result is verified."],
      evidence: [],
      createdAt: now,
      updatedAt: now,
    },
    actions: [
      {
        id: actionId,
        missionId,
        taskId: missionId,
        toolId: "system_diagnostic",
        capability: "system_diagnostics",
        authority: 1,
        trustZone: "CORE",
        parameters: {},
        preconditions: [],
        expectedSideEffects: [],
        verification: {
          id: `verification_${actionId}`,
          actionId,
          expectedOutcome: "Execution completes successfully.",
          criteria: [
            {
              id: "diagnostic_passed",
              description: "System diagnostic passed.",
              required: true,
            },
          ],
          evidenceIds: [],
          method: "STATE_CHECK",
        },
      },
    ],
  });

  console.log();

  box(
    "VÆLOR // LIVE MISSION",
    [
      "",
      `  MISSION ID   ${rgb(RGB.cyan, result.missionId)}`,
      `  TRACE ID     ${rgb(RGB.magenta, result.traceId)}`,
      "",
      `  OBJECTIVE    ${rgb(RGB.white + RGB.bold, objective)}`,
      "",
      `  STATUS       ${rgb(
        result.status === "SUCCEEDED" ? RGB.green : RGB.red,
        result.status
      )}`,
    ],
    RGB.magenta
  );

  console.log();

  for (const action of result.actionResults) {
    console.log(
      `  ACTION ${rgb(RGB.cyan, action.actionId)}  ` +
      `${rgb(
        action.state === "SUCCEEDED" ? RGB.green : RGB.red,
        action.state
      )}`
    );
  }

  console.log();

  box(
    "VÆLOR // RUNTIME RESULT",
    [
      "",
      `  MISSION      ${rgb(RGB.green, result.status)}`,
      `  ACTIONS      ${rgb(RGB.cyan, String(result.actionResults.length))}`,
      `  TRACE        ${rgb(RGB.cyan, "RECORDED")}`,
      "",
      `              ${rgb(
        result.status === "SUCCEEDED"
          ? RGB.violet + RGB.bold
          : RGB.red + RGB.bold,
        result.status === "SUCCEEDED"
          ? "◆ MISSION COMPLETE ◆"
          : "◆ MISSION FAILED ◆"
      )}`,
    ],
    result.status === "SUCCEEDED" ? RGB.green : RGB.red
  );
}

/* ============================================================
   CAPABILITIES
   ============================================================ */

function capabilities(): void {
  box(
    "VÆLOR // CAPABILITY MATRIX",
    [
      "",
      `  ${rgb(RGB.green, "✓")} Mission orchestration`,
      `  ${rgb(RGB.green, "✓")} Context management`,
      `  ${rgb(RGB.green, "✓")} Persistent memory`,
      `  ${rgb(RGB.green, "✓")} World modelling`,
      `  ${rgb(RGB.green, "✓")} Opportunity analysis`,
      `  ${rgb(RGB.green, "✓")} Initiative generation`,
      `  ${rgb(RGB.green, "✓")} Strategic planning`,
      `  ${rgb(RGB.green, "✓")} Cognitive reasoning boundary`,
      `  ${rgb(RGB.green, "✓")} Authorization`,
      `  ${rgb(RGB.green, "✓")} Tool execution`,
      `  ${rgb(RGB.green, "✓")} Verification`,
      `  ${rgb(RGB.green, "✓")} Evidence tracking`,
      `  ${rgb(RGB.green, "✓")} Recovery`,
      `  ${rgb(RGB.green, "✓")} Learning`,
      `  ${rgb(RGB.green, "✓")} Trace / observability`,
      `  ${rgb(RGB.green, "✓")} Durable runtime state`,
      `  ${rgb(RGB.green, "✓")} Consistency / concurrency`,
      "",
      rgb(RGB.violet + RGB.bold, "  NEXT EVOLUTION"),
      `  ${rgb(RGB.cyan, "→")} Natural language command layer`,
      `  ${rgb(RGB.cyan, "→")} Real model integration`,
      `  ${rgb(RGB.cyan, "→")} Vision perception`,
      `  ${rgb(RGB.cyan, "→")} Voice interface`,
      `  ${rgb(RGB.cyan, "→")} Proactive assistance`,
      `  ${rgb(RGB.cyan, "→")} Autonomous scheduling`,
      `  ${rgb(RGB.cyan, "→")} External tool federation`,
      `  ${rgb(RGB.cyan, "→")} Robotics integration`,
      `  ${rgb(RGB.cyan, "→")} Multi-agent coordination`,
      `  ${rgb(RGB.cyan, "→")} Long-horizon autonomy`,
    ],
    RGB.violet
  );
}

/* ============================================================
   ARCHITECTURE
   ============================================================ */

function architecture(): void {
  box(
    "VÆLOR // EXECUTION ARCHITECTURE",
    [
      "",
      `              ${rgb(RGB.white + RGB.bold, "USER")}`,
      `                ${rgb(RGB.cyan, "│")}`,
      `                ${rgb(RGB.cyan, "▼")}`,
      `           ${rgb(RGB.cyan, "OBJECTIVE")}`,
      `                ${rgb(RGB.cyan, "│")}`,
      `                ${rgb(RGB.cyan, "▼")}`,
      `           ${rgb(RGB.blue, "PERCEIVE")}`,
      `                ${rgb(RGB.blue, "│")}`,
      `                ${rgb(RGB.blue, "▼")}`,
      `            ${rgb(RGB.violet, "THINK")}`,
      `                ${rgb(RGB.violet, "│")}`,
      `                ${rgb(RGB.violet, "▼")}`,
      `             ${rgb(RGB.cyan, "PLAN")}`,
      `                ${rgb(RGB.cyan, "│")}`,
      `                ${rgb(RGB.cyan, "▼")}`,
      `          ${rgb(RGB.yellow, "AUTHORIZE")}`,
      `                ${rgb(RGB.yellow, "│")}`,
      `                ${rgb(RGB.yellow, "▼")}`,
      `             ${rgb(RGB.red, "ACT")}`,
      `                ${rgb(RGB.red, "│")}`,
      `                ${rgb(RGB.red, "▼")}`,
      `           ${rgb(RGB.green, "VERIFY")}`,
      `                ${rgb(RGB.green, "│")}`,
      `                ${rgb(RGB.green, "▼")}`,
      `            ${rgb(RGB.magenta, "LEARN")}`,
      `                ${rgb(RGB.magenta, "│")}`,
      `                ${rgb(RGB.magenta, "▼")}`,
      `             ${rgb(RGB.cyan, "RESULT")}`,
      "",
      `                ${rgb(RGB.violet, "↺ THINK AGAIN")}`,
    ],
    RGB.blue
  );
}

/* ============================================================
   FUTURE EVOLUTION
   ============================================================ */

async function future(): Promise<void> {
  clear();

  console.log();
  console.log(
    rgb(RGB.violet + RGB.bold, "  ◆ VÆLOR // NEXT EVOLUTION")
  );
  console.log();

  const roadmap = [
    ["NATURAL LANGUAGE", "Command VÆLOR directly.", RGB.cyan],
    ["REAL MODEL LAYER", "Replaceable reasoning providers.", RGB.violet],
    ["VISION", "Interpret visual world state.", RGB.blue],
    ["VOICE", "Listen, reason and respond.", RGB.magenta],
    ["PROACTIVE MODE", "Detect opportunities and initiate.", RGB.yellow],
    ["SCHEDULING", "Long-horizon autonomous execution.", RGB.cyan],
    ["TOOL FEDERATION", "Operate across external systems.", RGB.red],
    ["MULTI-AGENT", "Coordinate specialized agents.", RGB.violet],
    ["ROBOTICS", "Connect cognition to physical systems.", RGB.green],
    ["FULL AUTONOMY", "Observe → reason → act → verify → learn.", RGB.magenta],
  ] as const;

  for (const [name, description, color] of roadmap) {
    process.stdout.write(
      `  ${rgb(color, "◆")} ${rgb(
        RGB.white + RGB.bold,
        name.padEnd(20)
      )}`
    );

    await sleep(100);

    await typeText(
      `— ${description}`,
      4,
      RGB.dim
    );

    await sleep(70);
  }

  console.log();

  box(
    "VÆLOR // TRAJECTORY",
    [
      "",
      `  CURRENT STATE       ${rgb(RGB.green, "CANONICAL RUNTIME")}`,
      `  COGNITION           ${rgb(RGB.violet, "REPLACEABLE")}`,
      `  AUTHORITY           ${rgb(RGB.yellow, "VÆLOR OWNED")}`,
      `  EXECUTION           ${rgb(RGB.red, "VÆLOR OWNED")}`,
      `  VERIFICATION        ${rgb(RGB.green, "VÆLOR OWNED")}`,
      `  MEMORY              ${rgb(RGB.magenta, "VÆLOR OWNED")}`,
      `  OBSERVABILITY       ${rgb(RGB.cyan, "VÆLOR OWNED")}`,
      "",
      `  ${rgb(RGB.cyan + RGB.bold, "THE FOUNDATION IS READY.")}`,
      "",
      `  ${rgb(
        RGB.violet + RGB.bold,
        "THE COGNITIVE LAYER COMES NEXT."
      )}`,
    ],
    RGB.violet
  );

  await sleep(700);
}

/* ============================================================
   HELP
   ============================================================ */

function help(): void {
  box(
    "VÆLOR // COMMAND CENTER",
    [
      "",
      `  ${rgb(RGB.cyan, "status")}        System status`,
      `  ${rgb(RGB.cyan, "mission")}       Run live mission`,
      `  ${rgb(RGB.cyan, "architecture")}  Show architecture`,
      `  ${rgb(RGB.cyan, "capabilities")}  Show capability matrix`,
      `  ${rgb(RGB.cyan, "future")}        Show evolution roadmap`,
      `  ${rgb(RGB.cyan, "pipeline")}      Show cognitive pipeline`,
      `  ${rgb(RGB.cyan, "demo")}          Full cinematic sequence`,
      `  ${rgb(RGB.cyan, "clear")}         Clear terminal`,
      `  ${rgb(RGB.cyan, "help")}          Show commands`,
      `  ${rgb(RGB.cyan, "exit")}          Shutdown`,
      "",
    ],
    RGB.cyan
  );
}

/* ============================================================
   DEMO
   ============================================================ */

async function demo(): Promise<void> {
  banner();

  await sleep(300);

  await boot();

  await typeText(
    "  VÆLOR // AUTONOMOUS INTELLIGENCE RUNTIME",
    7,
    RGB.cyan + RGB.bold
  );

  await sleep(250);

  await cognitivePipeline();

  await sleep(250);

  await mission();

  await sleep(350);

  console.log();

  await typeText(
    "  ◆ COGNITIVE SYSTEMS ONLINE",
    8,
    RGB.magenta + RGB.bold
  );

  await sleep(250);

  await futureEvolution();

  await sleep(350);

  finalReveal();

  await sleep(700);

  console.log();
  await typeText(
    "  VÆLOR // COMMAND CENTER READY",
    8,
    RGB.cyan + RGB.bold
  );

  console.log();
}


/* ============================================================
   FUTURE EVOLUTION
   ============================================================ */

async function futureEvolution(): Promise<void> {
  console.log();

  console.log(
    rgb(
      RGB.magenta + RGB.bold,
      "  ╔════════════════════════════════════════════════════════════════════╗"
    )
  );

  console.log(
    rgb(RGB.magenta, "  ║") +
    rgb(
      RGB.white + RGB.bold,
      "                    NEXT EVOLUTION                    "
        .padEnd(66)
    ) +
    rgb(RGB.magenta, "║")
  );

  console.log(
    rgb(
      RGB.magenta + RGB.bold,
      "  ╠════════════════════════════════════════════════════════════════════╣"
    )
  );

  const future = [
    ["NATURAL LANGUAGE", RGB.cyan],
    ["REAL MODEL INTEGRATION", RGB.magenta],
    ["VISION PERCEPTION", RGB.blue],
    ["VOICE INTERFACE", RGB.violet],
    ["PROACTIVE ASSISTANCE", RGB.green],
    ["LONG-TERM MEMORY", RGB.cyan],
    ["WORLD STATE REASONING", RGB.blue],
    ["MULTI-AGENT ORCHESTRATION", RGB.magenta],
    ["ROBOTICS INTEGRATION", RGB.red],
    ["AUTONOMOUS CONTINUOUS OPERATION", RGB.green]
  ] as Array<[string, string]>;

  for (const [name, color] of future) {
    await cinematicStage(name, color, 260);
  }

  console.log(
    rgb(
      RGB.magenta + RGB.bold,
      "  ╚════════════════════════════════════════════════════════════════════╝"
    )
  );

  console.log();
}


/* ============================================================
   CINEMATIC STAGE
   ============================================================ */

async function cinematicStage(
  name: string,
  color: string,
  duration = 300
): Promise<void> {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  const frameDelay = 45;
  const count = Math.max(3, Math.floor(duration / frameDelay));

  for (let i = 0; i < count; i++) {
    const frame = frames[i % frames.length];
    const percent = Math.min(
      100,
      Math.round(((i + 1) / count) * 100)
    );

    const filled = Math.round(percent / 5);

    const bar =
      rgb(color, "█".repeat(filled)) +
      rgb(RGB.dim, "░".repeat(20 - filled));

    process.stdout.write(
      `\r  ${rgb((color ?? RGB.cyan) + RGB.bold, frame ?? "●")} ` +
      `${rgb(RGB.white, name.padEnd(31))} ` +
      `${bar} ${rgb(color, `${percent}%`.padStart(4))}`
    );

    await sleep(frameDelay);
  }

  process.stdout.write(
    `\r  ${rgb(RGB.green + RGB.bold, "◆")} ` +
    `${rgb(RGB.white + RGB.bold, name.padEnd(31))} ` +
    `${rgb(RGB.green, "████████████████████ 100%")} ` +
    `${rgb(RGB.green + RGB.bold, "ONLINE")}\n`
  );
}


/* ============================================================
   FINAL REVEAL
   ============================================================ */

function finalReveal(): void {
  clear();

  console.log();

  const art = [
    "██╗   ██╗ █████╗ ███████╗██╗      ██████╗ ██████╗ ",
    "██║   ██║██╔══██╗██╔════╝██║     ██╔═══██╗██╔══██╗",
    "╚██╗ ██╔╝███████║█████╗  ██║     ██║   ██║██████╔╝",
    " ╚████╔╝ ██╔══██║██╔══╝  ██║     ██║   ██║██╔══██╗",
    "  ╚██╔╝  ██║  ██║███████╗███████╗╚██████╔╝██║  ██║",
    "   ╚═╝   ╚═╝  ╚═╝╚══════╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝"
  ];

  for (let i = 0; i < art.length; i++) {
    console.log(
      rgb(
        i % 2 === 0
          ? RGB.cyan + RGB.bold
          : RGB.magenta + RGB.bold,
        "              " + art[i]
      )
    );
  }

  console.log();

  console.log(
    rgb(
      RGB.cyan + RGB.bold,
      "              ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    )
  );

  console.log(
    rgb(
      RGB.white + RGB.bold,
      "                 AUTONOMOUS INTELLIGENCE RUNTIME"
    )
  );

  console.log(
    rgb(
      RGB.magenta + RGB.bold,
      "                       V Æ L O R  V 2 . 1"
    )
  );

  console.log(
    rgb(
      RGB.cyan + RGB.bold,
      "              ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    )
  );

  console.log();

  const states = [
    ["PERCEPTION", RGB.cyan],
    ["REASONING", RGB.magenta],
    ["PLANNING", RGB.blue],
    ["AUTHORITY", RGB.violet],
    ["EXECUTION", RGB.red],
    ["VERIFICATION", RGB.green],
    ["LEARNING", RGB.magenta]
  ] as Array<[string, string]>;

  for (const [name, color] of states) {
    console.log(
      `              ${rgb(color + RGB.bold, "◆")} ` +
      `${rgb(RGB.white + RGB.bold, name.padEnd(20))}` +
      `${rgb(RGB.green, "● OPERATIONAL")}`
    );
  }

  console.log();

  console.log(
    rgb(
      RGB.green + RGB.bold,
      "                 ╔══════════════════════════╗"
    )
  );

  console.log(
    rgb(
      RGB.green + RGB.bold,
      "                 ║      SYSTEM AWAKE       ║"
    )
  );

  console.log(
    rgb(
      RGB.green + RGB.bold,
      "                 ╚══════════════════════════╝"
    )
  );

  console.log();

  console.log(
    rgb(
      RGB.dim,
      "          PERCEIVE → THINK → PLAN → ACT → VERIFY → LEARN"
    )
  );

  console.log();
}


/* ============================================================
   COMMAND LOOP
   ============================================================ */

function createCLI(): ReturnType<typeof createInterface> {
  return createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
  });
}


async function commandLoop(): Promise<void> {
  const cli = createCLI();

  console.log();

  console.log(
    rgb(
      RGB.cyan + RGB.bold,
      "  VÆLOR COMMAND CENTER ONLINE"
    )
  );

  console.log(
    rgb(
      RGB.dim,
      '  Type "help" to see available commands.'
    )
  );

  console.log();

  cli.setPrompt(
    rgb(
      RGB.magenta + RGB.bold,
      "VÆLOR › "
    )
  );

  cli.prompt();

  cli.on("line", async (raw: string) => {
    const command = raw.trim().toLowerCase();

    try {
      switch (command) {
        case "status":
          status();
          break;

        case "mission":
          await mission();
          break;

        case "architecture":
          architecture();
          break;

        case "capabilities":
          capabilities();
          break;

        case "demo":
          await demo();
          break;

        case "clear":
          clear();
          break;

        case "help":
          help();
          break;

        case "exit":
        case "quit":
          console.log();
          await typeText(
            "  VÆLOR // SHUTTING DOWN...",
            10,
            RGB.red + RGB.bold
          );

          await sleep(300);

          showCursor();
          cli.close();
          process.exit(0);
          break;

        default:
          if (command.length > 0) {
            console.log(
              rgb(
                RGB.red,
                `  Unknown command: ${command}`
              )
            );

            console.log(
              rgb(
                RGB.dim,
                '  Type "help" for available commands.'
              )
            );
          }
      }
    } catch (error) {
      console.log();

      console.log(
        rgb(
          RGB.red + RGB.bold,
          "  ◆ RUNTIME ERROR"
        )
      );

      console.log(
        rgb(
          RGB.red,
          error instanceof Error
            ? `  ${error.message}`
            : "  Unknown runtime error"
        )
      );
    }

    console.log();

    cli.prompt();
  });

  cli.on("SIGINT", () => {
    showCursor();
    cli.close();
    process.exit(0);
  });
}


/* ============================================================
   ENTRYPOINT
   ============================================================ */

async function main(): Promise<void> {
  hideCursor();

  try {
    await demo();
    await commandLoop();
  } catch (error) {
    showCursor();

    console.error(
      rgb(
        RGB.red + RGB.bold,
        "\n  VÆLOR CORE FAILURE"
      )
    );

    console.error(
      rgb(
        RGB.red,
        error instanceof Error
          ? `  ${error.message}`
          : "  Unknown error"
      )
    );

    process.exitCode = 1;
  }
}

void main();
