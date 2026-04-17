import { z } from "zod";

import { isoDateTimeSchema } from "./common";

export const publicProfileSchema = z.object({
  bio: z.string().nullable(),
  createdAt: isoDateTimeSchema,
  displayName: z.string(),
  id: z.string().uuid(),
  slug: z.string(),
});

export const listProfilesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(24).default(6),
});

export const listProfilesResponseSchema = z.object({
  items: z.array(publicProfileSchema),
});

export type PublicProfile = z.infer<typeof publicProfileSchema>;
