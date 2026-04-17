import type { CreateContactMessageInput } from "@repo/contracts";

import { getDb } from "@repo/db/client";
import { contactMessages } from "@repo/db/schema";

export async function insertContactMessage(input: CreateContactMessageInput) {
  const db = getDb();
  const [row] = await db
    .insert(contactMessages)
    .values({
      company: input.company ?? null,
      email: input.email,
      message: input.message,
      name: input.name,
    })
    .returning();

  return row;
}
