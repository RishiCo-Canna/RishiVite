import { spawn } from "child_process";
import { createServer } from "@tinacms/cli";
import config from "../.tina/config.js";

async function startDev() {
  try {
    // Start TinaCMS server
    console.log("Starting TinaCMS development server...");
    const tinaServer = await createServer({
      ...config,
      port: 5001,
    });

    // Start the Express server
    console.log("Starting Express server...");
    const mainApp = spawn("tsx", ["server/index.ts"], {
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        NODE_ENV: "development",
      },
    });

    // Handle process termination
    process.on("SIGTERM", () => {
      tinaServer.close();
      mainApp.kill();
      process.exit(0);
    });

    process.on("SIGINT", () => {
      tinaServer.close();
      mainApp.kill();
      process.exit(0);
    });

  } catch (error) {
    console.error("Development setup failed:", error);
    process.exit(1);
  }
}

startDev().catch(console.error);