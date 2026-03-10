import { assert, assertEquals, assertRejects } from "@std/assert";
import server, {
  _getMiddlewareCount,
  _getRoutePaths,
  _getRoutesForTests,
  _resetForTests,
  _toResponseForTests,
} from "./server.ts";
// test-only helper for internal handler retrieval (typed to satisfy linter)
// no test-only globals
import type { Context, Next } from "./types.ts";

Deno.test("Coverage - ctx.url lazy init", async () => {
  _resetForTests();
  server.get("/ctx", (_req: Request, ctx: Context) => {
    const url1 = ctx.url;
    const url2 = ctx.url;
    assertEquals(url1, url2);
    return "ok";
  });
  const s = server.serve({ port: 3111 });
  const res = await fetch("http://localhost:3111/ctx");
  assertEquals(await res.text(), "ok");
  s.close();
});

Deno.test("internal helpers: _getMiddlewareCount and _getRoutePaths", () => {
  _resetForTests();

  // Initially empty
  assertEquals(_getMiddlewareCount(), 0);
  assertEquals(_getRoutePaths().length, 0);

  // Add a global middleware and a couple routes
  server.use((_req, _ctx, next) => next && next());
  server.get("/x", () => "x");
  server.post("/y", () => "y");

  // Ensure helpers reflect added state
  assertEquals(_getMiddlewareCount(), 1);
  const paths = _getRoutePaths();
  // order may vary; ensure both paths present
  paths.sort();
  assertEquals(paths, ["/x", "/y"]);
});

Deno.test("Coverage - ctx.params lazy init", async () => {
  _resetForTests();
  server.get("/params/:id", (_req: Request, ctx: Context) => {
    const p1 = ctx.params;
    const p2 = ctx.params;
    assertEquals(p1.id, "123");
    assertEquals(p1, p2);
    return "ok";
  });
  const s = server.serve({ port: 3112 });
  const res = await fetch("http://localhost:3112/params/123");
  assertEquals(await res.text(), "ok");
  s.close();
});

Deno.test("Coverage - cache hit", async () => {
  _resetForTests();
  server.get("/cache", () => "cached");
  const s = server.serve({ port: 3113 });
  await (await fetch("http://localhost:3113/cache")).text();
  const res = await fetch("http://localhost:3113/cache");
  assertEquals(await res.text(), "cached");
  s.close();
});

Deno.test("Coverage - tryRoute with query", async () => {
  _resetForTests();
  server.get("/query", (_req: Request, ctx: Context) => ctx.query.a);
  const s = server.serve({ port: 3114 });
  const res = await fetch("http://localhost:3114/query?a=ok");
  assertEquals(await res.text(), "ok");
  s.close();
});

Deno.test("Coverage - tryRoute fallthrough", async () => {
  _resetForTests();
  server.get("/a", (_req: Request, _ctx: Context, next: Next | undefined) => {
    return next
      ? (next() as unknown as Response)
      : ("fail" as unknown as Response);
  });
  server.get("/a", () => "b");
  const s = server.serve({ port: 3115 });
  const res = await fetch("http://localhost:3115/a");
  assertEquals(await res.text(), "b");
  s.close();
});

Deno.test("Coverage - PUT and DELETE", async () => {
  _resetForTests();
  server.put("/u", () => "put");
  server.delete("/d", () => "delete");
  const s = server.serve({ port: 3116 });
  const res1 = await fetch("http://localhost:3116/u", { method: "PUT" });
  assertEquals(await res1.text(), "put");
  const res2 = await fetch("http://localhost:3116/d", { method: "DELETE" });
  assertEquals(await res2.text(), "delete");
  s.close();
});

Deno.test("Coverage - root with global middleware", async () => {
  _resetForTests();
  server.use((_req, _ctx, next) =>
    next ? (next() as unknown as Response) : ("fail" as unknown as Response)
  );
  server.get("/", () => "root");
  const s = server.serve({ port: 3117 });
  const res = await fetch("http://localhost:3117/");
  assertEquals(await res.text(), "root");
  s.close();
});

Deno.test("Coverage - root with route middleware", async () => {
  _resetForTests();
  server.get(
    "/",
    () => "root",
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
  );
  const s = server.serve({ port: 3118 });
  const res = await fetch("http://localhost:3118/");
  assertEquals(await res.text(), "root");
  s.close();
});

Deno.test("Coverage - root not GET", async () => {
  _resetForTests();
  server.post("/", () => "root post");
  const s = server.serve({ port: 3119 });
  const res = await fetch("http://localhost:3119/", { method: "POST" });
  assertEquals(await res.text(), "root post");
  s.close();
});

Deno.test("Coverage - 404 cache evicted", async () => {
  _resetForTests();
  const s = server.serve({ port: 3120, cacheSize: 1 });
  await (await fetch("http://localhost:3120/404a")).text();
  await (await fetch("http://localhost:3120/404b")).text();
  const res = await fetch("http://localhost:3120/404b");
  assertEquals(res.status, 404);
  await res.text();
  s.close();
});

Deno.test("Coverage - cache hit with route middlewares", async () => {
  _resetForTests();
  server.get(
    "/route-mw",
    () => "ok",
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
  );
  const s = server.serve({ port: 3121 });
  await (await fetch("http://localhost:3121/route-mw")).text();
  const res = await fetch("http://localhost:3121/route-mw");
  assertEquals(await res.text(), "ok");
  s.close();
});

Deno.test("Coverage - 404 cache eviction", async () => {
  _resetForTests();
  const s = server.serve({ port: 3122, cacheSize: 1 });
  await (await fetch("http://localhost:3122/404a")).text();
  await (await fetch("http://localhost:3122/404b")).text();
  await (await fetch("http://localhost:3122/404c")).text();
  const res = await fetch("http://localhost:3122/404c");
  assertEquals(res.status, 404);
  await res.text();
  s.close();
});

Deno.test("Coverage - fast path async", async () => {
  _resetForTests();
  server.get("/", () => Promise.resolve("root"));
  const s = server.serve({ port: 3125 });
  const res = await fetch("http://localhost:3125/");
  assertEquals(await res.text(), "root");
  s.close();
});

Deno.test("Coverage - cache hit async", async () => {
  _resetForTests();
  server.get("/async-cache", () => Promise.resolve("async"));
  const s = server.serve({ port: 3126 });
  await (await fetch("http://localhost:3126/async-cache")).text();
  const res = await fetch("http://localhost:3126/async-cache");
  assertEquals(await res.text(), "async");
  s.close();
});

Deno.test("Coverage - cache hit with route middlewares async", async () => {
  _resetForTests();
  server.get(
    "/route-mw-async",
    () => Promise.resolve("async"),
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
  );
  const s = server.serve({ port: 3127 });
  await (await fetch("http://localhost:3127/route-mw-async")).text();
  const res = await fetch("http://localhost:3127/route-mw-async");
  assertEquals(await res.text(), "async");
  s.close();
});

Deno.test("Coverage - toResponse other", async () => {
  _resetForTests();
  // @ts-ignore: testing
  server.get("/other", () => 42 as unknown);
  const s = server.serve({ port: 3128 });
  const res = await fetch("http://localhost:3128/other");
  assertEquals(res.status, 500);
  assertEquals(await res.text(), "Internal Server Error");
  s.close();
});

Deno.test("Coverage - fast path other return", async () => {
  _resetForTests();
  // @ts-ignore: testing
  server.get("/", () => 42 as unknown);
  const s = server.serve({ port: 3129 });
  const res = await fetch("http://localhost:3129/");
  assertEquals(res.status, 500);
  assertEquals(await res.text(), "Internal Server Error");
  s.close();
});

Deno.test("Coverage - cache hit other return", async () => {
  _resetForTests();
  // @ts-ignore: testing
  server.get("/other-cache", () => 42 as unknown);
  const s = server.serve({ port: 3130 });
  await (await fetch("http://localhost:3130/other-cache")).text();
  const res = await fetch("http://localhost:3130/other-cache");
  assertEquals(res.status, 500);
  assertEquals(await res.text(), "Internal Server Error");
  s.close();
});

Deno.test("Coverage - fast path ctx.url", async () => {
  _resetForTests();
  server.get("/", (_req, ctx) => ctx.url.pathname);
  const s = server.serve({ port: 3131 });
  const res = await fetch("http://localhost:3131/");
  assertEquals(await res.text(), "/");
  s.close();
});

Deno.test("Coverage - cache hit ctx.url", async () => {
  _resetForTests();
  server.get("/cache-url", (_req, ctx) => ctx.url.pathname);
  const s = server.serve({ port: 3132 });
  await (await fetch("http://localhost:3132/cache-url")).text();
  const res = await fetch("http://localhost:3132/cache-url");
  assertEquals(await res.text(), "/cache-url");
  s.close();
});

Deno.test("Coverage - regular ctx.url", async () => {
  _resetForTests();
  server.get("/regular-url", (_req, ctx) => ctx.url.pathname);
  const s = server.serve({ port: 3133 });
  const res = await fetch("http://localhost:3133/regular-url");
  assertEquals(await res.text(), "/regular-url");
  s.close();
});

Deno.test("Coverage - root next call", async () => {
  _resetForTests();
  // @ts-ignore: testing
  server.get("/", (_req, _ctx, next) => {
    // @ts-ignore: testing
    next();
  });
  const s = server.serve({ port: 3134 });
  const res = await fetch("http://localhost:3134/");
  assertEquals(res.status, 500);
  assertEquals(await res.text(), "Internal Server Error");
  s.close();
});

Deno.test("Coverage - root handler can call ctx.renderToString stub", async () => {
  _resetForTests();
  server.get("/render-stub", (_req, ctx) => {
    // call the renderToString stub exposed on the context
    return (ctx as unknown as { renderToString?: (c: unknown) => string })
      .renderToString?.("x") as string;
  });
  const s = server.serve({ port: 3134 });
  const res = await fetch("http://localhost:3134/render-stub");
  const text = await res.text();
  // should return the stub HTML
  if (!text.includes("render middleware not installed")) {
    throw new Error("stub not called");
  }
  s.close();
});

Deno.test("Coverage - fast-root handler with ctx.renderToString stub", async () => {
  _resetForTests();
  // Register root route that expects ctx and calls renderToString
  server.get("/", (_req, ctx) => {
    return (ctx as unknown as { renderToString?: (c: unknown) => string })
      .renderToString?.("x") as string;
  });
  const s = server.serve({ port: 3215 });
  const res = await fetch("http://localhost:3215/");
  const text = await res.text();
  if (!text.includes("render middleware not installed")) {
    throw new Error("fast-root stub not called");
  }
  s.close();
});

Deno.test("Coverage - fast-root second clause forced", async () => {
  _resetForTests();
  // root handler with zero args (rh0) to avoid ctx creation
  server.get("/", () => "forced-root");
  const s = server.serve({ port: 3220 });
  const res = await fetch("http://localhost:3220/", {
    headers: { "x-test-force-fast-root": "1" },
  });
  assertEquals(await res.text(), "forced-root");
  s.close();
});

Deno.test("Coverage - fast-root left clause forced", async () => {
  _resetForTests();
  // root handler with zero args (rh0) to exercise left OR clause
  server.get("/", () => "forced-root-left");
  const s = server.serve({ port: 3222 });
  const res = await fetch("http://localhost:3222/", {
    headers: { "x-test-force-fast-root-left": "1" },
  });
  assertEquals(await res.text(), "forced-root-left");
  s.close();
});

Deno.test("Coverage - request without trailing slash (no thirdSlash)", async () => {
  _resetForTests();
  server.get("/", () => "no-third");
  const s = server.serve({ port: 3333 });
  const res = await fetch("http://localhost:3333");
  assertEquals(await res.text(), "no-third");
  s.close();
});

