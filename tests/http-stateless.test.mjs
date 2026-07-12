import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { HttpStreamTransport, MCPServer } from "mcp-framework";

const fixturesPath = fileURLToPath(new URL("./fixtures", import.meta.url));

async function createTransport(onRequest) {
  const transport = new HttpStreamTransport({
    port: 0,
    endpoint: "/",
    responseMode: "stream",
    session: { enabled: false },
  });
  transport.onmessage = (message) => onRequest(transport, message);
  await transport.start();
  return { port: transport.port, transport };
}

async function post(port, body, headers = {}) {
  return fetch(`http://127.0.0.1:${port}/`, {
    method: "POST",
    headers: {
      accept: "application/json, text/event-stream",
      "content-type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

function parseSse(responseBody) {
  const data = responseBody
    .split("\n")
    .find((line) => line.startsWith("data: "));
  assert(data, `Expected an SSE data event, received: ${responseBody}`);
  return JSON.parse(data.slice("data: ".length));
}

async function createMcpServer(name) {
  const server = new MCPServer({
    name,
    version: "1.0.0",
    basePath: fixturesPath,
    transport: {
      type: "http-stream",
      options: {
        port: 0,
        endpoint: "/",
        responseMode: "stream",
        session: { enabled: false },
      },
    },
  });
  const running = server.start();

  for (let attempt = 0; attempt < 50; attempt += 1) {
    const port = server.transport?.port;
    if (!port) {
      await new Promise((resolve) => setTimeout(resolve, 20));
      continue;
    }
    try {
      const response = await fetch(`http://127.0.0.1:${port}/`, {
        method: "OPTIONS",
      });
      if (response.status === 204) return { port, running, server };
    } catch {
      // The listener is not ready yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 20));
  }

  await server.stop();
  await running;
  throw new Error(`MCP server ${name} did not start`);
}

test("stateless requests can land on different server instances", async (t) => {
  const instanceA = await createTransport(async (transport, message) => {
    await transport.send({
      jsonrpc: "2.0",
      id: message.id,
      result: {
        protocolVersion: "2025-03-26",
        capabilities: { tools: {} },
        serverInfo: { name: "instance-a", version: "1.0.0" },
      },
    });
  });
  const instanceB = await createTransport(async (transport, message) => {
    await transport.send({
      jsonrpc: "2.0",
      id: message.id,
      result: { tools: [{ name: "search", description: "Search docs" }] },
    });
  });

  t.after(async () => {
    await Promise.all([
      instanceA.transport.close(),
      instanceB.transport.close(),
    ]);
  });

  const initializeResponse = await post(instanceA.port, {
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2025-03-26",
      capabilities: {},
      clientInfo: { name: "regression-test", version: "1.0.0" },
    },
  });

  assert.equal(initializeResponse.status, 200);
  assert.equal(initializeResponse.headers.get("mcp-session-id"), null);
  assert.equal(
    parseSse(await initializeResponse.text()).result.serverInfo.name,
    "instance-a",
  );

  const listResponse = await post(
    instanceB.port,
    { jsonrpc: "2.0", id: 2, method: "tools/list", params: {} },
    { "mcp-protocol-version": "2025-03-26" },
  );

  assert.equal(listResponse.status, 200);
  assert.equal(listResponse.headers.get("mcp-session-id"), null);
  assert.deepEqual(parseSse(await listResponse.text()).result.tools, [
    { name: "search", description: "Search docs" },
  ]);
});

test("MCP framework handles initialize and tools/list on different replicas", async (t) => {
  const instanceA = await createMcpServer("instance-a");
  const instanceB = await createMcpServer("instance-b");

  t.after(async () => {
    await Promise.all([instanceA.server.stop(), instanceB.server.stop()]);
    await Promise.all([instanceA.running, instanceB.running]);
  });

  const initializeResponse = await post(instanceA.port, {
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2025-03-26",
      capabilities: {},
      clientInfo: { name: "regression-test", version: "1.0.0" },
    },
  });
  assert.equal(initializeResponse.status, 200);
  assert.equal(initializeResponse.headers.get("mcp-session-id"), null);

  const listResponse = await post(
    instanceB.port,
    { jsonrpc: "2.0", id: 2, method: "tools/list", params: {} },
    { "mcp-protocol-version": "2025-03-26" },
  );
  assert.equal(listResponse.status, 200);
  assert.equal(listResponse.headers.get("mcp-session-id"), null);
  assert.deepEqual(
    parseSse(await listResponse.text()).result.tools.map(({ name }) => name),
    ["ping"],
  );
});
