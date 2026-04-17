import { z } from "zod";

import { isoDateTimeSchema } from "./common";

export const healthStatusSchema = z.object({
  checkedAt: isoDateTimeSchema,
  service: z.literal("api"),
  status: z.literal("ok"),
});

export type HealthStatus = z.infer<typeof healthStatusSchema>;
