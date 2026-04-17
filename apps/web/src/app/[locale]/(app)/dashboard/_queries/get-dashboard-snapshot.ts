import "server-only";

import { getDashboardSnapshot } from "@gyeoltare/db/read-models/dashboard";

export async function getDashboardSnapshotQuery() {
  return getDashboardSnapshot();
}
