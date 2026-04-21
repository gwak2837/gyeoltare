import { db } from "@gyeoltare/db/client";

type ProbeName = "live" | "ready" | "startup";

type ProbeResponse = {
  body: {
    probe: ProbeName;
    status: "ok" | "error";
  };
  statusCode: 200 | 503;
};

type RuntimeState = {
  shuttingDown: boolean;
  startupComplete: boolean;
};

const runtimeState: RuntimeState = {
  shuttingDown: false,
  startupComplete: false,
};

function createProbeResponse(probe: ProbeName, statusCode: 200 | 503): ProbeResponse {
  return {
    body: {
      probe,
      status: statusCode === 200 ? "ok" : "error",
    },
    statusCode,
  };
}

export function getLiveResponse(): ProbeResponse {
  return createProbeResponse("live", 200);
}

export async function getReadyResponse(): Promise<ProbeResponse> {
  if (!runtimeState.startupComplete || runtimeState.shuttingDown) {
    return createProbeResponse("ready", 503);
  }

  try {
    await db.execute("select 1");

    return createProbeResponse("ready", 200);
  } catch {
    return createProbeResponse("ready", 503);
  }
}

export function getStartupResponse(): ProbeResponse {
  return createProbeResponse("startup", runtimeState.startupComplete ? 200 : 503);
}

export function markShutdownStarted() {
  runtimeState.shuttingDown = true;
}

export function markStartupComplete() {
  runtimeState.startupComplete = true;
}
