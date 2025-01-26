import { spawn } from "child_process";
import { createServer } from "@tinacms/cli";
import { defineConfig } from "tinacms";

async function startDev() {
  try {
    console.log("Starting TinaCMS development server...");
    const tinaConfig = defineConfig({
      build: {
        outputFolder: "admin",
        publicFolder: "public",
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

    // Start TinaCMS server
    const tinaServer = await createServer({
      ...tinaConfig,
      port: 5001,
    });

    console.log("Starting Express server...");
    const mainApp = spawn("tsx", ["server/index.ts"], {
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        NODE_ENV: "development",
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