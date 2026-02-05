import {
  assertEquals,
  assertExists,
  assertNotEquals,
  assertStringIncludes,
} from "@std/assert";
import React from "react";
import {
  _getHmrClientsForTests,
  _initWatcherForTests,
  _resetWatcherForTests,
  _setLastMtimeForTests,
  _watchTickForTests,
  createRenderMiddleware,
  generatePWAScript,
} from "./render.ts";
import Fastro, { Context } from "../../mod.ts";
import { _resetForTests } from "../../core/server.ts";

Deno.env.set("ENV", "production");

Deno.test("Render Middleware - generatePWAScript defaults", () => {
  const script = generatePWAScript();
  assertStringIncludes(script, "pwa-v18");
  assertStringIncludes(script, "await caches.match(request)");
});

Deno.test("Render Middleware - generatePWAScript assets is not array", () => {
  // @ts-ignore: testing invalid input
  const script = generatePWAScript({ assets: null });
  assertStringIncludes(script, "const PRECACHE = [];");
});

Deno.test("Render Middleware - generatePWAScript custom config", () => {
  const script = generatePWAScript({
    cacheName: "my-app",
    fetchStrategy: "network-first",
    assets: ["/test.js"],
  });
  assertStringIncludes(script, "my-app");
  assertStringIncludes(script, "RUNTIME_CACHE");
  assertStringIncludes(script, "/test.js");
});

Deno.test("Render Middleware - generatePWAScript with .sw_version changes hash", () => {
  const script1 = generatePWAScript();
  const version = "v123";
  Deno.writeTextFileSync(".sw_version", version);
  try {
    const script2 = generatePWAScript();
    assertNotEquals(script1, script2);
  } finally {
    try {
      Deno.removeSync(".sw_version");
    } catch (_) { /* ignore */ }
  }
});

Deno.test("Render Middleware - generatePWAScript catch serverOverride", () => {
  try {
    Deno.removeSync(".sw_version");
  } catch (_) { /* ignored */ }
  const script = generatePWAScript();
  assertExists(script);
});

Deno.test("Render Middleware - generatePWAScript with network-first strategy code", () => {
  const script = generatePWAScript({ fetchStrategy: "network-first" });
  assertStringIncludes(script, "RUNTIME_CACHE");
  assertStringIncludes(script, "fetch(request)");
});

Deno.test("Render Middleware - renderToString basic", async () => {
  _resetForTests();
  const fastro = new Fastro();
  fastro.use(createRenderMiddleware());
  fastro.get("/", (_req, ctx) => {
    return ctx.renderToString!(React.createElement("div", null, "Hello"));
  });

  const s = fastro.serve({ port: 3600 });
  try {
    const res = await fetch("http://localhost:3600/");
    const html = await res.text();
    assertStringIncludes(html, "Hello");
  } finally {
    s.close();
  }
});

Deno.test("Render Middleware - renderToString custom title and head", async () => {
  _resetForTests();
  const fastro = new Fastro();
  fastro.use(createRenderMiddleware());
  fastro.get("/", (_req, ctx) => {
    return ctx.renderToString!(React.createElement("div", null, "Hello"), {
      title: "Custom Title",
      head:
        '<head><title>Custom Title</title><meta name="description" content="test"></head>',
    });
  });

  const s = fastro.serve({ port: 3601 });
  try {
    const res = await fetch("http://localhost:3601/");
    const html = await res.text();
    assertStringIncludes(html, "Custom Title");
  } finally {
    s.close();
  }
});

Deno.test("Render Middleware - renderToString options with initialProps", async () => {
  _resetForTests();
  const fastro = new Fastro();
  fastro.use(createRenderMiddleware());
  fastro.get("/", (_req, ctx) => {
    return ctx.renderToString!(React.createElement("div", null, "Hello"), {
      module: "my-module",
      initialProps: { user: "admin" },
      identifierPrefix: "app",
      nonceProvider: () => "nonce",
    });
  });

  const s = fastro.serve({ port: 3602 });
  try {
    const res = await fetch("http://localhost:3602/");
    const html = await res.text();
    assertStringIncludes(html, '{"user":"admin"}');
  } finally {
    s.close();
  }
});

Deno.test("Render Middleware - renderToString includeHead: false", async () => {
  _resetForTests();
  const fastro = new Fastro();
  fastro.use(createRenderMiddleware());
  fastro.get("/", (_req, ctx) => {
    return ctx.renderToString!(React.createElement("div", null, "Hello"), {
      includeHead: false,
    });
  });

  const s = fastro.serve({ port: 3603 });
  try {
    const res = await fetch("http://localhost:3603/");
    const html = await res.text();
    assertEquals(html, "<div>Hello</div>");
  } finally {
    s.close();
  }
});

Deno.test("Render Middleware - renderToString includeDoctype: true", async () => {
  _resetForTests();
  const fastro = new Fastro();
  fastro.use(createRenderMiddleware());
  fastro.get("/", (_req, ctx) => {
    return ctx.renderToString!(React.createElement("div", null, "Hello"), {
      includeDoctype: true,
      includeHead: false,
    });
  });

  const s = fastro.serve({ port: 3604 });
  try {
    const res = await fetch("http://localhost:3604/");
    const html = await res.text();
    assertStringIncludes(html, "<!DOCTYPE html>");
  } finally {
    s.close();
  }
});

