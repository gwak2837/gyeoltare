import type { PublicProfile } from "@gyeoltare/contracts/profiles";
import { desc } from "drizzle-orm";

import { db } from "../client";
import { publicProfileFilter } from "../policies/profile-visibility";
import { profiles } from "../schema/profiles";

type GetFeaturedProfilesOptions = {
  limit: number;
};

export async function getFeaturedProfiles({
  limit,
}: GetFeaturedProfilesOptions): Promise<PublicProfile[]> {
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
    .orderBy(desc(profiles.createdAt))
    .limit(limit);

  return rows.map((row) => ({
    bio: row.bio,
    createdAt: row.createdAt.toISOString(),
    displayName: row.displayName,
    id: row.id,
    slug: row.slug,
  }));
}
