import { CSS, render } from "@deno/gfm";

// Add support for syntax highlighting
import "npm:prismjs@1.29.0/components/prism-typescript.js";
import "npm:prismjs@1.29.0/components/prism-bash.js";
import "npm:prismjs@1.29.0/components/prism-json.js";

// Fetch the latest version from local version.json
let cachedVersion: string | null = null;
async function getVersion() {
  if (cachedVersion) return cachedVersion;
  try {
    const url = new URL("../../version.json", import.meta.url);
    const content = await Deno.readTextFile(url);
    const { version } = JSON.parse(content);
    if (version) {
      cachedVersion = version;
      return cachedVersion;
    }
  } catch (_) {
    // Fallback in case of error
  }
  return "v1.0.0";
}

/**
 * Renders the content of a source code file with syntax highlighting.
 *
 * @param path The relative path to the source file.
 * @returns A promise that resolves to a rendered HTML string.
 */
export async function renderCode(path: string) {
  try {
    const url = new URL(`../../${path}`, import.meta.url);
    const content = await Deno.readTextFile(url);
    const md = `\`\`\`typescript\n// ${path}\n\n${content}\n\`\`\``;
    return renderMD_Content(md, path);
  } catch (_) {
    return renderStatic("public/index.html");
  }
}

/**
 * Renders markdown content to HTML with support for frontmatter, GFM, and math.
 *
 * @param content The raw markdown content.
 * @param path The path or identifier for the content.
 * @returns A promise that resolves to a rendered HTML string.
 */
