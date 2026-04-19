import type { Locale } from "./config";

type MessageNamespace = "auth" | "common" | "settings";

const dynamic = {
  en: {
    auth: () => import("../../messages/ko/auth.json"),
    common: () => import("../../messages/ko/common.json"),
    settings: () => import("../../messages/ko/settings.json"),
  },
  ko: {
    auth: () => import("../../messages/ko/auth.json"),
    common: () => import("../../messages/ko/common.json"),
    settings: () => import("../../messages/ko/settings.json"),
  },
  ja: {
    auth: () => import("../../messages/ko/auth.json"),
    common: () => import("../../messages/ko/common.json"),
    settings: () => import("../../messages/ko/settings.json"),
  },
  zh: {
    auth: () => import("../../messages/ko/auth.json"),
    common: () => import("../../messages/ko/common.json"),
    settings: () => import("../../messages/ko/settings.json"),
  },
} as const;

async function loadNamespace(locale: Locale, namespace: MessageNamespace) {
  return (await dynamic[locale][namespace]()).default;
}

export async function getMessages(locale: Locale) {
  const [auth, common, settings] = await Promise.all([
    loadNamespace(locale, "auth"),
    loadNamespace(locale, "common"),
    loadNamespace(locale, "settings"),
  ]);

  return {
    auth,
    common,
    settings,
  };
}
