import server, { _resetForTests } from "./server.ts";
import { Context, Next } from "./types.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

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
  server.get("/query", (req: Request, ctx: Context) => ctx.query.a);
  const s = server.serve({ port: 3114 });
  const res = await fetch("http://localhost:3114/query?a=ok");
  assertEquals(await res.text(), "ok");
  s.close();
});

Deno.test("Coverage - tryRoute fallthrough", async () => {
  _resetForTests();
  server.get("/a", (_req: Request, _ctx: Context, next: Next | undefined) => {
    return next ? (next() as any) : "fail";
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
  server.use((req, ctx, next) => next ? (next() as any) : "fail");
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
    (req, ctx, next) => next ? (next() as any) : "fail",
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
    (_req, _ctx, next) => next ? (next() as any) : "fail",
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
    (_req, _ctx, next) => next ? (next() as any) : "fail",
  );
  const s = server.serve({ port: 3127 });
  await (await fetch("http://localhost:3127/route-mw-async")).text();
  const res = await fetch("http://localhost:3127/route-mw-async");
  assertEquals(await res.text(), "async");
  s.close();
});

Deno.test("Coverage - toResponse other", async () => {
  _resetForTests();
  // @ts-ignore
  server.get("/other", () => 42 as any);
  const s = server.serve({ port: 3128 });
  const res = await fetch("http://localhost:3128/other");
  assertEquals(res.status, 500);
  assertEquals(await res.text(), "Internal Server Error");
  s.close();
});

Deno.test("Coverage - fast path other return", async () => {
  _resetForTests();
  // @ts-ignore
  server.get("/", () => 42 as any);
  const s = server.serve({ port: 3129 });
  const res = await fetch("http://localhost:3129/");
  assertEquals(res.status, 500);
  assertEquals(await res.text(), "Internal Server Error");
  s.close();
});

Deno.test("Coverage - cache hit other return", async () => {
  _resetForTests();
  // @ts-ignore
  server.get("/other-cache", () => 42 as any);
  const s = server.serve({ port: 3130 });
  await (await fetch("http://localhost:3130/other-cache")).text();
  const res = await fetch("http://localhost:3130/other-cache");
  assertEquals(res.status, 500);
  assertEquals(await res.text(), "Internal Server Error");
  s.close();
});

Deno.test("Coverage - fast path ctx.url", async () => {
  _resetForTests();
  server.get("/", (req, ctx) => ctx.url.pathname);
  const s = server.serve({ port: 3131 });
  const res = await fetch("http://localhost:3131/");
  assertEquals(await res.text(), "/");
  s.close();
});

Deno.test("Coverage - cache hit ctx.url", async () => {
  _resetForTests();
  server.get("/cache-url", (req, ctx) => ctx.url.pathname);
  const s = server.serve({ port: 3132 });
  await (await fetch("http://localhost:3132/cache-url")).text();
  const res = await fetch("http://localhost:3132/cache-url");
  assertEquals(await res.text(), "/cache-url");
  s.close();
});

Deno.test("Coverage - regular ctx.url", async () => {
  _resetForTests();
  server.get("/regular-url", (req, ctx) => ctx.url.pathname);
  const s = server.serve({ port: 3133 });
  const res = await fetch("http://localhost:3133/regular-url");
  assertEquals(await res.text(), "/regular-url");
  s.close();
});

Deno.test("Coverage - root next call", async () => {
  _resetForTests();
  // @ts-ignore
  server.get("/", (req, ctx, next) => {
    // @ts-ignore
    next();
  });
  const s = server.serve({ port: 3134 });
  const res = await fetch("http://localhost:3134/");
  assertEquals(res.status, 500);
  assertEquals(await res.text(), "Internal Server Error");
  s.close();
});

Deno.test("Coverage - cache hit with middlewares in runFinal", async () => {
  _resetForTests();
  server.use((req, ctx, next) => next ? (next() as any) : "fail");
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
    (req, ctx, next) => next ? (next() as any) : "fail",
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
  server.get("/no-query", (req, ctx) => {
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
  server.get("/:id", (req, ctx) => ctx.params.id || "empty");
  const s = server.serve({ port: 3139 });
  // This probably won't hit it because URLPattern is reliable.
  const res = await fetch("http://localhost:3139/123");
  assertEquals(await res.text(), "123");
  s.close();
});

Deno.test("Coverage - toResponse fallback", async () => {
  _resetForTests();
  // @ts-ignore
  server.get("/fallback", () => ({}) as any);
  const s = server.serve({ port: 3140 });
  const res = await fetch("http://localhost:3140/fallback");
  // Deno's serve will likely fail because it's not a Response
  assertEquals(res.status, 500);
  await res.text();
  s.close();
});

Deno.test("Coverage - cache hit with middlewares in runFinal - Response", async () => {
  _resetForTests();
  server.use((req, ctx, next) => next ? (next() as any) : "fail");
  server.get("/final-cache-res", () => new Response("ok"));
  const s = server.serve({ port: 3141 });
  await (await fetch("http://localhost:3141/final-cache-res")).text();
  const res = await fetch("http://localhost:3141/final-cache-res");
  assertEquals(await res.text(), "ok");
  s.close();
});

Deno.test("Coverage - cache hit with middlewares in runFinal - Promise", async () => {
  _resetForTests();
  server.use((req, ctx, next) => next ? (next() as any) : "fail");
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
    (req, ctx, next) => next ? (next() as any) : "fail",
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
    (req, ctx, next) => next ? (next() as any) : "fail",
  );
  const s = server.serve({ port: 3144 });
  await (await fetch("http://localhost:3144/final-route-cache-promise")).text();
  const res = await fetch("http://localhost:3144/final-route-cache-promise");
  assertEquals(await res.text(), "ok");
  s.close();
});

Deno.test("Coverage - URL lazy getter with query", async () => {
  _resetForTests();
  server.get("/with-query", (req, ctx) => {
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
    (req, ctx, next) => next ? (next() as any) : "fail",
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
    (req, ctx, next) => next ? (next() as any) : "fail",
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
    (req, ctx, next) => next ? (next() as any) : "fail",
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
    (req, ctx, next) => next ? (next() as any) : "fail",
  );
  const s = server.serve({ port: 3149 });
  await (await fetch("http://localhost:3149/route-mw-cached-promise")).text();
  const res = await fetch("http://localhost:3149/route-mw-cached-promise");
  assertEquals(await res.text(), "ok");
  s.close();
});

Deno.test("Coverage - URL lazy getter regular path", async () => {
  _resetForTests();
  server.get("/url-regular-new", (req, ctx) => ctx.url.pathname);
  const s = server.serve({ port: 3150 });
  const res = await fetch("http://localhost:3150/url-regular-new");
  assertEquals(await res.text(), "/url-regular-new");
  s.close();
});

Deno.test("Coverage - promise nested", async () => {
  _resetForTests();
  // @ts-ignore
  server.get("/promise-nested", () => Promise.resolve(Promise.resolve("ok")));
  const s = server.serve({ port: 3151 });
  const res = await fetch("http://localhost:3151/promise-nested");
  assertEquals(await res.text(), "ok");
  s.close();
});

Deno.test("Coverage - cached 404 with global middleware", async () => {
  _resetForTests();
  server.use((req, ctx, next) => next ? (next() as any) : "fail");
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
    (req, ctx, next) => next ? (next() as any) : "fail",
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
  server.use((req, ctx, next) => next ? (next() as any) : "fail");
  const res = await fetch("http://localhost:3160/cached-global-after");
  assertEquals(await res.text(), "ok");
  s.close();
});

Deno.test("Coverage - runFinal cached with route middlewares (applyMiddlewares path)", async () => {
  _resetForTests();
  server.get(
    "/cached-route-mw",
    () => "ok",
    (req, ctx, next) => next ? (next() as any) : "fail",
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
    (req, ctx, next) => next ? (next() as any) : "fail",
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
  server.get(new URLPattern({ pathname: "/urlp" }) as any, () => "urlp");
  const s = server.serve({ port: 3180 });
  const res = await fetch("http://localhost:3180/urlp");
  assertEquals(await res.text(), "urlp");
  s.close();
});

Deno.test("Coverage - Custom exec in serve", async () => {
  _resetForTests();
  const pattern = {
    pathname: undefined,
    exec: (url: string) => {
      if (url.endsWith("/custom")) {
        return { pathname: { groups: { name: "custom" } } };
      }
      return null;
    },
  };
  server.get(pattern as any, (_req, ctx) => "custom");
  const s = server.serve({ port: 3181 });
  const res = await fetch("http://localhost:3181/custom");
  assertEquals(await res.text(), "custom");
  s.close();
});

Deno.test("Coverage - Custom exec mismatch", async () => {
  _resetForTests();
  const pattern = {
    pathname: undefined,
    exec: (url: string) => null,
  };
  server.get(pattern as any, () => "fail");
  const s = server.serve({ port: 3182 });
  const res = await fetch("http://localhost:3182/miss");
  assertEquals(res.status, 404);
  await res.text();
  s.close();
});

Deno.test("Coverage - cache hit with global middleware and route middleware", async () => {
  _resetForTests();
  server.use(async (req, ctx, next) => {
    const res = await next!();
    res.headers.set("x-global", "1");
    return res;
  });
  server.get("/both-mw", () => "ok", (req, ctx, next) => next!());
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
  server.use(async (req, ctx, next) => {
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
  // @ts-ignore
  server.get("/nested", () => Promise.resolve(Promise.resolve("ok")));
  const s = server.serve({ port: 3191 });
  const res = await fetch("http://localhost:3191/nested");
  assertEquals(await res.text(), "ok");
  s.close();
});

Deno.test("Coverage - cached 404 in runFinal", async () => {
  _resetForTests();
  server.use((req, ctx, next) => next!());
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
  // @ts-ignore
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
  server.get("/with-mw", () => "ok", (req, ctx, next) => next!());
  const s = server.serve({ port: 3197 });
  const res = await fetch("http://localhost:3197/with-mw");
  assertEquals(await res.text(), "ok");
  s.close();
});

Deno.test("Coverage - applyMiddlewares fallthrough", async () => {
  _resetForTests();
  server.use((req, ctx, next) => next!());
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
  // @ts-ignore
  server.get("/promise-res", () => Promise.resolve(new Response("ok")));
  const s = server.serve({ port: 3210 });
  const res = await fetch("http://localhost:3210/promise-res");
  assertEquals(await res.text(), "ok");
  s.close();
});
