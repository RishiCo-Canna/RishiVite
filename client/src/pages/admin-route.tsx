import { TinaProvider, TinaCMS } from "tinacms";

export default function AdminRoute() {
  const cms = new TinaCMS({
    clientId: import.meta.env.VITE_TINA_CLIENT_ID ?? '',
    token: import.meta.env.VITE_TINA_TOKEN ?? '',
    branch: "main",
    contentApiUrlOverride: "/api/tina/gql",
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

  return (
    <div className="h-screen w-screen">
      <TinaProvider cms={cms}>
        <div id="tina-admin-wrapper" />
      </TinaProvider>
    </div>
  );
}