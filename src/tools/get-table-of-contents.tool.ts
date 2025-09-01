import { MCPTool } from "mcp-framework";
import { getTableOfContentsFromJson } from "../lib/utils/content.js";
import dedent from "dedent";

interface GetTableOfContentsInput {}

class GetTableOfContentsTool extends MCPTool<GetTableOfContentsInput> {
  name = "getTableOfContents";
  description = dedent`
  Get the table of contents for the Appwrite documentation
  Note, the TOC will not include code examples and technology-specific information. For that, it's best to use listFeatures and getFeatureExamples tools.
  `;
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