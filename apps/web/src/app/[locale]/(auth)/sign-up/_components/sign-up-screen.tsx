"use client";

import { authClient } from "@gyeoltare/auth/client";
import { Check, Eye, EyeOff, Lock, Spinner } from "@mynaui/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useDeferredValue, useEffect, useId, useState } from "react";
import { cn } from "@/component/cn";
import { resolveAuthErrorMessage } from "@/feature/auth/errors";
import { isUsernameFormatValid, normalizeEmail, normalizeUsername, trimText } from "@/feature/auth/shared";
import type { Locale } from "@/i18n/config";
import { getLocalizedPath } from "@/i18n/pathnames";

type SignUpScreenProps = {
  locale: Locale;
};

type AvailabilityState = "available" | "checking" | "idle" | "taken";

const focusClassName = "focus-visible:outline-3 focus-visible:outline-page-accent focus-visible:outline-offset-3";

const inputClassName =
  "w-full rounded-lg border border-[#eadbd0] bg-white px-4 py-3 text-base text-page-ink outline-none transition placeholder:text-[#b7afa7] focus:border-[#ff6a63] focus:ring-4 focus:ring-[#ff6a63]/10 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-page-danger/60 aria-invalid:focus:border-page-danger aria-invalid:focus:ring-page-danger/10";

