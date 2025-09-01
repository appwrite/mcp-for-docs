import { MCPTool } from "mcp-framework";
import { z } from "zod";
import { librariesWithFeatures } from "../lib/utils/process-libraries.js";
import dedent from "dedent";
import { libraryId } from "../lib/supported-libraries.js";

interface GetFeatureExamplesInput {
  libraryId: z.infer<typeof libraryId>;
  feature: string;
}

class GetFeatureExamplesTool extends MCPTool<GetFeatureExamplesInput> {
  name = "getFeatureExamples";
  description =
    dedent`
    Get examples for a particular feature of an Appwrite SDK for a particular platform.
    Before using this tool, identify the programming langauge in question (either by analyzing the code or by asking the user).
    `;

  schema = {
    libraryId: {
      type: libraryId,
      description:
        'The ID of the library to get examples for. E.g. "client-react-native"',
    },
    feature: {
      type: z.string(),
      description:
        'The name of the feature to get examples for. E.g. "account", "databases", "storage", etc.',
    },
  };

  async execute(input: GetFeatureExamplesInput) {
    console.log("[GetFeatureExamplesTool] Executing with input:", input);
    const library = librariesWithFeatures.find((library) => library.root === input.libraryId);
    
    if (!library) {
      return `Internal Server Error: Could not find library "${input.libraryId}"`;
    }

    const features = library.features.map((feature) => ({
      feature: feature.name,
      description: feature.description,
    }));

    const foundFeature = library.features.find((feature) => feature.name === input.feature);

    if (!foundFeature) {
      return dedent`
        Could not find feature "${input.feature}" in library "${input.libraryId}".

        Here are the features available in this library:
        ${JSON.stringify(features, null, 2)}
      `
    }

    return foundFeature.markdown;
  }
}

export default GetFeatureExamplesTool;
