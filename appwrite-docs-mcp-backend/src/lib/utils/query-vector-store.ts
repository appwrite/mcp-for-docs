import { embed } from "ai";
import { openai } from "@ai-sdk/openai";
import { vectorStore, VectorStoreMetadata } from "../vector-store";
import { getDocsFileContent } from "./content";

export async function queryVectorStore(query: string) {
  console.log(`Querying vector store with query: ${query}`);
  const queryEmbedding = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: query,
  });

  const results = await vectorStore.query({
    indexName: "docs",
    queryVector: queryEmbedding.embedding,
    topK: 3,
    minScore: 0.5
  });

  console.log(`Retrieved ${results.length} results`);

  const contents = results.map((result) => {
    const metadata = result.metadata as VectorStoreMetadata;
    const fullDocPage = getDocsFileContent(metadata.filePath);
    const { body } = fullDocPage;

    return {
      path: `/${metadata.filePath}`,
      score: parseFloat(result.score.toFixed(3)),
      title: metadata.title,
      description: metadata.description,
      content: body,
    }
  });

  console.log(`Contents:`, contents);
  return contents;
}
