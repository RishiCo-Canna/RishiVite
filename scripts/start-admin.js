import { createServer } from "@tinacms/cli";
import { defineConfig } from "tinacms";

// Create the Tina configuration for local development
const config = defineConfig({
  // Disable cloud features for local development
  local: true,
  contentApiUrlOverride: "/api/tina/gql",
  build: {
    outputFolder: "admin",
    publicFolder: "public",
    basePath: "",
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "content/posts",
        format: "mdx",
        ui: {
          filename: {
            readonly: true,
            slugify: (values) => {
              return `${values?.title?.toLowerCase().replace(/ /g, '-')}`;
            },
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
          {
            type: "datetime",
            name: "date",
            label: "Date",
            required: true,
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
