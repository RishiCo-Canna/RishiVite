
import { defineConfig } from "tinacms";

export default defineConfig({
  branch: "",  // Empty for local development
  clientId: process.env.TINA_CLIENT_ID || "",  // Will use env var if available
  token: process.env.TINA_TOKEN || "",  // Will use env var if available
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
  media: {
    tina: {
      publicFolder: "public",
      mediaRoot: "uploads",
    },
  },
  // Enable local mode for development
  local: true,
});
