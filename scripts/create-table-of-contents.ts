import path from "path";
import { contentRoot, getContent } from "../src/lib/utils/content";
import fs from "fs";

export async function createTableOfContents() {
  const excludedPaths = [
    "/docs/references"
  ]

  console.log(`Creating table of contents for docs`, { excludedPaths });

  const result = getContent();

   // Create docs/toc.json
    const toc = result
      .sort((a, b) => a.webPath.localeCompare(b.webPath))
      .map((item) => ({
        path: `/${item.webPath}`,
        title: item.attributes.title,
      }))
      // .filter((item) => excludedPaths.some((path) => !item.path.startsWith(path)));

    console.log(`Found ${toc.length} Table of Contents items`);
  
    console.log("Writing docs/toc.json");
    //  console.log("Writing docs/toc.json");
    fs.writeFileSync(
      path.join(contentRoot, "docs", "toc.json"),
      JSON.stringify(toc, null, 2)
    );
 }

//  await createTableOfContents();