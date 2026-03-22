import { CSS, render } from "jsr:@deno/gfm@^0.11.0";
import { getHeaderPages, getVersion } from "./utils.ts";
import {
  defaultLocale,
  locales,
  ogImageHeight,
  ogImageWidth,
  twitterSite,
} from "./site_config.ts";
import { renderStatic } from "./render_static.ts";

/**
 * Global cache for rendered markdown content.
 */
const RENDER_CACHE = new Map<string, string>();

// Add support for syntax highlighting
import "npm:prismjs@1.29.0/components/prism-typescript.js";
import "npm:prismjs@1.29.0/components/prism-bash.js";
import "npm:prismjs@1.29.0/components/prism-json.js";
import "npm:prismjs@1.29.0/components/prism-jsx.js";
import "npm:prismjs@1.29.0/components/prism-tsx.js";
import "npm:prismjs@1.29.0/components/prism-javascript.js";

/**
 * Renders markdown content to HTML with support for frontmatter, GFM, and math.
 *
 * @param content The raw markdown content.
 * @param path The path or identifier for the content.
 * @param kv Optional Deno KV instance.
 * @param canonical Optional canonical URL for the page.
 * @returns A promise that resolves to a Response.
 */
export async function renderMD_Content(
  content: string,
  path: string,
  kv?: Deno.Kv,
  canonical?: string,
  headExtras?: string,
  customCacheKey?: string,
) {
  const cacheKeySuffix = customCacheKey ||
    `${path}:${canonical || ""}:${headExtras || ""}`;
  const cached = RENDER_CACHE.get(cacheKeySuffix);
  if (cached) {
    return new Response(cached, {
      headers: {
        "content-type": "text/html",
        "cache-control": "no-cache, no-store, must-revalidate",
        "pragma": "no-cache",
        "expires": "0",
      },
    });
  }

  let finalContent = content;

  // Insert latest blog posts if requested placeholder exists
  if (finalContent.includes("{{LATEST_BLOG_POSTS}}")) {
    const postsHtml = await getLatestPostsHtml();
    finalContent = finalContent.replace("{{LATEST_BLOG_POSTS}}", postsHtml);
  }

  const version = await getVersion();
  const headerPages = await getHeaderPages(kv);
  const navItems = headerPages.map((p) => {
    const label = p.split(".")[0].charAt(0).toUpperCase() +
      p.split(".")[0].slice(1).toLowerCase();
    const href = `/${p}`;
    const isCurrent = path === p || path === `pages/${p}`;
    return `<a href="${href}" class="nav-link py-1 md:py-0 ${
      isCurrent ? "current-page" : ""
    }">${label}</a>`;
  }).join("\n          ");

  // Add Blog link if it exists in the system
  const blogLink = `<a href="/blog" class="nav-link py-1 md:py-0 ${
    path === "blog" ? "current-page" : ""
  }">Blog</a>`;

  const finalNav = navItems + (navItems ? "\n          " : "") + blogLink;

  let markdown = finalContent;
  let title = "";
  let description = "High-performance, minimalist web framework for Deno.";
  let date = "";
  let author = "";
  let draft = false;
  let noindex = false;
  let tags: string[] = [];
  let image =
    "https://repository-images.githubusercontent.com/264308713/1b83bd0f-b9d9-466d-9e63-f947c1a67281";
  let breadcrumbFromFrontmatter: string[] | undefined;

  // 1. Process Frontmatter
  if (markdown.startsWith("---")) {
    const endIdx = markdown.indexOf("---", 3);
    if (endIdx !== -1) {
      const frontmatter = markdown.slice(3, endIdx);
      markdown = markdown.slice(endIdx + 3).trim();

      const titleMatch = frontmatter.match(/title:\s*["']?(.*?)["']?$/m);
      if (titleMatch) title = titleMatch[1].trim();

      const descMatch = frontmatter.match(/description:\s*["']?(.*?)["']?$/m);
      if (descMatch) description = descMatch[1].trim();

      const dateMatch = frontmatter.match(/date:\s*(.*?)$/m);
      if (dateMatch) date = dateMatch[1].trim();

      const authorMatch = frontmatter.match(/author:\s*["']?(.*?)["']?$/m);
      if (authorMatch) author = authorMatch[1].trim();

      const tagsMatch = frontmatter.match(/tags:\s*\[?(.*?)\]?$/m);
      if (tagsMatch) {
        tags = tagsMatch[1].split(",").map((t) => t.trim().replace(/['"]/g, ""))
          .filter(Boolean);
      }

      const imageMatch = frontmatter.match(/image:\s*["']?(.*?)["']?$/m);
      if (imageMatch) image = imageMatch[1].trim();
      const breadcrumbArrayMatch = frontmatter.match(
        /breadcrumb:\s*\[(.*?)\]/m,
      );
      if (breadcrumbArrayMatch) {
        breadcrumbFromFrontmatter = breadcrumbArrayMatch[1]
          .split(",")
          .map((s) => s.trim().replace(/['"]/g, ""))
          .filter(Boolean);
      } else {
        const breadcrumbStrMatch = frontmatter.match(
          /breadcrumb:\s*["']?(.*?)["']?$/m,
        );
        if (breadcrumbStrMatch) {
          // allow delimiting with '>' or '/'
          breadcrumbFromFrontmatter = breadcrumbStrMatch[1]
            .split(/>|\//)
            .map((s) => s.trim())
            .filter(Boolean);
        }
      }
      const noindexMatch = frontmatter.match(/noindex:\s*(true|false)/i);
      if (noindexMatch) {
        noindex = noindexMatch[1].toString().toLowerCase() === "true";
      }
      const draftMatch = frontmatter.match(/draft:\s*(true|false)/i);
      if (draftMatch) draft = draftMatch[1].toString().toLowerCase() === "true";
    }
  }

  // 2. Extract Title from H1 if not in frontmatter and remove it from markdown
  const h1Match = markdown.match(/^#\s+(.*)/m);
  if (h1Match) {
    if (!title) title = h1Match[1].trim();
    // Remove the H1 line to avoid duplication in the body
    markdown = markdown.replace(/^#\s+.*\r?\n?/, "").trim();
  }

  // 3. Render Body
  const isMD = path.endsWith(".md") || path === "blog";
  const isBlogPost = path.startsWith("posts/");

  let htmlBody = "";
  if (isMD) {
    const mathBlocks: string[] = [];
    const codeBlocks: string[] = [];
    let mathCounter = 0;
    let codeCounter = 0;

    // A. Protect all code snippets (inline and block) from math regex
    let md = markdown.replace(/(`{1,}[\s\S]*?`{1,})/g, (match) => {
      codeBlocks.push(match);
      return `CODEBLOCKPLACEHOLDER${codeCounter++}X`;
    });

    // B. Protect math blocks from GFM mangling
    md = md.replace(/(\$\$[\s\S]*?\$\$|\$[^\$\s][^\$\n]*?\$)/g, (match) => {
      mathBlocks.push(match);
      return `MATHBLOCKPLACEHOLDER${mathCounter++}X`;
    });

    // C. Restore code blocks
    md = md.replace(
      /CODEBLOCKPLACEHOLDER(\d+)X/g,
      (_, id) => codeBlocks[parseInt(id)],
    );

    // D. Render Markdown
    htmlBody = path === "blog"
      ? md
      : render(md, { allowMath: false, disableHtmlSanitization: true });

    // E. Restore original math blocks
    htmlBody = htmlBody.replace(
      /MATHBLOCKPLACEHOLDER(\d+)X/g,
      (_, id) => mathBlocks[parseInt(id)],
    );
  } else {
    htmlBody = render(markdown, {
      allowMath: false,
      disableHtmlSanitization: true,
    });
  }

  const body = htmlBody;
  const docTitle = title || `Fastro - ${path}`;

  // JSON-LD Article for blog posts
  let jsonLd = "";
  if (isBlogPost) {
    try {
      const ld: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: docTitle,
        description: description,
      };
      if (image) ld.image = [image];
      if (author) ld.author = { "@type": "Person", name: author };
      if (date) {
        const dt = new Date(date);
        if (!Number.isNaN(dt.getTime())) ld.datePublished = dt.toISOString();
      }
      if (canonical) ld.mainEntityOfPage = canonical;
      jsonLd = `<script type=\"application/ld+json\">${
        JSON.stringify(ld)
      }</script>`;
    } catch {
      jsonLd = "";
    }
  }

  // BreadcrumbList JSON-LD (frontmatter overrides automatic URL-derived breadcrumbs)
  let breadcrumbLd = "";
  try {
    const makeNice = (s: string) =>
      s.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const crumbs = breadcrumbFromFrontmatter ?? (() => {
      const p = path.replace(/(?:\.md|\.html)$/, "");
      const parts = p.split("/").filter(Boolean);
      // if root or single page like blog, skip automatic breadcrumbs
      if (parts.length === 0) return [] as string[];
      return parts.map((seg) => makeNice(seg));
    })();

    if (crumbs && crumbs.length > 0) {
      const list: Array<Record<string, unknown>> = [];
      let position = 1;
      const base = canonical ? canonical.replace(/\/$/, "") : "";
      // ensure Home is first unless frontmatter already contains it
      const firstCrumb = crumbs[0] || "";
      if (firstCrumb.toLowerCase() !== "home") {
        list.push({
          "@type": "ListItem",
          position: position++,
          name: "Home",
          item: base ? `${base}/` : "/",
        });
      }

      let acc = "";
      for (const c of crumbs) {
        acc += `/${c.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
        const itemUrl = base ? `${base}${acc}` : acc;
        list.push({
          "@type": "ListItem",
          position: position++,
          name: c,
          item: itemUrl,
        });
      }

      const bl = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: list,
      };
      breadcrumbLd = `<script type=\"application/ld+json\">${
        JSON.stringify(bl)
      }</script>`;
    }
  } catch {
    breadcrumbLd = "";
  }

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${docTitle}</title>
    <meta name="description" content="${description}">
    ${canonical ? `<link rel="canonical" href="${canonical}">` : ""}
    ${
    locales && locales.length > 0
      ? (() => {
        // determine path portion for this resource
        let urlPath = "/";
        try {
          if (canonical) {
            const u = new URL(canonical);
            urlPath = u.pathname.replace(/\/$/, "") || "/";
          } else if (path === "README.md") {
            urlPath = "/";
          } else {
            urlPath = "/" + path.replace(/\.(md|html)$/, "");
          }
        } catch {
          urlPath = "/" + path.replace(/\.(md|html)$/, "");
        }
        const links = locales.map((l) => {
          const href = `${l.url.replace(/\/$/, "")}${urlPath}`;
          return `<link rel="alternate" hreflang="${l.lang}" href="${href}">`;
        }).join("\n    ");
        const defaultUrl =
          (locales.find((l) => l.lang === defaultLocale) || locales[0]).url
            .replace(/\/$/, "");
        return `${links}\n    <link rel="alternate" hreflang="x-default" href="${defaultUrl}${urlPath}">`;
      })()
      : ""
  }
    ${(draft || noindex) ? `<meta name="robots" content="noindex">` : ""}
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="${docTitle}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${image}">
    <meta property="og:image:width" content="${ogImageWidth}">
    <meta property="og:image:height" content="${ogImageHeight}">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:title" content="${docTitle}">
    <meta property="twitter:description" content="${description}">
    <meta property="twitter:image" content="${image}">
    ${twitterSite ? `<meta name="twitter:site" content="${twitterSite}">` : ""}

    ${jsonLd}
    ${breadcrumbLd}

    ${
    isMD
      ? `
    ${headExtras ?? ""}
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"
      onload="
        const mdBody = document.querySelector('.markdown-body');
        if (mdBody) {
          renderMathInElement(mdBody, {
            delimiters: [
              {left: '$$', right: '$$', display: true},
              {left: '$', right: '$', display: false},
            ],
            ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
            ignoredClasses: ['katex-ignore', 'prism-code', 'language-typescript', 'language-bash', 'language-json', 'language-javascript', 'language-js', 'token'],
            throwOnError : false
          });
          mdBody.querySelectorAll('pre > code.language-math').forEach(el => {
            const math = el.textContent;
            const div = document.createElement('div');
            div.className = 'my-6 overflow-x-auto';
            katex.render(math, div, { displayMode: true, throwOnError: false });
            el.parentElement.replaceWith(div);
          });
        }
      "></script>`
      : ""
  }
    <link rel="stylesheet" href="/css/app.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
      :root {
        --color-canvas-default: #000000;
        --color-canvas-subtle: #0a0a0d;
        --color-canvas-inset: #050507;
        --color-fg-default: #f5f5f7;
        --color-fg-muted: #86868b;
        --color-fg-subtle: #6e6e73;
        --color-border-default: #1c1c1e;
        --color-border-subtle: #161618;
        --color-accent-fg: #0071e3;
        --color-accent-emphasis: #007aff;
        --color-success-fg: #34c759;
        --color-danger-fg: #ff3b30;
        --header-height: 64px;
        --radius-medium: 12px;
        --radius-large: 18px;
        --blur-amount: 20px;
      }

      ${CSS}
      .hidden { 
        display: none !important; 
      }

      /* Menu Toggle (Hamburger to X) */
      #menu-toggle span {
        display: block;
        width: 1.5rem;
        height: 2px;
        background: var(--color-fg-default);
        border-radius: 99px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        transform-origin: center;
      }

      #menu-toggle.open span:nth-child(1) {
        transform: translateY(7px) rotate(45deg);
      }

      #menu-toggle.open span:nth-child(2) {
        opacity: 0;
        transform: translateX(-10px);
      }

      #menu-toggle.open span:nth-child(3) {
        transform: translateY(-7px) rotate(-45deg);
      }

      /* Unified alignment container */
      .site-container {
        max-width: 780px;
        margin-left: auto;
        margin-right: auto;
        padding-left: 1.25rem;
        padding-right: 1.25rem;
        width: 100%;
        box-sizing: border-box;
      }

      @media (min-width: 768px) {
        .site-container {
          padding-left: 2.5rem;
          padding-right: 2.5rem;
        }
      }

      /* Global resets for native look */
      body {
        margin: 0;
        padding: 0;
        background-color: var(--color-canvas-default);
        color: var(--color-fg-default);
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
        font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        overflow-x: hidden;
        font-size: 1.15rem;
        line-height: 1.65;
        letter-spacing: -0.005em;
      }

      /* Native scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: rgba(120, 120, 130, 0.3);
        border: 2px solid var(--color-canvas-default);
        border-radius: 10px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(120, 120, 130, 0.5);
      }

      /* Premium Typography */
      .brand-logo {
        letter-spacing: -0.04em !important;
        font-weight: 800 !important;
        font-size: 1.45rem !important;
      }

      .nav-link {
        font-family: 'Inter', system-ui, sans-serif;
        font-weight: 500;
        font-size: 1rem;
        text-decoration: none;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        color: var(--color-fg-muted);
        position: relative;
      }

      .nav-link:hover {
        color: var(--color-fg-default);
      }

      .nav-link::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 0;
        width: 100%;
        height: 2px;
        background: var(--color-accent-emphasis);
        border-radius: 2px;
        opacity: 0;
        transform: scaleX(0.7);
        transition: all 0.2s ease;
      }

      .nav-link:hover::after {
        opacity: 1;
        transform: scaleX(1);
      }

      .nav-link.current-page::after {
        opacity: 0.8;
        transform: scaleX(1);
      }

      /* Glassmorphism Header */
      header {
        background-color: rgba(0, 0, 0, 0.75) !important;
        backdrop-filter: saturate(180%) blur(var(--blur-amount)) !important;
        -webkit-backdrop-filter: saturate(180%) blur(var(--blur-amount)) !important;
        border-bottom: 0.5px solid rgba(255, 255, 255, 0.1) !important;
      }

      /* Native Cards */
      .markdown-body pre, 
      .blog-post-content .rounded-xl,
      .native-card {
        background-color: var(--color-canvas-subtle) !important;
        border: 0.5px solid rgba(255, 255, 255, 0.08) !important;
        border-radius: var(--radius-large) !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
      }

      .native-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.3);
        border-color: rgba(255, 255, 255, 0.15) !important;
      }

      /* Markdown custom styling for Dark Native look */
      .markdown-body {
        background: transparent !important;
        color: var(--color-fg-default) !important;
        padding: 0 !important;
        margin: 0 !important;
        max-width: none !important;
      }

      .markdown-body h1, 
      .markdown-body h2,
      .markdown-body h3,
      .markdown-body h4 {
        margin-left: 0 !important;
        margin-right: 0 !important;
        margin-top: 2rem !important;
        margin-bottom: 1rem !important;
        padding-left: 0 !important;
        border-bottom: none !important;
        padding-bottom: 0 !important;
        letter-spacing: -0.02em !important;
        line-height: 1.25 !important;
      }

      .markdown-body h1 { font-size: 2.1rem !important; font-weight: 800 !important; margin-bottom: 1.5rem !important; }
      .markdown-body h2 { font-size: 1.75rem !important; font-weight: 700 !important; margin-top: 2.5rem !important; }
      .markdown-body h3 { font-size: 1.45rem !important; font-weight: 600 !important; }
      .markdown-body h4 { font-size: 1.2rem !important; font-weight: 600 !important; margin-top: 0 !important; margin-bottom: 0.5rem !important; }

      @media (min-width: 768px) {
        .markdown-body h1 { font-size: 3.25rem !important; }
        .markdown-body h2 { font-size: 2.25rem !important; }
        .markdown-body h3 { font-size: 1.75rem !important; }
        .markdown-body h4 { font-size: 1.35rem !important; }
      }
      .markdown-body a {
        color: var(--color-fg-default) !important;
        text-decoration: underline;
        text-decoration-color: rgba(255, 255, 255, 0.2);
        text-underline-offset: 4px;
        text-decoration-thickness: 1px;
        transition: all 0.2s ease;
      }

      .markdown-body a:hover {
        text-decoration: none;
        opacity: 0.8;
      }

      .markdown-body code {
        background-color: rgba(255, 255, 255, 0.1) !important;
        border-radius: 4px;
        color: #ff7b72 !important; /* GitHub-style red for keywords */
      }

      .markdown-body blockquote {
        border-left: 4px solid var(--color-accent-emphasis) !important;
        color: var(--color-fg-muted) !important;
        background: rgba(255, 255, 255, 0.03);
        padding: 1rem 1.5rem;
        border-radius: 0 8px 8px 0;
      }

      /* Smooth imagery */
      img {
        border-radius: var(--radius-medium);
        transition: opacity 0.8s ease-in-out, transform 0.8s ease;
      }

      img.loaded {
        opacity: 1;
      }

      /* CTA Buttons */
      .cta-button {
        background: var(--color-accent-emphasis);
        color: white !important;
        padding: 10px 24px;
        border-radius: 24px;
        font-weight: 600;
        text-decoration: none !important;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
        box-shadow: 0 4px 14px rgba(0, 113, 227, 0.39);
      }

      .cta-button:hover {
        transform: translateY(-1px) scale(1.02);
        box-shadow: 0 6px 20px rgba(0, 113, 227, 0.45);
        opacity: 0.95;
      }

      .cta-button:active {
        transform: translateY(0.5px) scale(0.98);
      }

      /* Dashboard button secondary style */
      .dashboard-link {
        background: rgba(255, 255, 255, 0.08);
        border: 0.5px solid rgba(255, 255, 255, 0.1);
        color: var(--color-fg-default) !important;
        backdrop-filter: blur(8px);
      }
    </style>
  </head>
  <body data-color-mode="dark" data-light-theme="dark" data-dark-theme="dark" class="flex flex-col min-h-screen">
    <header class="border-b border-white/5 bg-black/60 sticky top-0 z-100 backdrop-blur-3xl">
      <div class="site-container py-3 md:py-5 flex flex-col md:flex-row md:justify-between md:items-center">
        <div class="flex justify-between items-center w-full md:w-auto">
          <div class="flex items-center gap-x-4">
            <a href="/" class="brand-logo text-fg-default no-underline hover:no-underline flex items-center gap-2 font-bold" style="font-size: 1.3rem;">
              
              FASTRO
            </a>
            <span class="brand-version text-[0.65rem] px-2.5 py-0.5 rounded-full bg-white/10 text-white font-semibold tracking-wide border border-white/10" style="backdrop-filter: blur(10px);">${version}</span>
          </div>
          <button id="menu-toggle" aria-label="Toggle Menu" class="flex flex-col justify-between w-6 h-4 bg-transparent border-none cursor-pointer p-0 md:hidden relative z-110">
            <span class="transition-all"></span>
            <span class="transition-all"></span>
            <span class="transition-all"></span>
          </button>
        </div>
        <nav id="nav-links" class="flex-col md:flex-row md:flex w-full md:w-auto gap-6 md:gap-10 items-start md:items-center overflow-hidden transition-all duration-300 md:mt-0">
          ${finalNav}
        </nav>
      </div>
    </header>
    <main class="site-container pt-6 md:pt-10 pb-8 flex-1">
        <div class="markdown-body blog-post-content" data-color-mode="dark" data-light-theme="dark" data-dark-theme="dark">${
    title
      ? `<h1 class="${
        isBlogPost
          ? "text-[2.1rem] md:text-[3.25rem] font-extrabold tracking-tight mb-8 leading-[1.15]"
          : `text-[2.1rem] md:text-[3.25rem] font-extrabold tracking-tight text-fg-default flex items-center ${
            path === "blog" ? "justify-between" : ""
          } gap-4 mb-10 leading-[1.15]`
      }">${title}${
        path === "blog"
          ? `<a href="/signin" class="dashboard-link text-[0.7rem] md:text-xs px-4 py-2 rounded-full border hover:brightness-110 transition-all no-underline! whitespace-nowrap uppercase tracking-widest">DASHBOARD</a>`
          : ""
      }</h1>`
      : ""
  }${
    (date || author || (tags && tags.length > 0)) && path !== "blog"
      ? `<div class="post-meta ${
        isBlogPost
          ? "mb-10 opacity-100 font-sans text-sm md:text-[0.9rem] flex flex-wrap items-center gap-y-3 pb-5 md:pb-3 border-b border-border-subtle"
          : "mb-4 pb-4 border-b border-border-subtle flex flex-wrap items-center gap-2"
      }">
          <div class="flex items-center gap-x-2 gap-y-1 flex-wrap">
            ${
        author
          ? `<span class="font-semibold text-fg-default whitespace-nowrap">${author}</span>`
          : ""
      }
            ${
        date
          ? `<span class="text-fg-default/80 whitespace-nowrap">${date}</span>`
          : ""
      }
          </div>
          ${
        tags && tags.length > 0
          ? `<div class="flex flex-wrap gap-2 ml-auto">
                ${
            tags.slice(0, 3).map((tag) =>
              `<a href="/blog?search=${
                encodeURIComponent(tag)
              }" class="text-[0.65rem] md:text-[0.7rem] px-2.5 py-1 rounded-full bg-canvas-subtle border border-border-default text-fg-default! uppercase tracking-wider hover:bg-canvas-default transition-colors no-underline!" style="font-family: 'Roboto', sans-serif; font-weight: 300;">${tag}</a>`
            ).join("")
          }
              </div>`
          : ""
      }
        </div>`
      : ""
  }${body}</div>
    </main>
    <footer class="border-t border-white/5 bg-black/40 backdrop-blur-3xl">
      <div class="site-container py-8 text-[0.85rem] text-fg-muted">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4 transition-opacity hover:opacity-100">
          <div class="flex items-center gap-x-2">
            <span class="whitespace-normal md:whitespace-nowrap">Built with <a href="https://github.com/fastrodev/fastro" class="text-fg-default hover:underline decoration-white/30 underline-offset-4 transition-all font-semibold">Fastro Framework</a></span>
          </div>
          <div class="flex items-center gap-4 font-medium text-[0.85rem]">
            <a href="https://github.com/sponsors/fastrodev" target="_blank" class="text-fg-muted hover:text-fg-default hover:underline decoration-white/30 underline-offset-4 transition-all">Support Development</a>
            <span class="hidden md:inline text-white/10">|</span>
            <span class="whitespace-nowrap">MIT License</span>       
          </div>
        </div>
        <div class="mt-8 pt-8 border-t border-white/5 mx-auto text-center text-xs opacity-60">
          &copy; ${new Date().getFullYear()} Fastro. All rights reserved.
        </div>
      </div>
    </footer>
    
    <script>
      const menuToggle = document.getElementById('menu-toggle');
      const navLinks = document.getElementById('nav-links');
      const currentPath = "${path === "README.md" ? "/" : "/" + path}";
      
      // Set active link
      document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
          link.classList.add('current-page');
        }
      });

      menuToggle.addEventListener('click', () => {
        const isActive = navLinks.classList.contains('active');
        if (isActive) {
          navLinks.classList.remove('active');
          setTimeout(() => {
            if (!navLinks.classList.contains('active')) {
              navLinks.classList.add('hidden');
            }
          }, 300);
        } else {
          navLinks.classList.remove('hidden');
          navLinks.style.marginTop = '1.25rem';
          setTimeout(() => {
            navLinks.classList.add('active');
          }, 10);
        }
        menuToggle.classList.toggle('open');
      });

      // Handle smooth image loading
      const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
      };

      const handleImage = (img) => {
        if (img.complete) {
          img.classList.add('loaded');
        } else {
          img.addEventListener('load', () => {
            img.classList.add('loaded');
          }, { once: true });
        }
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            handleImage(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      document.querySelectorAll('.markdown-body img, .blog-post-content img').forEach(img => {
        observer.observe(img);
        // Fallback for images already in view or cached
        if (img.complete) handleImage(img);
      });
    </script>
    ${
    isMD
      ? `
    <button id="scroll-to-top" 
      class="fixed bottom-6 right-6 p-3 rounded-full bg-white text-black shadow-2xl opacity-0 translate-y-10 pointer-events-none transition-all duration-300 z-110 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-xl border border-white/10"
      aria-label="Back to top">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
    <script>
      (function() {
        const scrollBtn = document.getElementById('scroll-to-top');
        if (scrollBtn) {
          window.addEventListener('scroll', () => {
            const isNearBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 150;
            if (window.scrollY > 400 || isNearBottom) {
              scrollBtn.classList.remove('opacity-0', 'translate-y-10', 'pointer-events-none');
              scrollBtn.classList.add('opacity-100', 'translate-y-0');
            } else {
              scrollBtn.classList.add('opacity-0', 'translate-y-10', 'pointer-events-none');
              scrollBtn.classList.remove('opacity-100', 'translate-y-0');
            }
          });
          scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          });
        }
      })();
    </script>`
      : ""
  }
  </body>
</html>`;

  const finalCacheKey = customCacheKey ||
    `${path}:${canonical || ""}:${headExtras || ""}`;
  RENDER_CACHE.set(finalCacheKey, html);

  return new Response(html, {
    headers: {
      "content-type": "text/html",
      "cache-control": "no-cache, no-store, must-revalidate",
      "pragma": "no-cache",
      "expires": "0",
    },
  });
}

/**
 * Retrieves the HTML string for the latest blog posts.
 * It shows 2 posts on mobile and 3 posts on desktop.
 */
async function getLatestPostsHtml(): Promise<string> {
  const postsDir = new URL("../../posts/", import.meta.url);
  const posts: {
    title: string;
    date: string;
    image: string;
    link: string;
  }[] = [];

  try {
    for await (const entry of Deno.readDir(postsDir)) {
      if (entry.isFile && entry.name.endsWith(".md")) {
        const name = entry.name;
        const postUrl = new URL(`../../posts/${name}`, import.meta.url);
        const content = await Deno.readTextFile(postUrl);
        let title = name.replace(".md", "").replace(/-/g, " ");
        let date = "";
        let image = "";

        if (content.startsWith("---")) {
          const endIdx = content.indexOf("---", 3);
          if (endIdx !== -1) {
            const frontmatter = content.slice(3, endIdx);
            const titleMatch = frontmatter.match(/title:\s*["']?(.*?)["']?$/m);
            if (titleMatch) title = titleMatch[1].trim();
            const dateMatch = frontmatter.match(/date:\s*(.*?)$/m);
            if (dateMatch) date = dateMatch[1].trim();
            const imageMatch = frontmatter.match(/image:\s*["']?(.*?)["']?$/m);
            if (imageMatch) image = imageMatch[1].trim();
          }
        }

        posts.push({
          title,
          date,
          image,
          link: `/posts/${name.replace(".md", "")}`,
        });
      }
    }
  } catch (_err) {
    return "";
  }

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const topPosts = posts.slice(0, 6);

  let html = `<div class="mt-8 mb-16 border-t border-white/5 pt-10">\n`;
  html +=
    `<div class="text-[1.5rem] md:text-[2.1rem] font-bold mb-8 tracking-tighter text-fg-default">Latest from Blog</div>\n`;
  html +=
    `<div class="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">\n`;

  const defaultImages = [
    "https://storage.googleapis.com/replix-394315-file/uploads/start.jpg",
    "https://storage.googleapis.com/replix-394315-file/uploads/resources.jpg",
    "https://storage.googleapis.com/replix-394315-file/uploads/middleware.jpg",
    "https://storage.googleapis.com/replix-394315-file/uploads/showcase.jpg",
  ];

  for (let i = 0; i < topPosts.length; i++) {
    const post = topPosts[i];
    const imgUrl = post.image || defaultImages[i % defaultImages.length];

    html +=
      `<a href="${post.link}" class="native-card group flex flex-col h-full no-underline! overflow-hidden p-3.5" style="text-decoration: none;">
<div class="aspect-video w-full overflow-hidden rounded-xl bg-canvas-inset mb-4">
<img src="${imgUrl}" alt="${post.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out">
</div>
<div class="flex-1 flex flex-col justify-between px-1.5 pb-1">
<div class="text-[1.1rem] md:text-[1.15rem] font-bold text-fg-default line-clamp-2 leading-[1.35] tracking-tight">${post.title}</div>
</div>
</a>\n`;
  }

  html += `</div>\n</div>`;
  return html;
}

/**
 * Renders a markdown file from the repository to HTML.
 *
 * @param path The relative path to the markdown file.
 * @param kv Optional Deno KV instance.
 * @param canonical Optional canonical URL for the page.
 * @returns A promise that resolves to a Response.
 */
export async function renderMD(
  path: string,
  kv?: Deno.Kv,
  canonical?: string,
) {
  try {
    const url = new URL(`../../${path}`, import.meta.url);
    const content = await Deno.readTextFile(url);
    return renderMD_Content(content, path, kv, canonical);
  } catch (_) {
    return renderStatic("public/index.html");
  }
}
