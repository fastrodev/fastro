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
import { defaultLocale, locales, twitterSite } from "./site_config.ts";

type PostMeta = {
  slug: string;
  title?: string;
  date?: string;
  description?: string;
  url: string;
  image?: string;
  content_html?: string;
  draft?: boolean;
  noindex?: boolean;
};

function normalizeDate(d?: string) {
  if (!d) return undefined;
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return undefined;
  return dt.toISOString();
}

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
      const date = normalizeDate(fm.date);
      const image = fm.image || undefined;
      const content_html = description ? `<p>${description}</p>` : undefined;
      const draft = (fm.draft || "").toString().toLowerCase() === "true";
      const noindex = (fm.noindex || "").toString().toLowerCase() === "true";
      const url = `${baseUrl.replace(/\/$/, "")}/posts/${slug}`;
      // Exclude drafts and explicitly noindexed posts from feeds/sitemap
      if (!draft && !noindex) {
        posts.push({
          slug,
          title: fm.title || slug,
          date,
          description,
          url,
          image,
          content_html,
          draft,
          noindex,
        });
      }
    }
  } catch {
    // ignore
  }
  return posts;
}

async function collectPages(
  pagesDir = "pages",
  baseUrl = "",
): Promise<PostMeta[]> {
  const pages: PostMeta[] = [];
  try {
    for await (const entry of Deno.readDir(pagesDir)) {
      if (!entry.isFile) continue;
      if (!entry.name.endsWith(".md") && !entry.name.endsWith(".html")) {
        continue;
      }
      const slug = entry.name.replace(/\.(md|html)$/, "");
      // Skip problematic or internal pages if any
      const url = `${baseUrl.replace(/\/$/, "")}/${slug}`;
      pages.push({ slug, url });
    }
  } catch {
    // ignore
  }
  return pages;
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

async function writeFile(path: string, content: string) {
  await Deno.mkdir(join(path, ".."), { recursive: true }).catch(() => {});
  await Deno.writeTextFile(path, content);
}

export async function generateSitemap(
  baseUrl: string,
  outPath = "public/sitemap.xml",
) {
  const posts = await collectPosts("posts", baseUrl);
  const pages = await collectPages("pages", baseUrl);

  // Sort posts by date DESC
  posts.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (a.date) return -1;
    if (b.date) return 1;
    return 0;
  });

  const base = baseUrl.replace(/\/$/, "");
  const homepage = { loc: base + "/", lastmod: undefined };
  const blogIndex = { loc: base + "/blog", lastmod: posts[0]?.date };
  // Add paginated blog index entries (page 2..N)
  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(posts.length / pageSize));
  const blogPages = [] as { loc: string; lastmod?: string }[];
  for (let i = 2; i <= totalPages; i++) {
    const idx = (i - 1) * pageSize;
    blogPages.push({
      loc: `${base}/blog?page=${i}`,
      lastmod: posts[idx]?.date,
    });
  }
  const pageUrls = pages.map((p) => ({ loc: p.url, lastmod: undefined }));
  const postUrls = posts.map((p) => ({
    loc: p.url,
    lastmod: p.date,
    image: p.image,
  }));

  const all = [homepage, blogIndex, ...blogPages, ...pageUrls, ...postUrls];

  const hasLocales = locales && locales.length > 0;
  const items = all.map((u) => {
    const lastmod = u.lastmod
      ? `\n    <lastmod>${new Date(u.lastmod).toISOString()}</lastmod>`
      : "";
    const entry = u as { image?: string };
    const imageTag = entry.image
      ? `\n    <image:image>\n      <image:loc>${entry.image}</image:loc>\n    </image:image>`
      : "";
    let alternateTags = "";
    if (hasLocales) {
      // derive relative path from absolute u.loc
      let relative = u.loc.replace(base, "");
      if (!relative.startsWith("/")) relative = "/" + relative;
      const links = locales.map((l) => {
        const href = `${l.url.replace(/\/$/, "")}${relative}`;
        return `\n    <xhtml:link rel="alternate" hreflang="${l.lang}" href="${href}" />`;
      }).join("");
      const defaultUrl = (locales.find((l) =>
        l.lang === defaultLocale
      ) || locales[0]).url.replace(/\/$/, "");
      const xdef =
        `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${defaultUrl}${relative}" />`;
      alternateTags = links + xdef;
    }
    return `  <url>\n    <loc>${u.loc}</loc>${lastmod}${alternateTags}${imageTag}\n  </url>`;
  }).join("\n");
  const xhtmlNs = hasLocales
    ? ' xmlns:xhtml="http://www.w3.org/1999/xhtml"'
    : "";
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${xhtmlNs} xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${items}\n</urlset>`;
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
  const feedUrl = `${baseUrl.replace(/\/$/, "")}/rss.xml`;
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n<channel>\n  <title>${
      escapeXml(siteTitle)
    }</title>\n  <link>${baseUrl}</link>\n  <description>${
      escapeXml(siteDesc)
    }</description>\n  <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />\n  <lastBuildDate>${lastBuildDate}</lastBuildDate>\n${items}\n</channel>\n</rss>`;
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
      content_html: p.content_html,
      image: p.image,
    })),
  };
  // attach feed-level author metadata when configured
  if (twitterSite) {
    // JSON Feed doesn't standardize a twitter field; include as an extension-friendly property
    (feed as Record<string, unknown>).author = {
      name: "Fastro",
      url: baseUrl,
      twitter: twitterSite,
    };
  }
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
