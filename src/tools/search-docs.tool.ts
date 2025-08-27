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
    console.log("[SearchDocsTool] Executing with input:", input);
    try {
      const pages = await queryVectorStore(input.query);
      return pages;
    } catch (error) {
      console.error("[SearchDocsTool] Error searching docs:", error);
      return `Could not search docs for query "${input.query}"`;
    }
  }
}

export default SearchDocsTool;