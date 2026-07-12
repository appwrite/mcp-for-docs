import { MCPTool } from "mcp-framework";

export default class PingTool extends MCPTool {
  name = "ping";
  description = "Return a pong response";
  schema = {};

  async execute() {
    return "pong";
  }
}
