import type { PublicProfile } from "@gyeoltare/contracts";
import { desc } from "drizzle-orm";

import { getDb, hasDatabaseUrl } from "../client";
import { publicProfileFilter } from "../policies/profile-visibility";
import { profiles } from "../schema";

const fallbackProfiles: PublicProfile[] = [
  {
    bio: "BFF 경계를 명확히 하면서도 화면용 조회 모델을 빠르게 만드는 실험 담당.",
    createdAt: "2026-04-17T00:00:00.000Z",
    displayName: "Seo Hana",
    id: "7f4c32fd-a3a8-4857-bd09-fd50b5ce44e6",
    slug: "seo-hana",
  },
  {
    bio: "Hono 서비스 계층과 Drizzle read model의 인터페이스 정합성을 다듬습니다.",
    createdAt: "2026-04-16T00:00:00.000Z",
    displayName: "Min Jiho",
    id: "5aeb8655-b278-4e98-a41a-f8d18df33bc5",
    slug: "min-jiho",
  },
  {
    bio: "아직 실제 DB가 없더라도 landing page가 비어 보이지 않도록 준비된 시드 데이터입니다.",
    createdAt: "2026-04-15T00:00:00.000Z",
    displayName: "Park Yerin",
    id: "7c5dab69-c48a-4be0-965c-1db45d64f2f8",
    slug: "park-yerin",
  },
];

type GetFeaturedProfilesOptions = {
  limit: number;
};

export async function getFeaturedProfiles({
  limit,
}: GetFeaturedProfilesOptions): Promise<PublicProfile[]> {
  if (!hasDatabaseUrl()) {
    return fallbackProfiles.slice(0, limit);
  }

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
