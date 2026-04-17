import type { Context } from "hono";

import { HttpError } from "../errors/http-error";

export function jsonCreated<T>(c: Context, data: T) {
  return c.json(data, 201);
}

export function jsonOk<T>(c: Context, data: T) {
  return c.json(data, 200);
}

export function jsonValidationError(_c: Context, details: unknown) {
  throw new HttpError(422, "validation_error", "Request validation failed.", details);
}
