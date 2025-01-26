import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { createProxyMiddleware } from "http-proxy-middleware";

export function registerRoutes(app: Express): Server {
  // Serve static files from public directory
  app.use(express.static(path.resolve(process.cwd(), "public")));

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

  // Handle admin routes
  if (process.env.NODE_ENV === 'development') {
    // In development, proxy all admin requests to TinaCMS server
    app.use(['/admin', '/admin/*'], createProxyMiddleware({
      target: 'http://localhost:5001',
      changeOrigin: true,
      ws: true,
      logLevel: 'debug'
    }));
  } else {
    // In production, serve the static admin files
    app.get(['/admin', '/admin/*'], (req, res) => {
      const adminIndexPath = path.join(process.cwd(), 'public', 'admin', 'index.html');
      if (fs.existsSync(adminIndexPath)) {
        res.sendFile(adminIndexPath);
      } else {
        res.status(404).send('Admin interface not available. Please build the admin interface first.');
      }
    });
  }

  const httpServer = createServer(app);
  return httpServer;
}