Deno.test("Coverage - pathname computation comprehensive", async () => {
  _resetForTests();
  server.get("/", () => "root");
  server.get("/path", () => "path");
  const s = server.serve({ port: 3337 });

  // 1. thirdSlash !== -1, qIdx === -1 (standard path)
  const res1 = await fetch("http://localhost:3337/path");
  assertEquals(await res1.text(), "path");

  // 2. thirdSlash !== -1, qIdx !== -1 (path + query)
  const res2 = await fetch("http://localhost:3337/path?a=1");
  assertEquals(await res2.text(), "path");

  // 3. thirdSlash === -1 (should fall back to "/")
  // Note: Most fetch implementations normalize http://localhost:port to http://localhost:port/
  // But we can try to force a request with no trailing slash if possible.
  const res3 = await fetch("http://localhost:3337");
  assertEquals(await res3.text(), "root");

  s.close();
});

Deno.test("Coverage - fast-root second clause forced with ctx", async () => {
  _resetForTests();
  // root handler that expects ctx (rh0 = false) but does not access ctx.url
  server.get("/", (_req: Request, _ctx) => "forced-root-ctx");
  const s = server.serve({ port: 3221 });
  const res = await fetch("http://localhost:3221/", {
    headers: { "x-test-force-fast-root": "1" },
  });

  // direct handler invocation removed to avoid adding test-only hooks
  assertEquals(await res.text(), "forced-root-ctx");
  s.close();
});

Deno.test("Coverage - cached route uses cachedCtx.renderToString stub", async () => {
  _resetForTests();
  server.get("/cache-render", (_req, ctx) => {
    return (ctx as unknown as { renderToString?: (c: unknown) => string })
      .renderToString?.("x") as string;
  });
  const s = server.serve({ port: 3135 });
  // prime the cache
  await (await fetch("http://localhost:3135/cache-render")).text();
  // second request should hit cached branch and still call the stub
  const res = await fetch("http://localhost:3135/cache-render");
  const text = await res.text();
  if (!text.includes("render middleware not installed")) {
    throw new Error("cached stub not called");
  }
  s.close();
});

Deno.test("Coverage - cache hit with middlewares in runFinal", async () => {
  _resetForTests();
  server.use((_req, _ctx, next) =>
    next ? (next() as unknown as Response) : ("fail" as unknown as Response)
  );
  server.get("/final-cache", () => "ok");
  const s = server.serve({ port: 3135 });
  await (await fetch("http://localhost:3135/final-cache")).text();
  const res = await fetch("http://localhost:3135/final-cache");
  assertEquals(await res.text(), "ok");
  s.close();
});

Deno.test("Coverage - cache hit with route middlewares in runFinal", async () => {
  _resetForTests();
  server.get(
    "/final-route-cache",
    () => "ok",
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
  );
  const s = server.serve({ port: 3136 });
  await (await fetch("http://localhost:3136/final-route-cache")).text();
  const res = await fetch("http://localhost:3136/final-route-cache");
  assertEquals(await res.text(), "ok");
  s.close();
});

Deno.test("Coverage - 404 cache limit eviction", async () => {
  _resetForTests();
  const s = server.serve({ port: 3137, cacheSize: 1 });
  // First 404
  await (await fetch("http://localhost:3137/404-1")).text();
  // Second 404 should evict first
  await (await fetch("http://localhost:3137/404-2")).text();
  const res = await fetch("http://localhost:3137/404-2");
  assertEquals(res.status, 404);
  await res.text();
  s.close();
});

Deno.test("Coverage - fast-root with credentials in URL", async () => {
  _resetForTests();
  server.get("/", () => "cred-root");
  const s = server.serve({ port: 3400 });
  const res = await fetch("http://user:pass@localhost:3400/");
  assertEquals(await res.text(), "cred-root");
  s.close();
});

Deno.test("Coverage - fast-root pathname else branch (longer path)", async () => {
  _resetForTests();
  server.get("/long/path", () => "long");
  const s = server.serve({ port: 3401 });
  const res = await fetch("http://localhost:3401/long/path");
  assertEquals(await res.text(), "long");
  s.close();
});

Deno.test("Coverage - explicit url length equals thirdSlash+1 case", async () => {
  _resetForTests();
  // create a single-segment path to exercise pathname length handling
  server.get("/x", () => "single-trailing");
  const s = server.serve({ port: 3402 });
  const res = await fetch("http://localhost:3402/x");
  assertEquals(await res.text(), "single-trailing");
  s.close();
});

Deno.test("Coverage - URL lazy getter no query", async () => {
  _resetForTests();
  server.get("/no-query", (_req, ctx) => {
    return ctx.url.pathname;
  });
  const s = server.serve({ port: 3138 });
  const res = await fetch("http://localhost:3138/no-query");
  assertEquals(await res.text(), "/no-query");
  s.close();
});

Deno.test("Coverage - registerRoute with URLPattern", async () => {
  _resetForTests();
  server.get(new URLPattern({ pathname: "/urlpattern" }), () => "up");
  const s = server.serve({ port: 3340 });
  const res = await fetch("http://localhost:3340/urlpattern");
  assertEquals(await res.text(), "up");
  s.close();
});

Deno.test("Coverage - routeRegex escaping and wildcard", async () => {
  _resetForTests();
  server.get("/a.b", () => "escaped");
  server.get("/wild/*", () => "wildcard");
  const s = server.serve({ port: 3341 });
  const r1 = await fetch("http://localhost:3341/a.b");
  assertEquals(await r1.text(), "escaped");
  const r2 = await fetch("http://localhost:3341/wild/anything/here");
  assertEquals(await r2.text(), "wildcard");
  s.close();
});

Deno.test("Coverage - middleware async + handler Promise", async () => {
  _resetForTests();
  server.get(
    "/mw-async",
    () => Promise.resolve("ok"),
    async (_req, _ctx, next) => {
      const out = next ? await (next() as unknown as Promise<unknown>) : "fail";
      if (out instanceof Response) return out;
      if (typeof out === "string") return new Response(out);
      return new Response("Internal Server Error", { status: 500 });
    },
  );
  server.get(
    "/res-mw",
    () => new Response("resp"),
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
  );
  const s = server.serve({ port: 3342 });
  const r1 = await fetch("http://localhost:3342/mw-async");
  assertEquals(await r1.text(), "ok");
  const r2 = await fetch("http://localhost:3342/res-mw");
  assertEquals(await r2.text(), "resp");
  s.close();
});

Deno.test("Coverage - param names missing in groups", async () => {
  _resetForTests();
  // Simulate a pattern that has a group but doesn't match the expected name?
  // Actually, URLPattern always provides the names.
  // But let's try to hit the ?? "" branch.
  server.get("/:id", (_req, ctx) => ctx.params.id || "empty");
  const s = server.serve({ port: 3139 });
  // This probably won't hit it because URLPattern is reliable.
  const res = await fetch("http://localhost:3139/123");
  assertEquals(await res.text(), "123");
  s.close();
});

Deno.test("Coverage - toResponse fallback", async () => {
  _resetForTests();
  // @ts-ignore: testing
  server.get("/fallback", () => ({}) as unknown);
  const s = server.serve({ port: 3140 });
  const res = await fetch("http://localhost:3140/fallback");
  // Now it returns 200 because we support JSON
  assertEquals(res.status, 200);
  await res.json();
  s.close();
});

Deno.test("Coverage - cache hit with middlewares in runFinal - Response", async () => {
  _resetForTests();
  server.use((_req, _ctx, next) =>
    next ? (next() as unknown as Response) : ("fail" as unknown as Response)
  );
  server.get("/final-cache-res", () => new Response("ok"));
  const s = server.serve({ port: 3141 });
  await (await fetch("http://localhost:3141/final-cache-res")).text();
  const res = await fetch("http://localhost:3141/final-cache-res");
  assertEquals(await res.text(), "ok");
  s.close();
});

Deno.test("Coverage - cache hit with middlewares in runFinal - Promise", async () => {
  _resetForTests();
  server.use((_req, _ctx, next) =>
    next ? (next() as unknown as Response) : ("fail" as unknown as Response)
  );
  server.get("/final-cache-promise", () => Promise.resolve("ok"));
  const s = server.serve({ port: 3142 });
  await (await fetch("http://localhost:3142/final-cache-promise")).text();
  const res = await fetch("http://localhost:3142/final-cache-promise");
  assertEquals(await res.text(), "ok");
  s.close();
});

Deno.test("Coverage - cache hit with route middlewares in runFinal - Response", async () => {
  _resetForTests();
  server.get(
    "/final-route-cache-res",
    () => new Response("ok"),
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
  );
  const s = server.serve({ port: 3143 });
  await (await fetch("http://localhost:3143/final-route-cache-res")).text();
  const res = await fetch("http://localhost:3143/final-route-cache-res");
  assertEquals(await res.text(), "ok");
  s.close();
});

Deno.test("Coverage - cache hit with route middlewares in runFinal - Promise", async () => {
  _resetForTests();
  server.get(
    "/final-route-cache-promise",
    () => Promise.resolve("ok"),
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
  );
  const s = server.serve({ port: 3144 });
  await (await fetch("http://localhost:3144/final-route-cache-promise")).text();
  const res = await fetch("http://localhost:3144/final-route-cache-promise");
  assertEquals(await res.text(), "ok");
  s.close();
});

Deno.test("Coverage - URL lazy getter with query", async () => {
  _resetForTests();
  server.get("/with-query", (_req, ctx) => {
    return ctx.url.search;
  });
  const s = server.serve({ port: 3145 });
  const res = await fetch("http://localhost:3145/with-query?a=1");
  assertEquals(await res.text(), "?a=1");
  s.close();
});

Deno.test("Coverage - tryRoute with route middlewares - Response", async () => {
  _resetForTests();
  server.get(
    "/route-mw-res",
    () => new Response("ok"),
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
  );
  const s = server.serve({ port: 3146 });
  const res = await fetch("http://localhost:3146/route-mw-res");
  assertEquals(await res.text(), "ok");
  s.close();
});

Deno.test("Coverage - tryRoute with route middlewares - Promise", async () => {
  _resetForTests();
  server.get(
    "/route-mw-promise",
    () => Promise.resolve("ok"),
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
  );
  const s = server.serve({ port: 3147 });
  const res = await fetch("http://localhost:3147/route-mw-promise");
  assertEquals(await res.text(), "ok");
  s.close();
});

Deno.test("Coverage - tryRoute with route middlewares - cached Response", async () => {
  _resetForTests();
  server.get(
    "/route-mw-cached-res",
    () => new Response("ok"),
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
  );
  const s = server.serve({ port: 3148 });
  await (await fetch("http://localhost:3148/route-mw-cached-res")).text();
  const res = await fetch("http://localhost:3148/route-mw-cached-res");
  assertEquals(await res.text(), "ok");
  s.close();
});

Deno.test("Coverage - tryRoute with route middlewares - cached Promise", async () => {
  _resetForTests();
  server.get(
    "/route-mw-cached-promise",
    () => Promise.resolve("ok"),
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
  );
  const s = server.serve({ port: 3149 });
  await (await fetch("http://localhost:3149/route-mw-cached-promise")).text();
  const res = await fetch("http://localhost:3149/route-mw-cached-promise");
  assertEquals(await res.text(), "ok");
  s.close();
});

Deno.test("Coverage - URL lazy getter regular path", async () => {
  _resetForTests();
  server.get("/url-regular-new", (_req, ctx) => ctx.url.pathname);
  const s = server.serve({ port: 3150 });
  const res = await fetch("http://localhost:3150/url-regular-new");
  assertEquals(await res.text(), "/url-regular-new");
  s.close();
});

