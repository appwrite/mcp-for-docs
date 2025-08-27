import { MCPTool } from "mcp-framework";
import { getTableOfContentsFromJson } from "../lib/utils/content.js";

interface GetTableOfContentsInput {}

class GetTableOfContentsTool extends MCPTool<GetTableOfContentsInput> {
  name = "getTableOfContents";
  description = "Get the table of contents for the Appwrite documentation";
  schema = {};

  async execute(input: GetTableOfContentsInput) {
    const toc = await getTableOfContentsFromJson();
    return toc;
  }
}

export default GetTableOfContentsTool;