import { spawn } from "node:child_process";

type RunCommandInput = {
  command: string[];
  cwd: string;
  env?: NodeJS.ProcessEnv;
  label: string;
  timeoutMs?: number;
};

export async function runCommand(input: RunCommandInput) {
  const child = spawn(input.command[0], input.command.slice(1), {
    cwd: input.cwd,
    env: input.env,
    stdio: ["ignore", "pipe", "pipe"],
  });

  const stdoutChunks: string[] = [];
  const stderrChunks: string[] = [];

  child.stdout?.on("data", (chunk) => {
    stdoutChunks.push(chunk.toString());
  });

  child.stderr?.on("data", (chunk) => {
    stderrChunks.push(chunk.toString());
  });

  const exitCode = await new Promise<number>((resolve, reject) => {
    let timeoutHandle: NodeJS.Timeout | undefined;

    if (input.timeoutMs) {
      timeoutHandle = setTimeout(() => {
        child.kill("SIGKILL");
        reject(new Error(`${input.label} timed out after ${input.timeoutMs}ms`));
      }, input.timeoutMs);
    }

    child.once("error", (error) => {
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }

      reject(error);
    });

    child.once("exit", (code) => {
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }

      resolve(code ?? 1);
    });
  });

  const stdout = stdoutChunks.join("");
  const stderr = stderrChunks.join("");

  if (exitCode !== 0) {
    throw new Error(
      [
        `${input.label} failed with exit code ${exitCode}.`,
        stdout ? `stdout:\n${stdout.trimEnd()}` : "",
        stderr ? `stderr:\n${stderr.trimEnd()}` : "",
      ]
        .filter(Boolean)
        .join("\n\n"),
    );
  }

  return { stderr, stdout };
}
