import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import fs from "fs/promises";
import { compile } from "@mdx-js/mdx";
import matter from "gray-matter";

export function registerRoutes(app: Express): Server {
  // API Routes for development
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
          const { data, content: mdxContent } = matter(content);
          const compiledMdx = await compile(mdxContent);
          return {
            ...data,
            body: String(compiledMdx),
            _sys: {
              relativePath: file,
            },
          };
        })
      );
      res.json(posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to load posts" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}