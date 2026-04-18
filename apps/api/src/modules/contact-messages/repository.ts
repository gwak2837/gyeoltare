import { db } from "@gyeoltare/db/client";
import { contactMessages } from "@gyeoltare/db/schema/contact-messages";
import type { CreateContactMessageInput } from "./schema";

export async function insertContactMessage(input: CreateContactMessageInput) {
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
