import { createHttpClient } from "./http-client";
import { type StartedApiServer, startApiServer } from "./server";
import { createIsolatedTestDatabase, type IsolatedTestDatabase } from "./test-db";

export function createApiIntegrationTestEnvironment(testFilePath: string) {
  let database: IsolatedTestDatabase | undefined;
  let server: StartedApiServer | undefined;

  return {
    async setup() {
      if (database || server) {
        return;
      }

      database = await createIsolatedTestDatabase(testFilePath);
      server = await startApiServer({
        databaseUrl: database.databaseUrl,
        label: `api-integration:${database.databaseName}`,
      });
    },

    async reset() {
      if (!database || !server) {
        throw new Error("API integration test environment has not been set up yet.");
      }

      await database.reset();
    },

    async teardown() {
      if (server) {
        await server.stop();
        server = undefined;
      }

      if (database) {
        await database.drop();
        database = undefined;
      }
    },

    createClient() {
      if (!database || !server) {
        throw new Error("API integration test environment has not been set up yet.");
      }

      return createHttpClient({ baseUrl: server.baseUrl });
    },
  };
}
