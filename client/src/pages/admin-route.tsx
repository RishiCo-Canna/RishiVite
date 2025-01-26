import { useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function AdminRoute() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const redirectToAdmin = async () => {
      try {
        // Get the current protocol and hostname
        const protocol = window.location.protocol;
        const hostname = window.location.hostname;
        const port = import.meta.env.DEV ? ':5000' : '';
        const baseUrl = `${protocol}//${hostname}${port}`;

        // Redirect to the admin interface
        window.location.href = `${baseUrl}/admin/index.html`;
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