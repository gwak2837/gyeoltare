"use client";

import { authClient } from "@gyeoltare/auth/client";
import type { AuthSessionData } from "@gyeoltare/auth/server";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { copyBackupCodesToClipboard, downloadBackupCodesFile } from "@/feature/auth/backup-codes";
import { resolveAuthErrorMessage } from "@/feature/auth/errors";
import {
  buildBackupCodesPath,
  buildProfileUpdateInput,
  buildSettingsPath,
  normalizeUsername,
  trimText,
} from "@/feature/auth/shared";
import { SignOutButton } from "@/feature/auth/sign-out-button";
import {
  AuthField,
  AuthHeading,
  AuthInput,
  InlineNotice,
  PrimaryButton,
  SecondaryButton,
  SectionShell,
  StatusPill,
} from "@/feature/auth/ui";
import type { Locale } from "@/i18n/config";
import { getLocalizedPath } from "@/i18n/pathnames";

type SettingsScreenProps = {
  initialSession: AuthSessionData;
  locale: Locale;
};

type NoticeState = {
  message: string;
  tone: "danger" | "success";
} | null;

function formatPasskeyDate(locale: Locale, value?: Date | string | null) {
  if (!value) {
    return "-";
  }

  const dateValue = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(dateValue.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "ko-KR", {
    dateStyle: "medium",
  }).format(dateValue);
}

