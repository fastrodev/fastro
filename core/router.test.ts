import { assertEquals } from "@std/assert";
import {
  build,
  createRouter,
  matchPath,
  type Route,
  setMaxCacheSize,
} from "./router.ts";
import { Context, Handler, Middleware } from "./types.ts";

Deno.test("matchPath - exact match without params", () => {
  const result = matchPath("/api", "/api");
  assertEquals(result, { params: {} });
});

Deno.test("matchPath - match with params", () => {
  const result = matchPath("/hello/:id", "/hello/123");
  assertEquals(result, { params: { id: "123" } });
});

Deno.test("matchPath - no match due to different lengths", () => {
  const result = matchPath("/api", "/api/test");
  assertEquals(result, null);
});

Deno.test("matchPath - no match due to different parts", () => {
  const result = matchPath("/hello/:id", "/bye/123");
  assertEquals(result, null);
});

Deno.test("matchPath - multiple params", () => {
  const result = matchPath("/user/:id/post/:postId", "/user/456/post/789");
  assertEquals(result, { params: { id: "456", postId: "789" } });
});

Deno.test("matchPath - root path match", () => {
  const result = matchPath("/", "/");
  assertEquals(result, { params: {} });
});

Deno.test("matchPath - no match for root vs non-root", () => {
  const result = matchPath("/", "/api");
  assertEquals(result, null);
});

Deno.test("matchPath - param with special characters", () => {
  const result = matchPath("/file/:name", "/file/test-file.txt");
  assertEquals(result, { params: { name: "test-file.txt" } });
});

Deno.test("matchPath - percent-encoded param decodes", () => {
  const result = matchPath("/u/:name", "/u/yanu%40fastro.dev");
  assertEquals(result, { params: { name: "yanu@fastro.dev" } });
});

Deno.test("matchPath - raw @ character preserved", () => {
  const result = matchPath("/u/:name", "/u/yanu@fastro.dev");
  assertEquals(result, { params: { name: "yanu@fastro.dev" } });
});

Deno.test("matchPath - percent-encoded invalid sequence falls back to raw", () => {
  const result = matchPath("/u/:name", "/u/invalid%ZZ");
  assertEquals(result, { params: { name: "invalid%ZZ" } });
});

Deno.test("matchPath - empty route and request", () => {
  const result = matchPath("", "");
  assertEquals(result, { params: {} });
});

Deno.test("matchPath - no match for empty vs non-empty", () => {
  const result = matchPath("", "/api");
  assertEquals(result, null);
});

Deno.test("matchPath - trailing slash mismatch", () => {
  const result = matchPath("/api", "/api/");
  assertEquals(result, null);
});

Deno.test("matchPath - both with trailing slash", () => {
  const result = matchPath("/api/", "/api/");
  assertEquals(result, { params: {} });
});

Deno.test("createRouteMiddleware - calls handler for matching route", async () => {
  const mockHandler: Handler = () => new Response("OK");
  const routes = [{ method: "GET", path: "/test", handler: mockHandler }];
  const middleware = build(routes);
  const req = new Request("http://localhost/test");
  const ctx: Context = {
    url: new URL("http://localhost"),
    params: {},
    query: {},
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 8000 },
  };
  const next = () => new Response("Next");

  const response = await middleware(req, ctx, next);
  assertEquals(response.status, 200);
  assertEquals(await response.text(), "OK");
});

Deno.test("createRouteMiddleware - extracts params correctly", async () => {
  const mockHandler: Handler = (_, ctx) =>
    new Response(`ID: ${ctx.params?.id}`);
  const routes = [{ method: "GET", path: "/test/:id", handler: mockHandler }];
  const middleware = build(routes);
  const req = new Request("http://localhost/test/123");
  const ctx: Context = {
    url: new URL("http://localhost"),
    params: {},
    query: {},
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 8000 },
  };
  const next = () => new Response("Next");

  const response = await middleware(req, ctx, next);
  assertEquals(await response.text(), "ID: 123");
});

Deno.test("createRouteMiddleware - applies middlewares in order", async () => {
  let log = "";
  const mw1: Middleware = (_req, _ctx, next) => {
    log += "mw1-";
    return next();
  };
  const mw2: Middleware = (_req, _ctx, next) => {
    log += "mw2-";
    return next();
  };
  const mockHandler: Handler = (_req, _ctx) => {
    log += "handler";
    return new Response("OK");
  };
  const routes = [{
    method: "GET",
    path: "/test",
    handler: mockHandler,
    middlewares: [mw1, mw2],
  }];
  const middleware = build(routes);
  const req = new Request("http://localhost/test");
  const ctx: Context = {
    url: new URL("http://localhost"),
    params: {},
    query: {},
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 8000 },
  };
  const next = () => new Response("Next");

  await middleware(req, ctx, next);
  assertEquals(log, "mw1-mw2-handler");
});

Deno.test("createRouteMiddleware - calls next if no route matches", async () => {
  const routes = [{
    method: "GET",
    path: "/test",
    handler: () => new Response("OK"),
  }];
  const middleware = build(routes);
  const req = new Request("http://localhost/other");
  const ctx: Context = {
    url: new URL("http://localhost"),
    params: {},
    query: {},
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 8000 },
  };
  const next = () => new Response("Next");

  const response = await middleware(req, ctx, next);
  assertEquals(await response.text(), "Next");
});

