import { getDb } from "../../../packages/db/src/client";
import { profiles } from "../../../packages/db/src/schema";

export async function seedProfiles() {
  const db = getDb();

  await db.insert(profiles).values([
    {
      bio: "통합 테스트용 프로필입니다.",
      displayName: "Integration Tester",
      slug: "integration-tester",
    },
    {
      bio: "공개 목록 응답을 검증하기 위한 두 번째 프로필입니다.",
      displayName: "Second Profile",
      slug: "second-profile",
    },
  ]);
}