export function SignUpScreen({ locale }: SignUpScreenProps) {
  const router = useRouter();
  const t = useTranslations("auth");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [availabilityState, setAvailabilityState] = useState<AvailabilityState>("idle");
  const deferredUsername = useDeferredValue(username);
  const errorId = useId();
  const usernameStatusId = useId();
  const nameInputId = useId();
  const usernameInputId = useId();
  const emailInputId = useId();
  const passwordInputId = useId();
  const isUsernameInvalid = username.length > 0 && !isUsernameFormatValid(username);
  const isUsernameUnavailable = availabilityState === "taken";
  const isBusy = isSubmitting || availabilityState === "checking";

  useEffect(() => {
    const normalizedUsername = normalizeUsername(deferredUsername);

    if (normalizedUsername.length === 0 || !isUsernameFormatValid(normalizedUsername)) {
      setAvailabilityState("idle");
      return;
    }

    let isCancelled = false;
    setAvailabilityState("checking");

    const timeoutId = window.setTimeout(async () => {
      const result = await authClient.isUsernameAvailable({ username: normalizedUsername }).catch(() => null);

      if (isCancelled) {
        return;
      }

      if (!result) {
        setAvailabilityState("idle");
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

    if (isBusy) {
      return;
    }

    const form = event.currentTarget;

    if (!form.reportValidity()) {
      return;
    }

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

    const formData = new FormData(form);
    setIsSubmitting(true);

    try {
      const result = await authClient.signUp.email({
        email: normalizeEmail(String(formData.get("email") ?? "")),
        name: trimText(String(formData.get("name") ?? "")),
        password: String(formData.get("password") ?? ""),
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

  function handleFormInput() {
    if (errorMessage) {
      setErrorMessage(null);
    }
  }

  function getUsernameStatus() {
    if (availabilityState === "checking") {
      return {
        className: "border-[#eadbd0] bg-page-soft text-[#6d665f]",
        icon: <Spinner aria-hidden="true" className="h-4 w-4 animate-spin motion-reduce:animate-none" stroke={1.8} />,
        message: t("signUp.usernameChecking"),
      };
    }

    if (availabilityState === "available") {
      return {
        className: "border-page-success/20 bg-page-success/10 text-page-success",
        icon: <Check aria-hidden="true" className="h-4 w-4" stroke={2.1} />,
        message: t("signUp.usernameAvailable"),
      };
    }

    if (availabilityState === "taken") {
      return {
        className: "border-page-danger/20 bg-page-danger/8 text-page-danger",
        icon: null,
        message: t("signUp.usernameTaken"),
      };
    }

    return null;
  }

  const usernameStatus = getUsernameStatus();

  return (
    <section className="grid w-full gap-8">
      <div>
        <p className="font-black text-[#ff4d54] text-sm">{t("signUp.eyebrow")}</p>
        <h1 className="mt-4 break-keep font-black text-[#241617] text-[2.05rem] leading-tight tracking-normal">
          {t("signUp.title")}
        </h1>
        <p className="mt-3 break-keep text-[#6d665f] text-[0.98rem] leading-6">{t("signUp.description")}</p>
      </div>

      <form aria-busy={isBusy} className="grid gap-6" onInput={handleFormInput} onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <label className="block font-black text-[#241617] text-sm" htmlFor={usernameInputId}>
            {t("signUp.usernameLabel")}
          </label>
          <input
            aria-describedby={usernameStatus ? usernameStatusId : undefined}
            aria-invalid={isUsernameInvalid || isUsernameUnavailable ? true : undefined}
            autoCapitalize="off"
            autoComplete="username"
            autoCorrect="off"
            className={inputClassName}
            disabled={isSubmitting}
            id={usernameInputId}
            maxLength={30}
            minLength={3}
            name="username"
            onChange={(event) => setUsername(normalizeUsername(event.target.value))}
            pattern="[a-z0-9._]{3,30}"
            placeholder={t("signUp.usernamePlaceholder")}
            required
            spellCheck={false}
            type="text"
            value={username}
          />
          <p className="break-keep text-[#766f68] text-xs leading-5">{t("signUp.usernameHint")}</p>
          {usernameStatus && (
            <div
              aria-live="polite"
              className={cn(
                "mt-3 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm",
                usernameStatus.className,
              )}
              id={usernameStatusId}
              role={availabilityState === "taken" ? "alert" : "status"}
            >
              {usernameStatus.icon}
              <span>{usernameStatus.message}</span>
            </div>
          )}
        </div>

        <div className="grid gap-2">
          <label className="block font-black text-[#241617] text-sm" htmlFor={emailInputId}>
            {t("signUp.emailLabel")}
          </label>
          <input
            autoCapitalize="off"
            autoComplete="email"
            autoCorrect="off"
            className={inputClassName}
            disabled={isSubmitting}
            id={emailInputId}
            inputMode="email"
            maxLength={254}
            name="email"
            placeholder={t("signUp.emailPlaceholder")}
            required
            spellCheck={false}
            type="email"
          />
        </div>

        <div className="grid gap-2">
          <label className="block font-black text-[#241617] text-sm" htmlFor={passwordInputId}>
            {t("signUp.passwordLabel")}
          </label>
          <div className="relative">
            <input
              autoComplete="new-password"
              className={cn(inputClassName, "pr-12")}
              disabled={isSubmitting}
              id={passwordInputId}
              minLength={8}
              name="password"
              placeholder={t("signUp.passwordPlaceholder")}
              required
              type={isPasswordVisible ? "text" : "password"}
            />
            <button
              aria-label={t(isPasswordVisible ? "signUp.passwordToggleHide" : "signUp.passwordToggleShow")}
              aria-pressed={isPasswordVisible}
              className="absolute top-1/2 right-3 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-md text-[#77706a] transition hover:bg-page-soft hover:text-page-ink focus-visible:outline-3 focus-visible:outline-page-accent focus-visible:outline-offset-2"
              disabled={isSubmitting}
              onClick={() => setIsPasswordVisible((value) => !value)}
              onMouseDown={(event) => event.preventDefault()}
              type="button"
            >
              {isPasswordVisible ? (
                <EyeOff aria-hidden="true" className="h-5 w-5" stroke={1.7} />
              ) : (
                <Eye aria-hidden="true" className="h-5 w-5" stroke={1.7} />
              )}
            </button>
          </div>
          <p className="break-keep text-[#766f68] text-xs leading-5">{t("signUp.passwordHint")}</p>
        </div>

        <div className="grid gap-2">
          <label className="block font-black text-[#241617] text-sm" htmlFor={nameInputId}>
            {t("signUp.nameLabel")}
          </label>
          <input
            autoComplete="name"
            className={inputClassName}
            disabled={isSubmitting}
            id={nameInputId}
            maxLength={80}
            name="name"
            placeholder={t("signUp.namePlaceholder")}
            required
            type="text"
          />
        </div>

        {errorMessage && (
          <div
            className="mt-5 rounded-lg border border-page-danger/20 bg-page-danger/8 px-4 py-3 text-page-danger text-sm leading-6"
            id={errorId}
            role="alert"
          >
            {errorMessage}
          </div>
        )}

        <button
          className="mt-3 inline-flex h-14 w-full touch-manipulation items-center justify-center gap-2 rounded-lg bg-[#ff4d54] px-5 font-black text-base text-white shadow-[0_18px_38px_rgba(255,77,84,0.18)] transition hover:bg-[#f14049] focus-visible:outline-3 focus-visible:outline-page-accent focus-visible:outline-offset-3 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isBusy || availabilityState === "taken"}
          type="submit"
        >
          {isSubmitting && (
            <Spinner aria-hidden="true" className="h-5 w-5 animate-spin motion-reduce:animate-none" stroke={1.8} />
          )}
          {isSubmitting ? t("signUp.submitting") : t("signUp.submit")}
        </button>
      </form>

      <p className="text-center text-[#5f5852] text-base">
        {t("signUp.loginPrompt")}{" "}
        <Link
          className={cn("font-black text-[#ff4d54] transition hover:text-[#e43c45]", focusClassName)}
          href={getLocalizedPath(locale, "/login")}
        >
          {t("signUp.loginLink")}
        </Link>
      </p>

      <p className="mt-2 text-center text-[#888078] text-sm leading-7">
        <span className="mx-auto mb-1 flex items-center justify-center gap-2">
          <Lock aria-hidden="true" className="h-4 w-4" stroke={1.7} />
          {t("signUp.securityNoteTitle")}
        </span>
        {t("signUp.securityNoteBody")}
      </p>
    </section>
  );
}
