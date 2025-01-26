import { defineConfig } from "tinacms";
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import pkg from '@tinacms/cli';
const { build } = pkg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function buildAdmin() {
  try {
    console.log("Building Tina admin interface...");

    // Ensure admin directory exists
    const adminDir = path.resolve(process.cwd(), "admin");
    await fs.mkdir(adminDir, { recursive: true });

    // Clean existing admin build
    await fs.rm(adminDir, { recursive: true, force: true }).catch(() => {});

    // Set environment for local development
    process.env.TINA_PUBLIC_IS_LOCAL = "true";

    // Build admin interface
    await build({
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
      build: {
        outputFolder: "admin",
        publicFolder: "public",
        basePath: "",
      },
      local: true,
    });

    console.log("Tina admin interface built successfully!");
  } catch (error) {
    console.error("Failed to build Tina admin:", error);
    process.exit(1);
  }
}

buildAdmin().catch(console.error);