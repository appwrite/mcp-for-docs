import http from "http";
import { server } from "../src/mastra/docs-mcp-server";

const httpServer = http.createServer(async (req, res) => {
  await server.startSSE({
    url: new URL(req.url || "", "http://localhost:1234"),
    ssePath: "/sse",
    messagePath: "/message",
    req,
    res,
  })
})

const PORT = process.env.PORT || 1234;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})