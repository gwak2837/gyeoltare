"use client";

import { authClient } from "@gyeoltare/auth/client";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { resolveAuthErrorMessage } from "@/feature/auth/errors";
import {
  type AuthMode,
  buildAuthContinuationPath,
  getAuthIdentifierKind,
  normalizeEmail,
  normalizeUsername,
  trimText,
} from "@/feature/auth/shared";
import {
  AuthCard,
  AuthField,
  AuthHeading,
  AuthInput,
  InlineNotice,
  PrimaryButton,
  SecondaryButton,
} from "@/feature/auth/ui";
import type { Locale } from "@/i18n/config";
import { getLocalizedPath } from "@/i18n/pathnames";

type LoginScreenProps = {
  locale: Locale;
  mode: AuthMode;
  returnTo: Route;
};

function needsTwoFactorVerification(data: unknown) {
  return (
    typeof data === "object" &&
    data !== null &&
    "twoFactorRedirect" in data &&
    Boolean((data as { twoFactorRedirect?: boolean }).twoFactorRedirect)
  );
}

export function LoginScreen({ locale, mode, returnTo }: LoginScreenProps) {
  const router = useRouter();
  const t = useTranslations("auth");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasskeyPending, setIsPasskeyPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const normalizedIdentifier = trimText(identifier);
      const payload =
        getAuthIdentifierKind(normalizedIdentifier) === "email"
          ? authClient.signIn.email({
              email: normalizeEmail(normalizedIdentifier),
              password,
            })
          : authClient.signIn.username({
              password,
              username: normalizeUsername(normalizedIdentifier),
            });
      const result = await payload;

      if (result.error) {
        setErrorMessage(resolveAuthErrorMessage(t, result.error));
        return;
      }

      if (needsTwoFactorVerification(result.data)) {
        router.replace(
          buildAuthContinuationPath({
            locale,
            mode,
            pathname: "/two-factor",
            returnTo,
          }),
        );
        router.refresh();
        return;
      }

      router.replace(returnTo);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePasskeySignIn() {
    setErrorMessage(null);
    setIsPasskeyPending(true);

    try {
      const result = await authClient.signIn.passkey();

      if (result.error) {
        setErrorMessage(resolveAuthErrorMessage(t, result.error));
        return;
      }

      if (needsTwoFactorVerification(result.data)) {
        router.replace(
          buildAuthContinuationPath({
            locale,
            mode,
            pathname: "/two-factor",
            returnTo,
          }),
        );
        router.refresh();
        return;
      }

      router.replace(returnTo);
      router.refresh();
    } finally {
      setIsPasskeyPending(false);
    }
  }

  return (
    <AuthCard className="w-full max-w-xl">
      <AuthHeading description={t("login.description")} eyebrow={t("login.eyebrow")} title={t("login.title")} />

      {mode === "reauth" ? (
        <div className="mt-6">
          <InlineNotice>{t("login.reauthNotice")}</InlineNotice>
        </div>
      ) : null}

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <AuthField label={t("login.identifierLabel")}>
          <AuthInput
            autoComplete="username webauthn"
            onChange={(event) => setIdentifier(event.target.value)}
            placeholder={t("login.identifierPlaceholder")}
            value={identifier}
          />
        </AuthField>

        <AuthField label={t("login.passwordLabel")}>
          <AuthInput
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder={t("login.passwordPlaceholder")}
            type="password"
            value={password}
          />
        </AuthField>

        {errorMessage ? <InlineNotice tone="danger">{errorMessage}</InlineNotice> : null}

        <PrimaryButton disabled={isSubmitting} type="submit">
          {isSubmitting ? t("login.submitting") : t("login.submit")}
        </PrimaryButton>

        <SecondaryButton disabled={isPasskeyPending} onClick={handlePasskeySignIn} type="button">
          {isPasskeyPending ? t("login.passkeyPending") : t("login.passkey")}
        </SecondaryButton>
      </form>

      {mode !== "reauth" ? (
        <p className="mt-6 text-center text-page-ink/65 text-sm">
          {t("login.signUpPrompt")}{" "}
          <Link className="font-semibold text-page-accent" href={getLocalizedPath(locale, "/sign-up")}>
            {t("login.signUpLink")}
          </Link>
        </p>
      ) : null}
    </AuthCard>
  );
}
