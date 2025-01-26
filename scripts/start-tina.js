import { createServer } from "@tinacms/cli";
import config from "../.tina/config.js";

// Start the Tina CMS server
createServer({
  ...config,
  // Ensure we're in local mode
  local: true,
  // Point to our content directory
  publicFolder: "public",
}).then(() => {
  console.log("Tina CMS server started on http://localhost:5001/admin");
});
