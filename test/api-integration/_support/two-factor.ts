import { createHmac } from "node:crypto";

import type { ApiHttpClient } from "./http-client";

type EnableTwoFactorResponse = {
  backupCodes: string[];
  totpURI: string;
};

export async function enableTwoFactor(client: ApiHttpClient, password: string) {
  const result = await client.postJson<EnableTwoFactorResponse>("/api/v1/auth/two-factor/enable", {
    body: { password },
  });

  return {
    ...result,
    secret: getTotpSecret(result.json.totpURI),
  };
}

export function generateTotpCode(secret: string) {
  const key = decodeBase32(secret);
  const counter = Buffer.alloc(8);
  const timeStep = Math.floor(Date.now() / 30_000);

  counter.writeBigUInt64BE(BigInt(timeStep));

  const digest = createHmac("sha1", key).update(counter).digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const binaryCode =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  return String(binaryCode % 1_000_000).padStart(6, "0");
}

function getTotpSecret(totpURI: string) {
  const secret = new URL(totpURI).searchParams.get("secret");

  if (!secret) {
    throw new Error("Missing secret in TOTP URI.");
  }

  return secret;
}

function decodeBase32(input: string) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const normalized = input.toUpperCase().replace(/=+$/g, "");
  let bits = "";

  for (const char of normalized) {
    const index = alphabet.indexOf(char);

    if (index === -1) {
      throw new Error(`Invalid base32 character: ${char}`);
    }

    bits += index.toString(2).padStart(5, "0");
  }

  const bytes: number[] = [];

  for (let index = 0; index + 8 <= bits.length; index += 8) {
    bytes.push(Number.parseInt(bits.slice(index, index + 8), 2));
  }

  return Buffer.from(bytes);
}
