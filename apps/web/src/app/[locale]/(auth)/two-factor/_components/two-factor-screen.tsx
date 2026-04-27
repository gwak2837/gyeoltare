"use client";

import { authClient } from "@gyeoltare/auth/client";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { cn } from "@/component/cn";
import { resolveAuthErrorMessage } from "@/feature/auth/errors";
import { type AuthMode, trimText } from "@/feature/auth/shared";
import { AuthCard, AuthField, AuthHeading, AuthInput, InlineNotice, PrimaryButton } from "@/feature/auth/ui";

type TwoFactorScreenProps = {
  mode: AuthMode;
  returnTo: Route;
};

type VerificationMethod = "backup" | "totp";

export function TwoFactorScreen({ mode, returnTo }: TwoFactorScreenProps) {
  const router = useRouter();
  const t = useTranslations("auth");
  const [verificationMethod, setVerificationMethod] = useState<VerificationMethod>("totp");
  const [totpCode, setTotpCode] = useState("");
  const [backupCode, setBackupCode] = useState("");
  const [trustDevice, setTrustDevice] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleVerify() {
    setErrorMessage(null);
    setIsPending(true);

    try {
      const result =
        verificationMethod === "totp"
          ? await authClient.twoFactor.verifyTotp({
              code: trimText(totpCode),
              trustDevice,
            })
          : await authClient.twoFactor.verifyBackupCode({
              code: trimText(backupCode),
              trustDevice,
            });

      if (result.error) {
        setErrorMessage(resolveAuthErrorMessage(t, result.error));
        return;
      }

      router.replace(returnTo);
      router.refresh();
    } finally {
      setIsPending(false);
    }
  }

  return (
    <AuthCard className="w-full max-w-xl">
      <AuthHeading
        description={t("twoFactor.description")}
        eyebrow={t("twoFactor.eyebrow")}
        title={t("twoFactor.title")}
      />

      {mode === "reauth" ? (
        <div className="mt-6">
          <InlineNotice>{t("twoFactor.reauthNotice")}</InlineNotice>
        </div>
      ) : null}

      <div className="mt-8 flex rounded-full bg-page-soft p-1">
        <button
          className={cn(
            "flex-1 rounded-full px-4 py-2 font-semibold text-sm",
            verificationMethod === "totp" ? "bg-white text-page-ink shadow-sm" : "text-page-ink/60",
          )}
          onClick={() => setVerificationMethod("totp")}
          type="button"
        >
          {t("twoFactor.totpTab")}
        </button>
        <button
          className={cn(
            "flex-1 rounded-full px-4 py-2 font-semibold text-sm",
            verificationMethod === "backup" ? "bg-white text-page-ink shadow-sm" : "text-page-ink/60",
          )}
          onClick={() => setVerificationMethod("backup")}
          type="button"
        >
          {t("twoFactor.backupTab")}
        </button>
      </div>

      <div className="mt-5 space-y-4">
        {verificationMethod === "totp" ? (
          <AuthField label={t("twoFactor.totpLabel")}>
            <AuthInput
              inputMode="numeric"
              onChange={(event) => setTotpCode(event.target.value)}
              placeholder={t("twoFactor.totpPlaceholder")}
              value={totpCode}
            />
          </AuthField>
        ) : (
          <AuthField hint={t("twoFactor.backupHint")} label={t("twoFactor.backupCodeLabel")}>
            <AuthInput
              onChange={(event) => setBackupCode(event.target.value)}
              placeholder={t("twoFactor.backupCodePlaceholder")}
              value={backupCode}
            />
          </AuthField>
        )}

        <label className="flex items-start gap-3 rounded-2xl border border-page-border bg-page-soft px-4 py-3 text-sm leading-6">
          <input
            checked={trustDevice}
            className="mt-1 h-4 w-4 rounded border-page-border accent-[var(--page-accent)]"
            onChange={(event) => setTrustDevice(event.target.checked)}
            type="checkbox"
          />
          <span>
            <strong className="block font-semibold text-page-ink">{t("twoFactor.trustDeviceLabel")}</strong>
            <span className="text-page-ink/66">{t("twoFactor.trustDeviceHint")}</span>
          </span>
        </label>

        {errorMessage ? <InlineNotice tone="danger">{errorMessage}</InlineNotice> : null}

        <PrimaryButton disabled={isPending} onClick={handleVerify} type="button">
          {isPending
            ? verificationMethod === "totp"
              ? t("twoFactor.totpSubmitting")
              : t("twoFactor.backupCodeSubmitting")
            : verificationMethod === "totp"
              ? t("twoFactor.totpSubmit")
              : t("twoFactor.backupCodeSubmit")}
        </PrimaryButton>
      </div>
    </AuthCard>
  );
}
