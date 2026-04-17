import { z } from "zod";

import { isoDateTimeSchema } from "./common";

export const createContactMessageInputSchema = z.object({
  company: z.string().max(120).optional(),
  email: z.email(),
  message: z.string().min(20).max(2_000),
  name: z.string().min(2).max(80),
});

export const contactMessageSchema = z.object({
  company: z.string().nullable(),
  createdAt: isoDateTimeSchema,
  email: z.email(),
  id: z.uuid(),
  message: z.string(),
  name: z.string(),
  status: z.enum(["received", "resolved", "triaged"]),
});

export type CreateContactMessageInput = z.infer<typeof createContactMessageInputSchema>;
