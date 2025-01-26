import { spawn } from "child_process";
import { build } from "@tinacms/cli";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function init() {
  try {
    console.log("Starting development setup...");

    // Set required environment variables
    process.env.TINA_PUBLIC_IS_LOCAL = "true";

    // Clean existing admin build
    const adminPath = path.resolve(process.cwd(), "admin");
    await fs.rm(adminPath, { recursive: true, force: true }).catch(() => {});
    await fs.mkdir(adminPath, { recursive: true });

    console.log("Building Tina CMS admin...");
    await build({
      clientId: process.env.TINA_CLIENT_ID,
      token: process.env.TINA_TOKEN,
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
    });

    console.log("Starting application server...");
    const mainApp = spawn("tsx", ["server/index.ts"], {
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        TINA_PUBLIC_IS_LOCAL: "true",
      }
    });

    process.on("SIGTERM", () => {
      mainApp.kill();
      process.exit(0);
    });

    process.on("SIGINT", () => {
      mainApp.kill();
      process.exit(0);
    });

  } catch (error) {
    console.error("Development setup failed:", error);
    process.exit(1);
  }
}

init().catch(console.error);