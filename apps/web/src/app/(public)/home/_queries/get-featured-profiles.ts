import "server-only";

import { getFeaturedProfiles } from "@repo/db/read-models/home";

export async function getFeaturedProfilesQuery() {
  return getFeaturedProfiles({ limit: 6 });
}