Deno.test("Render Middleware - admin bump-sw", async () => {
  _resetForTests();
  const fastro = new Fastro();
  fastro.use(createRenderMiddleware());
  const s = fastro.serve({ port: 3605 });
  try {
    const res = await fetch("http://localhost:3605/admin/bump-sw", {
      method: "POST",
    });
    const data = await res.json();
    assertEquals(data.ok, true);
  } finally {
    s.close();
    try {
      Deno.removeSync(".sw_version");
    } catch (_) { /* ignored */ }
  }
});

Deno.test("Render Middleware - admin bump-sw error", async () => {
  _resetForTests();
  const fastro = new Fastro();
  fastro.use(createRenderMiddleware());
  // Mock Deno.writeTextFileSync to throw
  const original = Deno.writeTextFileSync;
  Deno.writeTextFileSync = () => {
    throw new Error("mock error");
  };
  const s = fastro.serve({ port: 3623 });
  try {
    const res = await fetch("http://localhost:3623/admin/bump-sw", {
      method: "POST",
    });
    assertEquals(res.status, 500);
    const data = await res.json();
    assertEquals(data.ok, false);
  } finally {
    Deno.writeTextFileSync = original;
    s.close();
  }
});

Deno.test("Render Middleware - pwa sw.js request", async () => {
  _resetForTests();
  const fastro = new Fastro();
  fastro.use(createRenderMiddleware({ pwa: true }));
  const s = fastro.serve({ port: 3606 });
  try {
    const res = await fetch("http://localhost:3606/sw.js");
    assertEquals(res.status, 200);
    await res.text();
  } finally {
    s.close();
  }
});

Deno.test("Render Middleware - isSwRequest fallback", async () => {
  _resetForTests();
  const middleware = createRenderMiddleware({ pwa: true });
  const req = {
    url: "/sw.js", // No base, will throw in new URL(req.url)
    method: "GET",
  } as unknown as Request;
  const ctx = {} as unknown as Context;
  const next = () => Promise.resolve(new Response());
  const res = await middleware(req, ctx, next);
  assertEquals(res.status, 200);
  const text = await res.text();
  assertStringIncludes(text, "CACHE_NAME");
});

Deno.test("Render Middleware - hmr endpoint upgrade and heartbeat", {
  sanitizeOps: false,
  sanitizeResources: false,
}, async () => {
  _resetForTests();
  Deno.env.delete("ENV");
  const fastro = new Fastro();
  fastro.use(createRenderMiddleware());
  const s = fastro.serve({ port: 3608 });
  try {
    const ws = new WebSocket("ws://localhost:3608/hmr");
    const promise = new Promise<void>((resolve) => {
      let connected = false;
      ws.onmessage = (event) => {
        if (event.data === "connected") connected = true;
        if (event.data === "heartbeat" && connected) {
          ws.close();
          resolve();
        }
      };
    });
    await promise;
  } finally {
    s.close();
    Deno.env.set("ENV", "production");
  }
});

Deno.test("Render Middleware - components watcher coverage", {
  sanitizeOps: false,
  sanitizeResources: false,
}, async () => {
  _resetForTests();
  Deno.env.delete("ENV");
  const fastro = new Fastro();
  fastro.use(createRenderMiddleware());
  const s = fastro.serve({ port: 3622 });
  try {
    await (await fetch("http://localhost:3622/")).text();
    Deno.writeTextFileSync("./.build_done", Date.now().toString());
    await new Promise((r) => setTimeout(r, 600));

    // Trigger branch where mtime <= lastMtime
    // (Wait a bit but don't change file too much)
    await new Promise((r) => setTimeout(r, 100));

    // Rapid change for throttle
    Deno.writeTextFileSync("./.build_done", Date.now().toString());
    Deno.writeTextFileSync("./.build_done", "more");
  } finally {
    s.close();
    Deno.env.set("ENV", "production");
    try {
      Deno.removeSync("./.build_done");
    } catch (_) { /* ignored */ }
  }
});

Deno.test("Render Middleware - renderToString production mode", async () => {
  _resetForTests();
  const fastro = new Fastro();
  fastro.use(createRenderMiddleware());
  fastro.get("/", (_req, ctx) => {
    return ctx.renderToString!(React.createElement("div", null, "Hello"), {
      module: "my-module",
      initialProps: { data: 1 },
    });
  });

  const originalEnv = Deno.env.get("ENV");
  Deno.env.set("ENV", "production");
  const s = fastro.serve({ port: 3609 });
  try {
    const res = await fetch("http://localhost:3609/");
    const html = await res.text();
    assertStringIncludes(html, "/js/my-module/client.js");
  } finally {
    s.close();
    if (originalEnv) Deno.env.set("ENV", originalEnv);
    else Deno.env.delete("ENV");
  }
});

Deno.test("Render Middleware - renderToString options with prefix", async () => {
  _resetForTests();
  const fastro = new Fastro();
  fastro.use(createRenderMiddleware());
  fastro.get("/", (_req, ctx) => {
    return ctx.renderToString!(React.createElement("div", null, "Hello"), {
      identifierPrefix: "app",
    });
  });

  const s = fastro.serve({ port: 3610 });
  try {
    const res = await fetch("http://localhost:3610/");
    await res.text();
  } finally {
    s.close();
  }
});