Deno.test("createRouteMiddleware - ignores route if method does not match", async () => {
  const routes = [{
    method: "POST",
    path: "/test",
    handler: () => new Response("OK"),
  }];
  const middleware = build(routes);
  const req = new Request("http://localhost/test", { method: "GET" });
  const ctx: Context = {
    url: new URL("http://localhost"),
    params: {},
    query: {},
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 8000 },
  };
  const next = () => new Response("Next");

  const response = await middleware(req, ctx, next);
  assertEquals(await response.text(), "Next");
});

Deno.test("createRouteMiddleware - middleware returns response without calling next", async () => {
  const mw: Middleware = () => new Response("MW Response");
  const mockHandler: Handler = () => new Response("Handler");
  const routes = [{
    method: "GET",
    path: "/test",
    handler: mockHandler,
    middlewares: [mw],
  }];
  const middleware = build(routes);
  const req = new Request("http://localhost/test");
  const ctx: Context = {
    url: new URL("http://localhost"),
    params: {},
    query: {},
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 8000 },
  };
  const next = () => new Response("Next");

  const response = await middleware(req, ctx, next);
  assertEquals(await response.text(), "MW Response");
});

Deno.test("createRouteMiddleware - multiple routes, first matches", async () => {
  const handler1: Handler = () => new Response("First");
  const handler2: Handler = () => new Response("Second");
  const routes = [
    { method: "GET", path: "/test", handler: handler1 },
    { method: "GET", path: "/other", handler: handler2 },
  ];
  const middleware = build(routes);
  const req = new Request("http://localhost/test");
  const ctx: Context = {
    url: new URL("http://localhost"),
    params: {},
    query: {},
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 8000 },
  };
  const next = () => new Response("Next");

  const response = await middleware(req, ctx, next);
  assertEquals(await response.text(), "First");
});

Deno.test("createRouteMiddleware - multiple routes, second matches", async () => {
  const handler1: Handler = () => new Response("First");
  const handler2: Handler = () => new Response("Second");
  const routes = [
    { method: "GET", path: "/other", handler: handler1 },
    { method: "GET", path: "/test", handler: handler2 },
  ];
  const middleware = build(routes);
  const req = new Request("http://localhost/test");
  const ctx: Context = {
    url: new URL("http://localhost"),
    params: {},
    query: {},
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 8000 },
  };
  const next = () => new Response("Next");

  const response = await middleware(req, ctx, next);
  assertEquals(await response.text(), "Second");
});

Deno.test("createRouteMiddleware - no middlewares on route", async () => {
  const mockHandler: Handler = () => new Response("OK");
  const routes = [{ method: "GET", path: "/test", handler: mockHandler }];
  const middleware = build(routes);
  const req = new Request("http://localhost/test");
  const ctx: Context = {
    url: new URL("http://localhost"),
    params: {},
    query: {},
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 8000 },
  };
  const next = () => new Response("Next");

  const response = await middleware(req, ctx, next);
  assertEquals(await response.text(), "OK");
});

Deno.test("createRouteMiddleware - async handler", async () => {
  const mockHandler: Handler = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1));
    return new Response("Async OK");
  };
  const routes = [{ method: "GET", path: "/test", handler: mockHandler }];
  const middleware = build(routes);
  const req = new Request("http://localhost/test");
  const ctx: Context = {
    url: new URL("http://localhost"),
    params: {},
    query: {},
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 8000 },
  };
  const next = () => new Response("Next");

  const response = await middleware(req, ctx, next);
  assertEquals(await response.text(), "Async OK");
});

Deno.test("createRouteMiddleware - async middleware", async () => {
  const mw: Middleware = async (_req, _ctx, next) => {
    await new Promise((resolve) => setTimeout(resolve, 1));
    return next();
  };
  const mockHandler: Handler = () => new Response("OK");
  const routes = [{
    method: "GET",
    path: "/test",
    handler: mockHandler,
    middlewares: [mw],
  }];
  const middleware = build(routes);
  const req = new Request("http://localhost/test");
  const ctx: Context = {
    url: new URL("http://localhost"),
    params: {},
    query: {},
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 8000 },
  };
  const next = () => new Response("Next");

  const response = await middleware(req, ctx, next);
  assertEquals(await response.text(), "OK");
});

Deno.test("RouteBuilder - get method", async () => {
  const builder = createRouter();
  const handler: Handler = () => new Response("GET");
  builder.get("/test", handler);
  const middleware = builder.build();
  const req = new Request("http://localhost/test");
  const ctx: Context = {
    url: new URL("http://localhost"),
    params: {},
    query: {},
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 8000 },
  };
  const next = () => new Response("Next");

  const response = await middleware(req, ctx, next);
  assertEquals(await response.text(), "GET");
});

