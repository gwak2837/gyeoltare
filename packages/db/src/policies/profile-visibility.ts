import { eq } from "drizzle-orm";

import { profiles } from "../schema";

export function publicProfileFilter() {
  return eq(profiles.isPublic, true);
}
