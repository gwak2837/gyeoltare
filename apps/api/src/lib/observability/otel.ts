import { NodeSDK } from "@opentelemetry/sdk-node";
import { env } from "@/env";

export const OTEL_SERVICE_NAME = "gyeoltare-api";

const { OTEL_EXPORTER_OTLP_ENDPOINT, OTEL_TRACES_EXPORTER, OTEL_METRICS_EXPORTER, OTEL_LOGS_EXPORTER } = env;

export function initializeOpenTelemetry() {
  process.env.OTEL_EXPORTER_OTLP_ENDPOINT ??= OTEL_EXPORTER_OTLP_ENDPOINT;
  process.env.OTEL_TRACES_EXPORTER ??= OTEL_TRACES_EXPORTER;
  process.env.OTEL_METRICS_EXPORTER ??= OTEL_METRICS_EXPORTER;
  process.env.OTEL_LOGS_EXPORTER ??= OTEL_LOGS_EXPORTER;

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
