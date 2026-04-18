import { expect, test } from "bun:test";
import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";

import { getDefaultSecureHeadersOptions, getDocsSecureHeadersOptions } from "./secure-headers";

function createSecureHeadersTestApp() {
  const app = new Hono();
  const defaultSecureHeaders = secureHeaders(getDefaultSecureHeadersOptions());
  const docsSecureHeaders = secureHeaders(getDocsSecureHeadersOptions());

  app.use("*", (c, next) => {
    if (c.req.path === "/docs") {
      return docsSecureHeaders(c, next);
    }

    return defaultSecureHeaders(c, next);
  });

  app.get("/docs", (c) => c.text("docs"));
  app.get("/openapi.json", (c) => c.json({ ok: true }));

  return app;
}

test("/docs 에는 Scalar UI용 완화된 CSP를 적용한다", async () => {
  const app = createSecureHeadersTestApp();

  const response = await app.request("/docs");
  const contentSecurityPolicy = response.headers.get("content-security-policy");

  expect(response.status).toBe(200);
  expect(contentSecurityPolicy).toContain("default-src 'none'");
  expect(contentSecurityPolicy).toContain("script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net");
  expect(contentSecurityPolicy).toContain("connect-src 'self' https:");
  expect(contentSecurityPolicy).toContain("style-src 'self' 'unsafe-inline'");
});

test("기본 API 경로에는 기존 강한 CSP를 유지한다", async () => {
  const app = createSecureHeadersTestApp();

  const response = await app.request("/openapi.json");
  const contentSecurityPolicy = response.headers.get("content-security-policy");

  expect(response.status).toBe(200);
  expect(contentSecurityPolicy).toContain("default-src 'none'");
  expect(contentSecurityPolicy).not.toContain("https://cdn.jsdelivr.net");
  expect(contentSecurityPolicy).not.toContain("script-src");
});
