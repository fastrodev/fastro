import { CSS, KATEX_CSS, render } from "@deno/gfm";

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

export async function renderCode(path: string) {
  const url = new URL(`../../${path}`, import.meta.url);
  const content = await Deno.readTextFile(url);
  const md = `\`\`\`typescript\n// ${path}\n\n${content}\n\`\`\``;
  return renderMD_Content(md, path);
}

// adjust agar katex di fungsi ini tidak memproses template literal di dalam kode pemrograman (template literal menggunakan backtick `...`)
export async function renderMD_Content(content: string, path: string) {
  const version = await getVersion();
  let markdown = content;
  let title = "";
  let description = "High-performance, minimalist web framework for Deno.";
  let date = "";
  let author = "";
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
        color: var(--color-accent-fg);
        text-decoration: underline;
      }
      .post-meta {
        font-size: 0.9rem;
        color: var(--color-fg-muted);
        margin-bottom: 1.5rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid var(--borderColor-muted, var(--color-border-muted));
        display: flex;
        align-items: center;
        gap: 0.5rem;
        opacity: 0.8;
      }
      /* Global link reset */
      a {
        text-decoration: none;
        color: inherit;
      }
      .nav-link {
        font-weight: 500;
        color: var(--color-fg-muted);
        font-size: 0.95rem;
        transition: color 0.2s ease;
        white-space: nowrap;
      }
      .nav-link:hover {
        color: var(--color-accent-fg);
      }
      /* GFM Link Style */
      .markdown-body a {
        color: var(--color-accent-fg);
        text-decoration: none;
      }
      .markdown-body a:hover {
        text-decoration: underline;
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
        font-family: var(--font-sans);
      }

      .blog-post-content {
        font-family: var(--font-serif) !important;
        font-size: 1.15rem !important;
        font-weight: 400 !important;
        line-height: 1.75 !important;
        color: var(--color-fg-default) !important;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
      }

      .blog-post-content p {
        margin-bottom: 2rem !important;
      }

      .blog-post-content h2, 
      .blog-post-content h3 {
        font-family: var(--font-serif) !important;
        font-weight: 700 !important;
        letter-spacing: -0.015em !important;
        margin-top: 2.5rem !important;
        margin-bottom: 0.8rem !important;
        line-height: 1.2 !important;
        color: var(--color-fg-default) !important;
      }
      
      .blog-post-content h2 { font-size: 1.85rem !important; }
      .blog-post-content h3 { font-size: 1.5rem !important; }

      .blog-post-content blockquote {
        font-family: var(--font-serif) !important;
        font-style: italic;
        font-size: 1.2rem;
        border-left: 2px solid var(--color-fg-default) !important;
        padding-left: 1.25rem !important;
        margin: 2rem 0 !important;
        color: var(--color-fg-muted);
        line-height: 1.6 !important;
      }

      .blog-post-content code {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
        font-size: 0.85em !important;
        background: var(--color-canvas-subtle);
        padding: 0.2em 0.4em;
        border-radius: 4px;
      }
    </style>
  </head>
  <body data-color-mode="auto" data-light-theme="light" data-dark-theme="dark">
    <header class="border-b border-border-default bg-canvas-default/70 sticky top-0 z-[100] backdrop-blur-md">
      <div class="max-w-[720px] mx-auto flex flex-col md:flex-row md:justify-between md:items-center py-4 px-6 md:px-4">
        <div class="flex justify-between items-center w-full md:w-auto">
          <div class="flex items-center gap-2.5">
            <a href="/" class="text-2xl font-black text-fg-default no-underline hover:no-underline tracking-tighter">Fastro</a>
            <span class="text-[0.65rem] font-bold px-1.5 py-px rounded bg-fg-default text-canvas-default uppercase tracking-wider select-none">${version}</span>
          </div>
          <button id="menu-toggle" aria-label="Toggle Menu" class="flex flex-col justify-between w-6 h-5 bg-transparent border-none cursor-pointer p-0 md:hidden group">
            <span class="w-6 h-[2px] bg-fg-default rounded-full transition-all duration-300 origin-center"></span>
            <span class="w-6 h-[2px] bg-fg-default rounded-full transition-all duration-300"></span>
            <span class="w-6 h-[2px] bg-fg-default rounded-full transition-all duration-300 origin-center"></span>
          </button>
        </div>
        <nav id="nav-links" class="flex flex-col md:flex-row hidden md:flex w-full md:w-auto gap-5 md:gap-7 items-start md:items-center overflow-hidden">
          <a href="/" class="nav-link py-1 md:py-0">Home</a>
          <a href="/DOCS.md" class="nav-link py-1 md:py-0">Docs</a>
          <a href="/MIDDLEWARES.md" class="nav-link py-1 md:py-0">Middlewares</a>
          <a href="/SHOWCASE.md" class="nav-link py-1 md:py-0">Showcase</a>
          <a href="/BENCHMARK.md" class="nav-link py-1 md:py-0">Benchmarks</a>
          <a href="/blog" class="nav-link py-1 md:py-0">Blog</a>
        </nav>
      </div>
    </header>
    <main class="max-w-[720px] mx-auto p-6 md:p-8 flex-1 w-full box-border text-[var(--color-fg-default)]">
      ${
    title
      ? `<h1 class="${
        isBlogPost
          ? "blog-post-header text-[2.25rem] md:text-[3rem] font-black !leading-[1.1] tracking-tighter"
          : "text-[2.25rem] font-bold leading-tight"
      } mb-8 text-fg-default">${title}</h1>`
      : ""
  }

      ${
    (date || author) && path !== "blog"
      ? `<div class="post-meta ${
        isBlogPost ? "mb-12 opacity-100 font-sans text-[0.95rem] !gap-4" : ""
      }">
          ${
        author
          ? `<span class="font-medium text-fg-default">${author}</span>`
          : ""
      }
          ${date ? `<span class="text-fg-muted opacity-60">${date}</span>` : ""}
        </div>`
      : ""
  }

      <div class="${path !== "blog" ? "markdown-body" : ""} ${
    isBlogPost ? "blog-post-content" : ""
  }" data-color-mode="auto" data-light-theme="light" data-dark-theme="dark">
        ${body}
      </div>
    </main>
    <footer class="mt-auto border-t border-border-default">
      <div class="max-w-[720px] mx-auto px-6 md:px-4 py-4 text-[0.75rem] text-fg-muted">
        <div class="flex flex-row justify-between items-center gap-2 md:gap-1 opacity-70">
          <span>Made with ☕ by <a href="https://github.com/fastrodev" target="_blank" class="font-medium hover:text-accent-fg transition-colors">Fastrodev</a></span>  
          <div class="flex items-center gap-4 md:gap-6">
            ${
    path !== "blog"
      ? `<a href="https://github.com/fastrodev/fastro/edit/main/${path}" 
               target="_blank" 
               class="hover:text-accent-fg transition-colors flex items-center gap-1.5">
                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                <span>Edit this page</span>
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

export async function renderMD(path: string) {
  const url = new URL(`../../${path}`, import.meta.url);
  const content = await Deno.readTextFile(url);
  return renderMD_Content(content, path);
}

export async function renderBlog() {
  const postsDir = new URL("../../posts/", import.meta.url);
  const posts: { title: string; date: string; link: string }[] = [];

  for await (const entry of Deno.readDir(postsDir)) {
    if (entry.isFile && entry.name.endsWith(".md")) {
      const name = entry.name;
      const postUrl = new URL(`../../posts/${name}`, import.meta.url);
      const content = await Deno.readTextFile(postUrl);
      let title = name.replace(".md", "").replace(/-/g, " ");
      let date = "";

      if (content.startsWith("---")) {
        const endIdx = content.indexOf("---", 3);
        if (endIdx !== -1) {
          const frontmatter = content.slice(3, endIdx);
          const titleMatch = frontmatter.match(/title:\s*["']?(.*?)["']?$/m);
          if (titleMatch) title = titleMatch[1].trim();
          const dateMatch = frontmatter.match(/date:\s*(.*?)$/m);
          if (dateMatch) date = dateMatch[1].trim();
        }
      }

      posts.push({
        title,
        date,
        link: `/blog/${name.replace(".md", "")}`,
      });
    }
  }

  // Sort by date DESC
  posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  let html = `# Fastro Blog

  <p class="text-fg-muted mb-10 text-lg opacity-80">Updates and insights from the Fastro team.</p>

  <div class="space-y-4 mt-8">`;

  for (const post of posts) {
    html += `
      <a href="${post.link}" class="relative group block p-5 md:p-6 border border-border-default rounded-2xl hover:border-accent-fg hover:bg-canvas-subtle transition-all duration-300 no-underline shadow-sm hover:shadow-md">
        <div class="flex flex-row md:items-baseline justify-between w-full gap-3 md:gap-4">
          <span class="text-xl font-bold text-fg-default group-hover:text-accent-fg transition-colors tracking-tight line-clamp-2 pr-20 md:pr-0">
            ${post.title}
          </span>
          ${
      post.date
        ? `<span class="text-fg-muted text-[0.7rem] md:text-sm shrink-0 flex items-center gap-2 whitespace-nowrap opacity-60 md:opacity-40 absolute bottom-5 right-5 md:static uppercase tracking-wider font-semibold">
              ${post.date}
            </span>`
        : ""
    }
        </div>
      </a>`;
  }

  html += `</div>`;

  return renderMD_Content(html, "blog");
}
