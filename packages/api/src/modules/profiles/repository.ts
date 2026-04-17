import type { PublicProfile } from "@repo/contracts";
import { getDb } from "@repo/db/client";
import { publicProfileFilter } from "@repo/db/policies/profile-visibility";
import { profiles } from "@repo/db/schema";
import { asc } from "drizzle-orm";

type ListPublicProfilesOptions = {
  limit: number;
};

export async function listPublicProfilesFromDatabase({
  limit,
}: ListPublicProfilesOptions): Promise<PublicProfile[]> {
  const db = getDb();
  const rows = await db
    .select({
      bio: profiles.bio,
      createdAt: profiles.createdAt,
      displayName: profiles.displayName,
      id: profiles.id,
      slug: profiles.slug,
    })
    .from(profiles)
    .where(publicProfileFilter())
    .orderBy(asc(profiles.displayName))
    .limit(limit);

  return rows.map((row) => ({
    bio: row.bio,
    createdAt: row.createdAt.toISOString(),
    displayName: row.displayName,
    id: row.id,
    slug: row.slug,
  }));
}
