import { defineConfig } from "tinacms";

// Single source of truth for Tina configuration
export default defineConfig({
  build: {
    outputFolder: "admin", // This is relative to project root
    publicFolder: "public",
    basePath: "",
  },
  // Explicitly enable local mode
  local: true,
  // Remove cloud-specific config for local dev
  clientId: undefined,
  token: undefined,
  branch: "",
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