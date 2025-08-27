import { downloadTemplate} from "giget";
import path from 'node:path';
import { contentRoot, getContent } from "../src/lib/utils/content";
import fs from "fs";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const downloadDir = path.join(__dirname, '..', 'content', 'docs');

export async function downloadDocs() {
  const owner = "appwrite";
  const repo = "website";
  const path = "src/routes/docs";

  console.log(`Downloading docs from ${owner}/${repo}/${path} to ${downloadDir}`);
  const downloadResult = await downloadTemplate(`gh:${owner}/${repo}/${path}#main`, {
    dir: downloadDir,
    forceClean: true,
  });

  console.log(`Creating table of contents`);
  createTableOfContents();

  return {
    docsDir: downloadResult.dir
  }
}

downloadDocs();

export async function createTableOfContents() {
  const result = getContent();

   // Create docs/toc.json
    const toc = result
      .sort((a, b) => a.webPath.localeCompare(b.webPath))
      .map((item) => ({
        path: `/${item.webPath}`,
        title: item.attributes.title,
        description: item.attributes.description,
      }));
  
    console.log("Writing docs/toc.json");
    //  console.log("Writing docs/toc.json");
    fs.writeFileSync(
      path.join(contentRoot, "docs", "toc.json"),
      JSON.stringify(toc, null, 2)
    );
 }