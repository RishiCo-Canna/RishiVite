import { spawn } from "child_process";
import { build } from "@tinacms/cli";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import tinaConfig from "../.tina/config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function ensureAdminBuild() {
  const adminPath = path.resolve(process.cwd(), "admin");
  console.log("[Tina] Admin path:", adminPath);

  // Clean existing admin build
  await fs.rm(adminPath, { recursive: true, force: true }).catch(() => {});
  await fs.mkdir(adminPath, { recursive: true });

  try {
    // Set required environment variables
    process.env.TINA_PUBLIC_IS_LOCAL = "true";

    console.log("[Tina] Building admin interface...");
    await build({
      ...tinaConfig,
      build: {
        ...tinaConfig.build,
        outputFolder: adminPath,
      },
    });

    // Verify build output
    const files = await fs.readdir(adminPath);
    console.log("[Tina] Build output files:", files);

    const indexPath = path.join(adminPath, "index.html");
    await fs.access(indexPath, fs.constants.R_OK);

    console.log("[Tina] Admin build completed successfully");
    return true;
  } catch (error) {
    console.error("[Tina] Build failed:", error);
    return false;
  }
}

async function init() {
  try {
    console.log("Starting development setup...");

    // Ensure admin interface is built
    const adminBuilt = await ensureAdminBuild();
    if (!adminBuilt) {
      throw new Error("Failed to build Tina admin interface");
    }

    console.log("Starting application server...");
    const mainApp = spawn("tsx", ["server/index.ts"], {
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        TINA_PUBLIC_IS_LOCAL: "true",
      },
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