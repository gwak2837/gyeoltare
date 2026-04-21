import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const DEFAULT_DATABASE_URL = "postgresql://postgres:postgres@localhost:55432/gyeoltare";

const PROD_CA_CERT_URL = new URL("../prod-ca-2021.crt", import.meta.url);
const PROD_CA_CERT_PATH = fileURLToPath(PROD_CA_CERT_URL);
const PROD_CA_CERT = readFileSync(PROD_CA_CERT_URL, "utf8");

export function getDatabaseSSLOptions(connectionString: string) {
  if (!connectionString.includes("sslmode=verify-full")) {
    return undefined;
  }

  return {
    ca: PROD_CA_CERT,
    rejectUnauthorized: true,
  };
}

export function withDatabaseSSLRootCert(connectionString: string) {
  if (!connectionString.includes("sslmode=verify-full")) {
    return connectionString;
  }

  if (connectionString.includes("sslrootcert=")) {
    return connectionString;
  }

  const separator = connectionString.includes("?") ? "&" : "?";

  return `${connectionString}${separator}sslrootcert=${encodeURIComponent(PROD_CA_CERT_PATH)}`;
}
