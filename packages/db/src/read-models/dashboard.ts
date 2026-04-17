import { count, eq } from "drizzle-orm";

import { getDb, hasDatabaseUrl } from "../client";
import { contactMessages, profiles } from "../schema";

export type DashboardSnapshot = {
  generatedAt: string;
  pendingContactMessages: number;
  totalProfiles: number;
};

export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  if (!hasDatabaseUrl()) {
    return {
      generatedAt: new Date().toISOString(),
      pendingContactMessages: 0,
      totalProfiles: 3,
    };
  }

  const db = getDb();
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
