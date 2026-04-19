import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { SettingsScreen } from "@/features/auth/screens/settings-screen";
import { getCurrentSession } from "@/features/auth/server/get-current-session";
import { isLocale } from "@/i18n/config";
import { buildLocalizedMetadata } from "@/i18n/metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]/settings">): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const t = await getTranslations({
    locale,
    namespace: "settings",
  });

  return await buildLocalizedMetadata({
    description: t("metadata.description"),
    locale,
    pathname: "/settings",
    title: t("metadata.title"),
  });
}

export default async function SettingsPage({ params }: PageProps<"/[locale]/settings">) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const session = await getCurrentSession();

  if (!session) {
    notFound();
  }

  return <SettingsScreen initialSession={session} locale={locale} />;
}
