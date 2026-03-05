import { bodyParser, createRouter, kvMiddleware } from "../../deps.ts";
import type { Server } from "../../deps.ts";
import { createPostHandler } from "./handler.ts";
import {
  deletePostHandler,
  getPostHandler,
  listPostsHandler,
  updatePostHandler,
} from "./handler.ts";

export default function register(app: Server) {
  const r = createRouter(app);

  // Register handler first, then per-route middlewares. Router expects
  // signature: post(path, handler, ...middlewares)
  r.post(
    "/api/posts",
    async (req, ctx) => {
      const result = await createPostHandler(req, ctx);
      if (result instanceof Response) return result;
      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" },
      });
    },
    bodyParser,
    kvMiddleware,
  );

  // list posts
  r.get("/api/posts", async (_req, _ctx) => {
    const result = await listPostsHandler();
    if (result instanceof Response) return result;
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  });

  // get single post content
  r.get("/api/posts/:name", async (req, ctx) => {
    const result = await getPostHandler(req, ctx);
    if (result instanceof Response) return result;
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  });

  // delete post
  r.delete("/api/posts/:name", async (req, ctx) => {
    const result = await deletePostHandler(req, ctx);
    if (result instanceof Response) return result;
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  });

  // update post
  r.put(
    "/api/posts/:name",
    async (req, ctx) => {
      const result = await updatePostHandler(req, ctx);
      if (result instanceof Response) return result;
      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" },
      });
    },
    bodyParser,
    kvMiddleware,
  );
}
