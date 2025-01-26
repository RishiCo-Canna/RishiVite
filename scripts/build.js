import { build } from "vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import fs from "fs/promises";
import matter from "gray-matter";
import { compile } from "@mdx-js/mdx";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function generateStaticContent() {
  // Build the main Vite app
  await build();

  // Build Tina Admin UI
  process.env.TINA_PUBLIC_IS_LOCAL = "true";
  await import("@tinacms/cli").then((cli) => cli.build());

  // Process MDX content
  const postsDir = resolve(__dirname, "../content/posts");
  const files = await fs.readdir(postsDir);
  
  const posts = await Promise.all(
    files.map(async (file) => {
      const content = await fs.readFile(resolve(postsDir, file), "utf-8");
      const { data, content: mdxContent } = matter(content);
      const compiledMdx = await compile(mdxContent);
      return {
        ...data,
        body: String(compiledMdx),
        _sys: { relativePath: file },
      };
    })
  );

  // Write processed content for static serving
  const staticDataDir = resolve(__dirname, "../dist/public/data");
  await fs.mkdir(staticDataDir, { recursive: true });
  await fs.writeFile(
    resolve(staticDataDir, "posts.json"),
    JSON.stringify(posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
  );
}

generateStaticContent().catch(console.error);