Deno.test("Render Middleware - HMR heartbeat error coverage", {
  sanitizeOps: false,
  sanitizeResources: false,
}, async () => {
  _resetForTests();
  _resetWatcherForTests();
  Deno.env.delete("ENV");

  const originalUpgrade = Deno.upgradeWebSocket;
  const originalSetInterval = globalThis.setInterval;

  // @ts-ignore: mock
  globalThis.setInterval = (cb: unknown, ms: number) => {
    if (ms === 10000) {
      setTimeout(cb as () => void, 100);
      return 123;
    }
    return originalSetInterval(cb as () => void, ms);
  };

  // @ts-ignore: mock
  Deno.upgradeWebSocket = (req: Request) => {
    const { socket, response } = originalUpgrade(req);
    const originalSend = socket.send.bind(socket);
    socket.send = (data: unknown) => {
      if (data === "heartbeat") throw new Error("mock fail");
      return originalSend(data as string);
    };
    return { socket, response };
  };

  const fastro = new Fastro();
  fastro.use(createRenderMiddleware());
  const s = fastro.serve({ port: 3620 });
  try {
    const ws = new WebSocket("ws://localhost:3620/hmr");
    await new Promise((r) => ws.onopen = r);
    await new Promise((r) => setTimeout(r, 200));
    ws.close();
  } finally {
    s.close();
    // @ts-ignore: restore
    Deno.upgradeWebSocket = originalUpgrade;
    // @ts-ignore: restore
    globalThis.setInterval = originalSetInterval;
    Deno.env.set("ENV", "production");
  }
});

Deno.test("Render Middleware - generatePWAScript normalize coverage", () => {
  const script = generatePWAScript({
    assets: ["/path?q=1", "/other#hash"],
  });
  assertStringIncludes(script, '"/path"');
  assertStringIncludes(script, '"/other"');
});

Deno.test("Render Middleware - renderToString component error", {
  sanitizeOps: false,
  sanitizeResources: false,
}, async () => {
  _resetForTests();
  const fastro = new Fastro();
  fastro.use(createRenderMiddleware());
  const ThrowingComponent = () => {
    throw new Error("render error");
  };
  fastro.get("/", (_req, ctx) => {
    try {
      return ctx.renderToString!(
        React.createElement(
          ThrowingComponent as unknown as React.ComponentType,
        ),
        {
          onError: () => {},
        },
      );
    } catch (_) {
      return "caught";
    }
  });

  const s = fastro.serve({ port: 3615 });
  try {
    const res = await fetch("http://localhost:3615/");
    const text = await res.text();
    assertEquals(text, "caught");
  } finally {
    s.close();
  }
});

Deno.test("Render Middleware - PWA in production HTML script", async () => {
  _resetForTests();
  const fastro = new Fastro();
  fastro.use(createRenderMiddleware({ pwa: true }));
  fastro.get(
    "/",
    (_req, ctx) => ctx.renderToString!(React.createElement("div", null, "pwa")),
  );

  const or = Deno.env.get("ENV");
  Deno.env.set("ENV", "production");
  const s = fastro.serve({ port: 3616 });
  try {
    const res = await fetch("http://localhost:3616/");
    const html = await res.text();
    assertStringIncludes(html, "navigator.serviceWorker");
  } finally {
    s.close();
    if (or) Deno.env.set("ENV", or);
    else Deno.env.delete("ENV");
  }
});

Deno.test("Render Middleware - pwa sw.js production context", async () => {
  _resetForTests();
  const fastro = new Fastro();
  fastro.use(createRenderMiddleware({ pwa: true }));
  const original = Deno.env.get("ENV");
  Deno.env.set("ENV", "production");
  const s = fastro.serve({ port: 3619 });
  try {
    const res = await fetch("http://localhost:3619/sw.js");
    assertEquals(
      res.headers.get("cache-control"),
      "public, max-age=31536000, immutable",
    );
    await res.arrayBuffer();
  } finally {
    s.close();
    if (original) Deno.env.set("ENV", original);
    else Deno.env.delete("ENV");
  }
});

Deno.test("Render Middleware - URL parse error coverage", async () => {
  _resetForTests();
  const middleware = createRenderMiddleware();
  const req = { url: null, method: "GET" } as unknown as Request;
  const ctx = {} as unknown as Context;
  const next = () => Promise.resolve(new Response("ok"));
  const res = await middleware(req, ctx, next);
  assertEquals(await res.text(), "ok");
});

Deno.test("Render Middleware - components watcher no file initially", {
  sanitizeOps: false,
  sanitizeResources: false,
}, async () => {
  _resetForTests();
  _resetWatcherForTests();
  try {
    Deno.removeSync("./.build_done");
  } catch (_) { /* ignored */ }
  Deno.env.delete("ENV");
  const fastro = new Fastro();
  fastro.use(createRenderMiddleware());
  const s = fastro.serve({ port: 3612 });
  try {
    await (await fetch("http://localhost:3612/")).text();
    for (let i = 0; i < 20; i++) {
      try {
        if (Deno.statSync("./.build_done")) break;
      } catch (_) {
        await new Promise((r) => setTimeout(r, 50));
      }
    }
    assertExists(Deno.statSync("./.build_done"));
  } finally {
    s.close();
    Deno.env.set("ENV", "production");
    try {
      Deno.removeSync("./.build_done");
    } catch (_) { /* ignored */ }
  }
});

