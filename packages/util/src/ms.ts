import baseMs from "ms";

export const ms = baseMs;

export function sec(value: baseMs.StringValue) {
  return Math.floor(baseMs(value) / 1000);
}
