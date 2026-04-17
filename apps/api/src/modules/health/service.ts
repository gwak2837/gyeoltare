import { healthStatusSchema } from "@gyeoltare/contracts";

export function buildHealthStatus() {
  return healthStatusSchema.parse({
    checkedAt: new Date().toISOString(),
    service: "api",
    status: "ok",
  });
}
