import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

type Post = {
  title: string;
  date: string;
  body: string;
};

export default function Blog() {
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded w-2/3 animate-pulse mb-4" />
                <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>
        <div className="space-y-6">
          {posts?.map((post, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(post.date), "MMMM d, yyyy")}
                </p>
              </CardHeader>
              <CardContent>
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: post.body }}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
