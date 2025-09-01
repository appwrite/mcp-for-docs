import {
  docsTargetDir,
  examplesTargetDir,
  processedReferencesTargetDir,
} from "../constants.js";
import fs from "fs";
import path from "path";
import type {
  Library,
  LibraryExample,
  LibraryFeature,
} from "../supported-libraries.js";
import { libraries } from "../supported-libraries.js";
import dedent from "dedent";

export type LibraryWithFeatures = Library & {
  features: LibraryFeature[];
};

export async function processLibraries() {
  // const referenceFeatures = await getReferenceFeaturesFromDocs();

  const librariesWithFeatures: LibraryWithFeatures[] = [];
  for (const library of libraries) {
    const result = await createLibraryExamples({ library });
    librariesWithFeatures.push({
      ...library,
      features: result.features,
    });
  }

  return librariesWithFeatures;
}

export let librariesWithFeatures: LibraryWithFeatures[] = [];

export async function initLibrariesWithFeatures() {
  librariesWithFeatures = await processLibraries();
}

export async function writeLirbariesExamplesToDisk({
  librariesWithFeatures,
}: {
  librariesWithFeatures: LibraryWithFeatures[];
}) {
  // First, ensure we delete the directory
  fs.rmSync(processedReferencesTargetDir, { recursive: true, force: true });

  // Write librariesWithFeatures to files
  for (const libraryWithFeatures of librariesWithFeatures) {
    // Ensure library folder exists
    fs.mkdirSync(
      path.join(processedReferencesTargetDir, libraryWithFeatures.root),
      { recursive: true }
    );

    for (const feature of libraryWithFeatures.features) {
      const targetPath = path.join(
        processedReferencesTargetDir,
        libraryWithFeatures.root,
        feature.name,
        "index.md"
      );
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      fs.writeFileSync(targetPath, feature.markdown);

      for (const example of feature.examples) {
        const exampleTargetPath = path.join(
          processedReferencesTargetDir,
          libraryWithFeatures.root,
          feature.name,
          example.key,
          "index.md"
        );
        fs.mkdirSync(path.dirname(exampleTargetPath), { recursive: true });
        fs.writeFileSync(exampleTargetPath, example.content);
      }
    }
  }
}

async function generateFeatureMarkdown({
  library,
  featureName,
  featureDescription,
  examples,
}: {
  library: Library;
  featureName: string;
  featureDescription: string;
  examples: LibraryExample[];
}) {
  return dedent`
  ---
  layout: article
  title: Reference: ${library.name} / ${featureName}
  ---
  # ${library.name} / ${featureName}
  
  ${featureDescription}
  
  ## Examples

  ${examples
    .map(
      (example) => `### ${example.key}
  \`\`\`
  ${example.content}
  \`\`\``
    )
    .join("\n\n")}
  `;
}

async function getReferenceFeatureDescriptionFromDocsRepo({
  featureName,
}: {
  featureName: string;
}) {
  try {
    const dir = path.join(
      docsTargetDir,
      "references/[version]/[platform]/[service]/descriptions",
      `${featureName}.md`
    );
    const description = fs.readFileSync(dir, "utf8");
    return description;
  } catch (error) {
    return "No description found";
  }
}

async function createLibraryExamples({
  library,
}: {
  library: Library;
}): Promise<{
  library: Library;
  features: LibraryFeature[];
}> {
  const examplesDir = path.join(
    examplesTargetDir,
    library.root,
    library.examplesPath
  );
  const featureNames = fs.readdirSync(examplesDir);
  const features: LibraryFeature[] = [];

  for (const featureName of featureNames) {
    const featureExamplesFiles = fs.readdirSync(
      path.join(examplesDir, featureName)
    );

    const description = await getReferenceFeatureDescriptionFromDocsRepo({
      featureName,
    });

    const docsWebPath = path.join(
      "/docs/references",
      "cloud",
      library.root,
      library.examplesPath !== "examples" ? library.examplesPath : "",
      featureName
    );

    const examples: LibraryExample[] = [];
    for (const exampleFile of featureExamplesFiles) {
      const key = exampleFile.replace(".md", "");
      const content = fs.readFileSync(
        path.join(examplesDir, featureName, exampleFile),
        "utf8"
      );

      examples.push({ key, content, docsPath: docsWebPath });
    }

    const markdown = await generateFeatureMarkdown({
      library,
      featureName,
      featureDescription: description,
      examples,
    });
    features.push({ name: featureName, description, examples, markdown, docsPath: docsWebPath });
  }
  return {
    library,
    features,
  };
}
