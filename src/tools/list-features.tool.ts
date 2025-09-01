import { MCPTool } from "mcp-framework";
import { z } from "zod";
import { librariesWithFeatures } from "../lib/utils/process-libraries.js";
import dedent from "dedent";
import { libraryId } from "../lib/supported-libraries.js";

interface ListFeaturesInput {
  libraryId: z.infer<typeof libraryId>;
}

class ListFeaturesTool extends MCPTool<ListFeaturesInput> {
  name = "listFeatures";
  description =
    dedent`
    List the available features for an Appwrite SDK for a particular platform.
    Before using this tool, identify the programming langauge in question (either by analyzing the code or by asking the user).
    You will use the returned list of features to fetch code examples for particular features, using the getFeatureExamples tool. 
    `;

  schema = {
    libraryId: {
      type: libraryId,
      description:
        'The ID of the library to list the features for. E.g. "client-react-native"',
    },
  };

  async execute(input: ListFeaturesInput) {
    console.log("[ListFeaturesTool] Executing with input:", input);
    const library = librariesWithFeatures.find((library) => library.root === input.libraryId);
    
    if (!library) {
      return `Internal Server Error: Could not fetch features for library "${input.libraryId}"`;
    }

    const features = library.features.map((feature) => ({
      feature: feature.name,
      description: feature.description,
    }));

    return features;
  }
}

export default ListFeaturesTool;