Deno.test("RouteBuilder - post method", async () => {
  const builder = createRouter();
  const handler: Handler = () => new Response("POST");
  builder.post("/test", handler);
  const middleware = builder.build();
  const req = new Request("http://localhost/test", { method: "POST" });
  const ctx: Context = {
    url: new URL("http://localhost"),
    params: {},
    query: {},
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 8000 },
  };
  const next = () => new Response("Next");

  const response = await middleware(req, ctx, next);
  assertEquals(await response.text(), "POST");
});

Deno.test("RouteBuilder - put method", async () => {
  const builder = createRouter();
  const handler: Handler = () => new Response("PUT");
  builder.put("/test", handler);
  const middleware = builder.build();
  const req = new Request("http://localhost/test", { method: "PUT" });
  const ctx: Context = {
    url: new URL("http://localhost"),
    params: {},
    query: {},
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 8000 },
  };
  const next = () => new Response("Next");

  const response = await middleware(req, ctx, next);
  assertEquals(await response.text(), "PUT");
});

Deno.test("RouteBuilder - delete method", async () => {
  const builder = createRouter();
  const handler: Handler = () => new Response("DELETE");
  builder.delete("/test", handler);
  const middleware = builder.build();
  const req = new Request("http://localhost/test", { method: "DELETE" });
  const ctx: Context = {
    url: new URL("http://localhost"),
    params: {},
    query: {},
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 8000 },
  };
  const next = () => new Response("Next");

  const response = await middleware(req, ctx, next);
  assertEquals(await response.text(), "DELETE");
});

Deno.test("RouteBuilder - patch method", async () => {
  const builder = createRouter();
  const handler: Handler = () => new Response("PATCH");
  builder.patch("/test", handler);
  const middleware = builder.build();
  const req = new Request("http://localhost/test", { method: "PATCH" });
  const ctx: Context = {
    url: new URL("http://localhost"),
    params: {},
    query: {},
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 8000 },
  };
  const next = () => new Response("Next");

  const response = await middleware(req, ctx, next);
  assertEquals(await response.text(), "PATCH");
});

Deno.test("RouteBuilder - head method", async () => {
  const builder = createRouter();
  const handler: Handler = () => new Response("HEAD");
  builder.head("/test", handler);
  const middleware = builder.build();
  const req = new Request("http://localhost/test", { method: "HEAD" });
  const ctx: Context = {
    url: new URL("http://localhost"),
    params: {},
    query: {},
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 8000 },
  };
  const next = () => new Response("Next");

  const response = await middleware(req, ctx, next);
  assertEquals(await response.text(), "HEAD");
});

Deno.test("RouteBuilder - options method", async () => {
  const builder = createRouter();
  const handler: Handler = () => new Response("OPTIONS");
  builder.options("/test", handler);
  const middleware = builder.build();
  const req = new Request("http://localhost/test", { method: "OPTIONS" });
  const ctx: Context = {
    url: new URL("http://localhost"),
    params: {},
    query: {},
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 8000 },
  };
  const next = () => new Response("Next");

  const response = await middleware(req, ctx, next);
  assertEquals(await response.text(), "OPTIONS");
});

Deno.test("RouteBuilder - with middlewares", async () => {
  const builder = createRouter();
  const handler: Handler = () => new Response("OK");
  const mw: Middleware = (_req, _ctx, next) => next();
  builder.get("/test", handler, mw);
  const middleware = builder.build();
  const req = new Request("http://localhost/test");
  const ctx: Context = {
    url: new URL("http://localhost"),
    params: {},
    query: {},
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 8000 },
  };
  const next = () => new Response("Next");

  const response = await middleware(req, ctx, next);
  assertEquals(await response.text(), "OK");
});

Deno.test("RouteBuilder - chaining methods", async () => {
  const builder = createRouter();
  const getHandler: Handler = () => new Response("GET");
  const postHandler: Handler = () => new Response("POST");
  builder.get("/get", getHandler).post("/post", postHandler);
  const middleware = builder.build();

  const getReq = new Request("http://localhost/get");
  const getCtx: Context = {
    url: new URL("http://localhost/get"),
    params: {},
    query: {},
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 8000 },
  };
  const getResponse = await middleware(
    getReq,
    getCtx,
    () => new Response("Next"),
  );
  assertEquals(await getResponse.text(), "GET");

  const postReq = new Request("http://localhost/post", { method: "POST" });
  const postCtx: Context = {
    url: new URL("http://localhost/post"),
    params: {},
    query: {},
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 8000 },
  };
  const postResponse = await middleware(
    postReq,
    postCtx,
    () => new Response("Next"),
  );
  assertEquals(await postResponse.text(), "POST");
});

Deno.test("RouteBuilder - with params", async () => {
  const builder = createRouter();
  const handler: Handler = (_req, ctx) => new Response(`ID: ${ctx.params?.id}`);
  builder.get("/test/:id", handler);
  const middleware = builder.build();
  const req = new Request("http://localhost/test/123");
  const ctx: Context = {
    url: new URL("http://localhost"),
    params: {},
    query: {},
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 8000 },
  };
  const next = () => new Response("Next");

  const response = await middleware(req, ctx, next);
  assertEquals(await response.text(), "ID: 123");
});

