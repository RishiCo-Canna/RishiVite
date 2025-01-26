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

  // TinaCMS Admin routes
  if (process.env.NODE_ENV === 'development') {
    // Create proxy for TinaCMS admin in development
    app.use('/admin', createProxyMiddleware({
      target: 'http://localhost:5001',
      changeOrigin: true,
      ws: true,
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        console.log(`[TinaCMS Proxy] ${req.method} ${req.url}`);
      },
      onError: (err, req, res) => {
        console.error('[TinaCMS Proxy] Error:', err);
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end('Something went wrong with the TinaCMS proxy. Is the TinaCMS server running?');
      }
    }));
  } else {
    // Serve built admin files in production
    const adminPath = path.join(process.cwd(), 'public', 'admin');
    app.use('/admin', express.static(adminPath));
    app.get('/admin/*', (req, res) => {
      res.sendFile(path.join(adminPath, 'index.html'));
    });
  }

  const httpServer = createServer(app);
  return httpServer;
}