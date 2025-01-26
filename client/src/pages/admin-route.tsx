import { useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function AdminRoute() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const redirectToAdmin = async () => {
      try {
        if (import.meta.env.DEV) {
          // In development, check if Tina admin server is running
          const response = await fetch("http://localhost:5001/admin");
          if (response.ok) {
            window.location.href = "http://localhost:5001/admin";
          } else {
            throw new Error("Tina admin server is not running");
          }
        } else {
          // In production, use the built admin interface
          const response = await fetch("/admin/index.html");
          if (response.ok) {
            window.location.href = "/admin/index.html";
          } else {
            throw new Error("Admin interface not found");
          }
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to access the admin interface. Please try again later.",
          variant: "destructive",
        });
        setLocation("/");
      }
    };

    redirectToAdmin();
  }, [setLocation, toast]);

  return null;
}