import { defineConfig } from "tinacms";

// Ensure we're using environment variables correctly for Vite
const clientId = import.meta.env.VITE_TINA_CLIENT_ID;
const token = import.meta.env.VITE_TINA_TOKEN;

export default defineConfig({
  branch: "main",
  clientId: clientId || "",
  token: token || "",
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
  // Enable local mode for development
  local: true,
  // Configure API URL for local development
  contentApiUrlOverride: "/api/tina/gql",
  schema: {
    collections: [
      {
        name: "post",
        label: "Blog Posts",
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
        ],
      },
      {
        name: "page",
        label: "Pages",
        path: "content/pages",
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
            type: "string",
            name: "description",
            label: "Description",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
            templates: [
              {
                name: "Hero",
                label: "Hero Section",
                fields: [
                  {
                    name: "heading",
                    label: "Heading",
                    type: "string",
                  },
                  {
                    name: "subheading",
                    label: "Sub Heading",
                    type: "string",
                  },
                  {
                    name: "backgroundImage",
                    label: "Background Image",
                    type: "image",
                  },
                ],
              },
              {
                name: "Features",
                label: "Features List",
                fields: [
                  {
                    name: "items",
                    label: "Feature Items",
                    type: "object",
                    list: true,
                    fields: [
                      {
                        name: "title",
                        label: "Title",
                        type: "string",
                      },
                      {
                        name: "description",
                        label: "Description",
                        type: "string",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});