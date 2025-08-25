import { MCPTool } from "mcp-framework";
import { z } from "zod";

interface GetTableOfContentsInput {}

class GetTableOfContentsTool extends MCPTool<GetTableOfContentsInput> {
  name = "getTableOfContents";
  description = "Get the table of contents for the Appwrite documentation";
  schema = {};

  async execute(input: GetTableOfContentsInput) {
    const response = await fetch("http://localhost:1234/tools/get-table-of-contents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  }
}

export default GetTableOfContentsTool;