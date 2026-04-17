import type { Serve } from "bun";

import { app } from "./app";

export default {
  fetch: app.fetch,
  port: Number(process.env.PORT ?? 3001),
} satisfies Serve.Options<undefined>;
