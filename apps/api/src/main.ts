import { markShutdownStarted } from "./api/probe/service";
import { app } from "./app";
import { env } from "./env";

const server = Bun.serve({
  fetch: app.fetch,
  hostname: process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost",
  maxRequestBodySize: 1024 * 1024 * 10, // 10 MiB
  port: env.API_PORT,
});

let shutdownPromise: Promise<void> | null = null;

async function shutdown(signal: string) {
  if (shutdownPromise) {
    return shutdownPromise;
  }

  markShutdownStarted();

  shutdownPromise = server.stop().catch((error) => {
    console.error("server.shutdown_failed", {
      message: error instanceof Error ? error.message : String(error),
      signal,
    });
  });

  return shutdownPromise;
}

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));

export default server;
