import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Start main application
const mainApp = spawn("tsx", ["server/index.ts"], {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    PORT: "3000",
  },
});

// Start Tina admin server with local mode enabled
const tinaAdmin = spawn("npx", ["tinacms", "dev", "-c", ".tina/config.ts"], {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    TINA_PUBLIC_IS_LOCAL: "true",
    PORT: "5001",
  },
});

// Handle process termination
process.on("SIGTERM", () => {
  mainApp.kill();
  tinaAdmin.kill();
  process.exit(0);
});

process.on("SIGINT", () => {
  mainApp.kill();
  tinaAdmin.kill();
  process.exit(0);
});