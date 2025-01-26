import { spawn } from "child_process";
import { build } from "@tinacms/cli";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function validateAdminBuild(adminPath) {
  try {
    const files = await fs.readdir(adminPath);
    console.log("Admin build contents:", files);

    const requiredFiles = ["index.html", "assets"];
    const missingFiles = requiredFiles.filter(file => !files.includes(file));

    if (missingFiles.length > 0) {
      throw new Error(`Missing required files: ${missingFiles.join(", ")}`);
    }

    // Verify index.html exists and is readable
    await fs.access(path.join(adminPath, "index.html"), fs.constants.R_OK);
    return true;
  } catch (error) {
    console.error("Admin build validation failed:", error);
    return false;
  }
}

async function buildTinaAdmin() {
  const adminPath = path.resolve(process.cwd(), "admin");
  console.log("Building Tina CMS admin to:", adminPath);

  // Clean existing build
  await fs.rm(adminPath, { recursive: true, force: true }).catch(() => {});
  await fs.mkdir(adminPath, { recursive: true });

  // Build with explicit configuration
  await build({
    config: {
      build: {
        outputFolder: adminPath,
        publicFolder: "public",
        basePath: "",
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
    }
  });

  const isValid = await validateAdminBuild(adminPath);
  if (!isValid) {
    throw new Error("Admin build validation failed");
  }

  return true;
}

async function init() {
  try {
    console.log("Starting Tina CMS build process...");

    // Build admin interface first
    await buildTinaAdmin();
    console.log("Tina CMS build completed successfully");

    // Only start server after successful build
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
    console.error("Failed to start:", error);
    process.exit(1);
  }
}

init().catch(console.error);