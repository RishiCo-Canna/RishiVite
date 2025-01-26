import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import path from "path";
import fs from "fs";
import matter from "gray-matter";

export function registerRoutes(app: Express): Server {
  // Serve static files from public directory
  app.use(express.static(path.resolve(process.cwd(), "public")));

  // Serve the admin interface
  app.use("/admin", express.static(path.resolve(process.cwd(), "admin")));

  // Mock TinaCMS GraphQL API endpoint for development
  app.post('/api/tina/gql', (req, res) => {
    res.json({ 
      data: { 
        node: null,
        getCollection: {
          documents: []
        }
      } 
    });
  });

  // Blog posts API
  app.get("/api/posts", async (req, res) => {
    try {
      const postsDir = path.join(process.cwd(), "content/posts");
      const files = await fs.promises.readdir(postsDir);
      const posts = await Promise.all(
        files.map(async (file) => {
          const content = await fs.promises.readFile(path.join(postsDir, file), "utf-8");
          const { data, content: mdContent } = matter(content);
          return {
            ...data,
            body: mdContent,
            _sys: { relativePath: file },
          };
        })
      );
      res.json(posts);
    } catch (err) {
      console.error("[API] Error loading posts:", err);
      res.status(500).json({ error: "Failed to load posts" });
    }
  });

  // Always serve admin/index.html for /admin routes
  app.get(["/admin", "/admin/*"], (req, res) => {
    const adminIndexPath = path.resolve(process.cwd(), "admin", "index.html");
    if (fs.existsSync(adminIndexPath)) {
      res.sendFile(adminIndexPath);
    } else {
      res.status(404).send("Admin interface not built. Please wait while we build it...");
    }
  });

  // Create the HTTP server
  const httpServer = createServer(app);

  return httpServer;
}