export async function renderMD_Content(content: string, path: string) {
  const version = await getVersion();
  let markdown = content;
  let title = "";
  let description = "High-performance, minimalist web framework for Deno.";
  let date = "";
  let author = "";
  let tags: string[] = [];
  let image =
    "https://repository-images.githubusercontent.com/264308713/45a53a9a-141e-4204-8f0b-4867c05cbc0d";

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
    // We use a prefix that GFM/Markdown won't mangle with its own syntax
    let md = markdown.replace(/(`{1,}[\s\S]*?`{1,})/g, (match) => {
      codeBlocks.push(match);
      return `CODEBLOCKPLACEHOLDER${codeCounter++}X`;
    });

    // B. Protect math blocks from GFM mangling (no underscores or backslashes seen by GFM)
    md = md.replace(/(\$\$[\s\S]*?\$\$|\$[^\$\s][^\$\n]*?\$)/g, (match) => {
      mathBlocks.push(match);
      return `MATHBLOCKPLACEHOLDER${mathCounter++}X`;
    });

    // C. Restore code blocks so GFM can render them properly
    md = md.replace(
      /CODEBLOCKPLACEHOLDER(\d+)X/g,
      (_, id) => codeBlocks[parseInt(id)],
    );

    // D. Render Markdown - math is "dead text" placeholders now
    htmlBody = path === "blog" ? md : render(md, { allowMath: false });

    // E. Restore original math blocks into the final HTML for client-side KaTeX
    htmlBody = htmlBody.replace(
      /MATHBLOCKPLACEHOLDER(\d+)X/g,
      (_, id) => mathBlocks[parseInt(id)],
    );
  } else {
    htmlBody = path === "blog"
      ? markdown
      : render(markdown, { allowMath: false });
  }

  const body = htmlBody;

  // Fallback for document title
  const docTitle = title || `Fastro - ${path}`;

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${docTitle}</title>
    <meta name="description" content="${description}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="${docTitle}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${image}">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:title" content="${docTitle}">
    <meta property="twitter:description" content="${description}">
    <meta property="twitter:image" content="${image}">

    ${
    isMD
      ? `
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
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              canvas: {
                default: 'var(--color-canvas-default)',
                subtle: 'var(--color-canvas-subtle)',
              },
              fg: {
                default: 'var(--color-fg-default)',
                muted: 'var(--color-fg-muted)',
              },
              border: {
                default: 'var(--color-border-default)',
              },
              accent: {
                fg: 'var(--color-accent-fg)',
              }
            }
          }
        }
      }
    </script>

    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@800&display=swap');
      :root {
        --content-max-width: 720px;
      }
      body {
        margin: 0;
        background-color: var(--color-canvas-default);
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }
      header {
        position: sticky;
        top: 0;
        z-index: 100;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
      }
      /* Hamburger Animation */
      #menu-toggle.open span:nth-child(1) {
        transform: translateY(9px) rotate(45deg);
      }
      #menu-toggle.open span:nth-child(2) {
        opacity: 0;
      }
      #menu-toggle.open span:nth-child(3) {
        transform: translateY(-9px) rotate(-45deg);
      }
      /* Mobile Menu Transition */
      #nav-links {
        transition: all 0.3s ease-in-out;
        max-height: 0;
        overflow: hidden;
        opacity: 0;
        display: flex;
        flex-direction: column;
      }
      #nav-links.active {
        max-height: 500px;
        opacity: 1;
        padding-bottom: 1.5rem;
        padding-top: 1rem;
      }
      @media (min-width: 768px) {
        #nav-links {
          max-height: none;
          opacity: 1;
          overflow: visible;
          flex-direction: row;
          display: flex !important;
        }
      }
      /* Style for current page link */
      nav a.current-page {
        color: var(--color-fg-default) !important;
        font-weight: 600;
      }
      .edit-container {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 1.5rem;
      }
      .edit-link {
        font-size: 0.85rem;
        color: var(--color-fg-muted);
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        transition: color 0.2s ease;
      }
      .edit-link:hover {
        color: var(--color-fg-default);
      }
      .post-meta {
        color: var(--color-fg-muted);
        display: flex;
        align-items: center;
        opacity: 0.8;
      }
      /* Global link reset */
      a {
        text-decoration: none;
        color: inherit;
      }
      a:hover {
        text-decoration: none !important;
      }
      .nav-link {
        font-weight: 500;
        color: var(--color-fg-muted);
        font-size: 0.95rem;
        transition: color 0.2s ease;
        white-space: nowrap;
      }
      .nav-link:hover {
        color: var(--color-fg-default);
      }
      .brand-logo {
        font-family: 'Inter', sans-serif;
        font-weight: 800;
        letter-spacing: -0.05em;
        font-variant-ligatures: none;
      }
      .brand-version {
        font-family: 'Inter', sans-serif;
        font-weight: 800;
      }
      /* GFM Link Style - Neutral */
      .markdown-body a {
        color: var(--color-fg-default);
        text-decoration: underline;
        text-underline-offset: 2px;
        text-decoration-thickness: 1px;
        text-decoration-color: var(--color-border-default);
        transition: all 0.2s ease;
      }
      .markdown-body a:hover {
        text-decoration-color: var(--color-fg-muted) !important;
      }
      @media (max-width: 600px) {
        .edit-container {
          margin-bottom: 1rem;
        }
        .edit-link {
          font-size: 0.8rem;
        }
      }
      ${CSS}

      /* Custom Markdown Overrides */
      .markdown-body h1, .markdown-body h2, .markdown-body h3 {
        padding-bottom: 0.3em;
        border-bottom: 1px solid var(--color-border-default);
        margin-top: 1.5rem;
        margin-bottom: 1rem;
      }
      .markdown-body > h1:first-child {
        margin-top: 0 !important;
      }
      .markdown-body h4, .markdown-body h5, .markdown-body h6 {
        padding-bottom: 0.2rem;
        border-bottom: 1px solid var(--color-border-default);
        margin-top: 1.25rem;
        margin-bottom: 1rem;
        opacity: 0.9;
      }
      .markdown-body hr {
        height: 0 !important;
        margin: 2rem 0 !important;
        border: 0 !important;
        border-bottom: 1px solid var(--borderColor-muted, var(--color-border-muted)) !important;
        opacity: 0.5 !important;
      }
      @media (max-width: 768px) {
        .markdown-body hr {
          margin: 2.5rem 0 !important;
        }
      }

      /* Custom Scrollbar Styles */
      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: var(--color-border-default);
        border-radius: 10px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: var(--color-fg-muted);
      }
      /* Firefox support */
      * {
        scrollbar-width: thin;
        scrollbar-color: var(--color-border-default) transparent;
      }

      /* Consonant Design: Medium-inspired Typography */
      :root {
        --font-serif: Charter, "Bitstream Charter", "Sitka Text", Cambria, Georgia, serif;
        --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      }

      .blog-post-header {
        font-family: var(--font-sans) !important;
      }

      .blog-post-content {
        font-family: var(--font-serif) !important;
        font-size: 0.95rem !important;
        font-weight: 400 !important;
        line-height: 1.6 !important;
        color: var(--color-fg-default) !important;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
      }

      @media (min-width: 768px) {
        .blog-post-content {
          font-size: 1.15rem !important;
          line-height: 1.75 !important;
        }
      }

      .blog-post-content p {
        margin-bottom: 1.5rem !important;
      }

      @media (min-width: 768px) {
        .blog-post-content p {
          margin-bottom: 2rem !important;
        }
      }

      .blog-post-content h2, 
      .blog-post-content h3 {
        font-family: var(--font-serif) !important;
        font-weight: 700 !important;
        letter-spacing: -0.015em !important;
        margin-top: 2.5rem !important;
        margin-bottom: 1.25rem !important;
        line-height: 1.2 !important;
        color: var(--color-fg-default) !important;
        border-bottom: 1px solid var(--color-border-default);
        padding-bottom: 0.3em;
      }
      
      .blog-post-content h2 { font-size: 1.25rem !important; }
      .blog-post-content h3 { font-size: 1.15rem !important; }

      @media (min-width: 768px) {
        .blog-post-content h2 { font-size: 1.85rem !important; }
        .blog-post-content h3 { font-size: 1.5rem !important; }
        .blog-post-content h2, .blog-post-content h3 {
          margin-top: 2.5rem !important;
          margin-bottom: 0.8rem !important;
        }
      }

      .blog-post-content blockquote {
        font-family: var(--font-serif) !important;
        font-style: italic;
        font-size: 1rem;
        border-left: 2px solid var(--color-fg-default) !important;
        padding-left: 1.1rem !important;
        margin: 1.5rem 0 !important;
        color: var(--color-fg-muted);
        line-height: 1.5 !important;
      }

      @media (min-width: 768px) {
        .blog-post-content blockquote {
          font-size: 1.2rem;
          padding-left: 1.25rem !important;
          margin: 2rem 0 !important;
          line-height: 1.6 !important;
        }
      }

      .blog-post-content code {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
        font-size: 0.85em !important;
        background: var(--color-canvas-subtle);
        padding: 0.2em 0.4em;
        border-radius: 4px;
      }

      /* Smooth Image Loading */
      .markdown-body img,
      .blog-post-content img {
        opacity: 0;
        transition: opacity 0.5s ease-in-out;
      }
      .markdown-body img.loaded,
      .blog-post-content img.loaded {
        opacity: 1;
      }
    </style>
  </head>
  <body data-color-mode="auto" data-light-theme="light" data-dark-theme="dark">
    <header class="border-b border-border-default bg-canvas-default/70 sticky top-0 z-[100] backdrop-blur-md">
      <div class="max-w-[720px] mx-auto flex flex-col md:flex-row md:justify-between md:items-center py-4 px-6 md:px-8">
        <div class="flex justify-between items-center w-full md:w-auto">
          <div class="flex items-center gap-x-2">
            <a href="/" class="brand-logo text-2xl text-fg-default no-underline hover:no-underline">FASTRO</a>
            <span class="brand-version text-[0.65rem] px-1.5 py-px rounded bg-fg-default text-canvas-default uppercase tracking-wider select-none">${version}</span>
          </div>
          <button id="menu-toggle" aria-label="Toggle Menu" class="flex flex-col justify-between w-6 h-5 bg-transparent border-none cursor-pointer p-0 md:hidden group">
            <span class="w-6 h-[2px] bg-fg-default rounded-full transition-all duration-300 origin-center"></span>
            <span class="w-6 h-[2px] bg-fg-default rounded-full transition-all duration-300"></span>
            <span class="w-6 h-[2px] bg-fg-default rounded-full transition-all duration-300 origin-center"></span>
          </button>
        </div>
        <nav id="nav-links" class="flex flex-col md:flex-row hidden md:flex w-full md:w-auto gap-5 md:gap-7 items-start md:items-center overflow-hidden">
          <a href="/DOCS.md" class="nav-link py-1 md:py-0">Docs</a>
          <a href="/MIDDLEWARES.md" class="nav-link py-1 md:py-0">Middlewares</a>
          <a href="/SHOWCASE.md" class="nav-link py-1 md:py-0">Showcase</a>
          <a href="/BENCHMARK.md" class="nav-link py-1 md:py-0">Benchmarks</a>
          <a href="/blog" class="nav-link py-1 md:py-0">Blog</a>
        </nav>
      </div>
    </header>
    <main class="max-w-[720px] mx-auto p-6 md:p-8 flex-1 w-full box-border text-[var(--color-fg-default)]">
      <div class="markdown-body ${
    isBlogPost ? "blog-post-content" : ""
  }" data-color-mode="auto" data-light-theme="light" data-dark-theme="dark">${
    title
      ? `<h1 class="${
        isBlogPost
          ? "blog-post-header text-[2.25rem] md:text-[3.25rem] !font-black !leading-[1.1] tracking-tight mb-5 !border-b-0 !pb-0"
          : "text-[1.75rem] md:text-[2rem] font-semibold tracking-tight text-fg-default flex items-center gap-3 mb-4"
      }">${title}</h1>`
      : ""
  }${
    (date || author || (tags && tags.length > 0)) && path !== "blog"
      ? `<div class="post-meta ${
        isBlogPost
          ? "mb-10 opacity-100 font-sans text-sm md:text-[0.9rem] flex flex-wrap items-center gap-y-3 pb-5 md:pb-3 border-b border-border-default"
          : "mb-4 pb-4 border-b border-border-default flex flex-wrap items-center gap-2"
      }">
          <div class="flex items-center gap-x-3 gap-y-1 flex-wrap">
            ${
        author
          ? `<span class="font-semibold text-fg-default whitespace-nowrap">${author}</span>`
          : ""
      }
            ${
        date
          ? `<span class="text-fg-muted opacity-50 whitespace-nowrap md:ml-2">${date}</span>`
          : ""
      }
          </div>
          ${
        tags && tags.length > 0
          ? `<div class="flex flex-wrap gap-2 ml-auto">
                ${
            tags.slice(0, 2).map((tag) =>
              `<a href="/blog?search=${
                encodeURIComponent(tag)
              }" class="text-[0.65rem] md:text-[0.7rem] px-2.5 py-1 rounded-full bg-canvas-subtle border border-border-default !text-fg-muted font-medium uppercase tracking-wider hover:!text-fg-default hover:border-fg-muted transition-colors !no-underline">${tag}</a>`
            ).join("")
          }
              </div>`
          : ""
      }
        </div>`
      : ""
  }${body}</div>
    </main>
    <footer class="mt-auto border-t border-border-default">
      <div class="max-w-[720px] mx-auto px-6 md:px-8 py-4 text-[0.85rem] md:text-base text-fg-muted">
        <div class="flex flex-row justify-between items-center gap-4 opacity-80">
          <span class="whitespace-nowrap">Made by <a href="https://github.com/fastrodev" target="_blank" class="font-medium hover:text-fg-default transition-colors">Fastrodev</a></span>  
          <div class="flex items-center gap-4 md:gap-6">
            ${
    path !== "blog"
      ? `<a href="https://github.com/fastrodev/fastro/edit/main/${path}" 
               target="_blank" 
               class="hover:text-fg-default transition-colors flex items-center gap-1.5 whitespace-nowrap">
                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                <span class="hidden md:inline">Edit this page</span>
                <span class="md:hidden">Edit</span>
              </a>`
      : ""
  }
          </div>         
        </div>
      </div>
    </footer>
    ${
    isMD
      ? `
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"
      onload="
        const mdBody = document.querySelector('.markdown-body') || document.querySelector('.blog-post-content');
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
 * Renders a markdown file from the repository to HTML.
 *
 * @param path The relative path to the markdown file.
 * @returns A promise that resolves to a rendered HTML string.
 */
export async function renderMD(path: string) {
  try {
    const url = new URL(`../../${path}`, import.meta.url);
    const content = await Deno.readTextFile(url);
    return renderMD_Content(content, path);
  } catch (_) {
    return renderStatic("public/index.html");
  }
}

/**
 * Renders the blog index page listing all markdown posts with pagination and search.
 *
 * @param page The current page number.
 * @param search The search query string.
 * @returns A promise that resolves to a rendered HTML string.
 */
export async function renderBlog(page: number = 1, search: string = "") {
  const postsDir = new URL("../../posts/", import.meta.url);
  const posts: { title: string; date: string; link: string; tags: string[] }[] =
    [];
  const query = search.toLowerCase().trim();

  for await (const entry of Deno.readDir(postsDir)) {
    if (entry.isFile && entry.name.endsWith(".md")) {
      const name = entry.name;
      const postUrl = new URL(`../../posts/${name}`, import.meta.url);
      const content = await Deno.readTextFile(postUrl);
      let title = name.replace(".md", "").replace(/-/g, " ");
      let date = "";
      let tags: string[] = [];

      if (content.startsWith("---")) {
        const endIdx = content.indexOf("---", 3);
        if (endIdx !== -1) {
          const frontmatter = content.slice(3, endIdx);
          const titleMatch = frontmatter.match(/title:\s*["']?(.*?)["']?$/m);
          if (titleMatch) title = titleMatch[1].trim();
          const dateMatch = frontmatter.match(/date:\s*(.*?)$/m);
          if (dateMatch) date = dateMatch[1].trim();
          const tagsMatch = frontmatter.match(/tags:\s*\[?(.*?)\]?$/m);
          if (tagsMatch) {
            tags = tagsMatch[1].split(",").map((t) =>
              t.trim().replace(/['"]/g, "")
            ).filter(Boolean);
          }
        }
      }

      // Filter by search query if provided
      if (
        query &&
        !title.toLowerCase().includes(query) &&
        !content.toLowerCase().includes(query) &&
        !tags.some((t) => t.toLowerCase().includes(query))
      ) {
        continue;
      }

      posts.push({
        title,
        date,
        tags,
        link: `/blog/${name.replace(".md", "")}`,
      });
    }
  }

  // Sort by date DESC
  posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const pageSize = 4;
  const totalPages = Math.ceil(posts.length / pageSize);
  const currentPage = Math.min(Math.max(1, page), totalPages || 1);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const paginatedPosts = posts.slice(start, end);

  let html = `# Fastro Blog

  <p class="text-fg-muted mb-8 text-lg opacity-80">Updates and insights from the Fastro team.</p>

  <form action="/blog" method="GET" class="relative mb-10 group">
    <input 
      type="text" 
      name="search" 
      value="${search}" 
      placeholder="Search posts..." 
      class="w-full px-5 py-4 bg-canvas-subtle border border-border-default rounded-2xl focus:outline-none focus:border-accent-fg transition-all duration-300 text-fg-default placeholder:text-fg-muted/50"
    >
    <button type="submit" class="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-fg-muted hover:text-accent-fg transition-colors">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
    </button>
  </form>

  <div class="space-y-4">`;

  if (paginatedPosts.length === 0) {
    html += `
      <div class="py-20 text-center border border-dashed border-border-default rounded-2xl">
        <p class="text-fg-muted text-lg">No posts found for "${search}"</p>
        <a href="/blog" class="!text-fg-default font-medium hover:underline mt-2 inline-block">Clear search</a>
      </div>`;
  }

  for (const post of paginatedPosts) {
    html += `
      <div onclick="if(!event.target.closest('a')) location.href='${post.link}'" class="relative group block p-5 md:p-6 border border-border-default rounded-2xl hover:border-fg-muted hover:bg-canvas-subtle transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer">
        <div class="flex flex-col md:flex-row md:items-baseline justify-between w-full gap-3 md:gap-4">
          <div class="flex flex-col gap-2">
            <a href="${post.link}" class="text-xl font-bold !text-fg-default transition-colors tracking-tight line-clamp-2 md:line-clamp-none !no-underline hover:!no-underline">
              ${post.title}
            </a>
            ${
      post.tags && post.tags.length > 0
        ? `<div class="flex flex-wrap gap-2">
                ${
          post.tags.slice(0, 2).map((tag) =>
            `<a href="/blog?search=${
              encodeURIComponent(tag)
            }" class="text-[0.65rem] px-2 py-0.5 rounded-full bg-canvas-subtle border border-border-default !text-fg-muted font-medium uppercase tracking-wider hover:!text-fg-default hover:border-fg-muted transition-colors z-20 relative !no-underline">${tag}</a>`
          ).join("")
        }
              </div>`
        : ""
    }
          </div>
          ${
      post.date
        ? `<span class="text-fg-muted text-[0.7rem] md:text-sm shrink-0 flex items-center gap-2 whitespace-nowrap opacity-100 md:opacity-40 absolute bottom-4 right-4 md:static uppercase tracking-wider font-semibold z-10 bg-canvas-default group-hover:bg-canvas-subtle pl-4 pr-0 py-1 md:p-0 rounded-md md:rounded-none">
              ${post.date}
            </span>`
        : ""
    }
        </div>
      </div>`;
  }

  html += `</div>

  ${
    totalPages > 1
      ? `
  <div class="grid grid-cols-3 items-center mt-12 pt-8 border-t border-border-default">
    <div class="flex justify-start">
      ${
        currentPage > 1
          ? `<a href="/blog?page=${currentPage - 1}${
            search ? `&search=${encodeURIComponent(search)}` : ""
          }" class="px-5 py-2.5 rounded-xl border border-border-default hover:border-fg-muted hover:bg-canvas-subtle transition-all font-medium text-sm flex items-center gap-2 group whitespace-nowrap !text-fg-default !no-underline">
              <svg class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
              Previous
            </a>`
          : ""
      }
    </div>
    <span class="text-sm font-semibold text-fg-muted opacity-60 tracking-widest uppercase text-center whitespace-nowrap">Page ${currentPage} of ${totalPages}</span>
    <div class="flex justify-end">
      ${
        currentPage < totalPages
          ? `<a href="/blog?page=${currentPage + 1}${
            search ? `&search=${encodeURIComponent(search)}` : ""
          }" class="px-5 py-2.5 rounded-xl border border-border-default hover:border-fg-muted hover:bg-canvas-subtle transition-all font-medium text-sm flex items-center gap-2 group whitespace-nowrap !text-fg-default !no-underline">
              Next
              <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </a>`
          : ""
      }
    </div>
  </div>`
      : ""
  }`;

  return renderMD_Content(html, "blog");
}

/**
 * Serving the static public main html file.
 *
 * @param path The path to the index.html file.
 * @returns A promise that resolves to a Response object with HTML content.
 */
export async function renderStatic(path: string) {
  try {
    const url = new URL(`../../${path}`, import.meta.url);
    const content = await Deno.readTextFile(url);
    return new Response(content, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (_) {
    return new Response("Not found", { status: 404 });
  }
}
