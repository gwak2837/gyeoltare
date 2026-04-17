import type { Serve } from "bun";

import { app } from "./app";
import { env } from "./env";

const honoApp: Serve.Options<undefined> = {
  fetch: app.fetch,
  hostname: process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost",
  port: env.API_PORT,
};

export default honoApp;
