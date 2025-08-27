import { MCPTool } from "mcp-framework";
import { z } from "zod";
import { queryVectorStore } from "../lib/utils/query-vector-store.js";

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
    const pages = await queryVectorStore(input.query);
    return pages;
  }
}

export default SearchDocsTool;