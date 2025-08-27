import { MCPTool } from "mcp-framework";
import { getTableOfContentsFromJson } from "../lib/utils/content.js";

interface GetTableOfContentsInput {}

class GetTableOfContentsTool extends MCPTool<GetTableOfContentsInput> {
  name = "getTableOfContents";
  description = "Get the table of contents for the Appwrite documentation";
  schema = {};

  async execute(input: GetTableOfContentsInput) {
    console.log("[GetTableOfContentsTool] Executing");
    try {
      const toc = await getTableOfContentsFromJson();
      return toc;
    } catch (error) {
      console.error("[GetTableOfContentsTool] Error getting table of contents:", error);
      return "Could not retrieve table of contents";
    }
  }
}

export default GetTableOfContentsTool;