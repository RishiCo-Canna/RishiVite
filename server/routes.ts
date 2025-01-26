import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
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

  // Authentication setup
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        callbackURL: "/auth/github/callback",
      },
      function(accessToken: any, refreshToken: any, profile: any, done: any) {
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

  // Serve static files from public directory
  app.use(express.static(path.resolve(process.cwd(), "public")));

  // Mock Tina GraphQL API for local development
  app.all('/api/tina/gql', (req, res) => {
    // For now, just return a success response
    res.json({ data: { node: null } });
  });

  // Handle SPA routes by serving index.html
  app.get(["/admin", "/admin/*"], (req, res) => {
    res.sendFile(path.resolve(process.cwd(), "public/admin/index.html"));
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