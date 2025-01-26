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

  // Dynamic callback URL based on request
  app.use((req, _res, next) => {
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const baseUrl = `${protocol}://${host}`;

    // Configure GitHub strategy with dynamic callback URL
    passport.use(
      new GitHubStrategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID!,
          clientSecret: process.env.GITHUB_CLIENT_SECRET!,
          callbackURL: `${baseUrl}/auth/github/callback`,
        },
        function (accessToken, refreshToken, profile, done) {
          // For testing, we'll just pass the profile through
          return done(null, profile);
        }
      )
    );
    next();
  });

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  // Test authentication routes
  app.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));

  app.get(
    "/auth/github/callback",
    passport.authenticate("github", { failureRedirect: "/login" }),
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