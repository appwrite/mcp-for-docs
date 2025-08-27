import { downloadTemplate} from "giget";
import path from 'node:path';
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const downloadDir = path.join(__dirname, '..', 'content', 'docs');

export async function downloadDocs() {
  const owner = "appwrite";
  const repo = "website";
  const path = "src/routes/docs";

  console.log(`Downloading docs from ${owner}/${repo}/${path} to ${downloadDir}`);
  const downloadResult = await downloadTemplate(`gh:${owner}/${repo}/${path}#main`, {
    dir: downloadDir,
  });

  return {
    docsDir: downloadResult.dir
  }
}

downloadDocs();