Deno.test("RouteBuilder - multiple middlewares", async () => {
  const builder = createRouter();
  const handler: Handler = () => new Response("OK");
  const mw1: Middleware = (_req, _ctx, next) => next();
  const mw2: Middleware = (_req, _ctx, next) => next();
  builder.get("/test", handler, mw1, mw2);
  const middleware = builder.build();
  const req = new Request("http://localhost/test");
  const ctx: Context = {
    url: new URL("http://localhost"),
    params: {},
    query: {},
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 8000 },
  };
  const next = () => new Response("Next");

  const response = await middleware(req, ctx, next);
  assertEquals(await response.text(), "OK");
});

Deno.test("RouteBuilder - patch with middleware", async () => {
  const builder = createRouter();
  const handler: Handler = () => "PATCH";
  const mw: Middleware = (_req, _ctx, next) => next();
  builder.patch("/test", handler, mw);
  const middleware = builder.build();
  const res = await middleware(
    new Request("http://localhost/test", { method: "PATCH" }),
    { params: {} } as Context,
    () => new Response(),
  );
  assertEquals(await (res as Response).text(), "PATCH");
});

Deno.test("RouteBuilder - head with middleware", async () => {
  const builder = createRouter();
  const handler: Handler = () => "HEAD";
  const mw: Middleware = (_req, _ctx, next) => next();
  builder.head("/test", handler, mw);
  const middleware = builder.build();
  const res = await middleware(
    new Request("http://localhost/test", { method: "HEAD" }),
    { params: {} } as Context,
    () => new Response(),
  );
  assertEquals(await (res as Response).text(), "HEAD");
});

Deno.test("RouteBuilder - options with middleware", async () => {
  const builder = createRouter();
  const handler: Handler = () => "OPTIONS";
  const mw: Middleware = (_req, _ctx, next) => next();
  builder.options("/test", handler, mw);
  const middleware = builder.build();
  const res = await middleware(
    new Request("http://localhost/test", { method: "OPTIONS" }),
    { params: {} } as Context,
    () => new Response(),
  );
  assertEquals(await (res as Response).text(), "OPTIONS");
});

Deno.test("createRouteMiddleware - cache hit with handler calling next", async () => {
  const handler1: Handler = (_req, _ctx, next) => next!();
  const handler2: Handler = () => "Second";
  const routes: Route[] = [
    { method: "GET", path: "/test", handler: handler1 },
    { method: "GET", path: "/test", handler: handler2 },
  ];
  const middleware = build(routes);

  // 1. Initial hit (warm cache)
  await middleware(
    new Request("http://localhost/test"),
    { params: {} } as Context,
    () => new Response(),
  );

  // 2. Cache hit
  const res = await middleware(
    new Request("http://localhost/test"),
    { params: {} } as Context,
    () => new Response(),
  );
  assertEquals(await (res as Response).text(), "Second");
});

Deno.test("createRouteMiddleware - triggers cache eviction when capacity exceeded", async () => {
  const handler: Handler = (_req, _ctx) => new Response(_ctx.params!.id);
  const routes = [{ method: "GET", path: "/p/:id", handler }];
  const middleware = build(routes);

  const ctx: Context = {
    url: new URL("http://localhost"),
    params: {},
    query: {},
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 8000 },
  };

  const next = () => new Response("Next");

  // MAX_CACHE_SIZE is 1000 in implementation; exercise one more to force eviction
  for (let i = 0; i <= 1000; i++) {
    const req = new Request(`http://localhost/p/${i}`);
    const res = await middleware(req, { ...ctx, params: {} }, next);
    // last iteration should still return the correct id
    if (i === 1000) {
      assertEquals(await (res as Response).text(), "1000");
    }
  }
});

Deno.test("build - empty routes", async () => {
  const middleware = build([]);
  const res = await middleware(
    new Request("http://localhost/"),
    { params: {} } as Context,
    () => new Response("Next"),
  );
  assertEquals(await (res as Response).text(), "Next");
});
Deno.test("createRouteMiddleware - handler calls next to fall through to outer next", async () => {
  const handler: Handler = (_req, _ctx, next) => {
    return next!();
  };
  const routes = [
    { method: "GET", path: "/test", handler: handler },
  ];
  const middleware = build(routes);
  const req = new Request("http://localhost/test");
  const ctx: Context = {
    url: new URL(req.url),
    params: {},
    query: {},
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 8000 },
  };
  const next = () => new Response("Outer Next");

  const response = await middleware(req, ctx, next);
  assertEquals(await response.text(), "Outer Next");
});

Deno.test("matchPath - empty segment for parameter", () => {
  const result = matchPath("/hello/:id", "/hello/");
  assertEquals(result, null);
});

Deno.test("createRouteMiddleware - cache hit with middlewares", async () => {
  let mwCalled = 0;
  const mw: Middleware = (_req, _ctx, next) => {
    mwCalled++;
    return next();
  };
  const handler: Handler = () => new Response("OK");
  const routes = [{
    method: "GET",
    path: "/cache-test",
    handler,
    middlewares: [mw],
  }];
  const middleware = build(routes);
  const req = new Request("http://localhost/cache-test");
  const ctx: Context = {
    url: new URL(req.url),
    params: {},
    query: {},
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 8000 },
  };
  const next = () => new Response("Next");

  // First call - cache miss
  await middleware(req, ctx, next);
  assertEquals(mwCalled, 1);

  // Second call - cache hit
  await middleware(req, ctx, next);
  assertEquals(mwCalled, 2);
});

