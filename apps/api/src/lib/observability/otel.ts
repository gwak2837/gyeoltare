import { NodeSDK } from "@opentelemetry/sdk-node";

export const OTEL_SERVICE_NAME = "gyeoltare-api";

export function initializeOpenTelemetry() {
  process.env.OTEL_SERVICE_NAME ??= OTEL_SERVICE_NAME;
  process.env.OTEL_TRACES_EXPORTER ??= "otlp";
  process.env.OTEL_METRICS_EXPORTER ??= "none";
  process.env.OTEL_LOGS_EXPORTER ??= "none";

  try {
    const sdk = new NodeSDK({ serviceName: OTEL_SERVICE_NAME });
    sdk.start();

    async function shutdown(reason: string) {
      try {
        await sdk.shutdown();
      } catch (error) {
        console.error("otel.shutdown_failed", {
          message: error instanceof Error ? error.message : String(error),
          reason,
        });
      }
    }

    process.once("SIGINT", () => shutdown("SIGINT"));
    process.once("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("otel.initialization_failed", {
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
