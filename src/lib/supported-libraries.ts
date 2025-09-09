import z from "zod";

export const libraryId = z.enum([
  "client-android",
  "client-android-java",
  "client-android-kotlin",
  "client-apple",
  "client-flutter",
  "client-graphql",
  "client-react-native",
  "client-rest",
  "client-web",
  "console-cli",
  "server-dart",
  "server-deno",
  "server-dotnet",
  "server-go",
  "server-graphql",
  "server-kotlin",
  "server-nodejs",
  "server-php",
  "server-python",
  "server-ruby",
  "server-swift",
]);

export type Library = {
  name: string;
  root: z.infer<typeof libraryId>;
  type: "client" | "server";
  examplesPath: string;
};

export type LibraryExample = {
  key: string;
  content: string;
  docsPath: string;
};

export type LibraryFeature = {
  name: string;
  description: string;
  markdown: string;
  examples: LibraryExample[];
  docsPath: string;
};

export const libraries: Library[] = [
  {
    name: "Android - Java",
    type: "client",
    root: "client-android",
    examplesPath: "java",
  },
  {
    name: "Android - Kotlin",
    type: "client",
    root: "client-android",
    examplesPath: "kotlin",
  },
  {
    name: "Apple",
    type: "client",
    root: "client-apple",
    examplesPath: "examples",
  },
  {
    name: "Flutter",
    type: "client",
    root: "client-flutter",
    examplesPath: "examples",
  },
  {
    name: "GraphQL",
    type: "client",
    root: "client-graphql",
    examplesPath: "examples",
  },
  {
    name: "React Native",
    type: "client",
    root: "client-react-native",
    examplesPath: "examples",
  },
  {
    name: "REST",
    type: "client",
    root: "client-rest",
    examplesPath: "examples",
  },
  {
    name: "Web - JavaScript (including React, Vue, Svelte, Angular, etc)",
    type: "client",
    root: "client-web",
    examplesPath: "examples",
  },
  {
    name: "Console CLI",
    type: "client",
    root: "console-cli",
    examplesPath: "examples",
  },
  {
    name: "Dart",
    type: "server",
    root: "server-dart",
    examplesPath: "examples",
  },
  {
    name: "Deno",
    type: "server",
    root: "server-deno",
    examplesPath: "examples",
  },
  {
    name: "Dotnet",
    type: "server",
    root: "server-dotnet",
    examplesPath: "examples",
  },
  {
    name: "Go",
    type: "server",
    root: "server-go",
    examplesPath: "examples",
  },
  {
    name: "GraphQL",
    type: "server",
    root: "server-graphql",
    examplesPath: "examples",
  },
  {
    name: "Kotlin - Java",
    type: "server",
    root: "server-kotlin",
    examplesPath: "java",
  },
  {
    name: "Kotlin - Kotlin",
    type: "server",
    root: "server-kotlin",
    examplesPath: "kotlin",
  },
  {
    name: "Node.js",
    type: "server",
    root: "server-nodejs",
    examplesPath: "examples",
  },
  {
    name: "PHP",
    type: "server",
    root: "server-php",
    examplesPath: "examples",
  },
  {
    name: "Python",
    type: "server",
    root: "server-python",
    examplesPath: "examples",
  },
  {
    name: "Ruby",
    type: "server",
    root: "server-ruby",
    examplesPath: "examples",
  },
  {
    name: "Swift",
    type: "server",
    root: "server-swift",
    examplesPath: "examples",
  },
];
