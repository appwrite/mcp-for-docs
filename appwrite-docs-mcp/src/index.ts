import { MCPServer } from "mcp-framework";

const server = new MCPServer({
  name: "appwrite-docs-mcp",
  version: "0.0.1",
});

server.start();