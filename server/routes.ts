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

  // Mock Tina GraphQL API for local development
  app.all('/api/tina/gql', (req, res) => {
    res.json({ data: { node: null } });
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

  // Serve admin interface for all admin routes
  app.get(["/admin", "/admin/*"], (req, res, next) => {
    const adminIndexPath = path.resolve(process.cwd(), "admin/index.html");
    if (fs.existsSync(adminIndexPath)) {
      res.sendFile(adminIndexPath);
    } else {
      next(); // Let the static middleware handle it
    }
  });

  // Always return index.html for client routes
  app.get("*", (req, res, next) => {
    if (!req.url.startsWith("/api")) {
      const clientIndexPath = path.resolve(process.cwd(), "client/index.html");
      if (fs.existsSync(clientIndexPath)) {
        res.sendFile(clientIndexPath);
      } else {
        next();
      }
    } else {
      next();
    }
  });

  return createServer(app);
}