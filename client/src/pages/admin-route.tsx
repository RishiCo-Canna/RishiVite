import { TinaProvider, TinaCMS } from "tinacms";
import tinaConfig from "../lib/tina";

export default function AdminRoute() {
  // Create a separate CMS instance for the admin route with all required config
  const cms = new TinaCMS({
    ...tinaConfig,
    enabled: true,
    sidebar: true,
    clientId: import.meta.env.VITE_TINA_CLIENT_ID ?? '',
    branch: "main",
    token: import.meta.env.VITE_TINA_TOKEN ?? '',
    contentApiUrlOverride: "/api/tina/gql",
    local: true, // Enable local mode for development
    schema: {
      collections: [
        {
          name: "post",
          label: "Blog Posts",
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
    }
  });

  return (
    <div className="h-screen w-screen">
      <TinaProvider cms={cms}>
        <div id="tina-admin-wrapper" />
      </TinaProvider>
    </div>
  );
}