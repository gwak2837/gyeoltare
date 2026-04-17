import "server-only";

import { getDashboardSnapshot } from "@repo/db/read-models/dashboard";

export async function getDashboardSnapshotQuery() {
  return getDashboardSnapshot();
}
