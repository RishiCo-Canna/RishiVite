import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import pkg from '@tinacms/cli';
const { build } = pkg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function init() {
  try {
    console.log("Starting development setup...");

    // Ensure directories exist
    const adminDir = path.resolve(process.cwd(), "admin");
    await fs.mkdir(adminDir, { recursive: true });

    // Clean existing admin build
    await fs.rm(adminDir, { recursive: true, force: true }).catch(() => {});

    // Set environment for local development
    process.env.TINA_PUBLIC_IS_LOCAL = "true";
    process.env.PUBLIC_URL = "http://localhost:5000";

    console.log("Building Tina admin interface...");
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

    // Start the Express server
    const mainApp = spawn("tsx", ["server/index.ts"], {
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        TINA_PUBLIC_IS_LOCAL: "true",
      },
    });

    // Handle process termination
    process.on("SIGTERM", () => {
      mainApp.kill();
      process.exit(0);
    });

    process.on("SIGINT", () => {
      mainApp.kill();
      process.exit(0);
    });
  } catch (error) {
    console.error("\nDevelopment setup failed:", error);
    process.exit(1);
  }
}

init().catch(console.error);