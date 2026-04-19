"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { copyBackupCodesToClipboard, downloadBackupCodesFile } from "@/feature/auth/backup-codes";
import { joinBackupCodes } from "@/feature/auth/shared";
import { InlineNotice, PrimaryButton, SecondaryButton } from "@/feature/auth/ui";

type BackupCodesPanelProps = {
  backupCodes: string[];
};

type NoticeState = {
  message: string;
  tone: "danger" | "success";
} | null;

export function BackupCodesPanel({ backupCodes }: BackupCodesPanelProps) {
  const t = useTranslations("settings");
  const [notice, setNotice] = useState<NoticeState>(null);

  async function handleCopy() {
    try {
      await copyBackupCodesToClipboard(backupCodes);
      setNotice({
        message: t("feedback.backupCodesCopied"),
        tone: "success",
      });
    } catch {
      setNotice({
        message: t("backupCodesPage.genericHint"),
        tone: "danger",
      });
    }
  }

  function handleDownload() {
    downloadBackupCodesFile(backupCodes);
    setNotice({
      message: t("feedback.backupCodesDownloaded"),
      tone: "success",
    });
  }

  return (
    <div className="space-y-5">
      {notice ? <InlineNotice tone={notice.tone}>{notice.message}</InlineNotice> : null}

      <div className="rounded-[1.75rem] border border-page-border bg-page-soft p-5">
        <h2 className="font-semibold text-lg text-page-ink">{t("totp.backupTitle")}</h2>
        <p className="mt-2 text-page-ink/70 text-sm leading-6">{t("totp.backupDescription")}</p>
        <pre className="mt-4 overflow-x-auto rounded-2xl bg-white px-4 py-4 font-mono text-page-ink text-sm leading-7 shadow-sm">
          {joinBackupCodes(backupCodes)}
        </pre>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <SecondaryButton onClick={handleCopy} type="button">
          {t("totp.copy")}
        </SecondaryButton>
        <PrimaryButton onClick={handleDownload} type="button">
          {t("totp.download")}
        </PrimaryButton>
      </div>
    </div>
  );
}
