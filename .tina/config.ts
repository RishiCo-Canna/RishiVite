
import { defineConfig } from "tinacms";

export default defineConfig({
  branch: "", // Empty for local development
  clientId: process.env.TINA_CLIENT_ID || "dummy-development-id",
  token: process.env.TINA_TOKEN || "dummy-development-token",
  build: {
    outputFolder: "public/admin",
    publicFolder: "public",
    basePath: "admin",
  },
  // Enable local mode for development
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
