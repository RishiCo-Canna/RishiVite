import { defineConfig } from "tinacms";

// Define the base URL for the API
const apiURL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000/api/tina'
  : '/api/tina';

export default defineConfig({
  // Build configuration
  build: {
    outputFolder: "admin",
    publicFolder: "public",
    basePath: "",
  },

  // API Configuration
  contentApiUrlOverride: `${apiURL}/gql`,

  // Media Management
  media: {
    tina: {
      publicFolder: "public",
      mediaRoot: "uploads",
    },
  },

  // Content Schema
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
      {
        name: "page",
        label: "Pages",
        path: "content/pages",
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
            type: "string",
            name: "description",
            label: "Description",
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

  // Force local mode for development
  local: true,
  branch: "main",  // Use main branch
  clientId: process.env.TINA_CLIENT_ID,  // TinaCMS Client ID
  token: process.env.GITHUB_TOKEN,      // GitHub Token for authentication
});