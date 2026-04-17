import { DashboardShell } from "./_components/dashboard-shell";
import { getDashboardSnapshotQuery } from "./_queries/get-dashboard-snapshot";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const snapshot = await getDashboardSnapshotQuery();

  return (
    <main className="px-6 py-8 md:px-10 lg:px-14">
      <DashboardShell snapshot={snapshot} />
    </main>
  );
}
