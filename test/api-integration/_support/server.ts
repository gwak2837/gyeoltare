import { type ChildProcessByStdio, spawn } from "node:child_process";
import { once } from "node:events";
import { createServer as createNetServer } from "node:net";
import type { Readable } from "node:stream";
import { createHighEntropySecret, REPO_ROOT, sleep } from "./shared";

type StartApiServerInput = {
  databaseUrl: string;
  env?: NodeJS.ProcessEnv;
  label: string;
  waitUntilReady?: boolean;
};

export type StartedApiServer = {
  baseUrl: string;
  getLogs: () => string;
  stop: () => Promise<void>;
};

type ApiServerChildProcess = ChildProcessByStdio<null, Readable, Readable>;

export async function startApiServer(input: StartApiServerInput): Promise<StartedApiServer> {
  const port = await getAvailablePort();
  const baseUrl = `http://localhost:${port}`;
  const stdoutChunks: string[] = [];
  const stderrChunks: string[] = [];

  const child: ApiServerChildProcess = spawn(process.execPath, ["apps/api/src/main.ts"], {
    cwd: REPO_ROOT,
    env: {
      ...process.env,
      API_PORT: String(port),
      BETTER_AUTH_PASSKEY_ORIGIN: baseUrl,
      BETTER_AUTH_PASSKEY_RP_ID: "localhost",
      BETTER_AUTH_PASSKEY_RP_NAME: "gyeoltare",
      BETTER_AUTH_SECRETS: createHighEntropySecret(),
      BETTER_AUTH_URL: baseUrl,
      DATABASE_DIRECT_URL: input.databaseUrl,
      DATABASE_URL: input.databaseUrl,
      NODE_ENV: "test",
      OTEL_LOGS_EXPORTER: "none",
      OTEL_METRICS_EXPORTER: "none",
      OTEL_TRACES_EXPORTER: "none",
      WEB_ORIGIN: baseUrl,
      ...input.env,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  child.stdout.on("data", (chunk) => {
    stdoutChunks.push(chunk.toString());
  });

  child.stderr.on("data", (chunk) => {
    stderrChunks.push(chunk.toString());
  });

  const getLogs = () =>
    [`stdout:\n${stdoutChunks.join("").trimEnd()}`, `stderr:\n${stderrChunks.join("").trimEnd()}`]
      .filter((section) => !section.endsWith(":\n"))
      .join("\n\n");

  try {
    await waitForServer(input.label, baseUrl, child, getLogs, input.waitUntilReady ?? true);
  } catch (error) {
    await stopChildProcess(child);
    throw error;
  }

  return {
    baseUrl,
    getLogs,
    stop: async () => {
      await stopChildProcess(child);
    },
  };
}

async function waitForServer(
  label: string,
  baseUrl: string,
  child: ApiServerChildProcess,
  getLogs: () => string,
  waitUntilReady: boolean,
) {
  const timeoutMs = 30_000;
  const deadline = Date.now() + timeoutMs;
  let lastError: string | undefined;

  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error([`${label} exited before becoming available.`, getLogs()].filter(Boolean).join("\n\n"));
    }

    try {
      const startupResponse = await fetch(`${baseUrl}/api/startup`);

      if (startupResponse.status !== 200) {
        lastError = `startup probe returned ${startupResponse.status}`;
        await sleep(250);
        continue;
      }

      if (!waitUntilReady) {
        return;
      }

      const readyResponse = await fetch(`${baseUrl}/api/ready`);

      if (readyResponse.status === 200) {
        return;
      }

      lastError = `ready probe returned ${readyResponse.status}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }

    await sleep(250);
  }

  throw new Error(
    [`${label} did not become ready within ${timeoutMs}ms.`, lastError ? `last error: ${lastError}` : "", getLogs()]
      .filter(Boolean)
      .join("\n\n"),
  );
}

async function stopChildProcess(child: ApiServerChildProcess) {
  if (child.exitCode !== null) {
    return;
  }

  child.kill("SIGTERM");

  const exitedGracefully = await Promise.race([once(child, "exit").then(() => true), sleep(2_000).then(() => false)]);

  if (exitedGracefully || child.exitCode !== null) {
    return;
  }

  child.kill("SIGKILL");
  await once(child, "exit");
}

async function getAvailablePort() {
  return new Promise<number>((resolve, reject) => {
    const server = createNetServer();

    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();

      if (!address || typeof address === "string") {
        reject(new Error("Unable to resolve an ephemeral port."));
        return;
      }

      const { port } = address;

      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(port);
      });
    });
  });
}
