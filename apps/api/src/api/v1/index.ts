import { OpenAPIHono } from "@hono/zod-openapi";

import authRoutes from "./auth/routes";
import exampleRoutes from "./example/GET";

const app = new OpenAPIHono();

app.route("/auth", authRoutes);
app.route("/example", exampleRoutes);

export default app;
