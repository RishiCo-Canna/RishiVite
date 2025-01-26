import { useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function AdminRoute() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const redirectToAdmin = async () => {
      try {
        // In development, redirect to the admin path
        window.location.href = "/admin/index.html";
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