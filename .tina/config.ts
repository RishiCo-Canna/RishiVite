import { defineConfig } from "tinacms";

// Configuration for local development and GitHub integration
export default defineConfig({
  // GitHub configuration
  branch: "main",  // Use main branch
  clientId: process.env.TINA_CLIENT_ID,  // TinaCMS Client ID
  token: process.env.GITHUB_TOKEN,      // GitHub Token for authentication
  build: {
    publicFolder: "public",
    outputFolder: "admin", // Build directly into admin folder for simpler serving
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
});