import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { isLocale } from "@/i18n/config";
import { buildLocalizedMetadata } from "@/i18n/metadata";

import { CoupleRarityFlow } from "./_components/couple-rarity-screen";
import { getRarityContent } from "./_lib/content";

export async function generateMetadata({ params }: PageProps<"/[locale]/couple-rarity">): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const content = await getRarityContent(locale);

  return await buildLocalizedMetadata({
    description: content.metadata.description,
    locale,
    pathname: "/couple-rarity",
    title: content.metadata.title,
  });
}

export default async function CoupleRarityPage({ params }: PageProps<"/[locale]/couple-rarity">) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const content = await getRarityContent(locale);

  return (
    <Suspense fallback={<RarityPageFallback />}>
      <CoupleRarityFlow content={content} locale={locale} />
    </Suspense>
  );
}

function RarityPageFallback() {
  return (
    <main className="flex flex-1 items-center justify-center bg-page-bg px-safe py-16 text-page-ink">
      <div className="h-12 w-12 rounded-full border-4 border-page-accent/20 border-t-page-accent" />
    </main>
  );
}
