// deno-lint-ignore-file no-explicit-any
import { Fastro } from "@app/mod.ts";
import layout from "./blog.layout.tsx";
import blog from "./blog.page.tsx";
import { getSession } from "@app/utils/session.ts";
import posts from "@app/modules/blog/blog.json" with { type: "json" };
import { extract, remark, render } from "@app/middleware/markdown/deps.ts";
import { default as remarkToc } from "npm:remark-toc@8.0.1";
import { createTocExtractor } from "../../middleware/markdown/toc-extractor.ts";
import { getCorsHeaders } from "../../utils/headers.ts";
import { createPost, md } from "./blog.service.ts";

function processMarkdown(markdownContent: string) {
  const m = extract(markdownContent);
  const tocExtractor = createTocExtractor();

  return remark()
    .use(remarkToc, {
      heading: "contents|table[ -]of[ -]contents?",
      maxDepth: 6,
      tight: true,
    })
    .use(tocExtractor.plugin)
    .process(m.body)
    .then((f) => {
      const rendered = render(String(f));
      const tocData = tocExtractor.getTocData();

      return {
        content: rendered,
        frontmatter: m.attrs,
        tocData,
      };
    });
}

export default function (s: Fastro) {
  s.page("/play", {
    component: blog,
    layout,
    folder: "modules/blog",
    handler: async (req, ctx) => {
      const ses = await getSession(req, ctx);
      return ctx.render({
        isLogin: ses?.isLogin,
        avatar_url: ses?.avatar_url,
        html_url: ses?.html_url,
        title: "Blog",
        description: "Blog",
        destination: "/blog",
        baseUrl: Deno.env.get("BASE_URL") || "http://localhost:8000",
        posts,
      });
    },
  });

  s.page("/play/:id", {
    component: blog,
    layout,
    folder: "modules/blog",
    handler: async (req, ctx) => {
      const { content, frontmatter, tocData } = await processMarkdown(md);
      const fm = frontmatter as any;
      const author = {
        name: fm?.author,
        avatar: fm?.avatar,
        url: fm?.url,
        bio: fm?.bio,
      };

      const post = {
        id: "1",
        title: fm?.title,
        content,
        description: fm?.description,
        image: fm?.image,
        author,
        // Fix: support both publishedAt and published_at, and avoid invalid date
        publishedAt: (() => {
          const dateStr = fm?.publishedAt || fm?.published_at;
          const date = dateStr ? new Date(dateStr) : new Date();
          return isNaN(date.getTime())
            ? new Date().toISOString()
            : date.toISOString();
        })(),
        tags: fm?.tags || [],
        readTime: fm.readTime,
        toc: tocData,
      };

      const ses = await getSession(req, ctx);
      return ctx.render({
        isLogin: ses?.isLogin,
        avatar_url: ses?.avatar_url,
        html_url: ses?.html_url,
        title: post.title,
        description: post,
        baseUrl: Deno.env.get("BASE_URL") || "http://localhost:8000",
        post,
      });
    },
  });

  s.post("/api/post", async (req, ctx) => {
    const corsHeaders = getCorsHeaders(req);
    try {
      const body = await req.json();
      const md = body.content;

      if (!md || typeof md !== "string" || md.trim() === "") {
        return new Response(JSON.stringify({ error: "Content is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const { frontmatter } = await processMarkdown(md);
      const ses = await getSession(req, ctx);
      const username = ses?.username;
      const avatar = ses?.avatar_url;
      const attrs = frontmatter as any;

      const post = await createPost({
        content: md,
        author: username,
        avatar: avatar,
        image: attrs.image,
        title: attrs.title,
        description: attrs.description,
        tags: attrs.tags,
        expired: ses?.username ? false : true,
      });

      return new Response(JSON.stringify(post), {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error processing post request:", error);
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
  });

  s.get("/api/unpslash/:query", async (req) => {
    async function getRandomUnsplashImage(apiKey: string, query = "") {
      try {
        const baseUrl = "https://api.unsplash.com/photos/random";
        const url = query
          ? `${baseUrl}?client_id=${apiKey}&query=${query}`
          : `${baseUrl}?client_id=${apiKey}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return {
          url: data.urls.regular,
          description: data.description || "Random Unsplash Image",
          photographer: data.user.name,
          link: data.links.html,
        };
      } catch (error) {
        console.error("Error fetching random image:", error);
        return null;
      }
    }

    const unsplashAccessKey = Deno.env.get("UNSPLASH_ACCESS_KEY");
    if (!unsplashAccessKey) throw new Error("UNSPLASH_ACCESS_KEY needed");

    const res = await getRandomUnsplashImage(
      unsplashAccessKey,
      req.params?.query,
    );

    return new Response(JSON.stringify(res), {
      status: 200,
    });
  });

  s.put("/api/post/:id", () => {});
  s.delete("/api/post/:id", () => {});
  s.get("/api/post/:id", () => {});
  s.get("/api/post", () => {});

  return s;
}
