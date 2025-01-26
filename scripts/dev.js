import { spawn } from "child_process";
import { build } from "@tinacms/cli";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import tinaConfig from "../.tina/config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function validateAdminBuild(adminPath) {
  try {
    const files = await fs.readdir(adminPath);
    console.log("Admin build contents:", files);

    // Check index.html specifically
    const indexPath = path.join(adminPath, "index.html");
    await fs.access(indexPath, fs.constants.R_OK);

    const indexContent = await fs.readFile(indexPath, 'utf-8');
    if (!indexContent.includes('<!DOCTYPE html>')) {
      throw new Error('index.html appears to be invalid');
    }

    return true;
  } catch (error) {
    console.error("Admin build validation failed:", error);
    return false;
  }
}

async function init() {
  try {
    console.log("Starting development setup...");

    // Clean and prepare admin directory
    const adminPath = path.resolve(process.cwd(), "admin");
    await fs.rm(adminPath, { recursive: true, force: true }).catch(() => {});
    await fs.mkdir(adminPath, { recursive: true });

    console.log("Building Tina CMS admin...");
    await build({
      config: {
        ...tinaConfig,
        build: {
          ...tinaConfig.build,
          outputFolder: adminPath,
        },
      }
    });

    // Validate the build
    const isValid = await validateAdminBuild(adminPath);
    if (!isValid) {
      throw new Error("Failed to validate admin build");
    }

    console.log("Tina CMS build completed successfully");
    console.log("Starting application server...");

    // Start the Express server
    const mainApp = spawn("tsx", ["server/index.ts"], {
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        TINA_PUBLIC_IS_LOCAL: "true",
      }
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
    console.error("Development setup failed:", error);
    process.exit(1);
  }
}

init().catch(console.error);