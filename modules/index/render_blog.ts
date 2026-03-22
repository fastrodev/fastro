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
      let description = "";

      if (content.startsWith("---")) {
        const endIdx = content.indexOf("---", 3);
        if (endIdx !== -1) {
          const frontmatter = content.slice(3, endIdx);
          const titleMatch = frontmatter.match(/title:\s*["']?(.*?)["']?$/m);
          if (titleMatch) title = titleMatch[1].trim();
          const descMatch = frontmatter.match(
            /description:\s*["']?(.*?)["']?$/m,
          );
          if (descMatch) description = descMatch[1].trim();
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
        !description.toLowerCase().includes(query) &&
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

  <form action="/blog" method="GET" class="relative mb-10 group">
    <div class="absolute left-5 top-1/2 -translate-y-1/2 text-fg-muted/60 z-10">
      <svg class="w-5 h-5 transition-colors group-focus-within:text-accent-emphasis" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
    </div>
    <input 
      type="text" 
      name="search" 
      value="${search}" 
      placeholder="Search articles..." 
      class="w-full pl-13 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-accent-emphasis/50 focus:ring-4 focus:ring-accent-emphasis/10 transition-all duration-300 text-fg-default placeholder:text-fg-muted/50 text-base shadow-lg backdrop-blur-md"
    >
  </form>

  <div class="flex flex-wrap gap-3 mb-10 -mt-4">
    ${
    Array.from(allTags).sort().map((tag) => {
      const isActive = query === tag.toLowerCase();
      return `<a href="${
        isActive ? "/blog" : `/blog?search=${encodeURIComponent(tag)}`
      }" class="text-[0.65rem] md:text-[0.7rem] px-5 py-2 rounded-full border-0.5 transition-all duration-300 no-underline! font-semibold uppercase tracking-widest ${
        isActive
          ? "bg-accent-emphasis text-white shadow-lg shadow-accent-emphasis/20"
          : "bg-white/5 border-white/5 text-fg-muted hover:bg-white/10 hover:text-fg-default"
      }">${tag}</a>`;
    }).join("")
  }
  </div>

  <div class="grid grid-cols-1 gap-10">`;

  if (paginatedPosts.length === 0) {
    html += `
      <div class="py-12 text-center border border-dashed border-white/10 rounded-2xl bg-white/5 backdrop-blur-md">
        <p class="text-fg-muted/50 text-base italic">No articles found matching your criteria.</p>
        <a href="/blog" class="dashboard-link mt-4 inline-block px-4 py-2 rounded-full text-[0.7rem] font-bold uppercase tracking-widest no-underline!">Clear filters</a>
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
    const defaultImage =
      defaultImages[Math.floor(Math.random() * defaultImages.length)];
    html += `
      <div onclick="if(!event.target.closest('a')) location.href='${post.link}'" class="native-card group flex flex-col cursor-pointer overflow-hidden p-4">
        <div class="mb-5 overflow-hidden rounded-xl h-48 sm:h-56 bg-canvas-inset">
          <img src="${
      post.image || defaultImage
    }" alt="${post.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out">
        </div>
        <div class="flex flex-col flex-1 px-1">
          <div class="mb-4">
            <a href="${post.link}" class="text-xl md:text-2xl font-bold text-fg-default! tracking-tight line-clamp-2 no-underline! hover:no-underline! leading-tight transition-all duration-300">
              ${post.title}
            </a>
          </div>
          
          <div class="mt-auto flex items-center justify-between gap-4">
            ${
      post.tags && post.tags.length > 0
        ? `<div class="flex items-center gap-2">
                  ${
          post.tags.slice(0, 2).map((tag) =>
            `<a href="/blog?search=${
              encodeURIComponent(tag)
            }" class="text-[0.6rem] md:text-[0.65rem] px-3 py-1 rounded-full bg-white/5 border border-white/5 text-fg-muted hover:bg-white/10 hover:text-fg-default transition-all z-20 relative no-underline! font-medium uppercase tracking-widest">${tag}</a>`
          ).join("")
        }
                </div>`
        : "<div></div>"
    }
            ${
      post.date
        ? `<span class="text-fg-subtle text-[0.65rem] font-medium uppercase tracking-widest opacity-80">
                  ${post.date}
                </span>`
        : ""
    }
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
          }" class="px-4 py-2 rounded-xl border border-border-subtle hover:border-fg-muted hover:bg-canvas-subtle transition-all font-bold text-[0.7rem] uppercase tracking-widest flex items-center gap-2 group whitespace-nowrap text-fg-default! no-underline! shadow-sm">
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
          }" class="px-4 py-2 rounded-xl border border-border-subtle hover:border-fg-muted hover:bg-canvas-subtle transition-all font-bold text-[0.7rem] uppercase tracking-widest flex items-center gap-2 group whitespace-nowrap text-fg-default! no-underline! shadow-sm">
              <span class="hidden sm:inline">Next</span>
              <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </a>`
          : ""
      }
    </div>
  </div>`
      : ""
  }`;

  // Build rel=prev/next head links when applicable
  let headExtras = "";
  if (currentPage > 1) {
    const prevUrl = `/blog?page=${currentPage - 1}${
      search ? `&search=${encodeURIComponent(search)}` : ""
    }`;
    headExtras += `<link rel=\"prev\" href=\"${prevUrl}\">`;
  }
  if (currentPage < totalPages) {
    const nextUrl = `/blog?page=${currentPage + 1}${
      search ? `&search=${encodeURIComponent(search)}` : ""
    }`;
    headExtras += `<link rel=\"next\" href=\"${nextUrl}\">`;
  }

  const customCacheKey = `blog:${currentPage}:${search || "all"}`;

  return renderMD_Content(
    html,
    "blog",
    kv,
    canonical,
    headExtras,
    customCacheKey,
  );
}
