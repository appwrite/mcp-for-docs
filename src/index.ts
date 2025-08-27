import { MCPServer } from "mcp-framework";
import { config } from "dotenv";
import path from "path";

config({ path: path.join(process.cwd(), ".env") });

const port = parseInt(process.env.PORT ?? "1234");

const server = new MCPServer({
  transport: {
    type: "http-stream",
    options: {
      port, // Port to listen on
      endpoint: "/", // HTTP endpoint path (default: "/mcp")
      responseMode: "batch", // Response mode: "batch" or "stream" (default: "batch")
      batchTimeout: 30000, // Timeout for batch responses in ms (default: 30000)
      headers: {
        // Custom headers for responses
        "X-Custom-Header": "value",
      },
      cors: {
        // CORS configuration
        allowOrigin: "*",
        allowMethods: "GET, POST, DELETE, OPTIONS",
        allowHeaders:
          "Content-Type, Accept, Authorization, x-api-key, Mcp-Session-Id, Last-Event-ID",
        exposeHeaders: "Content-Type, Authorization, x-api-key, Mcp-Session-Id",
        maxAge: "86400",
      },
      auth: {},
      session: {
        // Session configuration
        enabled: true, // Enable session management (default: true)
        headerName: "Mcp-Session-Id", // Session header name (default: "Mcp-Session-Id")
        allowClientTermination: true, // Allow clients to terminate sessions (default: true)
      },
    },
  },
});

await server.start();
