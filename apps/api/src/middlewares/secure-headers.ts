import { sec } from "@gyeoltare/util";
import type { secureHeaders } from "hono/secure-headers";

function getSharedSecureHeadersOptions() {
  return {
    permissionsPolicy: {
      accelerometer: [],
      autoplay: [],
      browsingTopics: [],
      camera: [],
      fullscreen: [],
      geolocation: [],
      gyroscope: [],
      magnetometer: [],
      microphone: [],
      payment: [],
      usb: [],
    },
    strictTransportSecurity: `max-age=${sec("2 years")}; includeSubDomains; preload`,
    xFrameOptions: "DENY",
  };
}

export function getDefaultSecureHeadersOptions(): NonNullable<Parameters<typeof secureHeaders>[0]> {
  return {
    ...getSharedSecureHeadersOptions(),
    contentSecurityPolicy: {
      defaultSrc: ["'none'"],
      baseUri: ["'none'"],
      formAction: ["'none'"],
      frameAncestors: ["'none'"],
      objectSrc: ["'none'"],
    },
  };
}

export function getDocsSecureHeadersOptions(): NonNullable<Parameters<typeof secureHeaders>[0]> {
  return {
    ...getSharedSecureHeadersOptions(),
    contentSecurityPolicy: {
      defaultSrc: ["'none'"],
      baseUri: ["'none'"],
      connectSrc: ["'self'", "https:"],
      fontSrc: ["'self'", "data:", "https:"],
      formAction: ["'none'"],
      frameAncestors: ["'none'"],
      imgSrc: ["'self'", "data:", "https:"],
      objectSrc: ["'none'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      workerSrc: ["'self'", "blob:"],
    },
  };
}