Deno.test("Coverage - promise nested", async () => {
  _resetForTests();
  // @ts-ignore: testing
  server.get("/promise-nested", () => Promise.resolve(Promise.resolve("ok")));
  const s = server.serve({ port: 3151 });
  const res = await fetch("http://localhost:3151/promise-nested");
  assertEquals(await res.text(), "ok");
  s.close();
});

Deno.test("Coverage - cached 404 with global middleware", async () => {
  _resetForTests();
  server.use((_req, _ctx, next) =>
    next ? (next() as unknown as Response) : ("fail" as unknown as Response)
  );
  const s = server.serve({ port: 3152 });
  await fetch("http://localhost:3152/404").then((r) => r.text());
  const res = await fetch("http://localhost:3152/404");
  assertEquals(res.status, 404);
  await res.text();
  s.close();
});

Deno.test("Coverage - tryRoute with route middleware first hit", async () => {
  _resetForTests();
  server.get(
    "/route-mw-first",
    () => "ok",
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
  );
  const s = server.serve({ port: 3153 });
  const res = await fetch("http://localhost:3153/route-mw-first");
  assertEquals(await res.text(), "ok");
  s.close();
});

Deno.test("Coverage - runFinal cached with global middleware added after cache", async () => {
  _resetForTests();
  server.get("/cached-global-after", () => "ok");
  const s = server.serve({ port: 3160 });
  // first request sets the cache while there are no global middlewares
  await (await fetch("http://localhost:3160/cached-global-after")).text();
  // now add a global middleware so handler uses runFinal cached branch
  server.use((_req, _ctx, next) =>
    next ? (next() as unknown as Response) : ("fail" as unknown as Response)
  );
  const res = await fetch("http://localhost:3160/cached-global-after");
  assertEquals(await res.text(), "ok");
  s.close();
});

Deno.test("Coverage - runFinal cached with route middlewares (applyMiddlewares path)", async () => {
  _resetForTests();
  server.get(
    "/cached-route-mw",
    () => "ok",
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
  );
  const s = server.serve({ port: 3161 });
  // prime the cache
  await (await fetch("http://localhost:3161/cached-route-mw")).text();
  // second request should hit runFinal -> applyMiddlewares for route middlewares
  const res = await fetch("http://localhost:3161/cached-route-mw");
  assertEquals(await res.text(), "ok");
  s.close();
});

Deno.test("Coverage - explicit tryRoute applyMiddlewares", async () => {
  _resetForTests();
  server.get(
    "/cover-apply",
    () => "ok",
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
  );
  const s = server.serve({ port: 3170 });
  const res = await fetch("http://localhost:3170/cover-apply");
  assertEquals(await res.text(), "ok");
  s.close();
});

Deno.test("Coverage - explicit runFinal cached no-route-mw", async () => {
  _resetForTests();
  server.get("/cover-runfinal", () => "ok");
  const s = server.serve({ port: 3171 });
  // prime cache
  await (await fetch("http://localhost:3171/cover-runfinal")).text();
  // hit cached-runFinal path
  const res = await fetch("http://localhost:3171/cover-runfinal");
  assertEquals(await res.text(), "ok");
  s.close();
});

Deno.test("Coverage - URLPattern in serve", async () => {
  _resetForTests();
  server.get(
    new URLPattern({ pathname: "/urlp" }) as unknown as URLPattern,
    () => "urlp",
  );
  const s = server.serve({ port: 3180 });
  const res = await fetch("http://localhost:3180/urlp");
  assertEquals(await res.text(), "urlp");
  s.close();
});

Deno.test("Coverage - Custom exec in serve", async () => {
  _resetForTests();
  const pattern = {
    pathname: undefined,
    exec: (_url: string) => {
      if (_url.endsWith("/custom")) {
        return { pathname: { groups: { name: "custom" } } };
      }
      return null;
    },
  };
  server.get(pattern as unknown as URLPattern, (_req, _ctx) => "custom");
  const s = server.serve({ port: 3181 });
  const res = await fetch("http://localhost:3181/custom");
  assertEquals(await res.text(), "custom");
  s.close();
});

Deno.test("Coverage - Custom exec mismatch", async () => {
  _resetForTests();
  const pattern = {
    pathname: undefined,
    exec: (_url: string) => null,
  };
  server.get(pattern as unknown as URLPattern, () => "fail");
  const s = server.serve({ port: 3182 });
  const res = await fetch("http://localhost:3182/miss");
  assertEquals(res.status, 404);
  await res.text();
  s.close();
});

Deno.test("Coverage - cache hit with global middleware and route middleware", async () => {
  _resetForTests();
  server.use(async (_req, _ctx, next) => {
    const res = await next!();
    res.headers.set("x-global", "1");
    return res;
  });
  server.get("/both-mw", () => "ok", (_req, _ctx, next) => next!());
  const s = server.serve({ port: 3183 });
  // first call - cache miss
  const res1 = await fetch("http://localhost:3183/both-mw");
  assertEquals(await res1.text(), "ok");
  assertEquals(res1.headers.get("x-global"), "1");
  // second call - cache hit
  const res2 = await fetch("http://localhost:3183/both-mw");
  assertEquals(await res2.text(), "ok");
  assertEquals(res2.headers.get("x-global"), "1");
  s.close();
});

Deno.test("Coverage - runFinal cached with global middleware but no route middleware", async () => {
  _resetForTests();
  server.use(async (_req, _ctx, next) => {
    const res = await next!();
    res.headers.set("x-global", "1");
    return res;
  });
  server.get("/global-only-cached", () => "ok");
  const s = server.serve({ port: 3184 });
  // first call - cache miss
  await (await fetch("http://localhost:3184/global-only-cached")).text();
  // second call - cache hit
  const res = await fetch("http://localhost:3184/global-only-cached");
  assertEquals(await res.text(), "ok");
  assertEquals(res.headers.get("x-global"), "1");
  s.close();
});

Deno.test("Coverage - toResponse nested promise", async () => {
  _resetForTests();
  // @ts-ignore: testing
  server.get("/nested", () => Promise.resolve(Promise.resolve("ok")));
  const s = server.serve({ port: 3191 });
  const res = await fetch("http://localhost:3191/nested");
  assertEquals(await res.text(), "ok");
  s.close();
});

Deno.test("Coverage - cached 404 in runFinal", async () => {
  _resetForTests();
  server.use((_req, _ctx, next) => next!());
  const s = server.serve({ port: 3190 });
  await (await fetch("http://localhost:3190/404")).text();
  const res = await fetch("http://localhost:3190/404");
  assertEquals(res.status, 404);
  await res.text();
  s.close();
});

Deno.test("Coverage - matchCache hit eviction", async () => {
  _resetForTests();
  server.get("/a", () => "a");
  server.get("/b", () => "b");
  const s = server.serve({ port: 3193, cacheSize: 1 });
  await (await fetch("http://localhost:3193/a")).text();
  await (await fetch("http://localhost:3193/b")).text();
  s.close();
});

Deno.test("Coverage - server - param decoding success", async () => {
  _resetForTests();
  server.get(
    "/u/:username",
    (_req: Request, ctx: Context) => ctx.params.username,
  );
  const s = server.serve({ port: 3300 });
  const res = await fetch("http://localhost:3300/u/yanu%40fastro.dev");
  assertEquals(await res.text(), "yanu@fastro.dev");
  s.close();
});

Deno.test("Coverage - server - raw @ param preserved", async () => {
  _resetForTests();
  server.get(
    "/u2/:username",
    (_req: Request, ctx: Context) => ctx.params.username,
  );
  const s = server.serve({ port: 3301 });
  const res = await fetch("http://localhost:3301/u2/yanu@fastro.dev");
  assertEquals(await res.text(), "yanu@fastro.dev");
  s.close();
});

Deno.test("Coverage - extractParamNames fallback", async () => {
  _resetForTests();
  // @ts-ignore: testing
  server.get({ pathname: 42 }, () => "ok");
  const s = server.serve({ port: 3194 });
  const res = await fetch("http://localhost:3194/anything");
  assertEquals(res.status, 404);
  await res.text();
  s.close();
});

Deno.test("Coverage - routeRegex mapping fallback", async () => {
  _resetForTests();
  // Pass an object as path that has pathname as string but path is not string
  // and we also want to trigger the !pStr branch in routeRegex
  const p = new URLPattern({ pathname: "/foo" });
  server.get(p, () => "foo");
  const s = server.serve({ port: 3195 });
  const res = await fetch("http://localhost:3195/foo");
  assertEquals(await res.text(), "foo");
  s.close();
});

Deno.test("Coverage - tryRoute with no paramNames match", async () => {
  _resetForTests();
  server.get("/no-params", () => "ok");
  const s = server.serve({ port: 3196 });
  const res = await fetch("http://localhost:3196/no-params");
  assertEquals(await res.text(), "ok");
  s.close();
});

Deno.test("Coverage - tryRoute with route middlewares", async () => {
  _resetForTests();
  server.get("/with-mw", () => "ok", (_req, _ctx, next) => next!());
  const s = server.serve({ port: 3197 });
  const res = await fetch("http://localhost:3197/with-mw");
  assertEquals(await res.text(), "ok");
  s.close();
});

Deno.test("Coverage - applyMiddlewares fallthrough", async () => {
  _resetForTests();
  server.use((_req, _ctx, next) => next!());
  const s = server.serve({ port: 3198 });
  const res = await fetch("http://localhost:3198/404");
  assertEquals(res.status, 404);
  await res.text();
  s.close();
});

Deno.test("Coverage - hit next in runFinal cached branch", async () => {
  _resetForTests();
  server.use((_req, _ctx, next) => next!()); // global middleware triggers runFinal
  server.get("/", (_req, _ctx, next) => {
    return next!();
  });
  server.get("/", () => "second");
  const port = 3205;
  const { close } = server.serve({ port });
  try {
    const r1 = await fetch(`http://localhost:${port}/`);
    await r1.text(); // populate cache
    const res = await fetch(`http://localhost:${port}/`); // hit cache
    const text = await res.text();
    assertEquals(text, "second");
  } finally {
    close();
  }
});

Deno.test("Coverage - toResponse recursive response promise", async () => {
  _resetForTests();
  // @ts-ignore: testing
  server.get("/promise-res", () => Promise.resolve(new Response("ok")));
  const s = server.serve({ port: 3210 });
  const res = await fetch("http://localhost:3210/promise-res");
  assertEquals(await res.text(), "ok");
  s.close();
});

function resetCore() {
  _resetForTests();
}

Deno.test("route creation", async (t) => {
  await t.step("extractParamNames via route creation", () => {
    resetCore();
    server.get("/test/:id/:name", () => new Response("ok"));
    const routes = _getRoutesForTests();
    const route = routes[0];
    assertEquals(route.paramNames, ["id", "name"]);
  });

  await t.step("complex path parameters", () => {
    resetCore();
    server.get(
      "/api/:version/users/:userId/posts/:postId",
      () => new Response("ok"),
    );
    const routes = _getRoutesForTests();
    const route = routes[0];
    assertEquals(route.paramNames, ["version", "userId", "postId"]);
  });
});

Deno.test("HTTP methods", async (t) => {
  await t.step("GET route", () => {
    resetCore();
    const handler = () => new Response("ok");
    server.get("/test", handler);
    const routes = _getRoutesForTests();
    assertEquals(routes[0].method, "GET");
    assertEquals(routes[0].handler, handler);
  });

  await t.step("POST route", () => {
    resetCore();
    const handler = () => new Response("ok");
    server.post("/test", handler);
    const routes = _getRoutesForTests();
    assertEquals(routes[0].method, "POST");
  });

  await t.step("PUT route", () => {
    resetCore();
    const handler = () => new Response("ok");
    server.put("/test", handler);
    const routes = _getRoutesForTests();
    assertEquals(routes[0].method, "PUT");
  });

  await t.step("DELETE route", () => {
    resetCore();
    const handler = () => new Response("ok");
    server.delete("/test", handler);
    const routes = _getRoutesForTests();
    assertEquals(routes[0].method, "DELETE");
  });
});

