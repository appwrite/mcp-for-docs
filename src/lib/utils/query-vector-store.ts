import { vectorStore, VectorStoreMetadata } from "../vector-store.js";
import { getDocsFileContent } from "./content.js";
import { embed } from "ai";
import { openai } from "@ai-sdk/openai";

const MIN_SCORE = process.env.MIN_SCORE ? parseFloat(process.env.MIN_SCORE) : 0.5;

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set");
}

export async function queryVectorStore(query: string) {
  console.log(`Querying vector store with query: ${query}`);
  const queryEmbedding = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: query,
    maxRetries: 3,
  });

  const results = await vectorStore.query({
    indexName: "docs" as any,
    queryVector: queryEmbedding.embedding,
    topK: 3,
    minScore: MIN_SCORE,
  } as any);

  console.log(`Retrieved ${results.length} results`);

  const contents = await Promise.all(results.map(async (result) => {
    const metadata = result.metadata as VectorStoreMetadata;
    const fullDocPage = await getDocsFileContent(metadata.webPath);
    const { body } = fullDocPage;

    return {
      path: `/${metadata.filePath}`,
      score: parseFloat(result.score.toFixed(3)),
      title: metadata.title,
      description: metadata.description,
      content: body,
    };
  }));

  return contents;
}