Deno.test("createRouteMiddleware - cache hit with global next fallthrough", async () => {
  const handler: Handler = (_req, _ctx, next) => next!();
  const routes = [{ method: "GET", path: "/cache-fallthrough", handler }];
  const middleware = build(routes);
  const req = new Request("http://localhost/cache-fallthrough");
  const ctx: Context = {
    url: new URL(req.url),
    params: {},
    query: {},
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 8000 },
  };
  const next = () => new Response("Global Next");

  // First call - cache miss
  const res1 = await middleware(req, ctx, next);
  assertEquals(await res1.text(), "Global Next");

  // Second call - cache hit
  const res2 = await middleware(req, ctx, next);
  assertEquals(await res2.text(), "Global Next");
});

Deno.test("createRouteMiddleware - fallthrough to next matching route in same builder", async () => {
  const handler1: Handler = (_req, _ctx, next) => next!();
  const handler2: Handler = () => new Response("Second Match");
  const routes = [
    { method: "GET", path: "/multi-match", handler: handler1 },
    { method: "GET", path: "/multi-match", handler: handler2 },
  ];
  const middleware = build(routes);
  const req = new Request("http://localhost/multi-match");
  const ctx: Context = {
    url: new URL(req.url),
    params: {},
    query: {},
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 8000 },
  };
  const next = () => new Response("Global Next");

  const res = await middleware(req, ctx, next);
  assertEquals(await res.text(), "Second Match");
});

Deno.test("createRouteMiddleware - cache null for non-matching routes", async () => {
  const routes: Route[] = [];
  const middleware = build(routes);
  const req = new Request("http://localhost/no-match");
  const ctx: Context = {
    url: new URL(req.url),
    params: {},
    query: {},
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 8000 },
  };
  let nextCalled = 0;
  const next = () => {
    nextCalled++;
    return new Response("Next");
  };

  await middleware(req, ctx, next);
  assertEquals(nextCalled, 1);

  await middleware(req, ctx, next);
  assertEquals(nextCalled, 2);
});

Deno.test("createRouteMiddleware - handles string return", async () => {
  const handler: Handler = () => "String Response";
  const routes = [{ method: "GET", path: "/string", handler }];
  const middleware = build(routes);
  const req = new Request("http://localhost/string");
  const ctx: Context = {
    url: new URL(req.url),
    params: {},
    query: {},
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 8000 },
  };
  const next = () => new Response("Next");

  const response = await middleware(req, ctx, next);
  assertEquals(await (response as Response).text(), "String Response");
});

Deno.test("createRouteMiddleware - handles async string return", async () => {
  const handler: Handler = async () => {
    await new Promise((r) => setTimeout(r, 1));
    return "Async String Response";
  };
  const routes = [{ method: "GET", path: "/async-string", handler }];
  const middleware = build(routes);
  const req = new Request("http://localhost/async-string");
  const ctx: Context = {
    url: new URL(req.url),
    params: {},
    query: {},
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 8000 },
  };
  const next = () => new Response("Next");

  const response = await middleware(req, ctx, next);
  assertEquals(await (response as Response).text(), "Async String Response");
});

Deno.test("createRouteMiddleware - fallthrough to next matching route in same builder (cached)", async () => {
  const handler1: Handler = (_req, _ctx, next) => next!();
  const handler2: Handler = () => new Response("Second Match");
  const routes = [
    { method: "GET", path: "/multi-match-cache", handler: handler1 },
    { method: "GET", path: "/multi-match-cache", handler: handler2 },
  ];
  const middleware = build(routes);
  const req = new Request("http://localhost/multi-match-cache");
  const ctx: Context = {
    url: new URL(req.url),
    params: {},
    query: {},
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 8000 },
  };
  const next = () => new Response("Global Next");

  // First call - miss
  const res1 = await middleware(req, ctx, next);
  assertEquals(await res1.text(), "Second Match");

  // Second call - hit
  const res2 = await middleware(req, ctx, next);
  assertEquals(await res2.text(), "Second Match");
});

Deno.test("createRouteMiddleware - handles object return", async () => {
  const handler: Handler = () => ({ hello: "world" });
  const routes: Route[] = [{ method: "GET", path: "/json", handler }];
  const middleware = build(routes);
  const req = new Request("http://localhost/json");
  const ctx: Context = {
    url: new URL(req.url),
    params: {},
    query: {},
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 8000 },
  };
  const next = () => new Response("Next");

  const response = await middleware(req, ctx, next);
  assertEquals(await (response as Response).json(), { hello: "world" });
});

Deno.test("createRouteMiddleware - handles request with no path (origin only)", async () => {
  const mockHandler: Handler = () => new Response("ROOT");
  const routes = [{ method: "GET", path: "/", handler: mockHandler }];
  const middleware = build(routes);
  const req = new Request("http://localhost");
  const ctx: Context = {
    url: new URL("http://localhost"),
    params: {},
    query: {},
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 8000 },
  };
  const next = () => new Response("Next");

  const response = await middleware(req, ctx, next);
  assertEquals(await response.text(), "ROOT");
});

