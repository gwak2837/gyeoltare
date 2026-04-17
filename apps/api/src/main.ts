import type { Serve } from "bun";

import { app } from "./app";

const port = Number(process.env.PORT ?? 3001);

export default {
  fetch: app.fetch,
  idleTimeout: 30,
  port,
} satisfies Serve.Options<undefined>;
