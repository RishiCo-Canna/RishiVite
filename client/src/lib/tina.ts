import { defineConfig } from "tinacms";

// Ensure we're using environment variables correctly for Vite
const clientId = import.meta.env.VITE_TINA_CLIENT_ID;
const token = import.meta.env.VITE_TINA_TOKEN;

export default defineConfig({
  branch: "main",
  clientId: clientId || "",
  token: token || "",
  build: {
    outputFolder: "dist/public/admin",
    publicFolder: "public",
    basePath: "admin",
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },
  // Enable local mode for development without GitHub
  local: true,
  // Local content API endpoint
  contentApiUrlOverride: "/api/tina/gql",
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
            templates: [
              {
                name: "Image",
                label: "Image",
                fields: [
                  {
                    name: "src",
                    label: "Image Source",
                    type: "image",
                  },
                  {
                    name: "alt",
                    label: "Alt Text",
                    type: "string",
                  },
                ],
              },
            ],
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