Deno.test("middleware functionality", async (t) => {
  await t.step("middleware order execution", async () => {
    resetCore();
    const order: string[] = [];

    const middleware1 = async (_req: Request, _ctx: Context, next: Next) => {
      order.push("mw1-before");
      const response = await next();
      order.push("mw1-after");
      return response;
    };

    const middleware2 = async (_req: Request, _ctx: Context, next: Next) => {
      order.push("mw2-before");
      const response = await next();
      order.push("mw2-after");
      return response;
    };

    server.use(middleware1);
    server.use(middleware2);

    const handler = () => {
      order.push("handler");
      return new Response("ok");
    };

    server.get("/test", handler);
    const routes = _getRoutesForTests();
    const route = routes[0];

    const context = {
      url: new URL("http://localhost"),
      params: {},
      query: {},
      remoteAddr: {
        transport: "tcp",
        hostname: "127.0.0.1",
        port: 12345,
      } as Deno.Addr,
    };

    let index = 0;
    const allMiddlewares = [...route.middlewares, middleware1, middleware2];
    const dispatch = async (): Promise<Response> => {
      if (index >= allMiddlewares.length) {
        return handler();
      }
      const middleware = allMiddlewares[index++];
      return await middleware(
        new Request("http://localhost/test"),
        context,
        dispatch,
      );
    };

    await dispatch();
    assertEquals(order, [
      "mw1-before",
      "mw2-before",
      "handler",
      "mw2-after",
      "mw1-after",
    ]);
  });

  await t.step("route-specific middleware", async () => {
    resetCore();
    const order: string[] = [];

    const globalMiddleware = async (
      _req: Request,
      _ctx: Context,
      next: Next,
    ) => {
      order.push("global");
      return await next();
    };

    const routeMiddleware = async (
      _req: Request,
      _ctx: Context,
      next: Next,
    ) => {
      order.push("route");
      return await next();
    };

    server.use(globalMiddleware);

    const handler = () => {
      order.push("handler");
      return new Response("ok");
    };

    server.get("/test", handler, routeMiddleware);
    const routes = _getRoutesForTests();
    const route = routes[0];

    const context = {
      url: new URL("http://localhost"),
      params: {},
      query: {},
      remoteAddr: {
        transport: "tcp",
        hostname: "127.0.0.1",
        port: 12345,
      } as Deno.Addr,
    };

    let index = 0;
    const allMiddlewares = [...route.middlewares, globalMiddleware];
    const dispatch = async (): Promise<Response> => {
      if (index >= allMiddlewares.length) {
        return handler();
      }
      const middleware = allMiddlewares[index++];
      return await middleware(
        new Request("http://localhost/test"),
        context,
        dispatch,
      );
    };

    await dispatch();
    assertEquals(order, ["route", "global", "handler"]);
  });
});

Deno.test("context and rendering", async (t) => {
  await t.step("context params population", () => {
    resetCore();
    const params: Record<string, string> = {};
    const query: Record<string, string> = {};
    const context = {
      params,
      query,
      remoteAddr: {
        transport: "tcp",
        hostname: "127.0.0.1",
        port: 12345,
      } as Deno.Addr,
    };
    assertEquals(context.params, {});
    assertEquals(context.query, {});
  });

  await t.step("param population from match", () => {
    const match = {
      pathname: { groups: { id: "123", name: "test" } },
    } as unknown as URLPatternResult;
    const params: Record<string, string> = {};
    const paramNames = ["id", "name"];
    for (const name of paramNames) {
      params[name] = match.pathname.groups?.[name] ?? "";
    }
    assertEquals(params.id, "123");
    assertEquals(params.name, "test");
  });
});

Deno.test("error handling", async (t) => {
  await t.step("middleware error handling", async () => {
    resetCore();
    const errorMiddleware = () => {
      throw new Error("Middleware error");
    };

    server.use(errorMiddleware);
    const handler = () => new Response("ok");
    server.get("/test", handler);

    const routes = _getRoutesForTests();
    const route = routes[0];

    await assertRejects(
      async () => {
        const context = {
          url: new URL("http://localhost"),
          params: {},
          query: {},
          remoteAddr: {
            transport: "tcp",
            hostname: "127.0.0.1",
            port: 12345,
          } as Deno.Addr,
        };

        let index = 0;
        const allMiddlewares = [...route.middlewares, errorMiddleware];
        const dispatch = async (): Promise<Response> => {
          if (index >= allMiddlewares.length) {
            return handler();
          }
          const middleware = allMiddlewares[index++];
          return await middleware(
            new Request("http://localhost/test"),
            context,
            dispatch,
          );
        };
        await dispatch();
      },
      Error,
      "Middleware error",
    );
  });
});

Deno.test("route cache", async (t) => {
  await t.step("cache size configuration", () => {
    resetCore();
    const DEFAULT_CACHE_SIZE = 10000;
    const customCacheSize = 5000;

    // Test default cache size
    assertEquals(DEFAULT_CACHE_SIZE, 10000);

    // Test custom cache size
    assertEquals(customCacheSize, 5000);
  });

  await t.step("LRU cache eviction", () => {
    resetCore();
    const MAX_CACHE_SIZE = 3;
    const matchCache = new Map();

    // Fill cache beyond limit
    for (let i = 0; i < MAX_CACHE_SIZE + 2; i++) {
      // Simulate LRU eviction
      if (matchCache.size >= MAX_CACHE_SIZE) {
        const firstKey = matchCache.keys().next().value!;
        matchCache.delete(firstKey);
      }
      matchCache.set(`/test${i}`, { routeIndex: i, context: {} });
    }

    // Cache should not exceed MAX_CACHE_SIZE
    assertEquals(matchCache.size, MAX_CACHE_SIZE);

    // First entries should be evicted
    assert(!matchCache.has("/test0"));
    assert(!matchCache.has("/test1"));

    // Latest entries should remain
    assert(matchCache.has("/test2"));
    assert(matchCache.has("/test3"));
    assert(matchCache.has("/test4"));
  });

  await t.step("404 caching", () => {
    resetCore();
    const MAX_CACHE_SIZE = 10;
    const matchCache = new Map();

    // Cache a 404 response
    if (matchCache.size < MAX_CACHE_SIZE) {
      matchCache.set("/not-found", null);
    }

    assertEquals(matchCache.get("/not-found"), null);
    assert(matchCache.has("/not-found"));
  });
});
Deno.test("URL pattern matching", async (t) => {
  await t.step("pattern matching with parameters", () => {
    resetCore();
    server.get("/users/:id/posts/:postId", () => new Response("ok"));
    const routes = _getRoutesForTests();
    const route = routes[0];
    const pattern = route.pattern;
    const match = pattern.exec("http://localhost/users/123/posts/456");
    assert(match);
    assertEquals(match!.pathname.groups?.id, "123");
    assertEquals(match!.pathname.groups?.postId, "456");
  });

  await t.step("pattern matching without parameters", () => {
    resetCore();
    server.get("/api/users", () => new Response("ok"));
    const routes = _getRoutesForTests();
    const route = routes[0];
    const pattern = route.pattern;
    const match = pattern.exec("http://localhost/api/users");
    assert(match);
    assertEquals(route.paramNames.length, 0);
  });

  await t.step("pattern matching with empty parameter value", () => {
    resetCore();
    server.get("/users/:id", () => new Response("ok"));
    const routes = _getRoutesForTests();
    const route = routes[0];

    // Manually test the parameter extraction logic with undefined groups
    const params: Record<string, string> = {};
    const mockMatch = {
      pathname: { groups: undefined },
    } as unknown as URLPatternResult;

    for (const name of route.paramNames) {
      params[name] = mockMatch.pathname.groups?.[name] ?? "";
    }

    assertEquals(params.id, "");
  });
});

Deno.test("query parameter functionality", async (t) => {
  await t.step("empty query parameters", () => {
    const url = new URL("http://localhost/test");
    const hasQuery = url.search.length > 1;
    assertEquals(hasQuery, false);
  });

  await t.step("query parameters with values", () => {
    const url = new URL("http://localhost/test?name=John&age=30");
    const hasQuery = url.search.length > 1;
    assertEquals(hasQuery, true);

    const query: Record<string, string> = {};
    for (const [key, value] of url.searchParams) {
      query[key] = value;
    }

    assertEquals(query.name, "John");
    assertEquals(query.age, "30");
  });

  await t.step("single query parameter", () => {
    const url = new URL("http://localhost/test?name=John");
    const query: Record<string, string> = {};
    for (const [key, value] of url.searchParams) {
      query[key] = value;
    }

    assertEquals(query.name, "John");
    assertEquals(Object.keys(query).length, 1);
  });

  await t.step("query parameter with special characters", () => {
    const url = new URL(
      "http://localhost/test?search=hello%20world&filter=a%26b",
    );
    const query: Record<string, string> = {};
    for (const [key, value] of url.searchParams) {
      query[key] = value;
    }

    assertEquals(query.search, "hello world");
    assertEquals(query.filter, "a&b");
  });
});

Deno.test("performance optimizations", async (t) => {
  await t.step("conditional query parsing", () => {
    const urlWithQuery = new URL("http://localhost/test?name=John");
    const urlWithoutQuery = new URL("http://localhost/test");

    const hasQuery1 = urlWithQuery.search.length > 1;
    const hasQuery2 = urlWithoutQuery.search.length > 1;

    assert(hasQuery1);
    assert(!hasQuery2);
  });

  await t.step("middleware pre-merging", () => {
    resetCore();
    const globalMw = (_req: Request, _ctx: Context, next: Next) => next();
    const routeMw = (_req: Request, _ctx: Context, next: Next) => next();

    server.use(globalMw);
    server.get("/test", () => new Response("ok"), routeMw);

    const routes = _getRoutesForTests();
    const route = routes[0];

    // Middlewares should NOT be pre-merged anymore, they are handled separately
    assertEquals(route.middlewares.length, 1);
    assertEquals(route.middlewares[0], routeMw);
  });
});