export function SettingsScreen({ initialSession, locale }: SettingsScreenProps) {
  const router = useRouter();
  const settingsT = useTranslations("settings");
  const authT = useTranslations("auth");
  const sessionQuery = authClient.useSession();
  const passkeysQuery = authClient.useListPasskeys();
  const currentSession = (sessionQuery.data ?? initialSession) as AuthSessionData;

  const [notice, setNotice] = useState<NoticeState>(null);
  const [name, setName] = useState(initialSession.user.name);
  const [username, setUsername] = useState(initialSession.user.username ?? "");
  const [displayUsername, setDisplayUsername] = useState(initialSession.user.displayUsername ?? "");
  const [isProfilePending, setIsProfilePending] = useState(false);

  const [twoFactorPassword, setTwoFactorPassword] = useState("");
  const [enrollmentCode, setEnrollmentCode] = useState("");
  const [enrollmentData, setEnrollmentData] = useState<{
    backupCodes: string[];
    totpURI: string;
  } | null>(null);
  const [visibleBackupCodes, setVisibleBackupCodes] = useState<string[] | null>(null);
  const [isTwoFactorPending, setIsTwoFactorPending] = useState<null | "disable" | "enable" | "regenerate" | "verify">(
    null,
  );

  const [passkeyName, setPasskeyName] = useState("");
  const [passkeyAttachment, setPasskeyAttachment] = useState<"cross-platform" | "platform">("platform");
  const [passkeyActionId, setPasskeyActionId] = useState<string | null>(null);
  const [renameDrafts, setRenameDrafts] = useState<Record<string, string>>({});

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [revokeOtherSessions, setRevokeOtherSessions] = useState(true);
  const [isPasswordPending, setIsPasswordPending] = useState(false);

  useEffect(() => {
    if (!sessionQuery.data) {
      return;
    }

    setName(sessionQuery.data.user.name);
    setUsername(sessionQuery.data.user.username ?? "");
    setDisplayUsername(sessionQuery.data.user.displayUsername ?? "");
  }, [sessionQuery.data]);

  function showError(error: unknown) {
    setNotice({
      message: resolveAuthErrorMessage(authT, error),
      tone: "danger",
    });
  }

  function showSuccess(message: string) {
    setNotice({
      message,
      tone: "success",
    });
  }

  async function handleProfileSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);
    setIsProfilePending(true);

    try {
      const result = await authClient.updateUser(
        buildProfileUpdateInput({
          displayUsername,
          name,
          username,
        }),
      );

      if (result.error) {
        showError(result.error);
        return;
      }

      showSuccess(settingsT("feedback.profileSaved"));

      const nextUsername = normalizeUsername(username || currentSession.user.username || "");
      router.replace(getLocalizedPath(locale, buildSettingsPath(nextUsername)));
      router.refresh();
    } finally {
      setIsProfilePending(false);
    }
  }

  async function handleEnableTwoFactor() {
    setNotice(null);
    setIsTwoFactorPending("enable");

    try {
      const result = await authClient.twoFactor.enable({
        password: twoFactorPassword,
      });

      if (result.error) {
        showError(result.error);
        return;
      }

      setEnrollmentData({
        backupCodes: result.data.backupCodes,
        totpURI: result.data.totpURI,
      });
      setVisibleBackupCodes(result.data.backupCodes);
    } finally {
      setIsTwoFactorPending(null);
    }
  }

  async function handleVerifyEnrollment() {
    setNotice(null);
    setIsTwoFactorPending("verify");

    try {
      const result = await authClient.twoFactor.verifyTotp({
        code: trimText(enrollmentCode),
      });

      if (result.error) {
        showError(result.error);
        return;
      }

      setEnrollmentCode("");
      setEnrollmentData(null);
      setTwoFactorPassword("");
      showSuccess(settingsT("feedback.twoFactorEnabled"));
      router.refresh();
    } finally {
      setIsTwoFactorPending(null);
    }
  }

  async function handleDisableTwoFactor() {
    setNotice(null);
    setIsTwoFactorPending("disable");

    try {
      const result = await authClient.twoFactor.disable({
        password: twoFactorPassword,
      });

      if (result.error) {
        showError(result.error);
        return;
      }

      setEnrollmentData(null);
      setVisibleBackupCodes(null);
      setTwoFactorPassword("");
      showSuccess(settingsT("feedback.twoFactorDisabled"));
      router.refresh();
    } finally {
      setIsTwoFactorPending(null);
    }
  }

  async function handleRegenerateBackupCodes() {
    setNotice(null);
    setIsTwoFactorPending("regenerate");

    try {
      const result = await authClient.twoFactor.generateBackupCodes({
        password: twoFactorPassword,
      });

      if (result.error) {
        showError(result.error);
        return;
      }

      setVisibleBackupCodes(result.data.backupCodes);
    } finally {
      setIsTwoFactorPending(null);
    }
  }

  async function handleCopyBackupCodes() {
    if (!visibleBackupCodes) {
      return;
    }

    try {
      await copyBackupCodesToClipboard(visibleBackupCodes);
      showSuccess(settingsT("feedback.backupCodesCopied"));
    } catch (error) {
      showError(error);
    }
  }

  function handleDownloadBackupCodes() {
    if (!visibleBackupCodes) {
      return;
    }

    downloadBackupCodesFile(visibleBackupCodes);
    showSuccess(settingsT("feedback.backupCodesDownloaded"));
  }

  async function handleAddPasskey() {
    setNotice(null);
    setPasskeyActionId("add");

    try {
      const result = await authClient.passkey.addPasskey({
        authenticatorAttachment: passkeyAttachment,
        name: trimText(passkeyName) || undefined,
      });

      if (result.error) {
        showError(result.error);
        return;
      }

      setPasskeyName("");
      await passkeysQuery.refetch();
      showSuccess(settingsT("feedback.passkeyAdded"));
    } finally {
      setPasskeyActionId(null);
    }
  }

  async function handleRenamePasskey(id: string, fallbackName?: string | null) {
    setNotice(null);
    setPasskeyActionId(id);

    try {
      const nextName = trimText(renameDrafts[id] ?? fallbackName ?? "");
      const result = await authClient.passkey.updatePasskey({
        id,
        name: nextName,
      });

      if (result.error) {
        showError(result.error);
        return;
      }

      await passkeysQuery.refetch();
      showSuccess(settingsT("feedback.passkeyUpdated"));
    } finally {
      setPasskeyActionId(null);
    }
  }

  async function handleDeletePasskey(id: string) {
    setNotice(null);
    setPasskeyActionId(id);

    try {
      const result = await authClient.passkey.deletePasskey({
        id,
      });

      if (result.error) {
        showError(result.error);
        return;
      }

      await passkeysQuery.refetch();
      showSuccess(settingsT("feedback.passkeyDeleted"));
    } finally {
      setPasskeyActionId(null);
    }
  }

  async function handleChangePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);
    setIsPasswordPending(true);

    try {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions,
      });

      if (result.error) {
        showError(result.error);
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      showSuccess(settingsT("feedback.passwordChanged"));
      router.refresh();
    } finally {
      setIsPasswordPending(false);
    }
  }

  const passkeys = passkeysQuery.data ?? [];
  const twoFactorEnabled = Boolean(currentSession.user.twoFactorEnabled);

  return (
    <main className="mx-auto w-full max-w-6xl sm:p-8 lg:p-10">
      <div className="border border-page-border/80 bg-page-surface/92 p-7 shadow-[0_30px_120px_rgba(33,26,65,0.12)] backdrop-blur sm:rounded-4xl sm:p-10">
        <div className="flex flex-col gap-5 border-page-border/70 border-b pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <AuthHeading
              description={settingsT("header.description")}
              eyebrow={settingsT("header.eyebrow")}
              title={settingsT("header.title", { username: currentSession.user.username ?? "" })}
            />
          </div>
          <StatusPill
            tone={twoFactorEnabled ? "success" : "neutral"}
            value={twoFactorEnabled ? settingsT("status.enabled") : settingsT("status.disabled")}
          />
        </div>

        {notice ? (
          <div className="mt-6">
            <InlineNotice tone={notice.tone}>{notice.message}</InlineNotice>
          </div>
        ) : null}

        <div className="mt-8 grid gap-6">
          <SectionShell description={settingsT("account.description")} title={settingsT("account.title")}>
            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleProfileSave}>
              <AuthField label={settingsT("account.nameLabel")}>
                <AuthInput onChange={(event) => setName(event.target.value)} value={name} />
              </AuthField>
              <AuthField label={settingsT("account.usernameLabel")}>
                <AuthInput onChange={(event) => setUsername(event.target.value)} value={username} />
              </AuthField>
              <div className="md:col-span-2">
                <AuthField
                  hint={settingsT("account.displayUsernameHint")}
                  label={settingsT("account.displayUsernameLabel")}
                >
                  <AuthInput onChange={(event) => setDisplayUsername(event.target.value)} value={displayUsername} />
                </AuthField>
              </div>
              <div className="md:col-span-2">
                <PrimaryButton disabled={isProfilePending} type="submit">
                  {isProfilePending ? settingsT("account.submitting") : settingsT("account.submit")}
                </PrimaryButton>
              </div>
            </form>
          </SectionShell>

          <SectionShell description={settingsT("totp.description")} title={settingsT("totp.title")}>
            <div className="grid gap-5 lg:grid-cols-[0.65fr_0.35fr]">
              <div className="space-y-4">
                <AuthField label={settingsT("totp.passwordLabel")}>
                  <AuthInput
                    onChange={(event) => setTwoFactorPassword(event.target.value)}
                    placeholder={settingsT("totp.passwordPlaceholder")}
                    type="password"
                    value={twoFactorPassword}
                  />
                </AuthField>

                {!twoFactorEnabled ? (
                  <PrimaryButton
                    disabled={isTwoFactorPending === "enable"}
                    onClick={handleEnableTwoFactor}
                    type="button"
                  >
                    {isTwoFactorPending === "enable" ? settingsT("totp.enabling") : settingsT("totp.enable")}
                  </PrimaryButton>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Link
                      className="inline-flex items-center justify-center rounded-full border border-page-border bg-white px-5 py-3 font-semibold text-page-ink text-sm transition-colors hover:border-page-accent/40 hover:bg-page-soft"
                      href={getLocalizedPath(locale, buildBackupCodesPath(currentSession.user.username ?? ""))}
                    >
                      {settingsT("totp.view")}
                    </Link>
                    <SecondaryButton
                      disabled={isTwoFactorPending === "regenerate"}
                      onClick={handleRegenerateBackupCodes}
                      type="button"
                    >
                      {isTwoFactorPending === "regenerate"
                        ? settingsT("totp.regenerating")
                        : settingsT("totp.regenerate")}
                    </SecondaryButton>
                    <PrimaryButton
                      disabled={isTwoFactorPending === "disable"}
                      onClick={handleDisableTwoFactor}
                      type="button"
                    >
                      {isTwoFactorPending === "disable" ? settingsT("totp.disabling") : settingsT("totp.disable")}
                    </PrimaryButton>
                  </div>
                )}

                {enrollmentData ? (
                  <div className="space-y-4 rounded-3xl border border-page-border bg-page-soft p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                      <div className="flex h-44 w-44 items-center justify-center rounded-3xl bg-white p-4 shadow-sm">
                        <QRCodeSVG size={152} value={enrollmentData.totpURI} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{settingsT("totp.qrTitle")}</h3>
                        <p className="mt-2 text-page-ink/68 text-sm leading-6">{settingsT("totp.qrDescription")}</p>
                        <div className="mt-3 rounded-2xl bg-white px-4 py-3 font-mono text-page-ink/72 text-xs leading-6 shadow-sm">
                          {enrollmentData.totpURI}
                        </div>
                      </div>
                    </div>

                    <AuthField label={settingsT("totp.verifyLabel")}>
                      <AuthInput
                        inputMode="numeric"
                        onChange={(event) => setEnrollmentCode(event.target.value)}
                        placeholder={settingsT("totp.verifyPlaceholder")}
                        value={enrollmentCode}
                      />
                    </AuthField>

                    <PrimaryButton
                      disabled={isTwoFactorPending === "verify"}
                      onClick={handleVerifyEnrollment}
                      type="button"
                    >
                      {isTwoFactorPending === "verify" ? settingsT("totp.verifying") : settingsT("totp.verify")}
                    </PrimaryButton>
                  </div>
                ) : null}
              </div>

              <div className="rounded-3xl border border-page-border bg-page-soft p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{settingsT("totp.backupTitle")}</h3>
                    <p className="mt-2 text-page-ink/68 text-sm leading-6">{settingsT("totp.backupDescription")}</p>
                  </div>
                  <StatusPill
                    tone={twoFactorEnabled ? "success" : "neutral"}
                    value={twoFactorEnabled ? settingsT("status.enabled") : settingsT("status.disabled")}
                  />
                </div>

                {visibleBackupCodes ? (
                  <>
                    <div className="mt-4 rounded-[1.25rem] bg-white p-4 shadow-sm">
                      <ul className="grid gap-2 font-mono text-sm sm:grid-cols-2">
                        {visibleBackupCodes.map((backupCode) => (
                          <li className="rounded-xl bg-page-soft px-3 py-2" key={backupCode}>
                            {backupCode}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <SecondaryButton onClick={handleCopyBackupCodes} type="button">
                        {settingsT("totp.copy")}
                      </SecondaryButton>
                      <SecondaryButton onClick={handleDownloadBackupCodes} type="button">
                        {settingsT("totp.download")}
                      </SecondaryButton>
                    </div>
                  </>
                ) : (
                  <div className="mt-4 rounded-[1.25rem] border border-page-border border-dashed bg-white px-4 py-5 text-page-ink/55 text-sm leading-6">
                    {settingsT("totp.emptyState")}
                  </div>
                )}
              </div>
            </div>
          </SectionShell>

          <SectionShell description={settingsT("passkeys.description")} title={settingsT("passkeys.title")}>
            <div className="grid gap-5 lg:grid-cols-[0.38fr_0.62fr]">
              <div className="space-y-4 rounded-3xl border border-page-border bg-page-soft p-5">
                <AuthField label={settingsT("passkeys.nameLabel")}>
                  <AuthInput
                    onChange={(event) => setPasskeyName(event.target.value)}
                    placeholder={settingsT("passkeys.namePlaceholder")}
                    value={passkeyName}
                  />
                </AuthField>

                <AuthField label={settingsT("passkeys.attachmentLabel")}>
                  <select
                    className="w-full rounded-2xl border border-page-border bg-white px-4 py-3 text-page-ink outline-none"
                    onChange={(event) => setPasskeyAttachment(event.target.value as "cross-platform" | "platform")}
                    value={passkeyAttachment}
                  >
                    <option value="platform">{settingsT("passkeys.platformAttachment")}</option>
                    <option value="cross-platform">{settingsT("passkeys.crossPlatformAttachment")}</option>
                  </select>
                </AuthField>

                <PrimaryButton disabled={passkeyActionId === "add"} onClick={handleAddPasskey} type="button">
                  {passkeyActionId === "add" ? settingsT("passkeys.adding") : settingsT("passkeys.add")}
                </PrimaryButton>
              </div>

              <div className="space-y-3">
                {passkeysQuery.isPending ? (
                  <InlineNotice>Passkeys are loading.</InlineNotice>
                ) : passkeys.length === 0 ? (
                  <div className="rounded-3xl border border-page-border border-dashed bg-page-soft px-5 py-6">
                    <h3 className="font-semibold text-lg">{settingsT("passkeys.emptyTitle")}</h3>
                    <p className="mt-2 text-page-ink/68 text-sm leading-6">{settingsT("passkeys.emptyDescription")}</p>
                  </div>
                ) : (
                  passkeys.map((passkey) => (
                    <article className="rounded-3xl border border-page-border bg-page-soft p-5" key={passkey.id}>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <input
                            className="w-full rounded-xl border border-page-border bg-white px-4 py-3 font-semibold text-page-ink outline-none"
                            onChange={(event) =>
                              setRenameDrafts((currentDrafts) => ({
                                ...currentDrafts,
                                [passkey.id]: event.target.value,
                              }))
                            }
                            value={renameDrafts[passkey.id] ?? passkey.name ?? ""}
                          />
                          <dl className="mt-3 grid gap-2 text-page-ink/62 text-xs uppercase tracking-[0.18em] sm:grid-cols-2">
                            <div>
                              <dt>{settingsT("passkeys.createdAt")}</dt>
                              <dd className="mt-1 text-page-ink text-sm normal-case tracking-normal">
                                {formatPasskeyDate(locale, passkey.createdAt)}
                              </dd>
                            </div>
                            <div>
                              <dt>ID</dt>
                              <dd className="mt-1 truncate font-mono text-page-ink text-sm normal-case tracking-normal">
                                {passkey.id}
                              </dd>
                            </div>
                          </dl>
                        </div>

                        <div className="grid w-full gap-3 sm:w-44">
                          <SecondaryButton
                            disabled={passkeyActionId === passkey.id}
                            onClick={() => handleRenamePasskey(passkey.id, passkey.name)}
                            type="button"
                          >
                            {passkeyActionId === passkey.id
                              ? settingsT("passkeys.renaming")
                              : settingsT("passkeys.rename")}
                          </SecondaryButton>
                          <PrimaryButton
                            className="bg-page-danger text-white hover:bg-page-danger/92"
                            disabled={passkeyActionId === passkey.id}
                            onClick={() => handleDeletePasskey(passkey.id)}
                            type="button"
                          >
                            {passkeyActionId === passkey.id
                              ? settingsT("passkeys.deleting")
                              : settingsT("passkeys.delete")}
                          </PrimaryButton>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </SectionShell>

          <SectionShell description={settingsT("password.description")} title={settingsT("password.title")}>
            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleChangePassword}>
              <AuthField label={settingsT("password.currentPasswordLabel")}>
                <AuthInput
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  type="password"
                  value={currentPassword}
                />
              </AuthField>
              <AuthField label={settingsT("password.newPasswordLabel")}>
                <AuthInput
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder={settingsT("password.newPasswordPlaceholder")}
                  type="password"
                  value={newPassword}
                />
              </AuthField>
              <label className="flex items-start gap-3 rounded-2xl border border-page-border bg-page-soft px-4 py-3 text-sm leading-6 md:col-span-2">
                <input
                  checked={revokeOtherSessions}
                  className="mt-1 h-4 w-4 rounded border-page-border accent-page-accent"
                  onChange={(event) => setRevokeOtherSessions(event.target.checked)}
                  type="checkbox"
                />
                <span>{settingsT("password.revokeOtherSessions")}</span>
              </label>
              <div className="md:col-span-2">
                <PrimaryButton disabled={isPasswordPending} type="submit">
                  {isPasswordPending ? settingsT("password.submitting") : settingsT("password.submit")}
                </PrimaryButton>
              </div>
            </form>
          </SectionShell>

          <SectionShell description={settingsT("session.description")} title={settingsT("session.title")}>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex items-center justify-center rounded-full border border-page-border bg-page-soft px-5 py-3 font-semibold text-sm"
                href={getLocalizedPath(locale, "/")}
              >
                {settingsT("session.home")}
              </Link>
              <SignOutButton
                className="inline-flex items-center justify-center rounded-full bg-page-ink px-5 py-3 font-semibold text-sm text-white disabled:opacity-60"
                idleLabel={settingsT("session.signOut")}
                locale={locale}
                pendingLabel={settingsT("session.signingOut")}
              />
            </div>
          </SectionShell>
        </div>
      </div>
    </main>
  );
}
