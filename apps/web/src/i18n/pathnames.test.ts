import { describe, expect, it } from "bun:test";

import { getLocalizedPath, hasLocalePrefix, replaceLocaleInPathname } from "./pathnames";

describe("pathnames", () => {
  it("builds locale-prefixed paths", () => {
    expect(getLocalizedPath("ko", "/")).toBe("/ko");
    expect(getLocalizedPath("en", "/dashboard")).toBe("/en/dashboard");
  });

  it("detects locale prefixes", () => {
    expect(hasLocalePrefix("/ko/dashboard")).toBe(true);
    expect(hasLocalePrefix("/dashboard")).toBe(false);
  });

  it("replaces only the locale segment", () => {
    expect(replaceLocaleInPathname("/ko/dashboard", "en")).toBe("/en/dashboard");
    expect(replaceLocaleInPathname("/dashboard", "ko")).toBe("/ko/dashboard");
  });
});
