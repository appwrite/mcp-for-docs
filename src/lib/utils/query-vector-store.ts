import { vectorStore, VectorStoreMetadata } from "../vector-store.js";
import { getDocsFileContent } from "./content.js";
import { embed } from "ai";
import { openai } from "@ai-sdk/openai";

const MIN_SCORE = process.env.MIN_SCORE
  ? parseFloat(process.env.MIN_SCORE)
  : 0.25;

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set");
}

export async function queryVectorStore(query: string) {
  console.log(`Querying vector store with query: ${query}`);

  console.log("Creating embeddings...");

  let queryEmbedding: Awaited<ReturnType<typeof embed>>["embedding"] = [];
  let results: Awaited<ReturnType<typeof vectorStore.query>> = [];

  try {
    const queryEmbeddingResult = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: query,
      maxRetries: 3,
    });
    queryEmbedding = queryEmbeddingResult.embedding;
  } catch (error) {
    console.error("Error creating embeddings:", error);
    throw error;
  }

  try {
    results = await vectorStore.query({
      indexName: "docs" as any,
      queryVector: queryEmbedding,
      topK: 5,
      minScore: MIN_SCORE,
    } as any);
  } catch (error) {
    console.error("Error querying vector store:", error);
    throw error;
  }

  console.log(`Retrieved ${results.length} results`);

  const contents = await Promise.all(
    results.map(async (result) => {
      const metadata = result.metadata as VectorStoreMetadata;
      // const fullDocPage = await getDocsFileContent(metadata.webPath);
      // const { body } = fullDocPage;
      const fullDocPage = metadata.content;

      return {
        path: `${metadata.webPath}`,
        score: parseFloat(result.score.toFixed(3)),
        title: metadata.title,
        description: metadata.description ?? "",
        content: fullDocPage,
      };
    })
  );

  // Remove contents with duplicate paths
  const uniqueContents = contents.filter(
    (content, index, self) =>
      index === self.findIndex((t) => t.path === content.path)
  );

  return uniqueContents;
}
