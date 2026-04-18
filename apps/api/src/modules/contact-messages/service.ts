import { insertContactMessage } from "./repository";
import { type CreateContactMessageInput, contactMessageSchema } from "./schema";

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