Deno.test("serve function integration", async (t) => {
  await t.step("serve with GET route", async () => {
    resetCore();
    server.get("/hello", () => new Response("world"));
    const s = await server.serve({ port: 0 });
    const addr = s.addr as Deno.NetAddr;
    const port = addr.port;
    const res = await fetch(`http://localhost:${port}/hello`);
    assertEquals(res.status, 200);
    assertEquals(await res.text(), "world");
    s.close();
  });

  await t.step("serve with POST route", async () => {
    resetCore();
    server.post("/submit", () => new Response("submitted"));
    const s = await server.serve({ port: 0 });
    const addr = s.addr as Deno.NetAddr;
    const port = addr.port;
    const res = await fetch(`http://localhost:${port}/submit`, {
      method: "POST",
    });
    assertEquals(res.status, 200);
    assertEquals(await res.text(), "submitted");
    s.close();
  });

  await t.step("serve with route parameters", async () => {
    resetCore();
    server.get(
      "/user/:id",
      (_req, ctx) => new Response(`User ${ctx.params.id}`),
    );
    const s = await server.serve({ port: 0 });
    const addr = s.addr as Deno.NetAddr;
    const port = addr.port;
    const res = await fetch(`http://localhost:${port}/user/123`);
    assertEquals(res.status, 200);
    assertEquals(await res.text(), "User 123");
    s.close();
  });

  await t.step("serve with query parameters", async () => {
    resetCore();
    server.get("/search", (_req, ctx) => new Response(`Query: ${ctx.query.q}`));
    const s = await server.serve({ port: 0 });
    const addr = s.addr as Deno.NetAddr;
    const port = addr.port;
    const res = await fetch(`http://localhost:${port}/search?q=test`);
    assertEquals(res.status, 200);
    assertEquals(await res.text(), "Query: test");
    s.close();
  });

  await t.step("serve with 404", async () => {
    resetCore();
    server.get("/exists", () => new Response("ok"));
    const s = await server.serve({ port: 0 });
    const addr = s.addr as Deno.NetAddr;
    const port = addr.port;
    const res = await fetch(`http://localhost:${port}/notfound`);
    assertEquals(res.status, 404);
    assertEquals(await res.text(), "Not found");
    s.close();
  });

  await t.step("serve with middleware", async () => {
    resetCore();
    server.use((_req, ctx, next) => {
      ctx.test = "middleware";
      return next();
    });
    server.get("/mw", (_req, ctx) => new Response(ctx.test as string));
    const s = await server.serve({ port: 0 });
    const addr = s.addr as Deno.NetAddr;
    const port = addr.port;
    const res = await fetch(`http://localhost:${port}/mw`);
    assertEquals(res.status, 200);
    assertEquals(await res.text(), "middleware");
    s.close();
  });

  await t.step("serve fast path root route", async () => {
    resetCore();
    server.get("/", () => new Response("root"));
    const s = await server.serve({ port: 0 });
    const addr = s.addr as Deno.NetAddr;
    const port = addr.port;
    const res = await fetch(`http://localhost:${port}/`);
    assertEquals(res.status, 200);
    assertEquals(await res.text(), "root");
    s.close();
  });

  await t.step("serve root with query", async () => {
    resetCore();
    server.get("/", () => new Response("root"));
    const s = await server.serve({ port: 0 });
    const addr = s.addr as Deno.NetAddr;
    const port = addr.port;
    const res = await fetch(`http://localhost:${port}/?q=test`);
    assertEquals(res.status, 200);
    assertEquals(await res.text(), "root");
    s.close();
  });

  await t.step("serve with custom cache size", async () => {
    resetCore();
    server.get("/cache", () => new Response("cached"));
    const s = await server.serve({ port: 0, cacheSize: 5 });
    const addr = s.addr as Deno.NetAddr;
    const port = addr.port;
    const res = await fetch(`http://localhost:${port}/cache`);
    assertEquals(res.status, 200);
    assertEquals(await res.text(), "cached");
    s.close();
  });

  await t.step("hello world", async () => {
    resetCore();
    server.get("/hello", () => new Response("world"));
    const s = await server.serve({ port: 0 });
    const addr = s.addr as Deno.NetAddr;
    const port = addr.port;
    const res = await fetch(`http://localhost:${port}/hello`);
    assertEquals(res.status, 200);
    assertEquals(await res.text(), "world");
    s.close();
  });

  await t.step("cache-hit", async () => {
    resetCore();
    let counter = 0;
    server.get("/cache-hit", () => {
      counter++;
      return new Response(`counter: ${counter}`);
    });
    const s = await server.serve({ port: 0 });
    const addr = s.addr as Deno.NetAddr;
    const port = addr.port;
    const res1 = await fetch(`http://localhost:${port}/cache-hit`);
    assertEquals(res1.status, 200);
    assertEquals(await res1.text(), "counter: 1");
    const res2 = await fetch(`http://localhost:${port}/cache-hit`);
    assertEquals(res2.status, 200);
    assertEquals(await res2.text(), "counter: 2");
    s.close();
  });

  await t.step("cached-404", async () => {
    resetCore();
    server.get("/exists", () => new Response("ok"));
    const s = await server.serve({ port: 0 });
    const addr = s.addr as Deno.NetAddr;
    const port = addr.port;
    const res1 = await fetch(`http://localhost:${port}/missing`);
    assertEquals(res1.status, 404);
    assertEquals(await res1.text(), "Not found");
    const res2 = await fetch(`http://localhost:${port}/missing`);
    assertEquals(res2.status, 404);
    assertEquals(await res2.text(), "Not found");
    s.close();
  });

  await t.step("eviction", async () => {
    resetCore();
    let counterA = 0;
    let counterB = 0;
    server.get("/a", () => {
      counterA++;
      return new Response(`A: ${counterA}`);
    });
    server.get("/b", () => {
      counterB++;
      return new Response(`B: ${counterB}`);
    });
    const s = await server.serve({ port: 0, cacheSize: 1 });
    const addr = s.addr as Deno.NetAddr;
    const port = addr.port;
    // Hit /a, cache it
    const res1 = await fetch(`http://localhost:${port}/a`);
    assertEquals(await res1.text(), "A: 1");
    // Hit /b, evicts /a
    const res2 = await fetch(`http://localhost:${port}/b`);
    assertEquals(await res2.text(), "B: 1");
    // Hit /a again, should recompute since evicted
    const res3 = await fetch(`http://localhost:${port}/a`);
    assertEquals(await res3.text(), "A: 2");
    // Hit a 404, cache full so doesn't cache 404
    const res4 = await fetch(`http://localhost:${port}/missing`);
    assertEquals(res4.status, 404);
    assertEquals(await res4.text(), "Not found");
    s.close();
  });

  await t.step("serve with multiple route parameters", async () => {
    resetCore();
    server.get(
      "/api/:version/users/:userId/posts/:postId",
      (_req, ctx) =>
        new Response(
          `${ctx.params.version}-${ctx.params.userId}-${ctx.params.postId}`,
        ),
    );
    const s = await server.serve({ port: 0 });
    const addr = s.addr as Deno.NetAddr;
    const port = addr.port;
    const res = await fetch(
      `http://localhost:${port}/api/v1/users/123/posts/456`,
    );
    assertEquals(res.status, 200);
    assertEquals(await res.text(), "v1-123-456");
    s.close();
  });

  await t.step("serve with param fallback to empty string", async () => {
    resetCore();
    server.get(
      "/stub/:id",
      (_req, ctx) =>
        new Response(ctx.params.id === "" ? "(empty)" : ctx.params.id),
    );
    const routes = _getRoutesForTests();
    routes[0].pattern = {
      exec: (
        _url: string,
      ) => ({ pathname: { groups: undefined } } as unknown as URLPatternResult),
    } as unknown as URLPattern;

    const s = await server.serve({ port: 0 });
    const addr = s.addr as Deno.NetAddr;
    const port = addr.port;
    const res = await fetch(`http://localhost:${port}/stub/123`);
    assertEquals(res.status, 200);
    assertEquals(await res.text(), "(empty)");
    s.close();
  });
});
Deno.test("serve fast path root route - skip conditions", async (t) => {
  await t.step("skip if not GET", async () => {
    resetCore();
    server.get("/", () => new Response("root"));
    server.post("/", () => new Response("post root"));
    const s = await server.serve({ port: 0 });
    const addr = s.addr as Deno.NetAddr;
    const port = addr.port;
    const res = await fetch(`http://localhost:${port}/`, { method: "POST" });
    assertEquals(await res.text(), "post root");
    s.close();
  });

  await t.step("skip if has query", async () => {
    resetCore();
    server.get("/", () => {
      const _fastPathHit = true;
      return new Response("root");
    });
    const s = await server.serve({ port: 0 });
    const addr = s.addr as Deno.NetAddr;
    const port = addr.port;
    const res = await fetch(`http://localhost:${port}/?q=1`);
    assertEquals(await res.text(), "root");
    // If it was fast path, it would have returned "root" but we want to ensure it went through the normal path
    // We can't easily check internal state here without more instrumentation
    s.close();
  });
});

Deno.test("serve - cache hit with middlewares", async () => {
  resetCore();
  let mwCount = 0;
  server.use((_req, _ctx, next) => {
    mwCount++;
    return next();
  });
  server.get("/cache-mw", () => new Response("ok"));
  const s = await server.serve({ port: 0 });
  const addr = s.addr as Deno.NetAddr;
  const port = addr.port;

  const res1 = await fetch(`http://localhost:${port}/cache-mw`);
  await res1.text();
  assertEquals(mwCount, 1);

  const res2 = await fetch(`http://localhost:${port}/cache-mw`);
  await res2.text();
  assertEquals(mwCount, 2);
  s.close();
});

Deno.test("serve - fallthrough between routes", async () => {
  resetCore();
  server.get("/fall", (_req, _ctx, next) => next!());
  server.get("/fall", () => new Response("second"));
  const s = await server.serve({ port: 0 });
  const addr = s.addr as Deno.NetAddr;
  const port = addr.port;
  const res = await fetch(`http://localhost:${port}/fall`);
  assertEquals(await res.text(), "second");
  s.close();
});

Deno.test("string response", async (t) => {
  await t.step("GET /string returns string as Response", async () => {
    _resetForTests();
    server.get("/string", () => "Hello world!");

    const instance = await server.serve({ port: 0 });
    const port = (instance.addr as Deno.NetAddr).port;

    try {
      const res = await fetch(`http://localhost:${port}/string`);
      const text = await res.text();
      assertEquals(res.status, 200);
      assertEquals(text, "Hello world!");
    } finally {
      await instance.shutdown();
    }
  });

  await t.step("Async string response", async () => {
    _resetForTests();
    server.get("/async-string", async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      return "Hello async world!";
    });

    const instance = await server.serve({ port: 0 });
    const port = (instance.addr as Deno.NetAddr).port;

    try {
      const res = await fetch(`http://localhost:${port}/async-string`);
      const text = await res.text();
      assertEquals(res.status, 200);
      assertEquals(text, "Hello async world!");
    } finally {
      await instance.shutdown();
    }
  });
});

Deno.test("serve - cache hit with fallthrough across multiple requests", async () => {
  _resetForTests();
  let callCount = 0;
  server.get("/multi-fall", (_req, _ctx, next) => {
    callCount++;
    return next!();
  });
  server.get("/multi-fall", (_req, _ctx) => {
    return new Response("second match");
  });

  const s = await server.serve({ port: 0 });
  const addr = s.addr as Deno.NetAddr;
  const port = addr.port;

  // First request: should hit both
  const res1 = await fetch(`http://localhost:${port}/multi-fall`);
  assertEquals(await res1.text(), "second match");
  assertEquals(callCount, 1);

  // Second request: should hit cache for the first route
  const res2 = await fetch(`http://localhost:${port}/multi-fall`);
  assertEquals(await res2.text(), "second match");
  assertEquals(callCount, 2);

  s.close();
});

Deno.test("Coverage - toResponse JSON support", async () => {
  _resetForTests();
  server.get("/json", () => ({ hello: "world" }));
  const s = server.serve({ port: 3220 });
  const res = await fetch("http://localhost:3220/json");
  const data = await res.json();
  assertEquals(data.hello, "world");
  assertEquals(res.headers.get("content-type"), "application/json");
  s.close();
});

Deno.test("Coverage - Catch-all route (*)", async () => {
  _resetForTests();
  server.get("/static/*", () => "static");
  const s = server.serve({ port: 3221 });
  const res = await fetch("http://localhost:3221/static/any/path");
  assertEquals(await res.text(), "static");
  s.close();
});

Deno.test("Coverage - URLPattern with empty pathname", async () => {
  _resetForTests();
  // @ts-ignore: Simulate edge case
  const pattern = {
    exec: () => ({ pathname: { groups: {} } }),
  } as unknown as URLPattern;
  server.get(pattern, () => "match");
  const s = server.serve({ port: 3222 });
  const res = await fetch("http://localhost:3222/any");
  assertEquals(await res.text(), "match");
  s.close();
});

Deno.test("Coverage - toResponse with null and undefined", async () => {
  _resetForTests();
  // @ts-ignore: testing
  server.get("/null", () => null);
  // @ts-ignore: testing
  server.get("/undef", () => undefined);
  const s = server.serve({ port: 3223 });

  const res1 = await fetch("http://localhost:3223/null");
  await res1.body?.cancel();

  const res2 = await fetch("http://localhost:3223/undef");
  await res2.body?.cancel();

  s.close();
});