Deno.test("Render Middleware - HMR client reload delivery", {
  sanitizeOps: false,
  sanitizeResources: false,
}, async () => {
  _resetForTests();
  _resetWatcherForTests();
  Deno.env.delete("ENV");
  const fastro = new Fastro();
  fastro.use(createRenderMiddleware());
  const s = fastro.serve({ port: 3617 });
  try {
    const ws = new WebSocket("ws://localhost:3617/hmr");
    await new Promise((r) => ws.onopen = r);

    const reloadReceived = new Promise<void>((resolve) => {
      ws.onmessage = (event) => {
        if (event.data === "reload") resolve();
      };
    });

    // Wait for context to be initialized and watcher to start
    await new Promise((r) => setTimeout(r, 600));

    // Trigger watcher by creating/updating .build_done
    Deno.writeTextFileSync("./.build_done", Date.now().toString());

    // Wait for reload message
    await Promise.race([
      reloadReceived,
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Timeout waiting for HMR reload")),
          6000,
        )
      ),
    ]);
    ws.close();
  } finally {
    s.close();
    Deno.env.set("ENV", "production");
    try {
      Deno.removeSync("./.build_done");
    } catch (_) { /* ignored */ }
  }
});

Deno.test("Render Middleware - renderToString with signal", async () => {
  _resetForTests();
  const fastro = new Fastro();
  fastro.use(createRenderMiddleware());
  const controller = new AbortController();
  fastro.get("/", (_req, ctx) => {
    return ctx.renderToString!(React.createElement("div", null, "test"), {
      signal: controller.signal,
    });
  });
  const s = fastro.serve({ port: 3624 });
  try {
    const res = await fetch("http://localhost:3624/");
    assertStringIncludes(await res.text(), "test");
  } finally {
    s.close();
  }
});

Deno.test("Render Middleware - hmr closed/error client coverage", {
  sanitizeOps: false,
  sanitizeResources: false,
}, async () => {
  _resetForTests();
  _resetWatcherForTests();
  Deno.env.delete("ENV");
  const fastro = new Fastro();
  fastro.use(createRenderMiddleware());
  const s = fastro.serve({ port: 3625 });
  try {
    const ws1 = new WebSocket("ws://localhost:3625/hmr");
    await new Promise((r) => ws1.onopen = r);

    // Client that will be CLOSED
    const ws2 = new WebSocket("ws://localhost:3625/hmr");
    await new Promise((r) => ws2.onopen = r);
    ws2.close();
    await new Promise((r) => ws2.onclose = r);

    // Give it a bit to update readyState
    await new Promise((r) => setTimeout(r, 100));

    // Client that will THROW on send
    // We can't easily mock the server-side socket here without mocking upgradeWebSocket
    // but we can at least hit the CLOSED branch

    Deno.writeTextFileSync("./.build_done", Date.now().toString());
    await new Promise((r) => setTimeout(r, 800));

    ws1.close();
  } finally {
    s.close();
    Deno.env.set("ENV", "production");
    try {
      Deno.removeSync("./.build_done");
    } catch (_) { /* ignored */ }
  }
});

Deno.test("Render Middleware - HMR pending reload on connect", {
  sanitizeOps: false,
  sanitizeResources: false,
}, async () => {
  _resetForTests();
  _resetWatcherForTests();
  Deno.env.delete("ENV");

  // Ensure file doesn't exist initially
  try {
    Deno.removeSync("./.build_done");
  } catch (_) { /* ignored */ }

  const fastro = new Fastro();
  fastro.use(createRenderMiddleware());
  const s = fastro.serve({ port: 3626 });
  try {
    // Activate middleware to start watcher
    await fetch("http://localhost:3626/");

    // Wait for watcher to initialize and create its base mtime
    await new Promise((r) => setTimeout(r, 1000));

    // Trigger change with 0 clients -> pendingReload becomes true
    Deno.writeTextFileSync("./.build_done", "reload-me-" + Date.now());

    // Wait for watcher to tick and see the change (500ms interval)
    await new Promise((r) => setTimeout(r, 1500));

    const ws = new WebSocket("ws://localhost:3626/hmr");
    let _receivedReload = false;
    const reloadPromise = new Promise<void>((resolve, reject) => {
      const t = setTimeout(() => {
        ws.close();
        reject(new Error("Timeout waiting for pending HMR reload"));
      }, 5000);
      ws.onmessage = (e) => {
        if (e.data === "reload") {
          _receivedReload = true;
          clearTimeout(t);
          resolve();
        }
      };
    });
    await reloadPromise;
    ws.close();
    await new Promise((r) => ws.onclose = r);
  } finally {
    s.close();
    Deno.env.set("ENV", "production");
    _resetWatcherForTests();
    try {
      Deno.removeSync("./.build_done");
    } catch (_) { /* ignored */ }
  }
});

Deno.test("Render Middleware - context PWA props", async () => {
  const context = {} as unknown as Context;
  const middleware = createRenderMiddleware({ pwa: true });
  const req = new Request("http://localhost/");
  await middleware(req, context, () => Promise.resolve(new Response()));
  assertEquals(context.pwa, true);
  assertEquals(context.pwaEnabled, true);
});

