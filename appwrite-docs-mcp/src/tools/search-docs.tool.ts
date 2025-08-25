import { MCPTool } from "mcp-framework";
import { z } from "zod";

interface SearchDocsInput {
  query: string;
}

class SearchDocsTool extends MCPTool<SearchDocsInput> {
  name = "searchDocs";
  description = "Search the Appwrite documentation";

  schema = {
    query: {
      type: z.string(),
      description: "The query to search the documentation for",
    },
  };

  async execute(input: SearchDocsInput) {
    const response = await fetch("http://localhost:1234/tools/search-docs", {
      method: "POST",
      body: JSON.stringify({
        query: input.query,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  }
}

export default SearchDocsTool;