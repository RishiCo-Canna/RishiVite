import { defineConfig } from "tinacms";
import { createServer } from "@tinacms/cli";

// Create a local Tina server
createServer({
  ...defineConfig({
    contentApiUrlOverride: "/api/tina/gql",
    local: true,
    publicFolder: "public",
    build: {
      outputFolder: "admin",
      publicFolder: "public",
      basePath: "",
    },
  }),
}).then(() => {
  console.log("Tina Admin server started!");
});