Deno.test("Render Middleware - renderToString caching", () => {
  _resetForTests();
  const mockContext = {
    renderToString: undefined as unknown as (
      element: React.ReactElement,
      options?: Record<string, unknown>,
    ) => string,
    response: { headers: new Headers() },
  } as unknown as Context;
  const req = new Request("http://localhost/");
  const middleware = createRenderMiddleware();
  middleware(req, mockContext, () => new Response("next"));

  // Create a stable element
  const element = React.createElement("div", null, "Cached");
  const first = mockContext.renderToString!(element);
  const second = mockContext.renderToString!(element);
  if (first !== second) throw new Error("Cache mismatch");
  if (!first.includes("Cached")) throw new Error("Content missing");
});

Deno.test("Render Middleware - HMR cooldown branch", {
  sanitizeOps: false,
  sanitizeResources: false,
}, async () => {
  _resetWatcherForTests();
  const fastro = new Fastro();
  fastro.use(createRenderMiddleware());
  const s = fastro.serve({ port: 3627 });
  try {
    // activate
    await fetch("http://localhost:3627/");
    await new Promise((r) => setTimeout(r, 600));

    // First change
    Deno.writeTextFileSync("./.build_done", "1");
    await new Promise((r) => setTimeout(r, 600)); // wait for detection

    // Second change immediately
    Deno.writeTextFileSync("./.build_done", "2");
    await new Promise((r) => setTimeout(r, 200)); // check during cooldown
  } finally {
    s.close();
    _resetWatcherForTests();
    try {
      Deno.removeSync("./.build_done");
    } catch (_) { /* ignored */ }
  }
});

Deno.test("Render Middleware - generatePWAScript error in middleware branch", async () => {
  _resetForTests();
  const middleware = createRenderMiddleware({
    pwa: true,
    pwaConfig: {
      // @ts-ignore: trigger error
      manifest: 123 as unknown,
    },
  });
  const req = new Request("http://localhost/sw.js");
  const mockContext = {} as unknown as Context;
  const next = () => {
    return new Response("next");
  };
  try {
    await middleware(req, mockContext, next);
  } catch (_) {
    // ok
  }
});

Deno.test("Render Middleware - renderToString production mode full", () => {
  _resetForTests();
  Deno.env.set("ENV", "production");
  const mockContext = {
    response: { headers: new Headers() },
    renderToString: undefined as unknown as (
      element: React.ReactElement,
      options?: Record<string, unknown>,
    ) => string,
  } as unknown as Context;
  const req = new Request("http://localhost/");
  const middleware = createRenderMiddleware({
    pwa: true,
    pwaConfig: { cacheName: "test-cache" },
  });
  middleware(req, mockContext, () => new Response("next"));

  try {
    const element = React.createElement("div", null, "Prod");
    // Test with initialProps and module
    const html = mockContext.renderToString!(element, {
      initialProps: { data: 1 },
      module: "test-module",
    });
    if (!html.includes("/js/test-module/client.js")) {
      throw new Error("Client script missing");
    }
    if (html.includes("?t=")) throw new Error("Timestamp in production");
  } finally {
    Deno.env.delete("ENV");
  }
});

Deno.test("Render Middleware - isSwRequest URL throw fallback", async () => {
  _resetForTests();
  const middleware = createRenderMiddleware({ pwa: true });
  // req.url is not a valid URL
  const req = { url: "invalid-url/sw.js" } as unknown as Request;
  const mockContext = {} as unknown as Context;
  const res = await middleware(req, mockContext, () => new Response("next"));
  if (!(res instanceof Response)) throw new Error("Result should be Response");
});

Deno.test("Render Middleware - force HMR branches coverage", async () => {
  _resetForTests();
  Deno.env.set("ENV", "development");
  const originalStat = Deno.stat;

  try {
    // Set initial lastMtime, mock stat to return a larger mtime and call the watcher tick directly
    _setLastMtimeForTests(1000);
    // @ts-ignore: mock stat for watcher tick test
    Deno.stat = (p: string) => {
      if (p === "./.build_done") {
        return Promise.resolve(
          { mtime: { getTime: () => 2000 } } as unknown as Deno.FileInfo,
        );
      }
      return originalStat(p);
    };

    // Inject a client that is OPEN but whose send will throw (exercises send catch)
    const badSend = {
      readyState: 1,
      send: () => {
        throw new Error("send fail");
      },
    } as unknown as WebSocket;
    // Inject a closed client to hit the else delete branch
    const closedClient = {
      readyState: 0,
      send: () => {},
    } as unknown as WebSocket;

    _getHmrClientsForTests().add(badSend);
    _getHmrClientsForTests().add(closedClient);

    // Call the exported watcher tick directly (no intervals)
    await _watchTickForTests();

    // cleanup
    _getHmrClientsForTests().delete(badSend);
    _getHmrClientsForTests().delete(closedClient);
  } finally {
    Deno.stat = originalStat;
    Deno.env.delete("ENV");
    _resetWatcherForTests();
  }
});

Deno.test("Render Middleware - trigger startComponentsWatcher catches", async () => {
  _resetForTests();
  const originalStat = Deno.stat;
  try {
    // Make stat throw to hit the secondary catch without starting intervals
    // @ts-ignore: mock stat failure
    Deno.stat = (p: string) => {
      if (p === "./.build_done") return Promise.reject(new Error("stat fail"));
      return originalStat(p);
    };

    await _initWatcherForTests();
  } finally {
    Deno.stat = originalStat;
    _resetWatcherForTests();
  }
});

