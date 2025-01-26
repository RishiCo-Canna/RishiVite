import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import ReactMarkdown from 'react-markdown';

type Post = {
  title: string;
  date: string;
  body: string;
  _sys: {
    relativePath: string;
  };
};

export default function Blog() {
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: [import.meta.env.PROD ? "/data/posts.json" : "/api/posts"],
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
          {posts?.map((post) => (
            <Card key={post._sys.relativePath}>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(post.date), "MMMM d, yyyy")}
                </p>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{post.body}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}