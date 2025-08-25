import { MCPTool } from "mcp-framework";
import { z } from "zod";

interface GetDocsPageInput {
  path: string;
}

class GetDocsPageTool extends MCPTool<GetDocsPageInput> {
  name = "getDocsPage";
  description = "Get the content of a page from the Appwrite documentation by path";

  schema = {
    path: {
      type: z.string(),
      description: "The path of the page to get the content of. E.g. \"/docs/getting-started/introduction\"",
    },
  };

  async execute(input: GetDocsPageInput) {
    const response = await fetch("http://localhost:1234/tools/get-docs-page", {
      method: "POST",
      body: JSON.stringify({
        path: input.path,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  }
}

export default GetDocsPageTool;