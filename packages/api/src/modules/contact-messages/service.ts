import type { CreateContactMessageInput } from "@repo/contracts";
import { contactMessageSchema } from "@repo/contracts";
import { insertContactMessage } from "./repository";

export async function createContactMessage(input: CreateContactMessageInput) {
  const row = await insertContactMessage(input);

  return contactMessageSchema.parse({
    company: row.company,
    createdAt: row.createdAt.toISOString(),
    email: row.email,
    id: row.id,
    message: row.message,
    name: row.name,
    status: row.status,
  });
}
