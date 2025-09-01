import { MCPTool } from "mcp-framework";
import { z } from "zod";
import { getDocsFileContent } from "../lib/utils/content.js";
import dedent from "dedent";

interface GetDocsPageInput {
  path: string;
}

class GetDocsPageTool extends MCPTool<GetDocsPageInput> {
  name = "getDocsPage";
  description = dedent`
  "Get the content of a page from the Appwrite documentation by path";
    Note, for code examples and technology-specific information, it's best to use listFeatures and getFeatureExamples tools.
    `;
  schema = {
    path: {
      type: z.string(),
      description:
        'The path of the page to get the content of. E.g. "/docs/getting-started/introduction"',
    },
  };

  async execute(input: GetDocsPageInput) {
    console.log("[GetDocsPageTool] Executing with input:", input);
    try {
      const page = await getDocsFileContent(input.path);
      return page;
    } catch (error) {
      console.error("[GetDocsPageTool] Error getting docs page:", error);
      return `Could not retrieve docs page at path "${input.path}"`;
    }
  }
}

export default GetDocsPageTool;
