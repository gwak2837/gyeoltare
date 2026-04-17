import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { isLocale } from "@/i18n/config";
import { buildLocalizedMetadata } from "@/i18n/metadata";

import { DashboardShell } from "./_components/dashboard-shell";
import { getDashboardSnapshotQuery } from "./_queries/get-dashboard-snapshot";

export const dynamic = "force-dynamic";

type DashboardPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: DashboardPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const t = await getTranslations({
    locale,
    namespace: "dashboard",
  });

  return buildLocalizedMetadata({
    description: t("metadata.description"),
    locale,
    pathname: "/dashboard",
    title: t("metadata.title"),
  });
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const snapshot = await getDashboardSnapshotQuery();

  return (
    <main className="px-6 py-8 md:px-10 lg:px-14">
      <DashboardShell locale={locale} snapshot={snapshot} />
    </main>
  );
}