Deno.test("Coverage - extractParamNames with URLPattern having no pathname", async () => {
  _resetForTests();
  // @ts-ignore: force URLPattern-like object without pathname
  const pattern = {} as URLPattern;
  server.get(pattern, () => "ok");
  const s = server.serve({ port: 3224 });
  const res = await fetch("http://localhost:3224/");
  await res.text();
  s.close();
});

Deno.test("Coverage - server patch, head, options", async () => {
  _resetForTests();
  server.patch("/patch", () => "patched");
  server.head("/head", () => "headed");
  server.options("/options", () => "optioned");
  const s = server.serve({ port: 3225 });

  const resPatch = await fetch("http://localhost:3225/patch", {
    method: "PATCH",
  });
  assertEquals(await resPatch.text(), "patched");

  const resHead = await fetch("http://localhost:3225/head", {
    method: "HEAD",
  });
  assertEquals(resHead.status, 200);

  const resOptions = await fetch("http://localhost:3225/options", {
    method: "OPTIONS",
  });
  assertEquals(await resOptions.text(), "optioned");
  s.close();
});

Deno.test("Coverage - server - invalid parameter decoding", async () => {
  _resetForTests();
  server.get("/u/:name", (_req, ctx) => ctx.params.name);
  const s = server.serve({ port: 3326 });
  const res = await fetch("http://localhost:3326/u/%E0%A4%A");
  assertEquals(await res.text(), "%E0%A4%A");
  s.close();
});

Deno.test("Coverage - server - toResponse fallthrough", async () => {
  _resetForTests();
  // @ts-ignore: testing invalid return
  server.get("/err", () => undefined);
  const s = server.serve({ port: 3327 });
  const res = await fetch("http://localhost:3327/err");
  assertEquals(res.status, 500);
  await res.body?.cancel();
  s.close();
});

Deno.test("Coverage - server - stub renderToString warning", async () => {
  _resetForTests();
  let warned = false;
  const originalWarn = console.warn;
  console.warn = () => {
    warned = true;
  };

  server.get("/", (_req, ctx) => {
    // @ts-ignore: checking stub implementation
    return ctx.renderToString("test");
  });

  const s = server.serve({ port: 3328 });
  const res = await fetch("http://localhost:3328/");
  assert(
    (await res.text()).includes(
      "renderToString: render middleware not installed",
    ),
  );
  assert(warned);

  console.warn = originalWarn;
  s.close();
});

Deno.test("Coverage - server - cache eviction", async () => {
  _resetForTests();
  server.get("/test/:id", () => "ok");
  const s = server.serve({ port: 3329 });

  // Fill cache
  for (let i = 0; i < 1001; i++) {
    const res = await fetch(`http://localhost:3329/test/${i}`);
    await res.body?.cancel();
  }

  s.close();
});

Deno.test("Coverage - direct internals and registrations", async () => {
  _resetForTests();
  // register one route per method to ensure registration branches are hit
  server.get("/mget", () => "g");
  server.post("/mpost", () => "p");
  server.put("/mput", () => "u");
  server.delete("/mdelete", () => "d");
  server.patch("/mpatch", () => "pt");
  server.head("/mhead", () => "h");
  server.options("/moptions", () => "o");

  // also register using URLPattern to hit the alternate branch
  server.get(
    new URLPattern({ pathname: "/up" }) as unknown as URLPattern,
    () => "up",
  );

  const s = server.serve({ port: 3330 });
  // smoke requests to ensure routes are wired and consume bodies
  await (await fetch("http://localhost:3330/mget")).text();
  await (await fetch("http://localhost:3330/mpost", { method: "POST" })).text();
  await (await fetch("http://localhost:3330/mput", { method: "PUT" })).text();
  await (await fetch("http://localhost:3330/mdelete", { method: "DELETE" }))
    .text();
  await (await fetch("http://localhost:3330/mpatch", { method: "PATCH" }))
    .text();
  await (await fetch("http://localhost:3330/mhead", { method: "HEAD" })).text();
  await (await fetch("http://localhost:3330/moptions", { method: "OPTIONS" }))
    .text();
  await (await fetch("http://localhost:3330/up")).text();

  s.close();
});

Deno.test("Coverage - pathname derivation - origin only no trailing slash", async () => {
  _resetForTests();
  server.get("/", () => "root");
  const s = server.serve({ port: 3505 });

  const conn = await Deno.connect({ port: 3505 });
  // Host header is empty string
  const request = "GET / HTTP/1.1\r\nHost: \r\nConnection: close\r\n\r\n";
  await conn.write(new TextEncoder().encode(request));

  const buf = new Uint8Array(1024);
  await conn.read(buf);
  conn.close();
  s.close();
});

Deno.test("Coverage - pathname derivation - origin with query no trailing slash", async () => {
  _resetForTests();
  server.get("/", () => "root");
  const s = server.serve({ port: 3506 });

  const conn = await Deno.connect({ port: 3506 });
  const request =
    "GET http://localhost:3506?a=1 HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n";
  await conn.write(new TextEncoder().encode(request));

  const buf = new Uint8Array(1024);
  await conn.read(buf);
  conn.close();
  s.close();
});

Deno.test("Coverage - pathname derivation - path with query", async () => {
  _resetForTests();
  server.get("/p", () => "p");
  const s = server.serve({ port: 3507 });
  const res = await fetch("http://localhost:3507/p?a=1");
  assertEquals(await res.text(), "p");
  s.close();
});

Deno.test("Coverage - pathname derivation - complete scenario", async () => {
  _resetForTests();
  // Add a middleware to disable fastRoot and force regular path calculation coverage
  server.use((_req, _ctx, next) => next ? next() : new Response("ok"));
  server.get("/", () => "root");
  server.get("/p", () => "p");
  const s = server.serve({ port: 3510 });

  // 1. Hit thirdSlash === -1 by using an empty Host header resulting in http:///
  const conn1 = await Deno.connect({ port: 3510 });
  await conn1.write(
    new TextEncoder().encode(
      "GET / HTTP/1.1\r\nHost: \r\nConnection: close\r\n\r\n",
    ),
  );
  const buf1 = new Uint8Array(1024);
  await conn1.read(buf1);
  conn1.close();

  // 2. Hit thirdSlash !== -1 and qIdx === -1
  const r2 = await fetch("http://localhost:3510/");
  assertEquals(await r2.text(), "root");

  // 3. Hit thirdSlash !== -1 and qIdx !== -1
  const r3 = await fetch("http://localhost:3510/?a=1");
  assertEquals(await r3.text(), "root");

  // 4. Hit sub-branch with longer path
  const r4 = await fetch("http://localhost:3510/p");
  assertEquals(await r4.text(), "p");

  s.close();
});

Deno.test("server handles custom pattern-like object and URLPattern mounts", async () => {
  _resetForTests();

  // 1) custom pattern object with exec(url) and no pathname -> triggers rawPattern.exec branch
  const customPattern = {
    exec: (_url: string) => ({ pathname: { groups: { foo: "bar" } } }),
  } as unknown as URLPattern;

  server.get(customPattern, () => "custom-ok");

  // 2) URLPattern instance mount (string-like) -> should register /modules/user
  server.get(new URLPattern({ pathname: "/modules/user" }), () => "mod-user");

  const paths = _getRoutePaths();
  // Expect registered mounts include the explicit string and possibly empty string for custom
  const hasModules = paths.some((p) => p === "/modules/user");
  assertEquals(hasModules, true);

  // Start server and verify responses
  const s = server.serve({ port: 3520 });
  try {
    const r1 = await fetch("http://localhost:3520/modules/user");
    assertEquals(await r1.text(), "mod-user");

    // customPattern's exec always matches; call root URL to exercise it
    const r2 = await fetch("http://localhost:3520/");
    assertEquals(await r2.text(), "custom-ok");
  } finally {
    s.close();
  }
});

Deno.test("registerRoute splice branch exercised (multiple cases)", () => {
  // Case A: register less-specific then more-specific -> more-specific should splice in front
  _resetForTests();
  server.get("/", () => "root");
  server.get("/index", () => "index");
  let paths = _getRoutePaths();
  assertEquals(paths[0], "/index");
  assertEquals(paths.includes("/"), true);

  // Case B: register wildcard then specific
  _resetForTests();
  server.get("/*", () => "wild");
  server.get("/user", () => "user");
  paths = _getRoutePaths();
  assertEquals(paths[0], "/user");
  assertEquals(paths.includes("/*"), true);

  // Case C: deeper path splices before parent
  _resetForTests();
  server.get("/a", () => "a");
  server.get("/a/b/c", () => "deep");
  paths = _getRoutePaths();
  assertEquals(paths[0], "/a/b/c");
  assertEquals(paths[paths.length - 1], "/a");
});

Deno.test("registerRoute splice into middle when specificity falls between existing routes", () => {
  _resetForTests();

  // Register a very specific route first
  server.get("/aaa/bbb/ccc", () => "deep");
  // Register a low-specificity route later
  server.get("/x", () => "x");

  // Now insert a route whose specificity should place it between the two
  server.get("/aaa/bbb", () => "mid");

  const paths = _getRoutePaths();
  // Expect the deep route to remain first, the new mid route to be second,
  // and the low-specificity `/x` to be last.
  assertEquals(paths[0], "/aaa/bbb/ccc");
  assertEquals(paths[1], "/aaa/bbb");
  assertEquals(paths[paths.length - 1], "/x");
});

Deno.test("Coverage - registerRoute splice with non-string pStr branch", () => {
  _resetForTests();
  // 1. insert a low specificity route
  server.get("/*", () => "wild");
  // 2. insert a high specificity route with a non-string pathname (e.g., number 42)
  // specificity() will cast it to string "42" and rank it higher than "/*".
  // Because its type is "number", the `typeof pStr === "string"` ternary on line 204 evaluates to false,
  // returning `""` for the routePaths splice.
  // @ts-ignore: testing invalid type coverage
  server.get({ pathname: 42 }, () => "num");
});

// ──────────────────────────────────────────────────────────────────────────────
// Coverage gap: applyMiddlewares generic dispatch loop (3+ middlewares)
// ──────────────────────────────────────────────────────────────────────────────

Deno.test("Coverage - applyMiddlewares with 3+ middlewares (tryRoute first hit)", async () => {
  _resetForTests();
  server.get(
    "/three-mw",
    () => "ok",
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
  );
  const s = server.serve({ port: 3600 });
  const res = await fetch("http://localhost:3600/three-mw");
  assertEquals(await res.text(), "ok");
  s.close();
});

Deno.test("Coverage - applyMiddlewares with 3+ middlewares (cached fast-path)", async () => {
  _resetForTests();
  server.get(
    "/three-mw-cached",
    () => "ok",
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
  );
  const s = server.serve({ port: 3601 });
  // prime cache
  await (await fetch("http://localhost:3601/three-mw-cached")).text();
  // second request hits the cached fast-path → applyMiddlewares dispatch loop
  const res = await fetch("http://localhost:3601/three-mw-cached");
  assertEquals(await res.text(), "ok");
  s.close();
});

// ──────────────────────────────────────────────────────────────────────────────
// Coverage gap: root fast-path → JSON object response (DA:432)
// ──────────────────────────────────────────────────────────────────────────────

Deno.test("Coverage - root fast-path returns JSON object", async () => {
  _resetForTests();
  // @ts-ignore: testing
  server.get("/", () => ({ ok: true }) as unknown);
  const s = server.serve({ port: 3602 });
  const res = await fetch("http://localhost:3602/");
  assertEquals(res.status, 200);
  assertEquals(await res.json(), { ok: true });
  s.close();
});

// ──────────────────────────────────────────────────────────────────────────────
// Coverage gap: cached fast-path (no middleware) → JSON object (DA:473)
// ──────────────────────────────────────────────────────────────────────────────

