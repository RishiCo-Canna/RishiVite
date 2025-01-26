import { TinaProvider, TinaCMS } from "tinacms";
import tinaConfig from "../lib/tina";

export default function AdminRoute() {
  // Create a separate CMS instance for the admin route
  const cms = new TinaCMS({
    ...tinaConfig,
    enabled: true,
    sidebar: true,
  });

  return (
    <div className="h-screen w-screen">
      <TinaProvider cms={cms}>
        <div id="tina-admin-wrapper" />
      </TinaProvider>
    </div>
  );
}