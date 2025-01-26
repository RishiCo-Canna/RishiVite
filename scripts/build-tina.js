import { createServer } from "@tinacms/cli";
import { defineConfig } from "tinacms";
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = defineConfig({
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
  local: true,
});

// Build the admin interface
async function buildAdmin() {
  try {
    console.log("Building Tina admin interface...");

    // Create a temporary server to build the admin
    const server = await createServer({
      ...config,
      build: {
        ...config.build,
        outputFolder: path.resolve(process.cwd(), "admin"),
      },
    });

    // Close the server after building
    await server.close();

    console.log("Tina admin interface built successfully!");
  } catch (error) {
    console.error("Failed to build Tina admin:", error);
    process.exit(1);
  }
}

buildAdmin().catch(console.error);