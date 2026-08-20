import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { execFile, spawn } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const app = express();
app.use(express.json({ limit: "1mb" }));

const REPO = path.resolve(process.cwd(), "../..");

let runtime = {
  process: null,
  output: [],
};

function safePath(input) {
  const resolved = path.resolve(REPO, input);

  if (resolved !== REPO && !resolved.startsWith(REPO + path.sep)) {
    throw new Error("ACCESS DENIED: path outside VÆLOR repository");
  }

  return resolved;
}

const ALLOWED_COMMANDS = new Set([
  "git",
  "npm",
  "node",
  "npx",
  "tsc",
]);

async function run(command, args = []) {
  if (!ALLOWED_COMMANDS.has(command)) {
    throw new Error(`COMMAND DENIED: ${command}`);
  }

  const { stdout, stderr } = await execFileAsync(command, args, {
    cwd: REPO,
    timeout: 120000,
    maxBuffer: 5 * 1024 * 1024,
  });

  return { stdout, stderr };
}

function runtimeStatus() {
  const running =
    runtime.process !== null &&
    runtime.process.exitCode === null &&
    !runtime.process.killed;

  return {
    running,
    pid: running ? runtime.process.pid : null,
    output: runtime.output.slice(-100),
  };
}

function pushOutput(data) {
  runtime.output.push(String(data));

  if (runtime.output.length > 200) {
    runtime.output = runtime.output.slice(-200);
  }
}

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "vaelor-bridge",
    repo: REPO,
    runtime: runtimeStatus(),
  });
});

app.post("/read", async (req, res) => {
  try {
    const file = safePath(req.body.path);
    const content = await fs.readFile(file, "utf8");

    res.json({
      ok: true,
      path: path.relative(REPO, file),
      content,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      error: error.message,
    });
  }
});

app.post("/write", async (req, res) => {
  try {
    const file = safePath(req.body.path);
    const content = req.body.content;

    if (typeof content !== "string") {
      throw new Error("content must be a string");
    }

    if (content.length > 5 * 1024 * 1024) {
      throw new Error("content exceeds 5MB limit");
    }

    const exists = await fs
      .access(file)
      .then(() => true)
      .catch(() => false);

    let backup = null;

    if (exists) {
      backup = `${file}.bridge.bak`;
      await fs.copyFile(file, backup);
    }

    await fs.writeFile(file, content, "utf8");

    res.json({
      ok: true,
      path: path.relative(REPO, file),
      bytes: Buffer.byteLength(content, "utf8"),
      backup: backup ? path.relative(REPO, backup) : null,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      error: error.message,
    });
  }
});

app.post("/search", async (req, res) => {
  try {
    const pattern = String(req.body.pattern ?? "");

    if (!pattern || pattern.length > 300) {
      throw new Error("Invalid search pattern");
    }

    const result = await run("git", [
      "grep",
      "-n",
      "-I",
      "-E",
      "--",
      pattern,
    ]);

    res.json({
      ok: true,
      output: result.stdout,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      error: error.stdout || error.message,
    });
  }
});

app.post("/status", async (_req, res) => {
  try {
    const result = await run("git", ["status", "--short"]);

    res.json({
      ok: true,
      output: result.stdout,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      error: error.stdout || error.message,
    });
  }
});

app.post("/diff", async (_req, res) => {
  try {
    const result = await run("git", ["diff"]);

    res.json({
      ok: true,
      output: result.stdout,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      error: error.stdout || error.message,
    });
  }
});

app.post("/git", async (req, res) => {
  try {
    const args = req.body.args;

    if (!Array.isArray(args)) {
      throw new Error("args must be an array");
    }

    const forbidden = [
      "push",
      "reset",
      "clean",
      "checkout",
      "restore",
    ];

    if (args.some((arg) => forbidden.includes(arg))) {
      throw new Error("Git operation denied");
    }

    const result = await run("git", args);

    res.json({
      ok: true,
      stdout: result.stdout,
      stderr: result.stderr,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      error: error.stdout || error.message,
    });
  }
});

app.post("/command", async (req, res) => {
  try {
    const { command, args = [] } = req.body;

    if (!Array.isArray(args)) {
      throw new Error("args must be an array");
    }

    const result = await run(command, args);

    res.json({
      ok: true,
      stdout: result.stdout,
      stderr: result.stderr,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      error: error.stdout || error.message,
    });
  }
});

app.post("/runtime/start", (_req, res) => {
  if (runtime.process && runtime.process.exitCode === null) {
    return res.json({
      ok: true,
      message: "Runtime already running.",
      runtime: runtimeStatus(),
    });
  }

  runtime.output = [];

  const child = spawn(
    "node",
    ["dist/services/core/src/runtime/main.js"],
    {
      cwd: REPO,
      stdio: ["pipe", "pipe", "pipe"],
      detached: false,
    }
  );

  runtime.process = child;

  child.stdout.on("data", pushOutput);
  child.stderr.on("data", pushOutput);

  child.on("exit", (code, signal) => {
    pushOutput(
      `\n[RUNTIME EXIT] code=${code} signal=${signal ?? "none"}`
    );
  });

  child.on("error", (error) => {
    pushOutput(`\n[RUNTIME ERROR] ${error.message}`);
  });

  res.json({
    ok: true,
    message: "Runtime started.",
    runtime: runtimeStatus(),
  });
});

app.post("/runtime/input", (req, res) => {
  if (!runtime.process || runtime.process.exitCode !== null) {
    return res.status(400).json({
      ok: false,
      error: "Runtime is not running.",
    });
  }

  const input = String(req.body.input ?? "");

  runtime.process.stdin.write(input + "\n");

  res.json({
    ok: true,
    runtime: runtimeStatus(),
  });
});

app.post("/runtime/stop", (_req, res) => {
  if (!runtime.process || runtime.process.exitCode !== null) {
    return res.json({
      ok: true,
      message: "Runtime is not running.",
      runtime: runtimeStatus(),
    });
  }

  runtime.process.kill("SIGTERM");

  res.json({
    ok: true,
    message: "Runtime stop requested.",
    runtime: runtimeStatus(),
  });
});

app.post("/runtime/status", (_req, res) => {
  res.json({
    ok: true,
    runtime: runtimeStatus(),
  });
});

const PORT = 8787;

app.listen(PORT, "127.0.0.1", () => {
  console.log("VÆLOR bridge online");
  console.log(`Repository: ${REPO}`);
  console.log(`Listening: http://127.0.0.1:${PORT}`);
});
