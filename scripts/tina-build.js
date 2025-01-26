import { build } from "@tinacms/cli";
import { defineConfig } from "tinacms";

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

try {
  console.log("Starting TinaCMS admin build...");
  await build(config);
  console.log("TinaCMS admin build completed successfully!");
} catch (error) {
  console.error("Failed to build TinaCMS admin:", error);
  process.exit(1);
}
