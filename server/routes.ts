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
  // Session middleware
  app.use(
    session({
      secret: "keyboard cat", // This is just for testing
      resave: false,
      saveUninitialized: false,
      store: new SessionStore({
        checkPeriod: 86400000 // prune expired entries every 24h
      }),
    })
  );

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Base URL middleware - must come before passport strategy setup
  app.use((req, res, next) => {
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    req.baseUrl = `${protocol}://${host}`;
    next();
  });

  // Configure GitHub strategy with dynamic callback URL
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        callbackURL: "/auth/github/callback",
        proxy: true
      },
      function (accessToken: any, refreshToken: any, profile: any, done: any) {
        // For testing, we'll just pass the profile through
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

  // Test authentication routes
  app.get("/auth/github", (req, res, next) => {
    const authOptions = {
      scope: ["user:email"],
      callbackURL: `${req.baseUrl}/auth/github/callback`
    };
    passport.authenticate("github", authOptions)(req, res, next);
  });

  app.get(
    "/auth/github/callback",
    (req, res, next) => {
      const authOptions = {
        failureRedirect: "/login",
        callbackURL: `${req.baseUrl}/auth/github/callback`
      };
      passport.authenticate("github", authOptions)(req, res, next);
    },
    function (req, res) {
      res.redirect("/auth/test");
    }
  );

  // Test verification endpoint
  app.get("/auth/test", (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ 
        authenticated: true, 
        user: req.user,
        message: "GitHub OAuth is working correctly!" 
      });
    } else {
      res.json({ 
        authenticated: false, 
        message: "Not authenticated" 
      });
    }
  });

  // Existing blog posts route
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
          const { data, content: mdContent } = matter(content);

          return {
            ...data,
            body: mdContent,
            _sys: {
              relativePath: file,
            },
          };
        })
      );
      res.json(posts.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to load posts" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}