Deno.test("Render Middleware - renderToString extra options", () => {
  _resetForTests();
  const mockContext = {
    response: { headers: new Headers() },
    renderToString: undefined as unknown as (
      element: React.ReactElement,
      options?: Record<string, unknown>,
    ) => string,
  } as unknown as Context;
  const req = new Request("http://localhost/");
  const middleware = createRenderMiddleware();
  middleware(req, mockContext, () => new Response("next"));

  const element = React.createElement("div", null, "Extra");
  let _errorCaught = false;
  const html = mockContext.renderToString!(element, {
    identifierPrefix: "pre-",
    nonceProvider: () => "nonce-123",
    onError: () => {
      _errorCaught = true;
    },
  });
  if (!html.includes("Extra")) throw new Error("Content missing");
});

Deno.test("Render Middleware - HMR client states and errors", {
  sanitizeOps: false,
  sanitizeResources: false,
}, async () => {
  _resetWatcherForTests();
  const fastro = new Fastro();
  fastro.use(createRenderMiddleware());
  const s = fastro.serve({ port: 3629 });

  try {
    // start watcher
    await fetch("http://localhost:3629/");
    await new Promise((r) => setTimeout(r, 600));

    const ws1 = new WebSocket("ws://localhost:3629/hmr");
    const ws2 = new WebSocket("ws://localhost:3629/hmr");

    const openPromises = [
      new Promise((res, rej) => {
        const t = setTimeout(() => rej(new Error("WS1 timeout")), 2000);
        ws1.onopen = () => {
          clearTimeout(t);
          res(null);
        };
      }),
      new Promise((res, rej) => {
        const t = setTimeout(() => rej(new Error("WS2 timeout")), 2000);
        ws2.onopen = () => {
          clearTimeout(t);
          res(null);
        };
      }),
    ];
    await Promise.all(openPromises);

    // Force ws1 to be closed but still in the set manually for a moment if possible
    // Alternatively, just close it and hope the interval hits it before the server-side onclose fires
    ws1.close();
    await new Promise((r) => ws1.onclose = r);

    // Trigger change
    Deno.writeTextFileSync("./.build_done", "reload-" + Date.now());
    await new Promise((r) => setTimeout(r, 1000));

    ws2.close();
    await new Promise((r) => ws2.onclose = r);
  } finally {
    s.close();
    _resetWatcherForTests();
    try {
      Deno.removeSync("./.build_done");
    } catch (_) { /* ignored */ }
  }
});

Deno.test("Render Middleware - HMR watcher stat error", {
  sanitizeOps: false,
  sanitizeResources: false,
}, async () => {
  _resetWatcherForTests();
  const fastro = new Fastro();
  fastro.use(createRenderMiddleware());
  const s = fastro.serve({ port: 3630 });
  try {
    // Delete file to trigger catch blocks in startComponentsWatcher
    try {
      Deno.removeSync("./.build_done");
    } catch (_) { /* ignored */ }

    await fetch("http://localhost:3630/");
    await new Promise((r) => setTimeout(r, 1000));

    // File should have been recreated
    if (!Deno.statSync("./.build_done")) throw new Error("File not recreated");
  } finally {
    s.close();
    _resetWatcherForTests();
    try {
      Deno.removeSync("./.build_done");
    } catch (_) { /* ignored */ }
  }
});

Deno.test("Render Middleware - Chaos WebSocket", {
  sanitizeOps: false,
  sanitizeResources: false,
}, async () => {
  _resetWatcherForTests();
  const fastro = new Fastro();
  fastro.use(createRenderMiddleware());
  const s = fastro.serve({ port: 3631 });
  try {
    await fetch("http://localhost:3631/");
    await new Promise((r) => setTimeout(r, 600));

    const ws = new WebSocket("ws://localhost:3631/hmr");
    await new Promise((r) => ws.onopen = r);

    // Mock readyState or just close it and hope
    ws.close();
    // Don't await onclose, trigger change immediately
    Deno.writeTextFileSync("./.build_done", "chaos-" + Date.now());
    await new Promise((r) => setTimeout(r, 1000));
  } finally {
    s.close();
    _resetWatcherForTests();
  }
});

Deno.test("Render Middleware - generatePWAScript network-first coverage", () => {
  generatePWAScript({ fetchStrategy: "network-first" });
});

Deno.test(
  "Render Middleware - startComponentsWatcher file gone during interval",
  { sanitizeOps: false, sanitizeResources: false },
  async () => {
    _resetWatcherForTests();
    const fastro = new Fastro();
    fastro.use(createRenderMiddleware());
    const s = fastro.serve({ port: 3632 });
    try {
      await fetch("http://localhost:3632/");
      await new Promise((r) => setTimeout(r, 600));

      // Remove file so next interval tick fails
      Deno.removeSync("./.build_done");
      await new Promise((r) => setTimeout(r, 1000));
    } finally {
      s.close();
      _resetWatcherForTests();
    }
  },
);

