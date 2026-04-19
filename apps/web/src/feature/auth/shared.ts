import type { Route } from "next";
import type { Locale } from "@/i18n/config";
import { getLocalizedPath } from "@/i18n/pathnames";

export type AuthIdentifierKind = "email" | "username";
export type AuthMode = "default" | "reauth";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[a-z0-9._]+$/;

export function trimText(value: string) {
  return value.trim();
}

export function normalizeEmail(value: string) {
  return trimText(value).toLowerCase();
}

export function normalizeUsername(value: string) {
  return trimText(value).toLowerCase();
}

export function isEmailIdentifier(value: string) {
  return emailPattern.test(trimText(value));
}

export function getAuthIdentifierKind(value: string): AuthIdentifierKind {
  return isEmailIdentifier(value) ? "email" : "username";
}

export function isUsernameFormatValid(value: string) {
  const normalizedValue = normalizeUsername(value);

  return normalizedValue.length >= 3 && normalizedValue.length <= 30 && usernamePattern.test(normalizedValue);
}

export function sanitizeOptionalText(value: string) {
  const trimmedValue = trimText(value);

  return trimmedValue.length > 0 ? trimmedValue : undefined;
}

export function buildProfileUpdateInput(input: { displayUsername: string; name: string; username: string }) {
  return {
    displayUsername: sanitizeOptionalText(input.displayUsername),
    name: trimText(input.name),
    username: normalizeUsername(input.username),
  };
}

export function buildSettingsPath(username: string) {
  return `/${normalizeUsername(username)}/settings`;
}

export function buildBackupCodesPath(username: string) {
  return `${buildSettingsPath(username)}/backup-codes`;
}

export function parseAuthMode(value: string | string[] | undefined): AuthMode {
  const normalizedValue = Array.isArray(value) ? value[0] : value;

  return normalizedValue === "reauth" ? "reauth" : "default";
}

export function sanitizeReturnTo(value: string | string[] | undefined, locale: Locale) {
  const fallbackPath = getLocalizedPath(locale, "/");
  const normalizedValue = Array.isArray(value) ? value[0] : value;

  if (!normalizedValue?.startsWith("/") || normalizedValue.startsWith("//")) {
    return fallbackPath;
  }

  try {
    const url = new URL(normalizedValue, "https://gyeoltare.invalid");
    const localePrefix = `/${locale}`;

    if (url.pathname !== localePrefix && !url.pathname.startsWith(`${localePrefix}/`)) {
      return fallbackPath;
    }

    return `${url.pathname}${url.search}${url.hash}` as Route;
  } catch {
    return fallbackPath;
  }
}

export function buildAuthContinuationPath({
  locale,
  mode,
  pathname,
  returnTo,
}: {
  locale: Locale;
  mode: AuthMode;
  pathname: "/login" | "/two-factor";
  returnTo?: string;
}) {
  const localizedPath = getLocalizedPath(locale, pathname);
  const searchParams = new URLSearchParams();

  if (mode === "reauth") {
    searchParams.set("mode", mode);
  }

  if (returnTo) {
    searchParams.set("returnTo", returnTo);
  }

  const queryString = searchParams.toString();

  return (queryString.length > 0 ? `${localizedPath}?${queryString}` : localizedPath) as Route;
}

export function joinBackupCodes(backupCodes: string[]) {
  return backupCodes.join("\n");
}

export function isFreshAuthSession(session: Pick<{ createdAt: Date }, "createdAt">) {
  const createdAtMs = new Date(session.createdAt).getTime();

  if (!Number.isFinite(createdAtMs)) {
    return false;
  }

  return Date.now() - createdAtMs < 1000 * 60 * 60 * 24;
}
