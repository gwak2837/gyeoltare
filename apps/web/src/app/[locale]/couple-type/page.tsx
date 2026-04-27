import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { isLocale } from "@/i18n/config";
import { buildLocalizedMetadata } from "@/i18n/metadata";

import { CoupleTypeScreen } from "./_components/couple-type-screen";

export async function generateMetadata({ params }: PageProps<"/[locale]/couple-type">): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const t = await getTranslations({
    locale,
    namespace: "common",
  });

  return await buildLocalizedMetadata({
    description: t("coupleType.metadataDescription"),
    locale,
    pathname: "/couple-type",
    title: t("coupleType.metadataTitle"),
  });
}

export default async function CoupleTypePage({ params }: PageProps<"/[locale]/couple-type">) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <CoupleTypeScreen locale={locale} />;
}