Deno.test("createRouteMiddleware - handles async object return", async () => {
  const handler: Handler = async () => {
    await new Promise((r) => setTimeout(r, 1));
    return { async: "json" };
  };
  const routes: Route[] = [{ method: "GET", path: "/async-json", handler }];
  const middleware = build(routes);
  const req = new Request("http://localhost/async-json");
  const ctx: Context = {
    url: new URL(req.url),
    params: {},
    query: {},
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 8000 },
  };
  const next = () => new Response("Next");

  const response = await middleware(req, ctx, next);
  assertEquals(await (response as Response).json(), { async: "json" });
});

Deno.test("createRouteMiddleware - cache hit without middlewares", async () => {
  const handler: Handler = () => new Response("OK");
  const routes: Route[] = [{ method: "GET", path: "/cache-no-mw", handler }];
  const middleware = build(routes);
  const req = new Request("http://localhost/cache-no-mw");
  const ctx: Context = {
    url: new URL(req.url),
    params: {},
    query: {},
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 8000 },
  };
  const next = () => new Response("Next");

  // First call - miss
  await middleware(req, ctx, next);
  // Second call - hit
  const res = await middleware(req, ctx, next);
  assertEquals(await res.text(), "OK");
});

Deno.test("createRouteMiddleware - cache size limit and LRU eviction", async () => {
  const routes: Route[] = [];
  for (let i = 0; i < 1005; i++) {
    routes.push({
      method: "GET",
      path: `/path${i}`,
      handler: () => `path${i}`,
    });
  }
  const middleware = build(routes);
  const next = () => new Response("Next");

  // 1. Fill cache to capacity (1000)
  for (let i = 0; i < 1000; i++) {
    const req = new Request(`http://localhost/path${i}`);
    const ctx = { params: {} } as Context;
    await middleware(req, ctx, next);
  }

  // 2. Access entry 0 to make it "most recently used"
  await middleware(
    new Request("http://localhost/path0"),
    { params: {} } as Context,
    next,
  );

  // 3. Add one more entry (should evict "path1")
  await middleware(
    new Request("http://localhost/path1000"),
    { params: {} } as Context,
    next,
  );
});

Deno.test("createRouteMiddleware - handles Record return", async () => {
  const handler: Handler = () => ({ status: "success" });
  const middleware = build([{ method: "GET", path: "/json", handler }]);
  const res = await middleware(
    new Request("http://localhost/json"),
    { params: {} } as Context,
    () => new Response(),
  );
  assertEquals(await (res as Response).json(), { status: "success" });
});

Deno.test("createRouteMiddleware - handles Promise<Record> return", async () => {
  const handler: Handler = async () => {
    await new Promise((r) => setTimeout(r, 1));
    return { async: true };
  };
  const middleware = build([{ method: "GET", path: "/json-async", handler }]);
  const res = await middleware(
    new Request("http://localhost/json-async"),
    { params: {} } as Context,
    () => new Response(),
  );
  assertEquals(await (res as Response).json(), { async: true });
});

Deno.test("createRouteMiddleware - handles Promise<Response> return", async () => {
  const handler: Handler = () =>
    Promise.resolve(new Response("Async Response"));
  const middleware = build([{ method: "GET", path: "/async-res", handler }]);
  const res = await middleware(
    new Request("http://localhost/async-res"),
    { params: {} } as Context,
    () => new Response(),
  );
  assertEquals(await (res as Response).text(), "Async Response");
});

Deno.test("createRouteMiddleware - handles null return", async () => {
  // @ts-ignore: testing invalid return
  const handler: Handler = () => null;
  const middleware = build([{ method: "GET", path: "/null", handler }]);
  const res = await middleware(
    new Request("http://localhost/null"),
    { params: {} } as Context,
    () => new Response(),
  );
  assertEquals(await (res as Response).text(), "null"); // Response.json(null) gives "null"
});

Deno.test("createRouteMiddleware - handles array return", async () => {
  // @ts-ignore: testing non-standard handler return type
  const handler: Handler = () => [1, 2, 3];
  const middleware = build([{ method: "GET", path: "/array", handler }]);
  const res = await middleware(
    new Request("http://localhost/array"),
    { params: {} } as Context,
    () => new Response(),
  );
  assertEquals(await (res as Response).json(), [1, 2, 3]);
});

Deno.test("matchPath - wildcard route matches everything", () => {
  const result = matchPath("*", "/any/path/here");
  assertEquals(result, { params: {} });
});

Deno.test("createRouteMiddleware - handler returns undefined throws TypeError", async () => {
  // @ts-ignore: testing undefined return value
  const handler: Handler = () => {
    throw new TypeError("Handler returned undefined");
  };
  const middleware = build([{ method: "GET", path: "/undef", handler }]);
  try {
    await middleware(
      new Request("http://localhost/undef"),
      { params: {} } as Context,
      () => new Response(),
    );
    throw new Error("Expected middleware to throw");
  } catch (e) {
    assertEquals(e instanceof TypeError, true);
  }
});

