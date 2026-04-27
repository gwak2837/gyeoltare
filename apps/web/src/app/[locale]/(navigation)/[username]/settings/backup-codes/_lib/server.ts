import "server-only";

import type { AuthSessionData } from "@gyeoltare/auth/server";
import { headers } from "next/headers";

import { auth } from "@/feature/auth/server-auth";

type AuthEndpointError = {
  code?: string;
  message?: string;
};

type ViewBackupCodesResult = {
  backupCodes: string[];
  status: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeAuthEndpointError(error: unknown, fallbackMessage: string): AuthEndpointError {
  if (!isRecord(error)) {
    return { message: fallbackMessage };
  }

  const body = isRecord(error.body) ? error.body : null;
  const code = typeof body?.code === "string" ? body.code : typeof error.code === "string" ? error.code : undefined;
  const message =
    typeof body?.message === "string"
      ? body.message
      : typeof error.message === "string"
        ? error.message
        : fallbackMessage;

  return { code, message };
}

export async function loadBackupCodes(session: AuthSessionData) {
  try {
    const payload = await auth.api.viewBackupCodes({
      body: {
        userId: session.user.id,
      },
      headers: await headers(),
    });

    return {
      data: {
        backupCodes: payload.backupCodes.filter((code): code is string => typeof code === "string"),
        status: payload.status,
      } satisfies ViewBackupCodesResult,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: normalizeAuthEndpointError(error, "Unable to load backup codes"),
    };
  }
}
