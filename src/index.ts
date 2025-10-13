import { MCPServer } from "mcp-framework";
import { config } from "dotenv";
import path from "path";
import { initLibrariesWithFeatures } from "./lib/utils/process-libraries.js";
import { vectorStore } from "./lib/vector-store.js";

config({ path: path.join(process.cwd(), ".env") });

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
      responseMode: "batch", // Response mode: "batch" or "stream" (default: "batch")
      batchTimeout: 30000, // Timeout for batch responses in ms (default: 30000)
      headers: {
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
    },
  },
});

await server.start();
