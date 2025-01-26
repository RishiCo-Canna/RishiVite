import { createServer } from "@tinacms/cli";
import { defineConfig } from "tinacms";

// Create the Tina configuration for local development
const config = defineConfig({
  build: {
    outputFolder: "admin",
    publicFolder: "public",
    basePath: "",
  },
  // Force local mode
  local: true,
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
});

// Start the Tina admin server
createServer({
  ...config,
  port: 5001, // Run on a different port than our main app
}).then(() => {
  console.log("Tina Admin server started on http://localhost:5001/admin");
}).catch((error) => {
  console.error("Failed to start Tina Admin server:", error);
  process.exit(1);
});