import { defineConfig } from "tinacms";

const config = defineConfig({
  branch: "",  // Empty for local development
  clientId: process.env.TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
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

// Dynamic import for ESM compatibility
const buildAdmin = async () => {
  const { build } = await import('@tinacms/cli');
  try {
    process.env.TINA_PUBLIC_IS_LOCAL = "true";
    await build({
      ...config,
      // Force local mode for development
      local: true,
    });
    console.log('Tina CMS admin build completed successfully!');
  } catch (error) {
    console.error('Failed to build Tina CMS admin:', error);
    process.exit(1);
  }
};

buildAdmin();