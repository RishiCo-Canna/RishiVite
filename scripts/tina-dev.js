import { createServer } from "@tinacms/cli";
import { defineConfig } from "tinacms";

// Create a local Tina server for development
createServer({
  ...defineConfig({
    branch: "",
    clientId: process.env.TINA_CLIENT_ID,
    token: process.env.TINA_TOKEN,
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
  }),
}).then(() => {
  console.log("Tina CMS server started on http://localhost:5001/admin");
});
