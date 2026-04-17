import type { PublicProfile } from "@gyeoltare/contracts/profiles";
import { db } from "@gyeoltare/db/client";
import { publicProfileFilter } from "@gyeoltare/db/policies/profile-visibility";
import { profiles } from "@gyeoltare/db/schema/profiles";
import { asc } from "drizzle-orm";

type ListPublicProfilesOptions = {
  limit: number;
};

export async function listPublicProfilesFromDatabase({
  limit,
}: ListPublicProfilesOptions): Promise<PublicProfile[]> {
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
