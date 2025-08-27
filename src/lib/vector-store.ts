import { LibSQLVector } from "@mastra/libsql";
import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);

export const vectorStore = new LibSQLVector({
  connectionUrl: `file:${path.join(process.cwd(), "tmp", "vector-store.db")}`,
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
};

