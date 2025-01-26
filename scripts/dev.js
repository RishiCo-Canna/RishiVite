import { spawn } from "child_process";
import { build } from "@tinacms/cli";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Use path relative to the project root for Tina config
const tinaConfigPath = path.join(__dirname, "../.tina/config.ts");

async function init() {
  try {
    console.log("Building Tina admin interface...");

    // First build the admin interface
    await build({
      config: tinaConfigPath,
      // Ensure local mode is enabled
      local: true
    });

    console.log("Tina admin build complete");

    // Then start the main application
    const mainApp = spawn("tsx", ["server/index.ts"], {
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        TINA_PUBLIC_IS_LOCAL: "true"
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
    console.error("Failed to start:", error);
    process.exit(1);
  }
}

init().catch(console.error);