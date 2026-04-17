import { eq } from "drizzle-orm";

import { profiles } from "../schema/profiles";

export function publicProfileFilter() {
  return eq(profiles.isPublic, true);
}
