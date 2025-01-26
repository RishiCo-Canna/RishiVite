import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import path from "path";
import fs from "fs/promises";
import matter from "gray-matter";

export function registerRoutes(app: Express): Server {
  // Serve static files from public directory
  app.use(express.static(path.resolve(process.cwd(), "public")));

  // Serve the admin interface
  app.use("/admin", express.static(path.resolve(process.cwd(), "admin")));

  // Mock Tina GraphQL API for local development
  app.all('/api/tina/gql', (req, res) => {
    res.json({ data: { node: null } });
  });

  // Blog posts API
  app.get("/api/posts", async (req, res) => {
    try {
      const postsDir = path.join(process.cwd(), "content/posts");
      const files = await fs.readdir(postsDir);
      const posts = await Promise.all(
        files.map(async (file) => {
          const content = await fs.readFile(path.join(postsDir, file), "utf-8");
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

  // Serve the admin interface HTML for all admin routes
  app.get(["/admin", "/admin/*"], async (req, res) => {
    const adminPath = path.resolve(process.cwd(), "admin/index.html");
    try {
      await fs.access(adminPath);
      res.sendFile(adminPath);
    } catch (err) {
      res.status(404).json({ error: "Admin interface not built yet" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}