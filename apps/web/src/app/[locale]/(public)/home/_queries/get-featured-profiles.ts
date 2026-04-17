import "server-only";

import { getFeaturedProfiles } from "@gyeoltare/db/read-models/home";

export async function getFeaturedProfilesQuery() {
  return getFeaturedProfiles({ limit: 6 });
}
