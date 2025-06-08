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
  s.page("/blog", {
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

  s.page("/blog/:id", {
    component: blog,
    layout,
    folder: "modules/blog",
    handler: async (req, ctx) => {
      const { content, frontmatter, tocData } = await processMarkdown(md);
      console.log("tocData", tocData);
      const post = {
        id: "1",
        title: "Getting Started with Fastro: A Modern Deno Framework",
        content,
        description: (frontmatter as any)?.description,
        author: "John Doe",
        publishedAt: "2025-06-07T10:00:00Z",
        tags: (frontmatter as any)?.tags || [],
        readTime: "5 min read",
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

  s.put("/api/post/:id", () => {});
  s.delete("/api/post/:id", () => {});
  s.get("/api/post/:id", () => {});
  s.get("/api/post", () => {});

  return s;
}