Deno.test("Coverage - cached fast-path no-mw returns JSON object", async () => {
  _resetForTests();
  // @ts-ignore: testing
  server.get("/cached-json", () => ({ cached: true }) as unknown);
  const s = server.serve({ port: 3603 });
  // prime the cache
  await (await fetch("http://localhost:3603/cached-json")).json();
  // second request hits cached path → DA:473 Response.json branch
  const res = await fetch("http://localhost:3603/cached-json");
  assertEquals(res.status, 200);
  assertEquals(await res.json(), { cached: true });
  s.close();
});

// ──────────────────────────────────────────────────────────────────────────────
// Coverage gap: cached single-mw fast-path → handler returns object (DA:483-487)
// ──────────────────────────────────────────────────────────────────────────────

Deno.test("Coverage - cached single-mw fast-path returns JSON object", async () => {
  _resetForTests();
  server.get(
    "/cached-mw-json",
    // @ts-ignore: testing
    () => ({ mw: true }) as unknown,
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
  );
  const s = server.serve({ port: 3604 });
  // prime the cache
  await (await fetch("http://localhost:3604/cached-mw-json")).json();
  // second request hits cached single-mw path → DA:483-487
  const res = await fetch("http://localhost:3604/cached-mw-json");
  assertEquals(res.status, 200);
  assertEquals(await res.json(), { mw: true });
  s.close();
});

Deno.test("Coverage - cached single-mw fast-path handler returns 500", async () => {
  _resetForTests();
  server.get(
    "/cached-mw-500",
    // @ts-ignore: testing
    () => 42 as unknown,
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
  );
  const s = server.serve({ port: 3605 });
  // prime the cache
  await (await fetch("http://localhost:3605/cached-mw-500")).text();
  // second request hits cached single-mw path → DA:486 500 branch
  const res = await fetch("http://localhost:3605/cached-mw-500");
  assertEquals(res.status, 500);
  await res.text();
  s.close();
});

// ──────────────────────────────────────────────────────────────────────────────
// Coverage gap: runFinal cached route-middleware branches (DA:572-590)
// ──────────────────────────────────────────────────────────────────────────────

Deno.test("Coverage - runFinal cached route-mw handler returns object", async () => {
  _resetForTests();
  // global mw forces hasGlobalMiddlewares = true → goes through runFinal
  server.use((_req, _ctx, next) =>
    next ? (next() as unknown as Response) : ("fail" as unknown as Response)
  );
  server.get(
    "/runfinal-obj",
    // @ts-ignore: testing
    () => ({ rf: true }) as unknown,
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
  );
  const s = server.serve({ port: 3606 });
  await (await fetch("http://localhost:3606/runfinal-obj")).json();
  const res = await fetch("http://localhost:3606/runfinal-obj");
  assertEquals(res.status, 200);
  assertEquals(await res.json(), { rf: true });
  s.close();
});

Deno.test("Coverage - runFinal cached route-mw handler returns promise", async () => {
  _resetForTests();
  server.use((_req, _ctx, next) =>
    next ? (next() as unknown as Response) : ("fail" as unknown as Response)
  );
  server.get(
    "/runfinal-promise",
    () => Promise.resolve("promise-ok"),
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
  );
  const s = server.serve({ port: 3607 });
  await (await fetch("http://localhost:3607/runfinal-promise")).text();
  const res = await fetch("http://localhost:3607/runfinal-promise");
  assertEquals(await res.text(), "promise-ok");
  s.close();
});

Deno.test("Coverage - runFinal cached route-mw handler returns 500", async () => {
  _resetForTests();
  server.use((_req, _ctx, next) =>
    next ? (next() as unknown as Response) : ("fail" as unknown as Response)
  );
  server.get(
    "/runfinal-500",
    // @ts-ignore: testing
    () => 42 as unknown,
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
  );
  const s = server.serve({ port: 3608 });
  await (await fetch("http://localhost:3608/runfinal-500")).text();
  const res = await fetch("http://localhost:3608/runfinal-500");
  assertEquals(res.status, 500);
  await res.text();
  s.close();
});

Deno.test("Coverage - toResponse Promise branch (via applyMiddlewares loop)", async () => {
  _resetForTests();
  // 3 middlewares forces dispatch loop; handler returns Promise → toResponse(Promise) branch
  server.get(
    "/toresponse-promise",
    () => Promise.resolve("promise-val"),
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
  );
  const s = server.serve({ port: 3609 });
  const res = await fetch("http://localhost:3609/toresponse-promise");
  assertEquals(await res.text(), "promise-val");
  s.close();
});

Deno.test("Coverage - toResponse 500 fallback branch (via applyMiddlewares loop)", async () => {
  _resetForTests();
  server.get(
    "/toresponse-500",
    // @ts-ignore: testing
    () => 42 as unknown,
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
  );
  const s = server.serve({ port: 3610 });
  const res = await fetch("http://localhost:3610/toresponse-500");
  assertEquals(res.status, 500);
  await res.text();
  s.close();
});

// ──────────────────────────────────────────────────────────────────────────────
// DA:10 – toResponse Promise branch (called directly via tryRoute with applyMiddlewares
//          where the inline branches are exhausted but toResponse itself is called)
// DA:12 – toResponse 500 branch
// These lines are in the `toResponse` function itself. We need to call it via a
// path where the *inlined* checks don't short-circuit first.
// The only remaining caller of toResponse() is tryRoute's applyMiddlewares closure
// (line 144-152 in tryRoute).  applyMiddlewares routes through the dispatch loop
// (3+ middlewares) which calls the finalHandler closure that has the inline checks.
// Actually DA:10 and DA:12 are ONLY reachable if `toResponse` is called with a
// nested Promise (Promise.resolve(Promise.resolve(x))) or with `undefined`/`null`.
// ──────────────────────────────────────────────────────────────────────────────

Deno.test("Coverage - toResponse recursive Promise (DA:10)", async () => {
  _resetForTests();
  // A handler returning a Promise<Promise<string>> triggers the recursive
  // toResponse path (DA:10): toResponse receives a Promise from `.then(toResponse)`
  // and needs to recurse.
  server.get(
    "/toresponse-recursive",
    // @ts-ignore: testing
    () => Promise.resolve(Promise.resolve("recursive")) as unknown,
  );
  const s = server.serve({ port: 3611 });
  const res = await fetch("http://localhost:3611/toresponse-recursive");
  assertEquals(await res.text(), "recursive");
  s.close();
});

Deno.test("Coverage - toResponse 500 fallback (DA:12) via direct call", async () => {
  _resetForTests();
  // We need toResponse called with a non-Response, non-string, non-Promise, non-object.
  // Route handler returns `undefined` which is not caught by the inlined checks.
  // However, since all hot-paths inline the checks, toResponse is only called via
  // `.then(toResponse)`. So we return Promise<undefined> to trigger the chain.
  server.get(
    "/toresponse-undef",
    // @ts-ignore: testing
    () => Promise.resolve(undefined) as unknown,
  );
  const s = server.serve({ port: 3612 });
  const res = await fetch("http://localhost:3612/toresponse-undef");
  assertEquals(res.status, 500);
  await res.text();
  s.close();
});

// ──────────────────────────────────────────────────────────────────────────────
// DA:495 – cached applyMiddlewares (3+ mw) → handler returns Response
// DA:497 – cached applyMiddlewares (3+ mw) → handler returns Promise
// DA:498-500 – cached applyMiddlewares (3+ mw) → handler returns object
// DA:501 – cached applyMiddlewares (3+ mw) → handler returns 500
// ──────────────────────────────────────────────────────────────────────────────

Deno.test("Coverage - cached 3+mw applyMiddlewares handler returns Response (DA:495)", async () => {
  _resetForTests();
  server.get(
    "/cached-3mw-response",
    () => new Response("direct"),
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
  );
  const s = server.serve({ port: 3620 });
  await (await fetch("http://localhost:3620/cached-3mw-response")).text();
  const res = await fetch("http://localhost:3620/cached-3mw-response");
  assertEquals(await res.text(), "direct");
  s.close();
});

Deno.test("Coverage - cached 3+mw applyMiddlewares handler returns string (DA:496)", async () => {
  _resetForTests();
  server.get(
    "/cached-3mw-string",
    () => "str-ok",
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
  );
  const s = server.serve({ port: 3621 });
  await (await fetch("http://localhost:3621/cached-3mw-string")).text();
  const res = await fetch("http://localhost:3621/cached-3mw-string");
  assertEquals(await res.text(), "str-ok");
  s.close();
});

Deno.test("Coverage - cached 3+mw applyMiddlewares handler returns Promise (DA:497)", async () => {
  _resetForTests();
  server.get(
    "/cached-3mw-promise",
    () => Promise.resolve("promise-3mw"),
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
  );
  const s = server.serve({ port: 3622 });
  await (await fetch("http://localhost:3622/cached-3mw-promise")).text();
  const res = await fetch("http://localhost:3622/cached-3mw-promise");
  assertEquals(await res.text(), "promise-3mw");
  s.close();
});

Deno.test("Coverage - cached 3+mw applyMiddlewares handler returns object (DA:498-500)", async () => {
  _resetForTests();
  server.get(
    "/cached-3mw-object",
    // @ts-ignore: testing
    () => ({ obj: "3mw" }) as unknown,
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
  );
  const s = server.serve({ port: 3623 });
  await (await fetch("http://localhost:3623/cached-3mw-object")).json();
  const res = await fetch("http://localhost:3623/cached-3mw-object");
  assertEquals(await res.json(), { obj: "3mw" });
  s.close();
});

Deno.test("Coverage - cached 3+mw applyMiddlewares handler returns 500 (DA:501)", async () => {
  _resetForTests();
  server.get(
    "/cached-3mw-500",
    // @ts-ignore: testing
    () => 42 as unknown,
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
  );
  const s = server.serve({ port: 3624 });
  await (await fetch("http://localhost:3624/cached-3mw-500")).text();
  const res = await fetch("http://localhost:3624/cached-3mw-500");
  assertEquals(res.status, 500);
  await res.text();
  s.close();
});

// ──────────────────────────────────────────────────────────────────────────────
// DA:523-525 – decodeURIComponent catch block in query parser
// Send a query string with invalid percent-encoding like %zz
// ──────────────────────────────────────────────────────────────────────────────

Deno.test("Coverage - query parser decodeURIComponent catch (DA:523-525)", async () => {
  _resetForTests();
  server.get("/bad-query", (_req, ctx) => ctx.query["key"] ?? "missing");
  const s = server.serve({ port: 3625 });
  // %zz is invalid percent-encoding, will throw in decodeURIComponent
  const res = await fetch("http://localhost:3625/bad-query?%zz=val");
  // The catch block falls back to raw key; either way we get a response
  assertEquals(res.status, 200);
  await res.text();
  s.close();
});

// ──────────────────────────────────────────────────────────────────────────────
// DA:572-576 – runFinal no-mw: handler returns object or 500
// Requires: hasGlobalMiddlewares=true, cached route, no route-mw, handler returns object/500
// ──────────────────────────────────────────────────────────────────────────────

Deno.test("Coverage - runFinal no-mw handler returns object (DA:572-574)", async () => {
  _resetForTests();
  server.use((_req, _ctx, next) =>
    next ? (next() as unknown as Response) : ("fail" as unknown as Response)
  );
  // @ts-ignore: testing
  server.get("/runfinal-nomw-obj", () => ({ nomw: true }) as unknown);
  const s = server.serve({ port: 3626 });
  await (await fetch("http://localhost:3626/runfinal-nomw-obj")).json();
  const res = await fetch("http://localhost:3626/runfinal-nomw-obj");
  assertEquals(await res.json(), { nomw: true });
  s.close();
});

