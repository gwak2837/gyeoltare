import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { loadBackupCodes } from "@/app/[locale]/[username]/settings/backup-codes/_lib/server";
import { resolveAuthErrorMessage } from "@/feature/auth/errors";
import { getCurrentSession } from "@/feature/auth/session";
import {
  buildAuthContinuationPath,
  buildBackupCodesPath,
  buildSettingsPath,
  isFreshAuthSession,
} from "@/feature/auth/shared";
import { AuthHeading, InlineNotice } from "@/feature/auth/ui";
import { isLocale } from "@/i18n/config";
import { buildLocalizedMetadata } from "@/i18n/metadata";
import { getLocalizedPath } from "@/i18n/pathnames";

import { BackupCodesPanel } from "./_components/backup-codes-panel";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/[username]/settings/backup-codes">): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const t = await getTranslations({
    locale,
    namespace: "settings",
  });

  return await buildLocalizedMetadata({
    description: t("backupCodesPage.metadataDescription"),
    locale,
    pathname: "/settings/backup-codes",
    title: t("backupCodesPage.metadataTitle"),
  });
}

export default async function BackupCodesPage({ params }: PageProps<"/[locale]/[username]/settings/backup-codes">) {
  const { locale, username } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const [settingsT, authT] = await Promise.all([
    getTranslations({
      locale,
      namespace: "settings",
    }),
    getTranslations({
      locale,
      namespace: "auth",
    }),
  ]);

  const session = await getCurrentSession();

  if (!session) {
    redirect(getLocalizedPath(locale, "/login"));
  }

  if (!session.user.username) {
    redirect(getLocalizedPath(locale, "/"));
  }

  if (session.user.username !== username) {
    redirect(getLocalizedPath(locale, buildBackupCodesPath(session.user.username)));
  }

  if (!session.user.twoFactorEnabled) {
    redirect(getLocalizedPath(locale, buildSettingsPath(session.user.username)));
  }

  const returnTo = getLocalizedPath(locale, buildBackupCodesPath(session.user.username));

  if (!isFreshAuthSession(session.session)) {
    redirect(
      buildAuthContinuationPath({
        locale,
        mode: "reauth",
        pathname: "/login",
        returnTo,
      }),
    );
  }

  const result = await loadBackupCodes(session);
  const settingsPath = getLocalizedPath(locale, buildSettingsPath(session.user.username));
  const errorMessage = result.error
    ? resolveAuthErrorMessage(authT, result.error)
    : settingsT("backupCodesPage.genericHint");

  return (
    <main className="mx-auto w-full max-w-4xl sm:p-8 lg:p-10">
      <div className="border border-page-border/80 bg-page-surface/92 p-7 shadow-[0_30px_120px_rgba(33,26,65,0.12)] backdrop-blur sm:rounded-4xl sm:p-10">
        <div className="flex flex-col gap-5 border-page-border/70 border-b pb-8 lg:flex-row lg:items-end lg:justify-between">
          <AuthHeading
            description={settingsT("backupCodesPage.description")}
            eyebrow={settingsT("backupCodesPage.eyebrow")}
            title={settingsT("backupCodesPage.title")}
          />
          <Link
            className="inline-flex items-center justify-center rounded-full border border-page-border bg-white px-5 py-3 font-semibold text-page-ink text-sm transition hover:-translate-y-0.5 hover:border-page-accent/40 hover:bg-page-soft"
            href={settingsPath}
          >
            {settingsT("backupCodesPage.backToSettings")}
          </Link>
        </div>

        <div className="mt-8">
          {result.data ? (
            <BackupCodesPanel backupCodes={result.data.backupCodes} />
          ) : (
            <InlineNotice tone="danger">{errorMessage}</InlineNotice>
          )}
        </div>
      </div>
    </main>
  );
}
