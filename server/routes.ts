import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import fs from "fs/promises";
import matter from "gray-matter";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import session from "express-session";
import MemoryStore from "memorystore";
import express from "express";

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
  const adminPath = path.resolve(process.cwd(), "admin");

  // First serve static files
  console.log("Serving admin static files from:", adminPath);
  app.use("/admin", express.static(adminPath));

  // Then handle SPA routes
  app.get(["/admin", "/admin/*"], async (req, res) => {
    try {
      const indexPath = path.join(adminPath, "index.html");
      // Verify the file exists before sending
      await fs.access(indexPath);
      res.sendFile(indexPath);
    } catch (err) {
      console.error("Admin access error:", err);
      res.status(500).send(
        "Admin interface is not available. Please ensure the admin build is complete."
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