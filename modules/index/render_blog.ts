import { renderMD_Content } from "./render_md.ts";

/**
 * Renders the blog index page listing all markdown posts with pagination and search.
 *
 * @param page The current page number.
 * @param search The search query string.
 * @param kv Optional Deno KV instance.
 * @param canonical Optional canonical URL for the page.
 * @returns A promise that resolves to a rendered HTML string.
 */
export async function renderBlog(
  page: number = 1,
  search: string = "",
  kv?: Deno.Kv,
  canonical?: string,
) {
  const postsDir = new URL("../../posts/", import.meta.url);
  const posts: {
    title: string;
    date: string;
    link: string;
    tags: string[];
    image?: string;
  }[] = [];
  const query = search.toLowerCase().trim();
  const allTags = new Set<string>();

  for await (const entry of Deno.readDir(postsDir)) {
    if (entry.isFile && entry.name.endsWith(".md")) {
      const name = entry.name;
      const postUrl = new URL(`../../posts/${name}`, import.meta.url);
      const content = await Deno.readTextFile(postUrl);
      let title = name.replace(".md", "").replace(/-/g, " ");
      let date = "";
      let tags: string[] = [];
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
          const tagsMatch = frontmatter.match(/tags:\s*\[?(.*?)\]?$/m);
          if (tagsMatch) {
            tags = tagsMatch[1].split(",").map((t) =>
              t.trim().replace(/['"]/g, "")
            ).filter(Boolean);
            tags.forEach((t) => allTags.add(t));
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
        image,
        link: `/posts/${name.replace(".md", "")}`,
      });
    }
  }

  // Sort by date DESC
  posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const pageSize = 6;
  const totalPages = Math.ceil(posts.length / pageSize);
  const currentPage = Math.min(Math.max(1, page), totalPages || 1);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const paginatedPosts = posts.slice(start, end);

  let html = `# Fastro Blog

  <p class="text-fg-muted mb-8 text-base opacity-70">Updates and insights from the Fastro team.</p>

  <form action="/blog" method="GET" class="relative mb-6 group">
    <input 
      type="text" 
      name="search" 
      value="${search}" 
      placeholder="Search posts..." 
      class="w-full px-5 py-3 bg-canvas-subtle border border-border-subtle rounded-xl focus:outline-none focus:border-accent-fg/30 focus:ring-4 focus:ring-accent-fg/5 transition-all duration-300 text-fg-default placeholder:text-fg-muted/30 text-sm shadow-sm"
    >
    <button type="submit" class="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-fg-muted/40 hover:text-accent-fg transition-colors">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
    </button>
  </form>

  <div class="flex flex-wrap gap-2 mb-6 -mt-2">
    ${
    Array.from(allTags).sort().map((tag) => {
      const isActive = query === tag.toLowerCase();
      return `<a href="${
        isActive ? "/blog" : `/blog?search=${encodeURIComponent(tag)}`
      }" class="text-[0.6rem] md:text-[0.65rem] px-2.5 py-1.5 rounded border ${
        isActive
          ? "bg-fg-default border-fg-default !text-canvas-default"
          : "bg-canvas-subtle border-border-subtle !text-fg-muted/60 hover:border-fg-muted hover:!text-fg-default hover:bg-canvas-default"
      } font-bold uppercase tracking-widest transition-all duration-200 !no-underline">${tag}</a>`;
    }).join("")
  }
  </div>

  <div class="grid gap-8 md:gap-12">`;

  if (paginatedPosts.length === 0) {
    html += `
      <div class="py-12 text-center border border-dashed border-border-default/20 rounded-2xl bg-canvas-subtle/30">
        <p class="text-fg-muted/50 text-base italic">No articles found matching your criteria.</p>
        <a href="/blog" class="!text-fg-default font-black hover:underline mt-4 inline-block uppercase tracking-[0.25em] text-[0.6rem]">Clear filters</a>
      </div>`;
  }

  const defaultImages = [
    "https://storage.googleapis.com/replix-394315-file/uploads/start.jpg",
    "https://storage.googleapis.com/replix-394315-file/uploads/resources.jpg",
    "https://storage.googleapis.com/replix-394315-file/uploads/middleware.jpg",
    "https://storage.googleapis.com/replix-394315-file/uploads/showcase.jpg",
  ];

  for (let i = 0; i < paginatedPosts.length; i++) {
    const post = paginatedPosts[i];
    const isLatest = currentPage === 1 && i === 0;
    const defaultImage =
      defaultImages[Math.floor(Math.random() * defaultImages.length)];
    html += `
      <div onclick="if(!event.target.closest('a')) location.href='${post.link}'" class="relative group block transition-all duration-500 cursor-pointer overflow-hidden">
        ${
      isLatest
        ? `<div class="mb-6 overflow-hidden rounded-xl h-48 md:h-[320px]">
              <img src="${
          post.image || defaultImage
        }" alt="${post.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000">
            </div>`
        : ""
    }
        <div class="flex items-start gap-4 md:gap-8">
          ${
      !isLatest
        ? `<div class="shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 overflow-hidden rounded-lg bg-canvas-subtle">
              <img src="${
          post.image || defaultImage
        }" alt="${post.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000">
            </div>`
        : ""
    }
          <div class="flex-1 min-w-0 flex flex-col min-h-full py-0">
            <div class="mb-2 md:mb-5">
              <a href="${post.link}" class="text-xl md:text-2xl font-bold !text-fg-default tracking-tight line-clamp-2 !no-underline hover:!no-underline leading-[1.25] md:group-hover:text-accent-fg transition-colors duration-300">
                ${post.title}
              </a>
            </div>
            
            <div class="flex flex-wrap items-center gap-4">
              ${
      post.date
        ? `<span class="text-fg-muted/30 text-[0.6rem] md:text-[0.65rem] uppercase tracking-[0.2em] font-black">
                  ${post.date}
                </span>`
        : ""
    }
              ${
      post.tags && post.tags.length > 0
        ? `<div class="flex items-center gap-1.5">
                  ${
          post.tags.slice(0, 2).map((tag) =>
            `<a href="/blog?search=${
              encodeURIComponent(tag)
            }" class="text-[0.55rem] md:text-[0.6rem] px-2 py-0.5 rounded-sm bg-canvas-subtle !text-fg-muted/60 font-black uppercase tracking-widest hover:!text-fg-default hover:bg-canvas-default transition-all z-20 relative !no-underline">${tag}</a>`
          ).join("")
        }
                </div>`
        : ""
    }
            </div>
          </div>
        </div>
      </div>`;
  }

  html += `</div>

  ${
    totalPages > 1
      ? `
  <div class="grid grid-cols-3 items-center mt-6 md:mt-12 py-0">
    <div class="flex justify-start">
      ${
        currentPage > 1
          ? `<a href="/blog?page=${currentPage - 1}${
            search ? `&search=${encodeURIComponent(search)}` : ""
          }" class="px-4 py-2 rounded-xl border border-border-subtle hover:border-fg-muted hover:bg-canvas-subtle transition-all font-bold text-[0.7rem] uppercase tracking-widest flex items-center gap-2 group whitespace-nowrap !text-fg-default !no-underline shadow-sm">
              <svg class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
              <span class="hidden sm:inline">Prev</span>
            </a>`
          : ""
      }
    </div>
    <span class="text-[0.65rem] font-bold text-fg-muted/40 tracking-widest uppercase text-center whitespace-nowrap">Page ${currentPage} / ${totalPages}</span>
    <div class="flex justify-end">
      ${
        currentPage < totalPages
          ? `<a href="/blog?page=${currentPage + 1}${
            search ? `&search=${encodeURIComponent(search)}` : ""
          }" class="px-4 py-2 rounded-xl border border-border-subtle hover:border-fg-muted hover:bg-canvas-subtle transition-all font-bold text-[0.7rem] uppercase tracking-widest flex items-center gap-2 group whitespace-nowrap !text-fg-default !no-underline shadow-sm">
              <span class="hidden sm:inline">Next</span>
              <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </a>`
          : ""
      }
    </div>
  </div>`
      : ""
  }`;

  return renderMD_Content(html, "blog", kv, canonical);
}
