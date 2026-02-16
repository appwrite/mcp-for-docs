import { LibSQLVector } from "@mastra/libsql";
import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);

export const TMP_DIR = `${path.join(__dirname, "../../", "tmp")}`;
export const VECTOR_STORE_PATH = `${TMP_DIR}/vector-store.db`;

export const vectorStore = new LibSQLVector({
  url: `file:${VECTOR_STORE_PATH}`,
  id: "vector-store",
});

export type VectorStoreMetadata = {
  text: string;
  id: string;
  layout: string;
  title: string;
  description: string;
  createdAt: string;
  webPath: string;
  content: string;
  library?: string;
};

