import { MDocument } from "@mastra/rag";
import { vectorStore, VectorStoreMetadata } from "../src/lib/vector-store";
import { getContent } from "../src/lib/utils/content";
import { embedMany } from "ai";
import { openai } from "@ai-sdk/openai";
import { librariesWithFeatures } from "../src/lib/utils/process-libraries";

const BATCH_SIZE = process.env.BATCH_SIZE
  ? parseInt(process.env.BATCH_SIZE)
  : 50;

async function initVectorStore() {
  // Delete index content
  try {
    console.log("Deleting index contents...");
    await vectorStore.deleteIndex({
      indexName: "docs",
    });
    console.log("Index contents deleted");
  } catch (error) {}

  // Wait 3 seconds
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Create index
  console.log("Creating index...");
  await vectorStore.createIndex({
    indexName: "docs" as any,
    dimension: 1536,
  } as any);

  console.log("Index created");

  await addDocsToVectorStore();
  console.log("Done");
}


async function addDocsToVectorStore() {
  // Add documents
  const docsPages = getContent();

  console.log(`Processing ${docsPages.length} pages...`);

  // Process in batches
  for (let i = 0; i < docsPages.length; i += BATCH_SIZE) {
    const batch = docsPages.slice(i, i + BATCH_SIZE);
    console.log(
      `Processing batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(docsPages.length / BATCH_SIZE)}`
    );
    await Promise.all(
      batch.map(async (page) => {
        try {
          console.log(`Processing page: ${page.webPath}`);
          await processPage({
            markdown: page.body,
            webPath: page.webPath,
            layout: page.attributes.layout,
            title: page.attributes.title,
            description: page.attributes.description,
          });
        } catch (error) {
          console.error(`Error processing document ${page.filePath}:`, error);
        }
      })
    );
  }
}

export async function processPage({
  markdown,
  webPath,
  layout,
  title,
  description,
  library,
}: {
  markdown: string;
  webPath: string;
  layout: string;
  title: string;
  description: string;
  library?: string;
}) {
  const chunks = await getChunks({ markdown });
  const embeddings = await embedDocsPage(chunks);
  await upsertDocsPageEmbeddings({
    webPath,
    layout,
    title,
    description,
    embeddings,
    chunks,
    library,
    content: markdown,
  });
  return { chunks, embeddings };
}

export async function getChunks({ markdown }: { markdown: string }) {
  const doc = MDocument.fromMarkdown(markdown);
  const chunks = await doc.chunk({
    strategy: "markdown",
    extract: {},
  });

  return chunks;
}

async function embedDocsPage(chunks: Awaited<ReturnType<MDocument["chunk"]>>) {
  const embeddingsResult = await embedMany({
    model: openai.embedding("text-embedding-3-small"),
    values: chunks.map((chunk) => chunk.text),
    maxRetries: 3,
  });
  return embeddingsResult.embeddings;
}

async function upsertDocsPageEmbeddings({
  webPath,
  layout,
  title,
  description,
  embeddings,
  chunks,
  content,
  library,
}: {
  webPath: string;
  layout: string;
  title: string;
  description: string;
  library?: string;
  content: string;
  chunks: Awaited<ReturnType<MDocument["chunk"]>>;
  embeddings: Awaited<ReturnType<typeof embedMany>>["embeddings"];
}) {
  await vectorStore.upsert({
    indexName: "docs",
    vectors: embeddings,
    metadata: chunks.map(
      (chunk, index) =>
        ({
          text: chunk.text,
          id: `${webPath}_c_${index}`,
          layout: layout,
          title: title,
          description: description,
          createdAt: new Date().toISOString(),
          webPath: webPath,
          library: library,
          content: content,
        }) satisfies VectorStoreMetadata
    ),
  });
}

initVectorStore();
