import { type CreateContactMessageInput, contactMessageSchema } from "@gyeoltare/contracts/contact-messages";
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
