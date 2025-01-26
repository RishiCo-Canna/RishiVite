import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import fs from "fs/promises";
import matter from "gray-matter";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import session from "express-session";
import MemoryStore from "memorystore";

const SessionStore = MemoryStore(session);

export function registerRoutes(app: Express): Server {
  // Session middleware setup
  app.use(
    session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: false,
      store: new SessionStore({
        checkPeriod: 86400000
      }),
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Admin routes handling
  app.get(["/admin", "/admin/*"], async (req, res) => {
    const adminPath = path.resolve(process.cwd(), "admin");
    const indexPath = path.join(adminPath, "index.html");

    try {
      // Check if admin directory exists
      await fs.access(adminPath);

      // For static assets in admin directory
      if (req.path !== "/admin" && req.path !== "/admin/") {
        const assetPath = path.join(adminPath, req.path.replace("/admin", ""));
        try {
          await fs.access(assetPath);
          return res.sendFile(assetPath);
        } catch {
          // If asset not found, fall back to index.html
        }
      }

      // Serve index.html
      try {
        await fs.access(indexPath);
        res.sendFile(indexPath);
      } catch (err) {
        res.status(500).send(
          "Admin interface is not available. Please ensure the admin build is complete."
        );
      }
    } catch (err) {
      res.status(500).send(
        "Admin directory not found. Please ensure Tina CMS is properly built."
      );
    }
  });

  // Authentication setup
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        callbackURL: "/auth/github/callback",
      },
      function (accessToken: any, refreshToken: any, profile: any, done: any) {
        return done(null, profile);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user: any, done) => {
    done(null, user);
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
      console.error("Error loading posts:", err);
      res.status(500).json({ error: "Failed to load posts" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}