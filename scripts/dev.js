import { spawn } from "child_process";
import { build } from "@tinacms/cli";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function buildTinaAdmin() {
  const adminPath = path.resolve(process.cwd(), "admin");
  console.log("\nPreparing Tina Admin build...");

  // Clean and recreate admin directory
  await fs.rm(adminPath, { recursive: true, force: true }).catch(() => {});
  await fs.mkdir(adminPath, { recursive: true });

  // Set required environment variables
  process.env.TINA_PUBLIC_IS_LOCAL = "true";
  process.env.PUBLIC_URL = "http://localhost:5000";

  try {
    console.log("Building Tina admin interface...");
    await build({
      build: {
        outputFolder: adminPath,
        publicFolder: "public",
        basePath: "",
      },
      local: true, // Force local mode
      clientId: process.env.TINA_CLIENT_ID, // Inject from environment
      token: process.env.TINA_TOKEN,        // Inject from environment
    });

    // Verify build output
    const indexPath = path.join(adminPath, "index.html");
    await fs.access(indexPath);
    console.log("Tina admin build completed successfully!");
    return true;
  } catch (error) {
    console.error("Failed to build Tina admin:", error);
    return false;
  }
}

async function init() {
  try {
    // Build Tina admin interface
    const adminBuilt = await buildTinaAdmin();
    if (!adminBuilt) {
      throw new Error("Failed to build Tina admin interface");
    }

    // Start the Express server
    console.log("\nStarting application server...");
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