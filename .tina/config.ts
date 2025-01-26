import { defineConfig } from "tinacms";

export default defineConfig({
  branch: "", // Empty for local development
  clientId: process.env.TINA_CLIENT_ID, // Will be injected
  token: process.env.TINA_TOKEN,    // Will be injected
  build: {
    outputFolder: "admin",
    publicFolder: "public",
    basePath: "",
  },
  // Force local mode for development
  local: true,
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