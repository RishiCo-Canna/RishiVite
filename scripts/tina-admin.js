import pkg from '@tinacms/cli';
const { build } = pkg;
import { defineConfig } from "tinacms";

// Configuration for building TinaCMS admin interface
const config = defineConfig({
  build: {
    outputFolder: "admin",
    publicFolder: "public",
    basePath: "",
  },
  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "content/posts",
        format: "mdx",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "datetime",
            name: "date",
            label: "Date",
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
    ],
  },
  local: true,
});

async function buildAdmin() {
  try {
    console.log("Building TinaCMS admin interface...");
    await build(config);
    console.log("TinaCMS admin build completed successfully!");
  } catch (error) {
    console.error("Failed to build TinaCMS admin:", error);
    process.exit(1);
  }
}

buildAdmin().catch(console.error);