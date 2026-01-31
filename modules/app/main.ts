import app from "../../mod.ts";
import { CSS, render } from "@deno/gfm";

// Add support for syntax highlighting
import "npm:prismjs@1.29.0/components/prism-typescript.js";
import "npm:prismjs@1.29.0/components/prism-bash.js";
import "npm:prismjs@1.29.0/components/prism-json.js";

async function renderCode(path: string) {
  const url = new URL(`../../${path}`, import.meta.url);
  const content = await Deno.readTextFile(url);
  const md = `\`\`\`typescript\n// ${path}\n\n${content}\n\`\`\``;
  return renderMD_Content(md, path);
}

async function renderMD_Content(content: string, path: string) {
  const body = render(content);

  // Extract title and description for SEO
  const titleMatch = content.match(/^#\s+(.*)/m);
  const title = titleMatch ? titleMatch[1] : `Fastro - ${path}`;
  const descMatch = content.match(/^###\s+.*\r?\n\r?\n(.*)/m) ||
    content.match(/^#\s+.*\r?\n\r?\n(.*)/m);
  const description = descMatch
    ? descMatch[1].trim().slice(0, 160)
    : "High-performance, minimalist web framework for Deno.";

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:title" content="${title}">
    <meta property="twitter:description" content="${description}">

    <style>
      :root {
        --content-max-width: 800px;
      }
      body {
        margin: 0;
        background-color: var(--color-canvas-default);
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }
      header {
        border-bottom: 1px solid var(--color-border-default);
        background-color: var(--color-canvas-subtle);
        position: sticky;
        top: 0;
        z-index: 100;
      }
      .header-content {
        display: flex;
        flex-direction: column;
      }
      .header-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 0.75rem 0;
      }
      @media (min-width: 600px) {
        .header-content {
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
        }
        .header-bar {
          width: auto;
          padding: 0;
        }
      }
      .brand a {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--color-fg-default);
        text-decoration: none;
      }
      nav {
        display: none;
        flex-direction: column;
        width: 100%;
        gap: 0.5rem;
        padding-bottom: 1rem;
      }
      nav.active {
        display: flex;
      }
      @media (min-width: 600px) {
        nav {
          display: flex;
          flex-direction: row;
          width: auto;
          gap: 1.5rem;
          padding: 0;
          border-top: none;
          margin-top: 0;
        }
      }
      nav a {
        font-weight: 500;
        color: var(--color-fg-muted);
        text-decoration: none;
        white-space: nowrap;
        font-size: 0.95rem;
        transition: color 0.2s ease-in-out;
      }
      nav a:hover {
        color: var(--color-accent-fg);
      }
      /* Style for current page link */
      nav a[href="${path === "README.md" ? "/" : "/" + path}"] {
        color: var(--color-fg-default);
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
      @media (max-width: 600px) {
        .edit-container {
          margin-bottom: 1rem;
        }
        .edit-link {
          font-size: 0.8rem;
        }
      }
      #menu-toggle {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        width: 1.5rem;
        height: 1.25rem;
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0;
        z-index: 10;
      }
      #menu-toggle span {
        width: 1.5rem;
        height: 0.15rem;
        background: var(--color-fg-default);
        border-radius: 10px;
        transition: all 0.3s linear;
        position: relative;
        transform-origin: 1px;
      }
      @media (min-width: 600px) {
        #menu-toggle { display: none; }
      }
      .container {
        max-width: var(--content-max-width);
        margin: 0 auto;
        padding: 1rem;
        width: 100%;
        box-sizing: border-box;
      }
      main.container {
        padding: 1.5rem 1rem;
        flex: 1;
      }
      @media (min-width: 600px) {
        .container { padding: 2rem; }
        main.container { padding: 2.5rem 2rem; }
      }
      footer {
        border-top: 1px solid var(--color-border-default);
        background-color: var(--color-canvas-subtle);
        padding: 1rem 1rem;
        text-align: center;
        font-size: 0.75rem;
        color: var(--color-fg-muted);
      }
      @media (min-width: 600px) {
        footer { padding: 0.5rem; font-size: 0.8rem; }
      }
      ${CSS}
    </style>
  </head>
  <body data-color-mode="auto" data-light-theme="light" data-dark-theme="dark" class="markdown-body">
    <header>
      <div class="container header-content">
        <div class="header-bar">
          <div class="brand">
            <a href="/">Fastro</a>
          </div>
          <button id="menu-toggle" aria-label="Toggle Menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        <nav id="nav-links">
          <a href="/">Home</a>
          <a href="/DOCS.md">Docs</a>
          <a href="/MIDDLEWARES.md">Middlewares</a>
          <a href="/SHOWCASE.md">Showcase</a>
          <a href="/BENCHMARK.md">Benchmarks</a>
          <a href="/CONTRIBUTING.md">Contributing</a>
        </nav>
      </div>
    </header>
    <main class="container">
      <div class="edit-container">
        <a href="https://github.com/fastrodev/fastro/edit/main/${path}" 
           target="_blank" 
           class="edit-link">
          <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          Edit this page
        </a>
      </div>
      ${body}
    </main>
    <footer>
      <div class="container">
        <a href="/LICENSE">MIT Licensed</a> | Made with ☕ in Tulungagung by <a href="https://github.com/fastrodev" target="_blank">Fastrodev</a>
      </div>
    </footer>
    <script>
      const menuToggle = document.getElementById('menu-toggle');
      const navLinks = document.getElementById('nav-links');
      
      menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Simple animation for hamburger
        const spans = menuToggle.querySelectorAll('span');
        menuToggle.classList.toggle('open');
      });
    </script>
  </body>
</html>`;
  return new Response(html, {
    headers: { "content-type": "text/html" },
  });
}

async function renderMD(path: string) {
  const url = new URL(`../../${path}`, import.meta.url);
  const content = await Deno.readTextFile(url);
  return renderMD_Content(content, path);
}

app.get("/", () => renderMD("README.md"));
app.get("/DOCS.md", () => renderMD("DOCS.md"));
app.get("/MIDDLEWARES.md", () => renderMD("MIDDLEWARES.md"));
app.get("/SHOWCASE.md", () => renderMD("SHOWCASE.md"));
app.get("/BENCHMARK.md", () => renderMD("BENCHMARK.md"));
app.get("/CONTRIBUTING.md", () => renderMD("CONTRIBUTING.md"));
app.get("/middlewares/logger.ts", () => renderCode("middlewares/logger.ts"));
app.get("/LICENSE", () => renderCode("LICENSE"));

app.serve({ port: parseInt(Deno.args[0]) || 8000 });
