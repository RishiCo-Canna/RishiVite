import { spawn } from "child_process";
import { build } from "@tinacms/cli";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function init() {
  try {
    console.log("Starting development setup...");

    // Ensure public directory exists
    const publicDir = path.resolve(process.cwd(), "public");
    await fs.mkdir(publicDir, { recursive: true });

    // Clean existing admin build
    await fs.rm(path.resolve(publicDir, "admin"), { recursive: true, force: true }).catch(() => {});

    // Set required environment variables
    process.env.TINA_PUBLIC_IS_LOCAL = "true";
    process.env.PUBLIC_URL = "http://localhost:5000";
    process.env.NEXT_PUBLIC_TINA_CLIENT_ID = process.env.TINA_CLIENT_ID;

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
        outputFolder: "public/admin",
        publicFolder: "public",
        basePath: "admin",
      },
      contentApiUrlOverride: '/api/tina/gql',
      local: true,
    });

    // Start the Express server with environment properly set
    const mainApp = spawn("tsx", ["server/index.ts"], {
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        TINA_PUBLIC_IS_LOCAL: "true",
        PUBLIC_URL: "http://localhost:5000",
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