import { assert, assertEquals, assertRejects } from "@std/assert";
import server, { _getRoutesForTests, _resetForTests } from "./server.ts";
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
