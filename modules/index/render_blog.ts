import { renderMD_Content } from "./render_md.ts";

/**
 * Renders the blog index page listing all markdown posts with pagination and search.
 *
 * @param page The current page number.
 * @param search The search query string.
 * @returns A promise that resolves to a rendered HTML string.
 */
export async function renderBlog(page: number = 1, search: string = "") {
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
        link: `/blog/${name.replace(".md", "")}`,
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

  <div class="flex flex-wrap gap-2 mb-10 -mt-4">
    ${
    Array.from(allTags).sort().map((tag) => {
      const isActive = query === tag.toLowerCase();
      return `<a href="${
        isActive ? "/blog" : `/blog?search=${encodeURIComponent(tag)}`
      }" class="text-[0.65rem] md:text-xs px-3 py-1 rounded-full border ${
        isActive
          ? "bg-fg-default border-fg-default !text-canvas-default"
          : "bg-canvas-subtle border-border-default !text-fg-muted hover:border-fg-muted hover:!text-fg-default"
      } font-semibold uppercase tracking-wider transition-all duration-200 !no-underline">${tag}</a>`;
    }).join("")
  }
  </div>

  <div class="space-y-4">`;

  if (paginatedPosts.length === 0) {
    html += `
      <div class="py-20 text-center border border-dashed border-border-default rounded-2xl">
        <p class="text-fg-muted text-lg">No posts found for "${search}"</p>
        <a href="/blog" class="!text-fg-default font-medium hover:underline mt-2 inline-block">Clear search</a>
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
      <div onclick="if(!event.target.closest('a')) location.href='${post.link}'" class="relative group block p-5 md:p-6 border border-border-default rounded-2xl hover:border-fg-muted hover:bg-canvas-subtle transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer">
        ${
      isLatest
        ? `<div class="mb-4 overflow-hidden rounded-xl border border-border-default h-48 md:h-64">
              <img src="${
          post.image || defaultImage
        }" alt="${post.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            </div>`
        : ""
    }
        <div class="flex items-stretch gap-4 md:gap-6">
          ${
      !isLatest
        ? `<div class="shrink-0 w-20 h-20 sm:w-24 sm:h-24 overflow-hidden rounded-xl border border-border-default bg-canvas-subtle">
              <img src="${
          post.image || defaultImage
        }" alt="${post.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            </div>`
        : ""
    }
          <div class="flex-1 min-w-0 flex flex-col">
            <div class="mb-1">
              <a href="${post.link}" class="text-xl font-bold !text-fg-default transition-colors tracking-tight line-clamp-2 md:line-clamp-none !no-underline hover:!no-underline leading-tight">
                ${post.title}
              </a>
            </div>
            
            <div class="mt-auto flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
              ${
      post.tags && post.tags.length > 0
        ? `<div class="flex flex-wrap gap-2">
                  ${
          post.tags.slice(0, 3).map((tag) =>
            `<a href="/blog?search=${
              encodeURIComponent(tag)
            }" class="text-[0.65rem] px-2 py-0.5 rounded-full bg-canvas-subtle border border-border-default !text-fg-muted font-medium uppercase tracking-wider hover:!text-fg-default hover:border-fg-muted transition-colors z-20 relative !no-underline">${tag}</a>`
          ).join("")
        }
                </div>`
        : "<div></div>"
    }
              ${
      post.date
        ? `<span class="text-fg-muted text-[0.7rem] md:text-sm uppercase tracking-wider font-semibold opacity-60 flex-shrink-0 ml-auto">
                  ${post.date}
                </span>`
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
  <div class="grid grid-cols-3 items-center mt-12">
    <div class="flex justify-start">
      ${
        currentPage > 1
          ? `<a href="/blog?page=${currentPage - 1}${
            search ? `&search=${encodeURIComponent(search)}` : ""
          }" class="px-3 py-2 md:px-5 md:py-2.5 rounded-xl border border-border-default hover:border-fg-muted hover:bg-canvas-subtle transition-all font-medium text-xs md:text-sm flex items-center gap-2 group whitespace-nowrap !text-fg-default !no-underline">
              <svg class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
              <span class="hidden md:inline">Previous</span>
            </a>`
          : ""
      }
    </div>
    <span class="text-[0.65rem] md:text-sm font-semibold text-fg-muted opacity-60 tracking-widest uppercase text-center whitespace-nowrap">Page ${currentPage} of ${totalPages}</span>
    <div class="flex justify-end">
      ${
        currentPage < totalPages
          ? `<a href="/blog?page=${currentPage + 1}${
            search ? `&search=${encodeURIComponent(search)}` : ""
          }" class="px-3 py-2 md:px-5 md:py-2.5 rounded-xl border border-border-default hover:border-fg-muted hover:bg-canvas-subtle transition-all font-medium text-xs md:text-sm flex items-center gap-2 group whitespace-nowrap !text-fg-default !no-underline">
              <span class="hidden md:inline">Next</span>
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
