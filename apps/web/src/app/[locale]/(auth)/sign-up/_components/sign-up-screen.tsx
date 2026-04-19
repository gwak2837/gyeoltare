"use client";

import { authClient } from "@gyeoltare/auth/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useDeferredValue, useEffect, useState } from "react";
import { resolveAuthErrorMessage } from "@/feature/auth/errors";
import { isUsernameFormatValid, normalizeEmail, normalizeUsername, trimText } from "@/feature/auth/shared";
import { AuthCard, AuthField, AuthHeading, AuthInput, InlineNotice, PrimaryButton } from "@/feature/auth/ui";
import type { Locale } from "@/i18n/config";
import { getLocalizedPath } from "@/i18n/pathnames";

type SignUpScreenProps = {
  locale: Locale;
};

type AvailabilityState = "available" | "checking" | "idle" | "taken";

export function SignUpScreen({ locale }: SignUpScreenProps) {
  const router = useRouter();
  const t = useTranslations("auth");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availabilityState, setAvailabilityState] = useState<AvailabilityState>("idle");
  const deferredUsername = useDeferredValue(username);

  useEffect(() => {
    const normalizedUsername = normalizeUsername(deferredUsername);

    if (normalizedUsername.length === 0 || !isUsernameFormatValid(normalizedUsername)) {
      setAvailabilityState("idle");
      return;
    }

    let isCancelled = false;
    setAvailabilityState("checking");

    const timeoutId = window.setTimeout(async () => {
      const result = await authClient.isUsernameAvailable({
        username: normalizedUsername,
      });

      if (isCancelled) {
        return;
      }

      setAvailabilityState(result.data?.available ? "available" : "taken");
    }, 280);

    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [deferredUsername]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const normalizedUsername = normalizeUsername(username);

    if (!isUsernameFormatValid(normalizedUsername)) {
      setErrorMessage(t("errors.invalidUsername"));
      return;
    }

    if (availabilityState === "taken") {
      setErrorMessage(t("errors.usernameTaken"));
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await authClient.signUp.email({
        email: normalizeEmail(email),
        name: trimText(name),
        password,
        username: normalizedUsername,
      });

      if (result.error) {
        setErrorMessage(resolveAuthErrorMessage(t, result.error));
        return;
      }

      router.replace(getLocalizedPath(locale, "/"));
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthCard className="w-full max-w-xl">
      <AuthHeading description={t("signUp.description")} eyebrow={t("signUp.eyebrow")} title={t("signUp.title")} />

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <AuthField label={t("signUp.nameLabel")}>
          <AuthInput
            onChange={(event) => setName(event.target.value)}
            placeholder={t("signUp.namePlaceholder")}
            value={name}
          />
        </AuthField>

        <AuthField hint={t("signUp.usernameHint")} label={t("signUp.usernameLabel")}>
          <AuthInput
            autoComplete="username"
            onChange={(event) => setUsername(event.target.value)}
            placeholder={t("signUp.usernamePlaceholder")}
            value={username}
          />
        </AuthField>

        {availabilityState === "checking" ? <InlineNotice>{t("signUp.usernameChecking")}</InlineNotice> : null}
        {availabilityState === "available" ? (
          <InlineNotice tone="success">{t("signUp.usernameAvailable")}</InlineNotice>
        ) : null}
        {availabilityState === "taken" ? <InlineNotice tone="danger">{t("signUp.usernameTaken")}</InlineNotice> : null}

        <AuthField label={t("signUp.emailLabel")}>
          <AuthInput
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t("signUp.emailPlaceholder")}
            type="email"
            value={email}
          />
        </AuthField>

        <AuthField hint={t("signUp.passwordHint")} label={t("signUp.passwordLabel")}>
          <AuthInput
            autoComplete="new-password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder={t("signUp.passwordPlaceholder")}
            type="password"
            value={password}
          />
        </AuthField>

        {errorMessage ? <InlineNotice tone="danger">{errorMessage}</InlineNotice> : null}

        <PrimaryButton disabled={isSubmitting} type="submit">
          {isSubmitting ? t("signUp.submitting") : t("signUp.submit")}
        </PrimaryButton>
      </form>

      <p className="mt-6 text-center text-page-ink/65 text-sm">
        {t("signUp.loginPrompt")}{" "}
        <Link className="font-semibold text-page-accent" href={getLocalizedPath(locale, "/login")}>
          {t("signUp.loginLink")}
        </Link>
      </p>
    </AuthCard>
  );
}
