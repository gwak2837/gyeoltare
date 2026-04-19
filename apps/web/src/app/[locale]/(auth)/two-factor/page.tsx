import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { TwoFactorScreen } from "@/features/auth/screens/two-factor-screen";
import { isLocale } from "@/i18n/config";
import { buildLocalizedMetadata } from "@/i18n/metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]/two-factor">): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const t = await getTranslations({
    locale,
    namespace: "auth",
  });

  return await buildLocalizedMetadata({
    description: t("twoFactor.metadataDescription"),
    locale,
    pathname: "/two-factor",
    title: t("twoFactor.metadataTitle"),
  });
}

export default async function TwoFactorPage({ params }: PageProps<"/[locale]/two-factor">) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <TwoFactorScreen locale={locale} />;
}
