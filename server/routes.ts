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
  console.log("[Admin] Base path:", adminPath);

  // Serve static files from admin build
  app.use("/admin", express.static(adminPath));

  // Handle SPA routes for admin
  app.get(["/admin", "/admin/*"], async (req, res, next) => {
    try {
      const indexPath = path.join(adminPath, "index.html");

      // Check if the file exists
      try {
        await fs.access(indexPath, fs.constants.R_OK);
      } catch (error) {
        console.error("[Admin] index.html not found:", error);
        return res.status(404).send("Admin interface not found. Please ensure the build process is complete.");
      }

      res.sendFile(indexPath);
    } catch (error) {
      console.error("[Admin] Error serving admin interface:", error);
      next(error);
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
      console.error("[API] Error loading posts:", err);
      res.status(500).json({ error: "Failed to load posts" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}