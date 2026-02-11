/**
 * modules/index/seo.ts
 *
 * Simple SEO asset generator for Fastro:
 * - sitemap.xml
 * - rss.xml (RSS 2.0)
 * - feed.json (JSON Feed v1)
 *
 * Usage (local):
 *   deno run --allow-read --allow-write modules/index/seo.ts https://your-site.example
 */

import { join } from "https://deno.land/std@0.201.0/path/mod.ts";

type PostMeta = {
  slug: string;
  title?: string;
  date?: string;
  description?: string;
  url: string;
};

function parseFrontmatter(text: string) {
  const fmMatch = text.match(/^---\s*([\s\S]*?)\s*---/);
  if (!fmMatch) return {} as Record<string, string>;
  const fm = fmMatch[1];
  const out: Record<string, string> = {};
  for (const line of fm.split(/\r?\n/)) {
    const m = line.match(/^([a-zA-Z0-9_-]+):\s*(?:"([^"]*)"|'([^']*)'|(.*))$/);
    if (m) out[m[1]] = m[2] ?? m[3] ?? (m[4] ?? "");
  }
  return out;
}

async function collectPosts(
  postsDir = "posts",
  baseUrl = "",
): Promise<PostMeta[]> {
  const posts: PostMeta[] = [];
  try {
    for await (const entry of Deno.readDir(postsDir)) {
      if (!entry.isFile || !entry.name.endsWith(".md")) continue;
      const slug = entry.name.replace(/\.md$/, "");
      const path = join(postsDir, entry.name);
      const text = await Deno.readTextFile(path);
      const fm = parseFrontmatter(text);
      const description = fm.description || extractFirstParagraph(text) || "";
      const date = fm.date || guessDateFromFile(text) || undefined;
      const url = `${baseUrl.replace(/\/$/, "")}/blog/${slug}`;
      posts.push({ slug, title: fm.title || slug, date, description, url });
    }
  } catch {
    // directory may not exist; return empty list
  }
  // sort descending by date when available
  posts.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (a.date) return -1;
    if (b.date) return 1;
    return 0;
  });
  return posts;
}

function extractFirstParagraph(md: string) {
  const withoutFM = md.replace(/^---[\s\S]*?---\s*/, "");
  const parts = withoutFM.split(/\r?\n\r?\n/).map((s) => s.trim()).filter(
    Boolean,
  );
  if (parts.length === 0) return undefined;
  // strip markdown links/images for a clean description
  return parts[0].replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(
    /\[([^\]]+)\]\([^)]*\)/g,
    "$1",
  );
}

function guessDateFromFile(md: string) {
  const fm = md.match(/^---[\s\S]*?---/);
  if (!fm) return undefined;
  const m = fm[0].match(/date:\s*(?:"([^"]+)"|'([^']+)'|(.*))/);
  return m ? (m[1] ?? m[2] ?? m[3]).trim() : undefined;
}

async function writeFile(path: string, content: string) {
  await Deno.mkdir(join(path, ".."), { recursive: true }).catch(() => {});
  await Deno.writeTextFile(path, content);
}

export async function generateSitemap(
  baseUrl: string,
  outPath = "public/sitemap.xml",
) {
  const posts = await collectPosts("posts", baseUrl);
  const urls = [
    { loc: baseUrl.replace(/\/$/, "") + "/", lastmod: undefined },
    ...posts.map((p) => ({ loc: p.url, lastmod: p.date })),
  ];
  const items = urls.map((u) => {
    const lastmod = u.lastmod
      ? `<lastmod>${new Date(u.lastmod).toISOString()}</lastmod>`
      : "";
    return `  <url>\n    <loc>${u.loc}</loc>\n    ${lastmod}\n  </url>`;
  }).join("\n");
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>`;
  await writeFile(outPath, xml);
}

export async function generateRSS(baseUrl: string, outPath = "public/rss.xml") {
  const posts = await collectPosts("posts", baseUrl);
  const siteTitle = "Fastro";
  const siteDesc = "Fastro blog and docs";
  const lastBuildDate = posts[0]?.date
    ? new Date(posts[0].date).toUTCString()
    : new Date().toUTCString();
  const items = posts.map((p) => {
    const pubDate = p.date
      ? new Date(p.date).toUTCString()
      : new Date().toUTCString();
    const description = escapeXml(p.description ?? "");
    return `  <item>\n    <title>${
      escapeXml(p.title ?? p.slug)
    }</title>\n    <link>${p.url}</link>\n    <guid isPermaLink="true">${p.url}</guid>\n    <pubDate>${pubDate}</pubDate>\n    <description>${description}</description>\n  </item>`;
  }).join("\n");
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n<channel>\n  <title>${
      escapeXml(siteTitle)
    }</title>\n  <link>${baseUrl}</link>\n  <description>${
      escapeXml(siteDesc)
    }</description>\n  <lastBuildDate>${lastBuildDate}</lastBuildDate>\n${items}\n</channel>\n</rss>`;
  await writeFile(outPath, xml);
}

export async function generateJSONFeed(
  baseUrl: string,
  outPath = "public/feed.json",
) {
  const posts = await collectPosts("posts", baseUrl);
  const feed = {
    version: "https://jsonfeed.org/version/1",
    title: "Fastro",
    home_page_url: baseUrl,
    feed_url: `${baseUrl.replace(/\/$/, "")}/feed.json`,
    items: posts.map((p) => ({
      id: p.url,
      url: p.url,
      title: p.title,
      content_text: p.description,
      date_published: p.date,
    })),
  };
  await writeFile(outPath, JSON.stringify(feed, null, 2));
}

export async function generateRobots(
  baseUrl: string,
  outPath = "public/robots.txt",
) {
  const site = baseUrl.replace(/\/$/, "");
  const content =
    `# robots.txt for Fastro\nUser-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`;
  await writeFile(outPath, content);
}

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;").replace(/'/g, "&apos;");
}

export async function generateAll(baseUrl: string, outDir = "public") {
  await generateSitemap(baseUrl, `${outDir}/sitemap.xml`);
  await generateRSS(baseUrl, `${outDir}/rss.xml`);
  await generateJSONFeed(baseUrl, `${outDir}/feed.json`);
  await generateRobots(baseUrl, `${outDir}/robots.txt`);
}

if (import.meta.main) {
  const base = Deno.args[0] ?? "http://localhost:8000";
  console.log(`Generating SEO assets for ${base} ...`);
  await generateAll(base);
  console.log(
    "Generated sitemap.xml, rss.xml, feed.json, robots.txt in public/",
  );
}
