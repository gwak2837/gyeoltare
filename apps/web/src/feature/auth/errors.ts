const errorKeyMap = {
  AUTHENTICATION_FAILED: "errors.passkeyAuthenticationFailed",
  AUTH_CANCELLED: "errors.passkeyCancelled",
  FAILED_TO_VERIFY_REGISTRATION: "errors.passkeyRegistrationFailed",
  FAILED_TO_UPDATE_PASSKEY: "errors.passkeyRenameFailed",
  INVALID_BACKUP_CODE: "errors.invalidBackupCode",
  INVALID_CODE: "errors.invalidCode",
  INVALID_EMAIL_OR_PASSWORD: "errors.invalidCredentials",
  INVALID_USERNAME: "errors.invalidUsername",
  INVALID_USERNAME_OR_PASSWORD: "errors.invalidCredentials",
  PASSKEY_NOT_FOUND: "errors.passkeyNotFound",
  PREVIOUSLY_REGISTERED: "errors.passkeyAlreadyRegistered",
  REGISTRATION_CANCELLED: "errors.passkeyCancelled",
  SESSION_NOT_FRESH: "errors.sessionNotFresh",
  SESSION_REQUIRED: "errors.sessionRequired",
  TOO_MANY_ATTEMPTS_REQUEST_NEW_CODE: "errors.tooManyAttempts",
  TOTP_NOT_ENABLED: "errors.twoFactorNotEnabled",
  TWO_FACTOR_NOT_ENABLED: "errors.twoFactorNotEnabled",
  UNABLE_TO_CREATE_SESSION: "errors.generic",
  UNKNOWN_ERROR: "errors.generic",
  USERNAME_IS_ALREADY_TAKEN: "errors.usernameTaken",
  USERNAME_TOO_LONG: "errors.usernameTooLong",
  USERNAME_TOO_SHORT: "errors.usernameTooShort",
  YOU_ARE_NOT_ALLOWED_TO_REGISTER_THIS_PASSKEY: "errors.passkeyRegistrationFailed",
} as const;

type TranslationLookup = (key: string) => string;

function getErrorCode(error: unknown) {
  if (typeof error !== "object" || error === null) {
    return undefined;
  }

  const candidate = "code" in error ? error.code : undefined;

  return typeof candidate === "string" ? candidate : undefined;
}

function getErrorMessage(error: unknown) {
  if (typeof error !== "object" || error === null) {
    return undefined;
  }

  const candidate = "message" in error ? error.message : undefined;

  return typeof candidate === "string" ? candidate : undefined;
}

export function resolveAuthErrorMessage(t: TranslationLookup, error: unknown) {
  const errorCode = getErrorCode(error);

  if (errorCode) {
    const translationKey = errorKeyMap[errorCode as keyof typeof errorKeyMap];

    if (translationKey) {
      return t(translationKey);
    }
  }

  const message = getErrorMessage(error);

  return message && message.length > 0 ? message : t("errors.generic");
}
