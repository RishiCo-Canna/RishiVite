import { useEffect } from "react";

export default function AdminRoute() {
  useEffect(() => {
    // Redirect to Tina admin interface
    window.location.href = "/admin/index.html";
  }, []);

  return null;
}