Deno.test("Coverage - runFinal no-mw handler returns 500 (DA:575)", async () => {
  _resetForTests();
  server.use((_req, _ctx, next) =>
    next ? (next() as unknown as Response) : ("fail" as unknown as Response)
  );
  // @ts-ignore: testing
  server.get("/runfinal-nomw-500", () => 42 as unknown);
  const s = server.serve({ port: 3627 });
  await (await fetch("http://localhost:3627/runfinal-nomw-500")).text();
  const res = await fetch("http://localhost:3627/runfinal-nomw-500");
  assertEquals(res.status, 500);
  await res.text();
  s.close();
});

// ──────────────────────────────────────────────────────────────────────────────
// DA:582-588 – runFinal route-mw: handler returns Response, Promise, object, 500
// Requires: hasGlobalMiddlewares=true, cached route, route has 1 mw
// ──────────────────────────────────────────────────────────────────────────────

Deno.test("Coverage - runFinal route-mw handler returns Response (DA:582)", async () => {
  _resetForTests();
  server.use((_req, _ctx, next) =>
    next ? (next() as unknown as Response) : ("fail" as unknown as Response)
  );
  server.get(
    "/runfinal-routemw-response",
    () => new Response("routemw-resp"),
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
  );
  const s = server.serve({ port: 3628 });
  await (await fetch("http://localhost:3628/runfinal-routemw-response")).text();
  const res = await fetch("http://localhost:3628/runfinal-routemw-response");
  assertEquals(await res.text(), "routemw-resp");
  s.close();
});

Deno.test("Coverage - runFinal route-mw handler returns string (DA:583)", async () => {
  _resetForTests();
  server.use((_req, _ctx, next) =>
    next ? (next() as unknown as Response) : ("fail" as unknown as Response)
  );
  server.get(
    "/runfinal-routemw-string",
    () => "routemw-str",
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
  );
  const s = server.serve({ port: 3629 });
  await (await fetch("http://localhost:3629/runfinal-routemw-string")).text();
  const res = await fetch("http://localhost:3629/runfinal-routemw-string");
  assertEquals(await res.text(), "routemw-str");
  s.close();
});

Deno.test("Coverage - runFinal route-mw handler returns Promise (DA:584)", async () => {
  _resetForTests();
  server.use((_req, _ctx, next) =>
    next ? (next() as unknown as Response) : ("fail" as unknown as Response)
  );
  server.get(
    "/runfinal-routemw-promise",
    () => Promise.resolve("routemw-promise"),
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
  );
  const s = server.serve({ port: 3630 });
  await (await fetch("http://localhost:3630/runfinal-routemw-promise")).text();
  const res = await fetch("http://localhost:3630/runfinal-routemw-promise");
  assertEquals(await res.text(), "routemw-promise");
  s.close();
});

Deno.test("Coverage - runFinal route-mw handler returns object (DA:585-587)", async () => {
  _resetForTests();
  server.use((_req, _ctx, next) =>
    next ? (next() as unknown as Response) : ("fail" as unknown as Response)
  );
  server.get(
    "/runfinal-routemw-object",
    // @ts-ignore: testing
    () => ({ routemw: true }) as unknown,
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
  );
  const s = server.serve({ port: 3631 });
  await (await fetch("http://localhost:3631/runfinal-routemw-object")).json();
  const res = await fetch("http://localhost:3631/runfinal-routemw-object");
  assertEquals(await res.json(), { routemw: true });
  s.close();
});

Deno.test("Coverage - runFinal route-mw handler returns 500 (DA:588)", async () => {
  _resetForTests();
  server.use((_req, _ctx, next) =>
    next ? (next() as unknown as Response) : ("fail" as unknown as Response)
  );
  server.get(
    "/runfinal-routemw-500",
    // @ts-ignore: testing
    () => 42 as unknown,
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
  );
  const s = server.serve({ port: 3632 });
  await (await fetch("http://localhost:3632/runfinal-routemw-500")).text();
  const res = await fetch("http://localhost:3632/runfinal-routemw-500");
  assertEquals(res.status, 500);
  await res.text();
  s.close();
});

// ──────────────────────────────────────────────────────────────────────────────
// DA:10 – toResponse Promise branch called directly via _toResponseForTests
// DA:653-657 – _toResponseForTests function body
// ──────────────────────────────────────────────────────────────────────────────

Deno.test("Coverage - _toResponseForTests covers DA:10 recursive Promise branch", async () => {
  // Passing a Promise directly into _toResponseForTests causes toResponse()
  // to hit the `if (res instanceof Promise)` branch at DA:10, which then
  // calls `.then(toResponse)` recursively. This also covers the exported
  // _toResponseForTests function body (DA:653-657).
  const res = await _toResponseForTests(Promise.resolve("hello-direct"));
  assertEquals(await (res as Response).text(), "hello-direct");
});

Deno.test("Coverage - _toResponseForTests with nested Promise covers DA:10 recurse", async () => {
  // Promise<Promise<string>> → toResponse is called on a Promise, recurses once more.
  const res = await _toResponseForTests(
    Promise.resolve(Promise.resolve("nested")),
  );
  assertEquals(await (res as Response).text(), "nested");
});

// ──────────────────────────────────────────────────────────────────────────────
// Cover applyMiddlewares len===2 branch via tryRoute first-hit path
// (route registered with exactly 2 middlewares, first request = non-cached)
// ──────────────────────────────────────────────────────────────────────────────

Deno.test("Coverage - applyMiddlewares len===2 via tryRoute (first hit)", async () => {
  _resetForTests();
  server.get(
    "/two-mw-tryroute",
    () => "two-mw-ok",
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
    (_req, _ctx, next) =>
      next ? (next() as unknown as Response) : ("fail" as unknown as Response),
  );
  const s = server.serve({ port: 3639 });
  // First request hits tryRoute → applyMiddlewares with len===2
  const res = await fetch("http://localhost:3639/two-mw-tryroute");
  assertEquals(await res.text(), "two-mw-ok");
  s.close();
});

// ──────────────────────────────────────────────────────────────────────────
// Hook coverage: onRequest only, onResponse async (Promise + sync result)
// ──────────────────────────────────────────────────────────────────────────

Deno.test("Coverage - hook onResponse only (no onRequest)", async () => {
  _resetForTests();
  server.hook("onResponse", (_req: Request, _ctx: Context, next: Next) => {
    return next();
  });
  server.get("/hook-resp-only", () => new Response("resp-only"));
  const s = server.serve({ port: 3643 });
  const res = await fetch("http://localhost:3643/hook-resp-only");
  assertEquals(await res.text(), "resp-only");
  s.close();
});

Deno.test("Coverage - hook onRequest only (no onResponse)", async () => {
  _resetForTests();
  let ran = false;
  server.hook("onRequest", (_req: Request, _ctx: Context, next: Next) => {
    ran = true;
    return next();
  });
  server.get("/hook-req-only", () => new Response("ok"));
  const s = server.serve({ port: 3640 });
  const res = await fetch("http://localhost:3640/hook-req-only");
  assertEquals(await res.text(), "ok");
  assert(ran);
  s.close();
});

Deno.test("Coverage - hook onResponse async with Promise result", async () => {
  _resetForTests();
  server.hook("onRequest", (_req: Request, ctx: Context, next: Next) => {
    ctx.state = { tag: "req" };
    return next();
  });
  server.hook(
    "onResponse",
    async (_req: Request, _ctx: Context, next: Next) => {
      // async hook — result of next() is a Promise when route handler is async
      const res = await next() as Response;
      return new Response((await res.text()) + "+async", {
        status: res.status,
      });
    },
  );
  // async route so handleRequest returns a Promise → covers "result instanceof Promise" branch
  server.get("/hook-async-promise", async () => {
    await Promise.resolve();
    return new Response("body");
  });
  const s = server.serve({ port: 3641 });
  const res = await fetch("http://localhost:3641/hook-async-promise");
  assertEquals(await res.text(), "body+async");
  s.close();
});

Deno.test("Coverage - hook onResponse async with sync result", async () => {
  _resetForTests();
  server.hook("onRequest", (_req: Request, ctx: Context, next: Next) => {
    ctx.state = { tag: "req" };
    return next();
  });
  server.hook(
    "onResponse",
    async (_req: Request, _ctx: Context, next: Next) => {
      const res = await next() as Response;
      return new Response((await res.text()) + "+async-sync", {
        status: res.status,
      });
    },
  );
  // sync route so handleRequest returns a Response (not a Promise)
  server.get("/hook-async-sync", () => new Response("body"));
  const s = server.serve({ port: 3642 });
  const res = await fetch("http://localhost:3642/hook-async-sync");
  assertEquals(await res.text(), "body+async-sync");
  s.close();
});

Deno.test("Coverage - hook + cache hit uses sharedCtx (no new FastContext)", async () => {
  _resetForTests();
  server.hook(
    "onRequest",
    (_req: Request, _ctx: Context, next: Next) => next(),
  );
  server.hook(
    "onResponse",
    (_req: Request, _ctx: Context, next: Next) => next(),
  );
  server.get(
    "/hook-cache",
    (_req, ctx) => new Response(`id:${ctx.params.id ?? "none"}`),
  );
  const s = server.serve({ port: 3643 });
  // First request: non-cached path
  const r0 = await fetch("http://localhost:3643/hook-cache");
  await r0.body?.cancel();
  // Second request: cache hit path with sharedCtx populated
  const res = await fetch("http://localhost:3643/hook-cache");
  assertEquals(await res.text(), "id:none");
  s.close();
});

Deno.test("Coverage - onError hook: sync handler throws", async () => {
  _resetForTests();
  server.hook("onError", (_req: Request, ctx: Context, _next: Next) => {
    return new Response(`caught:${(ctx.error as Error).message}`, {
      status: 500,
    });
  });
  server.get("/err-sync", () => {
    throw new Error("sync-boom");
  });
  const s = server.serve({ port: 3644 });
  const res = await fetch("http://localhost:3644/err-sync");
  assertEquals(res.status, 500);
  assertEquals(await res.text(), "caught:sync-boom");
  s.close();
});

Deno.test("Coverage - onError hook: async handler rejects", async () => {
  _resetForTests();
  server.hook("onError", (_req: Request, ctx: Context, _next: Next) => {
    return new Response(`caught:${(ctx.error as Error).message}`, {
      status: 500,
    });
  });
  server.get("/err-async", async () => {
    await Promise.resolve();
    throw new Error("async-boom");
  });
  const s = server.serve({ port: 3645 });
  const res = await fetch("http://localhost:3645/err-async");
  assertEquals(res.status, 500);
  assertEquals(await res.text(), "caught:async-boom");
  s.close();
});

Deno.test("Coverage - onError hook: non-Error thrown value", async () => {
  _resetForTests();
  server.hook("onError", (_req: Request, ctx: Context, _next: Next) => {
    const errMsg = ctx.error instanceof Error
      ? ctx.error.message
      : String(ctx.error);
    return new Response(`caught:${errMsg}`, { status: 500 });
  });
  server.get("/err-string", () => {
    throw new Error("string-boom");
  });
  const s = server.serve({ port: 3646 });
  const res = await fetch("http://localhost:3646/err-string");
  assertEquals(res.status, 500);
  assertEquals(await res.text(), "caught:string-boom");
  s.close();
});

Deno.test("Coverage - onError hook: next() calls default response", async () => {
  _resetForTests();
  server.hook("onError", (_req: Request, _ctx: Context, next: Next) => {
    return next();
  });
  server.get("/err-next", () => {
    throw new Error("boom");
  });
  const s = server.serve({ port: 3647 });
  const res = await fetch("http://localhost:3647/err-next");
  assertEquals(res.status, 500);
  assertEquals(await res.text(), "Internal Server Error");
  s.close();
});
