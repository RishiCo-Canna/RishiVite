import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <section className="py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-6">
            Modern Content Management Made Simple
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            A beautiful website powered by Tina CMS, with seamless GitHub integration
            and modern components.
          </p>
          <Link href="/blog">
            <Button size="lg" className="gap-2">
              View Blog <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Visual Editing</h3>
              <p className="text-muted-foreground">
                Edit your content visually with a modern interface powered by Tina CMS.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Git-Based</h3>
              <p className="text-muted-foreground">
                All content is stored in your GitHub repository for version control.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Modern Stack</h3>
              <p className="text-muted-foreground">
                Built with React, Vite, and Express for optimal performance.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
