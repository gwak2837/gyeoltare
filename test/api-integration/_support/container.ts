import { GenericContainer, Wait } from "testcontainers";
import { buildDatabaseUrl, POSTGRES_IMAGE, POSTGRES_PORT, ROOT_DATABASE_NAME } from "./shared";

type StartedPostgresContainer = Awaited<ReturnType<GenericContainer["start"]>>;

export type PostgresContainerInfo = {
  adminDatabaseUrl: string;
  container: StartedPostgresContainer;
  host: string;
  password: string;
  port: number;
  username: string;
};

const globalContainerState = globalThis as typeof globalThis & {
  __gyeoltareApiIntegrationContainerPromise?: Promise<PostgresContainerInfo>;
};

export async function getPostgresContainer() {
  if (!globalContainerState.__gyeoltareApiIntegrationContainerPromise) {
    globalContainerState.__gyeoltareApiIntegrationContainerPromise = startPostgresContainer();
  }

  return globalContainerState.__gyeoltareApiIntegrationContainerPromise;
}

async function startPostgresContainer(): Promise<PostgresContainerInfo> {
  const username = "postgres";
  const password = "postgres";

  const container = await new GenericContainer(POSTGRES_IMAGE)
    .withEnvironment({
      POSTGRES_DB: ROOT_DATABASE_NAME,
      POSTGRES_PASSWORD: password,
      POSTGRES_USER: username,
    })
    .withExposedPorts(POSTGRES_PORT)
    .withStartupTimeout(120_000)
    .withWaitStrategy(Wait.forLogMessage(/database system is ready to accept connections/i, 2))
    .start();

  const host = container.getHost();
  const port = container.getMappedPort(POSTGRES_PORT);
  const adminDatabaseUrl = buildDatabaseUrl({
    databaseName: ROOT_DATABASE_NAME,
    host,
    password,
    port,
    username,
  });

  return {
    adminDatabaseUrl,
    container,
    host,
    password,
    port,
    username,
  };
}
