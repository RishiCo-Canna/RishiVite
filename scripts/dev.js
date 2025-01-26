import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Start main application with Tina CMS enabled
const mainApp = spawn("tsx", ["server/index.ts"], {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    TINA_PUBLIC_IS_LOCAL: "true",
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