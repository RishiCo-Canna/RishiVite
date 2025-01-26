import { spawn } from "child_process";
import { build } from "@tinacms/cli";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function init() {
  try {
    console.log("Starting Tina CMS build process...");

    // Clean and recreate admin directory
    const adminPath = path.join(process.cwd(), "admin");
    await fs.rm(adminPath, { recursive: true, force: true });
    await fs.mkdir(adminPath, { recursive: true });

    // Basic Tina config for local development
    await build({
      config: {
        build: {
          outputFolder: "admin",
          publicFolder: "public",
        },
        local: true,
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
                  type: "rich-text",
                  name: "body",
                  label: "Body",
                  isBody: true,
                },
              ],
            },
          ],
        },
      }
    });

    // Verify build output
    const files = await fs.readdir(adminPath);
    console.log("Admin build contents:", files);

    if (!files.includes("index.html")) {
      throw new Error("Admin build failed: index.html not found");
    }

    console.log("Tina CMS build successful, starting application server...");

    // Start the Express server
    const mainApp = spawn("tsx", ["server/index.ts"], {
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        TINA_PUBLIC_IS_LOCAL: "true"
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
    console.error("Failed to start:", error);
    process.exit(1);
  }
}

init().catch(console.error);