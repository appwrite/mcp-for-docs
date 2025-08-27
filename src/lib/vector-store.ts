import { PgVector } from "@mastra/pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

export const vectorStore = new PgVector({
  connectionString,
});

export type VectorStoreMetadata = {
  text: string;
  id: string;
  layout: string;
  title: string;
  description: string;
  createdAt: string;
  filePath: string;
  webPath: string;
}