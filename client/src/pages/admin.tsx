import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

type AuthResponse = {
  authenticated: boolean;
  user?: {
    displayName: string;
    username: string;
    photos?: { value: string }[];
  };
  message: string;
};

export default function Admin() {
  const [, setLocation] = useLocation();
  const { data, isLoading } = useQuery<AuthResponse>({
    queryKey: ["/auth/test"],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <div className="h-6 bg-muted rounded w-2/3 animate-pulse" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data?.authenticated) {
    setLocation("/");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            {data.user?.photos?.[0] && (
              <img
                src={data.user.photos[0].value}
                alt=""
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <h2 className="text-2xl font-bold">{data.user?.displayName}</h2>
              <p className="text-muted-foreground">@{data.user?.username}</p>
            </div>
          </div>
          <Button asChild variant="outline">
            <a href="/admin" target="_blank" rel="noopener noreferrer">
              Open Tina CMS
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
