import type { CreateContactMessageInput } from "@gyeoltare/contracts";

import { getDb } from "@gyeoltare/db/client";
import { contactMessages } from "@gyeoltare/db/schema";

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