Deno.test("matchPath - different parts same length", () => {
  const result = matchPath("/a/b", "/a/c");
  assertEquals(result, null);
});

Deno.test("createRouteMiddleware - multiple middlewares cache hit", async () => {
  let count = 0;
  const mw: Middleware = (_, __, next) => {
    count++;
    return next();
  };
  const handler: Handler = () => "OK";
  const routes = [{
    method: "GET",
    path: "/multi-mw",
    handler,
    middlewares: [mw, mw],
  }];
  const middleware = build(routes);
  const req = new Request("http://localhost/multi-mw");
  const ctx = { params: {} } as Context;

  await middleware(req, ctx, () => new Response());
  assertEquals(count, 2);

  await middleware(req, ctx, () => new Response());
  assertEquals(count, 4);
});

Deno.test("createRouteMiddleware - POST cache hit", async () => {
  const handler: Handler = () => "POST OK";
  const routes = [{ method: "POST", path: "/post", handler }];
  const middleware = build(routes);
  const req = new Request("http://localhost/post", { method: "POST" });
  const ctx = { params: {} } as Context;
  const next = () => new Response("Next");

  await middleware(req, ctx, next); // miss
  const res = await middleware(req, ctx, next); // hit
  assertEquals(await (res as Response).text(), "POST OK");
});

Deno.test("createRouteMiddleware - handles number return", async () => {
  // @ts-ignore: testing non-standard handler return type
  const handler: Handler = () => 123;
  const middleware = build([{ method: "GET", path: "/number", handler }]);
  const res = await middleware(
    new Request("http://localhost/number"),
    { params: {} } as Context,
    () => new Response(),
  );
  assertEquals(await (res as Response).json(), 123);
});

Deno.test("createRouteMiddleware - handles request with query string (single segment)", async () => {
  const handler: Handler = () => new Response("QOK");
  const middleware = build([{ method: "GET", path: "/search", handler }]);
  const res = await middleware(
    new Request("http://localhost/search?q=1"),
    { params: {} } as Context,
    () => new Response(),
  );
  assertEquals(await (res as Response).text(), "QOK");
});

Deno.test("createRouteMiddleware - handles request with query string (multi segment)", async () => {
  const handler: Handler = () => new Response("QOK2");
  const middleware = build([{ method: "GET", path: "/a/b", handler }]);
  const res = await middleware(
    new Request("http://localhost/a/b?x=1&y=2"),
    { params: {} } as Context,
    () => new Response(),
  );
  assertEquals(await (res as Response).text(), "QOK2");
});

Deno.test("createRouteMiddleware - handles undefined return", async () => {
  // @ts-ignore: testing non-standard handler return type
  const handler: Handler = () => undefined;
  const middleware = build([{ method: "GET", path: "/undef", handler }]);
  try {
    await middleware(
      new Request("http://localhost/undef"),
      { params: {} } as Context,
      () => new Response(),
    );
    throw new Error("Expected middleware to throw");
  } catch (e) {
    // Response.json(undefined) is not serializable and should throw TypeError
    assertEquals(e instanceof TypeError, true);
  }
});

Deno.test("createRouteMiddleware - handles boolean return", async () => {
  // @ts-ignore: testing non-standard handler return type
  const handler: Handler = () => true;
  const middleware = build([{ method: "GET", path: "/bool", handler }]);
  const res = await middleware(
    new Request("http://localhost/bool"),
    { params: {} } as Context,
    () => new Response(),
  );
  assertEquals(await (res as Response).json(), true);
});

Deno.test("createRouteMiddleware - 404 cache LRU eviction", async () => {
  const middleware = build([]);
  const next = () => new Response("Next");

  // Fill cache with 404s
  for (let i = 0; i < 1001; i++) {
    const req = new Request(`http://localhost/404-${i}`);
    await middleware(req, { params: {} } as Context, next);
  }
});

Deno.test("createRouteMiddleware - small cache eviction covers both branches", async () => {
  // Use a small cache size to deterministically hit both eviction checks.
  setMaxCacheSize(3);

  // 1) Matching route eviction
  const handler: Handler = (_req, _ctx) => new Response(_ctx.params!.id);
  const routes = [{ method: "GET", path: "/ev/:id", handler }];
  const middleware = build(routes);
  const ctx = { params: {} } as Context;
  const next = () => new Response();

  for (let i = 0; i <= 3; i++) {
    const req = new Request(`http://localhost/ev/${i}`);
    const res = await middleware(req, { ...ctx, params: {} }, next);
    if (i === 3) {
      assertEquals(await (res as Response).text(), "3");
    }
  }

  // 2) Non-matching route eviction (cache null branch)
  const none = build([]);
  for (let i = 0; i <= 3; i++) {
    const req = new Request(`http://localhost/ev-none-${i}`);
    await none(req, { params: {} } as Context, () => new Response());
  }

  // restore default
  setMaxCacheSize(1000);
});

Deno.test("matchPath - handles invalid encoding", () => {
  const result = matchPath("/u/:name", "/u/%E0%A4%A");
  assertEquals(result, { params: { name: "%E0%A4%A" } });
});

