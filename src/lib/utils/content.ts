import fs from "node:fs";
import path from "node:path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
import fm from "front-matter";

export const contentRoot = path.join(__dirname, "..", "..", "..", "content");
export const docsRoot = path.join(contentRoot, "docs");

function getAllFilesRecursively(dir: string): string[] {
  const files: string[] = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Recursively get files from subdirectories
      files.push(...getAllFilesRecursively(fullPath));
    } else if (stat.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

type PageAttributes = {
  title: string;
  description: string;
  layout: string;
};

export function getContent(rootDir: string = docsRoot) {
  // Get all files recursively
  const allFiles = getAllFilesRecursively(rootDir);

  // Filter for .markdoc files only
  const markdocFiles = allFiles.filter((file) => file.endsWith(".markdoc"));

  console.log(`Found ${markdocFiles.length} .markdoc files`);

  const result = markdocFiles.map((filePath) => {
    const fileContent = fs.readFileSync(filePath, "utf8");

    const frontmatter = fm(fileContent);
    const attributes = frontmatter.attributes as PageAttributes;
    const body = frontmatter.body;

    const relativePath = path.relative(contentRoot, filePath);
    const relativePathWithoutExtension = relativePath.replace(
      "/+page.markdoc",
      ""
    );

    return {
      filePath: relativePath,
      webPath: relativePathWithoutExtension,
      body,
      attributes,
    };
  });

  return result;
}

export async function getDocsFileContent(filePath: string) {
  const sanitizedFilePath = filePath.startsWith("/") ? filePath : "/" + filePath;
  const relativePath = path.join(contentRoot, sanitizedFilePath);
  const fileContent = await fs.promises.readFile(`${relativePath}/+page.markdoc`, "utf8");
  const frontmatter = fm(fileContent);
  const attributes = frontmatter.attributes as PageAttributes;
  const body = frontmatter.body;

  return {
    attributes,
    body,
  };
}

export function getTableOfContentsFromJson() {
  const toc = fs.readFileSync(
    path.join(contentRoot, "docs", "toc.json"),
    "utf8"
  );
  return JSON.parse(toc);
}
