export const openApiDocument = {
  info: {
    description: "Shared contract surface for the gyeoltare Hono API.",
    title: "gyeoltare API",
    version: "0.1.0",
  },
  openapi: "3.1.0",
  paths: {
    "/api/healthz": {
      get: {
        responses: {
          "200": {
            description: "API health status",
          },
        },
        summary: "Health check",
      },
    },
    "/api/v1/contact-messages": {
      post: {
        requestBody: {
          content: {
            "application/json": {
              schema: {
                additionalProperties: false,
                properties: {
                  company: { type: "string" },
                  email: { format: "email", type: "string" },
                  message: { maxLength: 2000, minLength: 20, type: "string" },
                  name: { maxLength: 80, minLength: 2, type: "string" },
                },
                required: ["name", "email", "message"],
                type: "object",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Contact message created",
          },
          "422": {
            description: "Validation error",
          },
        },
        summary: "Create a contact message",
      },
    },
    "/api/v1/profiles": {
      get: {
        parameters: [
          {
            in: "query",
            name: "limit",
            required: false,
            schema: { default: 6, maximum: 24, minimum: 1, type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "List of public profiles",
          },
          "422": {
            description: "Validation error",
          },
        },
        summary: "List public profiles",
      },
    },
  },
} as const;
