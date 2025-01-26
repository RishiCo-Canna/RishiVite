import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

export default function Nav() {
  const [location] = useLocation();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <Link href="/">
            <Button variant="link" className="text-xl font-bold p-0">
              TinaSite
            </Button>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant={location === "/" ? "secondary" : "ghost"}>
                Home
              </Button>
            </Link>
            <Link href="/blog">
              <Button variant={location === "/blog" ? "secondary" : "ghost"}>
                Blog
              </Button>
            </Link>
            <Button
              variant="outline"
              asChild
            >
              <a
                href="/admin/index.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                Admin
              </a>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}