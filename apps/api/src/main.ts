import { createApp } from "@repo/api";

const port = Number(process.env.PORT ?? 3001);
const app = createApp();

if (import.meta.main) {
  Bun.serve({
    fetch: app.fetch,
    idleTimeout: 30,
    port,
  });

  console.log(`[api] hono runtime listening on :${port}`);
}

export default app;
