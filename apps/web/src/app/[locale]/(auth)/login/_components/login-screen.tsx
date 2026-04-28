"use client";

import { authClient } from "@gyeoltare/auth/client";
import { Danger, Eye, EyeOff, FaceId, Lock, Spinner } from "@mynaui/icons-react";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { resolveAuthErrorMessage } from "@/feature/auth/errors";
import {
  type AuthMode,
  buildAuthContinuationPath,
  getAuthIdentifierKind,
  normalizeEmail,
  normalizeUsername,
  trimText,
} from "@/feature/auth/shared";
import type { Locale } from "@/i18n/config";
import { getLocalizedPath } from "@/i18n/pathnames";

type LoginScreenProps = {
  locale: Locale;
  mode: AuthMode;
  returnTo: Route;
};

const rememberedIdentifierStorageKey = "gyeoltare.auth.login.rememberedIdentifier";

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
  const identifierInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [rememberIdentifier, setRememberIdentifier] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasskeyPending, setIsPasskeyPending] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const errorId = useId();
  const identifierId = useId();
  const passwordInputId = useId();
  const rememberId = useId();
  const isBusy = isSubmitting || isPasskeyPending;

  useEffect(() => {
    const rememberedIdentifier = readRememberedIdentifier();

    if (!rememberedIdentifier) {
      return;
    }

    setRememberIdentifier(true);

    if (identifierInputRef.current?.value.length === 0) {
      identifierInputRef.current.value = rememberedIdentifier;
    }
  }, []);

  function navigateAfterSignIn(data: unknown) {
    if (needsTwoFactorVerification(data)) {
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
  }

  function resolveUnexpectedErrorMessage(error: unknown) {
    if (error instanceof DOMException && (error.name === "AbortError" || error.name === "NotAllowedError")) {
      return t("errors.passkeyCancelled");
    }

    return t("errors.generic");
  }

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
    setIsSubmitting(true);

    try {
      const formData = new FormData(form);
      const normalizedIdentifier = trimText(String(formData.get("identifier") ?? ""));
      const password = String(formData.get("password") ?? "");
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

      persistRememberedIdentifier(normalizedIdentifier, rememberIdentifier);
      navigateAfterSignIn(result.data);
    } catch (error) {
      setErrorMessage(resolveUnexpectedErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePasskeySignIn() {
    if (isBusy) {
      return;
    }

    setErrorMessage(null);
    setIsPasskeyPending(true);

    try {
      const result = await authClient.signIn.passkey();

      if (result.error) {
        setErrorMessage(resolveAuthErrorMessage(t, result.error));
        return;
      }

      navigateAfterSignIn(result.data);
    } catch (error) {
      setErrorMessage(resolveUnexpectedErrorMessage(error));
    } finally {
      setIsPasskeyPending(false);
    }
  }

  function handleFormInput() {
    if (errorMessage) {
      setErrorMessage(null);
    }
  }

  function handleRememberIdentifierChange(event: React.ChangeEvent<HTMLInputElement>) {
    const shouldRemember = event.target.checked;

    setRememberIdentifier(shouldRemember);

    if (!shouldRemember) {
      forgetRememberedIdentifier();
    }
  }

  return (
    <section className="grid w-full gap-8">
      {mode === "reauth" && (
        <div className="flex items-center gap-3 rounded-lg border border-[#f4d8c8] bg-[#fff3eb] px-6 py-4 text-[#a96855]">
          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-[#ef9b80] text-[#e98369]">
            <Danger aria-hidden="true" className="h-3.5 w-3.5" stroke={2} />
          </span>
          <p className="font-bold text-[0.9rem]">{t("login.reauthBanner")}</p>
        </div>
      )}

      <div className="mt-1">
        <p className="font-black text-[#241617] text-[2.05rem] leading-tight tracking-normal">
          {t("login.simpleTitle")}
        </p>
        <p className="mt-3 text-[#6d665f] text-[0.98rem] leading-6">{t("login.simpleDescription")}</p>
      </div>

      <form aria-busy={isBusy} className="mt-3 grid gap-5" onInput={handleFormInput} onSubmit={handleSubmit}>
        <div>
          <label className="block font-black text-[#241617] text-sm" htmlFor={identifierId}>
            {t("login.identifierLabel")}
          </label>
          <input
            aria-describedby={errorMessage ? errorId : undefined}
            aria-invalid={errorMessage ? true : undefined}
            autoCapitalize="off"
            autoComplete="username webauthn"
            autoCorrect="off"
            className="mt-3 w-full rounded-lg border border-[#eadbd0] bg-white px-4 py-3 text-base text-page-ink outline-none transition placeholder:text-[#b7afa7] focus:border-[#ff6a63] focus:ring-4 focus:ring-[#ff6a63]/10 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-page-danger/60 aria-invalid:focus:border-page-danger aria-invalid:focus:ring-page-danger/10"
            disabled={isBusy}
            enterKeyHint="next"
            id={identifierId}
            inputMode="email"
            maxLength={254}
            name="identifier"
            placeholder={t("login.simpleIdentifierPlaceholder")}
            ref={identifierInputRef}
            required
            spellCheck={false}
            type="text"
          />
        </div>

        <div className="mt-1">
          <label className="block font-black text-[#241617] text-sm" htmlFor={passwordInputId}>
            {t("login.passwordLabel")}
          </label>
          <div className="relative mt-3">
            <input
              aria-describedby={errorMessage ? errorId : undefined}
              aria-invalid={errorMessage ? true : undefined}
              autoCapitalize="off"
              autoComplete="current-password"
              autoCorrect="off"
              className="w-full rounded-lg border border-[#eadbd0] bg-white px-4 py-3 pr-12 text-base text-page-ink outline-none transition placeholder:text-[#b7afa7] focus:border-[#ff6a63] focus:ring-4 focus:ring-[#ff6a63]/10 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-page-danger/60 aria-invalid:focus:border-page-danger aria-invalid:focus:ring-page-danger/10"
              disabled={isBusy}
              enterKeyHint="done"
              id={passwordInputId}
              name="password"
              placeholder={t("login.passwordPlaceholder")}
              ref={passwordInputRef}
              required
              spellCheck={false}
              type={isPasswordVisible ? "text" : "password"}
            />
            <button
              aria-label={t(isPasswordVisible ? "login.passwordToggleHide" : "login.passwordToggleShow")}
              aria-pressed={isPasswordVisible}
              className="absolute top-1/2 right-3 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-md text-[#77706a] transition hover:bg-page-soft hover:text-page-ink focus-visible:outline-3 focus-visible:outline-page-accent focus-visible:outline-offset-2"
              disabled={isBusy}
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
        </div>

        <div className="flex items-center gap-4">
          <label className="inline-flex cursor-pointer items-center gap-2 text-[#4e4741] text-sm" htmlFor={rememberId}>
            <input
              checked={rememberIdentifier}
              className="h-5 w-5 rounded-[0.3rem] border-[#d8c8bd] accent-[#ff4d54]"
              disabled={isBusy}
              id={rememberId}
              onChange={handleRememberIdentifierChange}
              type="checkbox"
            />
            <span>{t("login.rememberIdentifier")}</span>
          </label>
        </div>

        {errorMessage && (
          <div
            className="rounded-lg border border-page-danger/20 bg-page-danger/8 px-4 py-3 text-page-danger text-sm leading-6"
            id={errorId}
            role="alert"
          >
            {errorMessage}
          </div>
        )}

        <button
          className="mt-4 inline-flex w-full touch-manipulation items-center justify-center gap-2 rounded-lg bg-[#ff4d54] p-3 font-black text-base text-white shadow-[0_18px_38px_rgba(255,77,84,0.18)] transition hover:bg-[#f14049] focus-visible:outline-3 focus-visible:outline-page-accent focus-visible:outline-offset-3 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isBusy}
          type="submit"
        >
          {isSubmitting && (
            <Spinner aria-hidden="true" className="h-5 w-5 animate-spin motion-reduce:animate-none" stroke={1.8} />
          )}
          {isSubmitting ? t("login.submitting") : t("login.submit")}
        </button>
      </form>

      <div className="flex items-center gap-4 text-[#9c948d] text-sm">
        <span className="h-px flex-1 bg-[#eadbd0]" />
        <span>{t("login.divider")}</span>
        <span className="h-px flex-1 bg-[#eadbd0]" />
      </div>

      <button
        className="inline-flex w-full touch-manipulation items-center justify-center gap-3 rounded-lg border border-[#ff7d7d] bg-white p-3 font-black text-[#241617] text-base transition hover:bg-[#fff6f2] focus-visible:outline-3 focus-visible:outline-page-accent focus-visible:outline-offset-3 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isBusy}
        onClick={handlePasskeySignIn}
        type="button"
      >
        {isPasskeyPending ? (
          <Spinner aria-hidden="true" className="h-5 w-5 animate-spin motion-reduce:animate-none" stroke={1.8} />
        ) : (
          <FaceId aria-hidden="true" className="h-5 w-5" stroke={1.8} />
        )}
        {isPasskeyPending ? t("login.passkeyPending") : t("login.passkey")}
      </button>

      {mode !== "reauth" && (
        <p className="text-center text-[#5f5852] text-base">
          {t("login.signUpPrompt")}{" "}
          <Link
            className="font-black text-[#ff4d54] transition hover:text-[#e43c45] focus-visible:outline-3 focus-visible:outline-page-accent focus-visible:outline-offset-3"
            href={getLocalizedPath(locale, "/sign-up")}
          >
            {t("login.signUpLink")}
          </Link>
        </p>
      )}

      <p className="text-center text-[#888078] text-sm leading-7">
        <span className="mx-auto flex items-center justify-center gap-2">
          <Lock aria-hidden="true" className="h-4 w-4" stroke={1.7} />
          {t("login.securityNoteTitle")}
        </span>
        <span>{t("login.securityNoteBody")}</span>
      </p>
    </section>
  );
}

function readRememberedIdentifier() {
  try {
    return window.localStorage.getItem(rememberedIdentifierStorageKey) ?? "";
  } catch {
    return "";
  }
}

function persistRememberedIdentifier(identifier: string, shouldRemember: boolean) {
  try {
    if (shouldRemember) {
      window.localStorage.setItem(rememberedIdentifierStorageKey, identifier);
      return;
    }

    window.localStorage.removeItem(rememberedIdentifierStorageKey);
  } catch {
    // Storage can be unavailable in privacy-restricted browsers.
  }
}

function forgetRememberedIdentifier() {
  try {
    window.localStorage.removeItem(rememberedIdentifierStorageKey);
  } catch {
    // Storage can be unavailable in privacy-restricted browsers.
  }
}
