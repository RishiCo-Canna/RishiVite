import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import fs from "fs/promises";

export function registerRoutes(app: Express): Server {
  // API Routes
  app.get("/api/posts", async (_req, res) => {
    try {
      const postsDir = path.join(process.cwd(), "content/posts");
      const files = await fs.readdir(postsDir);
      const posts = await Promise.all(
        files.map(async (file) => {
          const content = await fs.readFile(
            path.join(postsDir, file),
            "utf-8"
          );
          // Basic frontmatter parsing
          const [_, frontmatter, body] = content.split("---");
          const meta = Object.fromEntries(
            frontmatter
              .trim()
              .split("\n")
              .map((line) => line.split(": ").map((s) => s.trim()))
          );
          return { ...meta, body };
        })
      );
      res.json(posts);
    } catch (err) {
      res.status(500).json({ error: "Failed to load posts" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
