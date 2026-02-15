import { createRouter } from "../../core/router.ts";
import { createPostHandler } from "./handler.ts";
import {
  deletePostHandler,
  getPostHandler,
  listPostsHandler,
  updatePostHandler,
} from "./handler.ts";
import { bodyParser } from "../../middlewares/bodyparser/mod.ts";
import { kvMiddleware } from "../../middlewares/kv/mod.ts";

const r = createRouter();

// Register handler first, then per-route middlewares. Router expects
// signature: post(path, handler, ...middlewares)
//  Type '{ success: boolean; message: string; filename: string; }' is missing the following properties from type 'Response': headers, ok, redirected, status, and 12 more
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
r.get(
  "/api/posts",
  async (_req, _ctx) => {
    const result = await listPostsHandler();
    if (result instanceof Response) return result;
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  },
);

// get single post content
r.get(
  "/api/posts/:name",
  async (req, ctx) => {
    const result = await getPostHandler(req, ctx);
    if (result instanceof Response) return result;
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  },
);

// delete post
r.delete(
  "/api/posts/:name",
  async (req, ctx) => {
    const result = await deletePostHandler(req, ctx);
    if (result instanceof Response) return result;
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  },
);

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

export default r.build();
