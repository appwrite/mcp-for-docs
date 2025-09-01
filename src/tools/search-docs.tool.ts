import { MCPTool } from "mcp-framework";
import { z } from "zod";
import { queryVectorStore } from "../lib/utils/query-vector-store.js";
import dedent from "dedent";

interface SearchDocsInput {
  query: string;
}

class SearchDocsTool extends MCPTool<SearchDocsInput> {
  name = "searchDocs";
  description = dedent`
    Search the Appwrite documentation.
    Note, for code examples and technology-specific information, it's best to use listFeatures and getFeatureExamples tools.
    `;

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