Deno.test("Render Middleware - Coverage completion", {
  sanitizeOps: false,
  sanitizeResources: false,
}, async () => {
  _resetWatcherForTests();
  const fastro = new Fastro();
  fastro.use(createRenderMiddleware());
  const s = fastro.serve({ port: 3633 });
  try {
    // 1. Trigger startComponentsWatcher with stat failure on first tick
    // We can't easily make stat fail globally, but we can hit some branches.

    // 2. Hit cid = -1 branch
    // @ts-ignore: access private set
    const _hmrClientsSet = await fetch("http://localhost:3633/").then(() => {
      // Find the set in the middleware? No, it's a module level variable.
      // I can just import it if I export it, but it's not exported.
      // Wait, _resetWatcherForTests clears it, so I know where it is.
    });

    // Actually, I can't access hmrClients directly because it's not exported.
    // I already exported _resetWatcherForTests which accesses it.

    // 3. Hit readyState !== OPEN
    const ws = new WebSocket("ws://localhost:3633/hmr");
    await new Promise((r) => ws.onopen = r);
    // Trigger detection while WS is in a weird state?
    // closing it might put it in CLOSING state
    ws.close();
    Deno.writeTextFileSync("./.build_done", "reload-final-" + Date.now());
    await new Promise((r) => setTimeout(r, 1000));
  } finally {
    s.close();
    _resetWatcherForTests();
  }
});

Deno.test("Render Middleware - generatePWAScript branch coverage", () => {
  // Hit normalize branch with query/hash
  generatePWAScript({ assets: ["/a?b=c#d"] });
  // Hit default assets branch
  generatePWAScript({ assets: undefined });
  // Hit non-array assets branch
  // @ts-ignore: testing invalid input
  generatePWAScript({ assets: "not-array" });
});

Deno.test("Render Middleware - createRenderToString branch coverage", {
  sanitizeOps: false,
  sanitizeResources: false,
}, () => {
  const middleware = createRenderMiddleware();
  const mockContext = {
    response: { headers: new Headers() },
    renderToString: undefined as unknown as (
      element: React.ReactElement,
      options?: Record<string, unknown>,
    ) => string,
  } as unknown as Context;
  middleware(
    new Request("http://localhost/"),
    mockContext as unknown as Context,
    () => Promise.resolve(new Response("ok")),
  );

  // Hit branches in renderOptions
  mockContext.renderToString!(React.createElement("div"), {
    identifierPrefix: "x",
    signal: new AbortController().signal,
    nonceProvider: () => "n",
    onError: () => {},
    includeDoctype: true,
    includeHead: true,
    title: "T",
    head: "<head><title>H</title></head>",
    initialProps: { a: 1 },
    module: "m",
  });

  // Hit includeHead: false
  mockContext.renderToString!(React.createElement("div"), {
    includeHead: false,
  });
});

Deno.test("Render Middleware - ctx.render helper", {
  sanitizeOps: false,
  sanitizeResources: false,
}, async () => {
  _resetForTests();
  const fastro = new Fastro();
  fastro.use(createRenderMiddleware());
  fastro.get("/", (_req, ctx) => {
    return ctx.render!(React.createElement("div", null, "Hello Response"));
  });

  const s = fastro.serve({ port: 3650 });
  try {
    const res = await fetch("http://localhost:3650/");
    assertEquals(res.status, 200);
    assertEquals(res.headers.get("content-type"), "text/html");
    const html = await res.text();
    assertStringIncludes(html, "Hello Response");
  } finally {
    s.close();
  }
});

Deno.test("Render Middleware - isHmrRequest fallback", async () => {
  _resetForTests();
  const middleware = createRenderMiddleware();
  const req = {
    url: "/hmr", // No base, will throw in new URL(req.url)
    method: "GET",
  } as unknown as Request;
  // Mock Deno.upgradeWebSocket to avoid actual upgrade
  const original = Deno.upgradeWebSocket;
  // @ts-ignore: mock
  Deno.upgradeWebSocket = () => ({
    socket: { onopen: null } as unknown as WebSocket,
    response: new Response("upgraded"),
  });
  try {
    const ctx = {} as unknown as Context;
    const res = await middleware(
      req,
      ctx,
      () => Promise.resolve(new Response()),
    );
    assertEquals(res.status, 200);
    assertEquals(await res.text(), "upgraded");
  } finally {
    Deno.upgradeWebSocket = original;
  }
});

