import { MCPServer } from "mcp-framework";
import { initLibrariesWithFeatures } from "./lib/utils/process-libraries.js";
import { vectorStore } from "./lib/vector-store.js";

const port = parseInt(process.env.PORT ?? "1234");

await initLibrariesWithFeatures();

async function inspectVectorStore() {
  const count = await vectorStore.describeIndex({ indexName: "docs" });
  console.log("Vector store count:", count);
}

await inspectVectorStore();

const server = new MCPServer({
  transport: {
    type: "http-stream",
    options: {
      port, // Port to listen on
      endpoint: "/", // HTTP endpoint path (default: "/mcp")
      responseMode: "stream", // Response mode: "batch" or "stream" (default: "batch")
      batchTimeout: 30000, // Timeout for batch responses in ms (default: 30000)
      session: {
        // The service runs with multiple replicas. Keeping MCP sessions in process
        // memory makes follow-up requests fail whenever the load balancer sends them
        // to another replica, so every request must be independently routable.
        enabled: false,
      },
      cors: {
        // CORS configuration
        allowOrigin: "*",
        allowMethods: "GET, POST, DELETE, OPTIONS",
        allowHeaders:
          "Content-Type, Accept, Authorization, x-api-key, Mcp-Session-Id, Last-Event-ID",
        exposeHeaders: "Content-Type, Authorization, x-api-key",
        maxAge: "86400",
      },
    },
  },
});

await server.start();
