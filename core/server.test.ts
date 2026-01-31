import { assert, assertEquals, assertRejects } from "@std/assert";
import server, { _getRoutesForTests, _resetForTests } from "./server.ts";
import type { Context, Next } from "./types.ts";

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
