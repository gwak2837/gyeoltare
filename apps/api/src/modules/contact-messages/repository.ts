import type { CreateContactMessageInput } from "@gyeoltare/contracts/contact-messages";

import { getDb } from "@gyeoltare/db/client";
import { contactMessages } from "@gyeoltare/db/schema/contact-messages";

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
