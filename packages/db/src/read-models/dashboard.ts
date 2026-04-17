import { count, eq } from "drizzle-orm";

import { db } from "../client";
import { contactMessages } from "../schema/contact-messages";
import { profiles } from "../schema/profiles";

export type DashboardSnapshot = {
  generatedAt: string;
  pendingContactMessages: number;
  totalProfiles: number;
};

export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  const [profileCount] = await db.select({ value: count(profiles.id) }).from(profiles);
  const [contactCount] = await db
    .select({ value: count(contactMessages.id) })
    .from(contactMessages)
    .where(eq(contactMessages.status, "received"));

  return {
    generatedAt: new Date().toISOString(),
    pendingContactMessages: contactCount?.value ?? 0,
    totalProfiles: profileCount?.value ?? 0,
  };
}