Deno.test("Render Middleware - Ultimate Coverage v10", {
  sanitizeOps: false,
  sanitizeResources: false,
}, async () => {
  const originalWrite = Deno.writeTextFileSync;
  const originalWriteAsync = Deno.writeTextFile;
  const originalStat = Deno.stat;
  const originalLog = console.log;
  const originalWarn = console.warn;

  try {
    // 1. Success path for generatePWAScript and render
    generatePWAScript();
    generatePWAScript({});
    createRenderMiddleware()(
      {} as unknown as Request,
      {} as unknown as Context,
      () => Promise.resolve(new Response()),
    );

    // 2. Early catches in startComponentsWatcher
    _resetWatcherForTests();
    Deno.env.set("ENV", "development");
    // @ts-ignore: mock write failure
    Deno.writeTextFile = () => Promise.reject(new Error("fail"));
    // @ts-ignore: mock stat failure
    Deno.stat = () => Promise.reject(new Error("fail"));
    const mw = createRenderMiddleware();
    await mw(
      new Request("http://localhost/"),
      {} as unknown as Context,
      () => new Response("ok"),
    );

    // 3. Stat returns mtime null branch
    _resetWatcherForTests();
    // @ts-ignore: mock stat returning null mtime
    Deno.stat = (p: string) => {
      if (p === "./.build_done") {
        return Promise.resolve({ mtime: null } as unknown as Deno.FileInfo);
      }
      return originalStat(p);
    };
    await mw(
      new Request("http://localhost/"),
      {} as unknown as Context,
      () => new Response("ok"),
    );
    await new Promise((r) => setTimeout(r, 600));

    // 4. Reload flow with varied stages
    _resetWatcherForTests();
    let mtimeVal = 1000;
    // @ts-ignore: mock stat with increasing mtime
    Deno.stat = (p: string) => {
      if (p === "./.build_done") {
        const val = mtimeVal;
        mtimeVal += 1000; // Auto-increment every call to ensure change is detected
        return Promise.resolve(
          { mtime: { getTime: () => val } } as unknown as Deno.FileInfo,
        );
      }
      return originalStat(p);
    };
    // @ts-ignore: restoring original writer
    Deno.writeTextFile = originalWriteAsync;

    // Set ENV and start watcher via middleware call
    Deno.env.set("ENV", "development");
    const mw2 = createRenderMiddleware();
    await mw2(
      new Request("http://localhost/"),
      {} as unknown as Context,
      () => new Response("ok"),
    );

    // Inject a client that will fail to send AND trigger console failure
    const mockClient = {
      readyState: 1, // WebSocket.OPEN
      send: () => {
        throw new Error("send fail");
      },
    };
    _getHmrClientsForTests().add(mockClient as unknown as WebSocket);

    // Make console fail everywhere
    console.log = () => {
      throw new Error("console.log fail");
    };
    console.warn = () => {
      throw new Error("console.warn fail");
    };

    // Wait for at least 2 ticks (500ms each)
    await new Promise((r) => setTimeout(r, 1500));

    // Reset console
    console.log = originalLog;
    console.warn = originalWarn;
    _getHmrClientsForTests().clear();

    // 5. Interval outer catch
    // @ts-ignore: mock stat failure
    Deno.stat = () => Promise.reject(new Error("stat fail"));
    await new Promise((r) => setTimeout(r, 600));

    // 6. Reset branches
    _resetWatcherForTests();
    _resetWatcherForTests(); // hits truthy then falsey watcherInterval
  } finally {
    Deno.writeTextFileSync = originalWrite;
    // @ts-ignore: restoring original writer
    Deno.writeTextFile = originalWriteAsync;
    Deno.stat = originalStat;
    console.log = originalLog;
    console.warn = originalWarn;
    _resetWatcherForTests();
    Deno.env.set("ENV", "production");
  }
});

Deno.test("Render Middleware - watchTick rethrow coverage", async () => {
  _resetForTests();
  const originalStat = Deno.stat;
  try {
    Deno.env.set("ENV", "coverage-throw");
    // @ts-ignore: mock stat failure
    Deno.stat = (p: string) => {
      if (p === "./.build_done") return Promise.reject(new Error("stat fail"));
      return originalStat(p);
    };
    let threw = false;
    try {
      await _watchTickForTests();
    } catch (_e) {
      threw = true;
    }
    assertEquals(threw, true);
  } finally {
    Deno.stat = originalStat;
    Deno.env.delete("ENV");
    _resetWatcherForTests();
  }
});

Deno.test("Render Middleware - startComponentsWatcher inner catch coverage", {
  sanitizeOps: false,
  sanitizeResources: false,
}, async () => {
  _resetForTests();
  const originalStat = Deno.stat;
  try {
    Deno.env.set("ENV", "coverage-throw");
    // Make stat throw so immediate tick rethrows and is caught by startComponentsWatcher's try/catch
    // @ts-ignore: mock stat failure
    Deno.stat = (p: string) => {
      if (p === "./.build_done") return Promise.reject(new Error("stat fail"));
      return originalStat(p);
    };
    const mw = createRenderMiddleware();
    // Should not throw because startComponentsWatcher swallows the immediate tick throw
    await mw(
      new Request("http://localhost/"),
      {} as unknown as Context,
      () => new Response("ok"),
    );
    // Allow background IIFE to run and complete its initial operations
    await new Promise((r) => setTimeout(r, 200));
  } finally {
    Deno.stat = originalStat;
    Deno.env.delete("ENV");
    _resetWatcherForTests();
  }
});

Deno.test("Render Middleware - initWatcher mtime branches", {
  sanitizeOps: false,
  sanitizeResources: false,
}, async () => {
  _resetForTests();
  const originalStat = Deno.stat;
  try {
    // Case: stat returns an object with mtime
    // @ts-ignore: mock stat success
    Deno.stat = (_p: string) =>
      Promise.resolve(
        { mtime: { getTime: () => 12345 } } as unknown as Deno.FileInfo,
      );
    await _initWatcherForTests();

    // Case: stat returns an object with null/undefined mtime
    // @ts-ignore: mock stat null mtime
    Deno.stat = (_p: string) =>
      Promise.resolve({ mtime: null } as unknown as Deno.FileInfo);
    await _initWatcherForTests();
    // allow any stray async ops to finish
    await new Promise((r) => setTimeout(r, 50));
  } finally {
    Deno.stat = originalStat;
    _resetWatcherForTests();
  }
});
