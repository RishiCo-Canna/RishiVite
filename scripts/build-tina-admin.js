import { defineConfig } from "tinacms";

const config = defineConfig({
  contentApiUrlOverride: "/api/tina/gql",
  build: {
    outputFolder: "admin",
    publicFolder: "public",
    basePath: "",
  },
  schema: {
    collections: [
      {
        name: "post",
        label: "Blog Posts",
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

// Dynamic import for ESM compatibility
const buildAdmin = async () => {
  const { build } = await import('@tinacms/cli');
  try {
    await build(config);
    console.log('Tina CMS admin build completed successfully!');
  } catch (error) {
    console.error('Failed to build Tina CMS admin:', error);
    process.exit(1);
  }
};

buildAdmin();