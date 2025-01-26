import { spawn } from "child_process";
import { createServer } from "@tinacms/cli";
import config from "../.tina/config.js";
import fs from 'fs/promises';

async function startDev() {
  try {
    console.log("Starting TinaCMS development server...");

    // Ensure content directories exist
    const contentDir = "./content/posts";
    const uploadsDir = "./public/uploads";
    await Promise.all([
      fs.mkdir(contentDir, { recursive: true }),
      fs.mkdir(uploadsDir, { recursive: true }),
    ]);

    // Start TinaCMS server with local configuration
    const tinaServer = await createServer({
      ...config,
      port: 5001,
      publicFolder: "public",
      contentApiUrlOverride: "/api/tina/gql",
    });

    console.log("Starting Express server...");
    const mainApp = spawn("tsx", ["server/index.ts"], {
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        NODE_ENV: "development",
        TINA_PUBLIC_IS_LOCAL: "true",
      },
    });

    const cleanup = () => {
      console.log("Shutting down servers...");
      tinaServer.close();
      mainApp.kill();
      process.exit(0);
    };

    process.on("SIGTERM", cleanup);
    process.on("SIGINT", cleanup);

  } catch (error) {
    console.error("Development setup failed:", error);
    process.exit(1);
  }
}

startDev().catch(console.error);