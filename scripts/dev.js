import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Start main application
const mainApp = spawn("tsx", ["server/index.ts"], {
  stdio: "inherit",
  shell: true,
});

// Start Tina admin server
const tinaAdmin = spawn("node", ["scripts/start-admin.js"], {
  stdio: "inherit",
  shell: true,
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
