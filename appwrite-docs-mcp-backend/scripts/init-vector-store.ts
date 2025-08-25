import { PgVector } from "@mastra/pg";
import { getContent } from "../src/mastra/lib/utils/content";
import { embed, embedMany } from "ai";
import { openai } from "@ai-sdk/openai";
import { MDocument } from "@mastra/rag"
import { vectorStore, VectorStoreMetadata } from "../src/mastra/lib/vector-store";

async function initVectorStore() {
  // Delete index contents
  try {
    console.log("Deleting index contents...");
    await vectorStore.deleteIndex({
      indexName: "docs",
    });
    console.log("Index contents deleted");
  } catch (error) {}


  // Wait 3 seconds
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Create index
  console.log("Creating index...");
  await vectorStore.createIndex({
    indexName: "docs",
    dimension: 1536,
  });

  console.log("Index created");

  // Add documents
  const docsPages = getContent();

  // Process in batches
  const batchSize = 20;
  for (let i = 0; i < docsPages.length; i += batchSize) {
    const batch = docsPages.slice(i, i + batchSize);
    console.log(`Processing batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(docsPages.length / batchSize)}`);
    await Promise.all(batch.map(page => embedDocsPage(page)));
  }
}

async function embedDocsPage(page: ReturnType<typeof getContent>[0]) {
  console.log(`Embeding document: ${page.filePath}`);

  const doc = MDocument.fromMarkdown(page.body);
  const chunks = await doc.chunk({
    strategy: "markdown",
    extract: {
      summary: true,
      keywords: true,
    },
  });

  console.log(`Creating embeddings for ${chunks.length} chunks for page ${page.webPath}`);
  const embedManyResult = await embedMany({
    model: openai.embedding("text-embedding-3-small"),
    values: chunks.map(chunk => chunk.text),
  });

  console.log(`Upserting ${embedManyResult.embeddings.length} embeddings for page ${page.webPath}`);
  
  await vectorStore.upsert({
    indexName: "docs",
    vectors: embedManyResult.embeddings,
    metadata: chunks.map((chunk, index) => ({
      text: chunk.text,
      id: `${page.webPath}_c_${index}`,
      layout: page.attributes.layout,
      title: page.attributes.title,
      description: page.attributes.description,
      createdAt: new Date().toISOString(),
      filePath: page.filePath,
      webPath: page.webPath,
    }) satisfies VectorStoreMetadata),
  });

  console.log(`Upserted ${embedManyResult.embeddings.length} embeddings for page ${page.webPath}`);
}

initVectorStore();