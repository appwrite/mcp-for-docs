import { downloadTemplate } from "giget";
import { createTableOfContents } from "./create-table-of-contents";
import { appwriteExamplesBranch, docsTargetDir, examplesTargetDir } from "../src/lib/constants";
import { processLibraries, writeLirbariesExamplesToDisk } from "../src/lib/utils/process-libraries";

export async function downloadDocs() {
  const owner = "appwrite";
  const repo = "website";
  const repoSubdir = "src/routes/docs";

  console.log(`Downloading docs from ${owner}/${repo}/${repoSubdir} to ${docsTargetDir}`);
  const downloadResult = await downloadTemplate(`gh:${owner}/${repo}/${repoSubdir}#main`, {
    dir: docsTargetDir,
    forceClean: true,
  });

  console.log(`Creating table of contents`);

  return {
    docsDir: downloadResult.dir
  }
}

export async function downloadExamples() {
  console.log(`Downloading examples from appwrite/appwrite (branch: ${appwriteExamplesBranch})`);

  const owner = "appwrite";
  const repo = "appwrite";
  const docsSubdirPath = `docs/examples/${appwriteExamplesBranch}`;

  console.log(`Downloading examples from ${owner}/${repo}/${docsSubdirPath} to ${examplesTargetDir}`);
  const downloadResult = await downloadTemplate(`gh:${owner}/${repo}/${docsSubdirPath}#${appwriteExamplesBranch}`, {
    dir: examplesTargetDir,
    forceClean: true,
  });

  return {
    examplesDir: downloadResult.dir
  }
}

async function main() {

  await Promise.all([
    downloadDocs(),
    downloadExamples(),
  ]);

  const librariesWithFeatures = await processLibraries();
  await writeLirbariesExamplesToDisk({ librariesWithFeatures });
  await createTableOfContents();
}

await main();