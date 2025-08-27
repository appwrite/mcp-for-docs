import { MCPTool } from "mcp-framework";
import { z } from "zod";
import { getDocsFileContent } from "../lib/utils/content.js";

interface GetDocsPageInput {
  path: string;
}

class GetDocsPageTool extends MCPTool<GetDocsPageInput> {
  name = "getDocsPage";
  description =
    "Get the content of a page from the Appwrite documentation by path";

  schema = {
    path: {
      type: z.string(),
      description:
        'The path of the page to get the content of. E.g. "/docs/getting-started/introduction"',
    },
  };

  async execute(input: GetDocsPageInput) {
    const page = await getDocsFileContent(input.path);
    return page;
  }
}

export default GetDocsPageTool;
