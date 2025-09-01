import path from 'node:path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
export const docsTargetDir = path.join(__dirname, '../../', 'content', 'docs');
export const examplesTargetDir = path.join(__dirname, '../../', 'content', 'examples');
export const processedReferencesTargetDir = path.join(__dirname, '../../', 'content', 'temp-references');
export const appwriteExamplesBranch = process.env.APPWRITE_REPO_BRANCH || "1.8.x";
