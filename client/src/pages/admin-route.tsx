import { useEffect } from "react";
import { TinaProvider, TinaCMS } from "tinacms";
import tinaConfig from "../lib/tina";
import { TinaEditProvider } from "tinacms";

export default function AdminRoute() {
  return (
    <div className="h-screen w-screen">
      <TinaEditProvider>
        <div id="tina-admin-wrapper" />
      </TinaEditProvider>
    </div>
  );
}