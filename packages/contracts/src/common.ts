import { z } from "zod";

export const isoDateTimeSchema = z.string().datetime();

export const apiErrorSchema = z.object({
  code: z.string(),
  details: z.unknown().optional(),
  message: z.string(),
  requestId: z.string().optional(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;
