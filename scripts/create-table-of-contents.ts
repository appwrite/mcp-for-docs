import { contentRoot, getContent } from "../src/lib/utils/content";
import fs from "fs";
import path from "path";

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

createTableOfContents();