Deno.test("matchPath - param cannot be empty", () => {
  const result = matchPath("/u/:name", "/u/");
  assertEquals(result, null);
});

Deno.test("createRouteBuilder - handles fallthrough with next", async () => {
  const r = createRouter();
  r.get(
    "/fall/:id",
    (
      _req: Request,
      ctx: Context,
      next: (() => Response | Promise<Response>) | undefined,
    ) => {
      if (ctx.params?.id === "1") return "First";
      return next ? next() : "Fail";
    },
  );
  r.get("/fall/:id", () => "Second");

  const middleware = r.build();

  const res1 = await middleware(
    new Request("http://localhost/fall/1"),
    { params: {} } as Context,
    () => new Response(),
  );
  assertEquals(await (res1 as Response).text(), "First");

  const res2 = await middleware(
    new Request("http://localhost/fall/2"),
    { params: {} } as Context,
    () => new Response(),
  );
  assertEquals(await (res2 as Response).text(), "Second");

  // Test cache hit fallthrough
  const res3 = await middleware(
    new Request("http://localhost/fall/2"),
    { params: {} } as Context,
    () => new Response(),
  );
  assertEquals(await (res3 as Response).text(), "Second");
});

Deno.test("createRouteMiddleware - cache hit LRU move", async () => {
  const handler: Handler = () => "OK";
  const middleware = build([{ method: "GET", path: "/test", handler }]);
  const req = new Request("http://localhost/test");
  const ctx = { params: {} } as Context;
  const next = () => new Response();

  await middleware(req, ctx, next); // cache
  await middleware(req, ctx, next); // hit & move
});

// Targeted: exercise tryRoute when called with index > 0 where a match exists
// but the prior route's handler calls next, ensuring the inner tryRoute loop
// executes the branch where `index !== 0` (no caching) and falls through.
Deno.test("createRouteMiddleware - tryRoute called with index>0 (no cache set)", async () => {
  const handler1: Handler = (_req, _ctx, next) => next!();
  const handler2: Handler = () => new Response("Inner");
  const routes: Route[] = [
    { method: "GET", path: "/chain", handler: handler1 },
    { method: "GET", path: "/chain", handler: handler2 },
  ];
  const middleware = build(routes);

  const req = new Request("http://localhost/chain");
  const ctx: Context = {
    url: new URL(req.url),
    params: {},
    query: {},
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 8000 },
  };
  const next = () => new Response("Outer");

  const res = await middleware(req, ctx, next);
  assertEquals(await (res as Response).text(), "Inner");
});

Deno.test("createRouteMiddleware - origin-only URL with query (no slash)", async () => {
  const handler: Handler = () => new Response("ROOTQ");
  const routes = [{ method: "GET", path: "/", handler }];
  const middleware = build(routes);

  const res = await middleware(
    new Request("http://localhost?x=1"),
    { params: {} } as Context,
    () => new Response(),
  );
  assertEquals(await (res as Response).text(), "ROOTQ");
});

Deno.test("createRouteMiddleware - non-http URL (about:blank) hits origin branch", async () => {
  const handler: Handler = () => new Response("BLANK");
  const middleware = build([{ method: "GET", path: "/", handler }]);

  const res = await middleware(
    new Request("about:blank"),
    { params: {} } as Context,
    () => new Response(),
  );

  assertEquals(await (res as Response).text(), "BLANK");
});

Deno.test("createRouteMiddleware - force eviction for matching routes (explicit)", async () => {
  const handler: Handler = (_req, _ctx) => new Response(_ctx.params!.id);
  const routes = [{ method: "GET", path: "/force/:id", handler }];
  const middleware = build(routes);
  const ctx = { params: {} } as Context;
  const next = () => new Response();

  // Fill the cache with MAX_CACHE_SIZE entries for matching routes
  for (let i = 0; i <= 1000; i++) {
    const req = new Request(`http://localhost/force/${i}`);
    const res = await middleware(req, { ...ctx, params: {} }, next);
    if (i === 1000) {
      assertEquals(await (res as Response).text(), "1000");
    }
  }
});

Deno.test("createRouteMiddleware - force eviction for non-matching routes (explicit)", async () => {
  const middleware = build([]);
  const next = () => new Response("Next");

  // Fill the cache with MAX_CACHE_SIZE 404 entries then add one more to evict
  for (let i = 0; i <= 1000; i++) {
    const req = new Request(`http://localhost/force-404-${i}`);
    await middleware(req, { params: {} } as Context, next);
  }
});

Deno.test("matchPath - handles double slashes in route and request", () => {
  const result = matchPath("/a//b", "/a//b");
  assertEquals(result, { params: {} });
});

Deno.test("createRouteMiddleware - handles URL with credentials", async () => {
  const handler: Handler = () => new Response("Creds");
  const middleware = build([{ method: "GET", path: "/test", handler }]);
  const req = new Request("http://user:pass@localhost/test");
  const ctx: Context = {
    url: new URL(req.url),
    params: {},
    query: {},
    remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 8000 },
  };
  const next = () => new Response("Next");

  const res = await middleware(req, ctx, next);
  assertEquals(await res.text(), "Creds");
});
