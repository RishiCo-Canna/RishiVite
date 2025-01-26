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
    // Create proxy for TinaCMS admin
    const adminProxy = createProxyMiddleware({
      target: 'http://localhost:5001',
      changeOrigin: true,
      ws: true,
      onProxyReq: (proxyReq, req, res) => {
        // Log proxy requests for debugging
        console.log(`[Proxy] ${req.method} ${req.url} -> http://localhost:5001${req.url}`);
      },
    });

    // Mount proxy middleware
    app.use('/admin', adminProxy);
  } else {
    // Serve static admin files in production
    app.use('/admin', express.static(path.join(process.cwd(), 'public', 'admin')));
    app.get('/admin/*', (req, res) => {
      res.sendFile(path.join(process.cwd(), 'public', 'admin', 'index.html'));
    });
  }

  const httpServer = createServer(app);
  return httpServer;
}