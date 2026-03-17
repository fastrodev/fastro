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
) {
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
    <style>
      ${CSS}
      .nav-link {
        font-family: 'Roboto', sans-serif;
        font-weight: 300;
        text-decoration: none;
      }
    </style>
  </head>
  <body data-color-mode="auto" data-light-theme="light" data-dark-theme="dark">
    <header class="border-b border-border-subtle bg-canvas-default/70 sticky top-0 z-100 backdrop-blur-md">
      <div class="max-w-180 mx-auto flex flex-col md:flex-row md:justify-between md:items-center py-4 px-6 md:px-8">
        <div class="flex justify-between items-center w-full md:w-auto">
          <div class="flex items-center gap-x-2">
            <a href="/" class="brand-logo text-fg-default no-underline hover:no-underline" style="font-family: 'Roboto', sans-serif; font-weight: 300; font-size: 1.25rem;">FASTRO</a>
            <span class="brand-version text-[0.65rem] px-1.5 py-px rounded bg-fg-default text-canvas-default uppercase tracking-wider select-none" style="font-family: 'Roboto', sans-serif; font-weight: 300;">${version}</span>
          </div>
          <button id="menu-toggle" aria-label="Toggle Menu" class="flex flex-col justify-between w-6 h-5 bg-transparent border-none cursor-pointer p-0 md:hidden group">
            <span class="w-6 h-0.5 bg-fg-default rounded-full transition-all duration-300 origin-center"></span>
            <span class="w-6 h-0.5 bg-fg-default rounded-full transition-all duration-300"></span>
            <span class="w-6 h-0.5 bg-fg-default rounded-full transition-all duration-300 origin-center"></span>
          </button>
        </div>
        <nav id="nav-links" class="flex flex-col md:flex-row md:flex w-full md:w-auto gap-5 md:gap-7 items-start md:items-center overflow-hidden">
          ${finalNav}
        </nav>
      </div>
    </header>
    <main class="max-w-180 mx-auto px-6 pt-3 pb-6 md:pt-3 md:pb-6 md:px-8 flex-1 w-full box-border text-fg-default">
        <div class="markdown-body blog-post-content" data-color-mode="auto" data-light-theme="light" data-dark-theme="dark">${
    title
      ? `<h1 class="${
        isBlogPost
          ? "text-[1.75rem] md:text-[2rem] font-bold tracking-tight mb-4 border-b-0! pb-0!"
          : `text-[1.75rem] md:text-[2rem] font-bold tracking-tight text-fg-default flex items-center ${
            path === "blog" ? "justify-between" : ""
          } gap-3 mb-4 border-b-0!`
      }" style="font-family: 'Roboto Slab', serif;">${title}${
        path === "blog"
          ? `<a href="/signin" class="text-[0.7rem] md:text-xs px-3 py-1.5 rounded-xl border border-border-default hover:border-fg-muted/50 hover:bg-canvas-subtle transition-all no-underline! text-fg-default/70! hover:text-fg-default! uppercase tracking-wider" style="font-family: 'Roboto', sans-serif; font-weight: 300;">DASHBOARD</a>`
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
    <footer class="mt-auto border-t border-border-subtle">
      <div class="max-w-180 mx-auto px-6 md:px-8 py-6 text-[0.85rem] md:text-sm text-fg-muted">
        <div class="flex flex-row justify-between items-center opacity-60">
          <span class="flex items-center gap-x-2 whitespace-nowrap">
            <a href="https://github.com/fastrodev/fastro" target="_blank" class="text-fg-muted hover:text-fg-default transition-colors" aria-label="GitHub">
              <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path></svg>
            </a>
            <span>Built with <a href="https://github.com/fastrodev/fastro" class="font-medium hover:text-fg-default transition-colors">Fastro Framework</a> and maintained by <a href="https://github.com/sponsors/fastrodev" target="_blank" class="font-medium hover:text-fg-default transition-colors">Fastrodev</a></span>
          </span>  
          <span class="hidden md:block whitespace-nowrap">Released under MIT License</span>       
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
      class="fixed bottom-3 right-6 p-3 rounded-full bg-fg-default text-canvas-default shadow-lg opacity-0 translate-y-10 pointer-events-none transition-all duration-300 z-110 hover:scale-110 active:scale-95 cursor-pointer"
      aria-label="Back to top">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
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

  let html = `<div class="mt-8 mb-10">\n`;
  html +=
    `<h3 class="text-[1.75rem] md:text-[2rem] font-bold mb-6" style="font-family: 'Roboto Slab', serif;">Latest from Blog</h3>\n`;
  html +=
    `<div class="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 md:gap-x-8 md:gap-y-4">\n`;

  const defaultImages = [
    "https://storage.googleapis.com/replix-394315-file/uploads/start.jpg",
    "https://storage.googleapis.com/replix-394315-file/uploads/resources.jpg",
    "https://storage.googleapis.com/replix-394315-file/uploads/middleware.jpg",
    "https://storage.googleapis.com/replix-394315-file/uploads/showcase.jpg",
  ];

  for (let i = 0; i < topPosts.length; i++) {
    const post = topPosts[i];
    const displayClass = i >= 4 ? "hidden md:flex" : "flex";
    const imgUrl = post.image || defaultImages[i % defaultImages.length];

    html +=
      `<a href="${post.link}" class="group ${displayClass} flex-col no-underline! overflow-hidden border-none!" style="text-decoration: none; border-bottom: none !important;">
<div class="aspect-video w-full overflow-hidden rounded-xl bg-canvas-subtle mb-1.5">
<img src="${imgUrl}" alt="${post.title}" class="w-full h-full object-cover">
</div>
<div class="flex-1 flex flex-col">
<h4 class="text-[0.95rem] md:text-base font-bold text-fg-default mb-2 line-clamp-3 leading-tight tracking-tight group-hover:text-accent-fg transition-colors border-b-0!" style="font-family: 'Roboto', sans-serif; border-bottom: none !important; margin-top: 0; padding-bottom: 0;">${post.title}</h4>
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
