import { useEffect } from "react";
import { useLocation } from "wouter";

export default function AdminRoute() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redirect to the actual Tina admin interface
    window.location.href = "/admin/index.html";
  }, []);

  return null;
}