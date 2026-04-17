import { describe, expect, it } from "bun:test";

import {
  getLocaleFromAcceptLanguage,
  getLocaleFromCookie,
  resolveLocaleFromRequestValues,
} from "./request-locale";

describe("request locale resolution", () => {
  it("prefers an explicit locale cookie", () => {
    expect(
      resolveLocaleFromRequestValues({
        acceptLanguage: "en-US,en;q=0.8",
        cookieLocale: "ko",
      }),
    ).toBe("ko");
  });

  it("matches Accept-Language with q weights", () => {
    expect(getLocaleFromAcceptLanguage("en-US;q=0.5,ko-KR;q=0.9")).toBe("ko");
  });

  it("normalizes cookie locales with regions", () => {
    expect(getLocaleFromCookie("en-US")).toBe("en");
  });

  it("falls back to the default locale when nothing matches", () => {
    expect(
      resolveLocaleFromRequestValues({
        acceptLanguage: "fr-FR,ja-JP;q=0.8",
        cookieLocale: null,
      }),
    ).toBe("ko");
  });
});
