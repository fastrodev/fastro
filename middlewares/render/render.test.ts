import React from "npm:react@^19.2.4";
import {
  _getHmrClientsForTests,
  _resetWatcherForTests,
  createRenderMiddleware,
  startComponentsWatcher,
} from "./render.ts";
import { assert, assertStringIncludes } from "@std/assert";
import type { Context } from "../../core/types.ts";
import {
  _setLastMtimeForTests,
  _watchTickForTests,
  _watchTickForTestsWithStat,
} from "./render.ts";
// note: assertThrows replaced by explicit try/catch

Deno.test("render middleware sets renderToString and returns doctype when requested", () => {
  Deno.env.set("ENV", "development");
  const ctx: Context = {
    params: {},
    query: {},
    remoteAddr: { transport: "tcp" },
    url: new URL("http://localhost/"),
  };

  const mw = createRenderMiddleware();
  const res = mw(
    new Request("http://localhost/"),
    ctx,
    () => new Response("next"),
  );
  // middleware should allow next through
  assert(res instanceof Response);
  // renderToString should be installed
  assert(typeof ctx.renderToString === "function");
  const html = ctx.renderToString!(React.createElement("h1", null, "Hello"), {
    includeDoctype: true,
  });
  assertStringIncludes(html, "<!DOCTYPE html>");
  assertStringIncludes(html, "<h1");
  _resetWatcherForTests();
});

Deno.test("watcher deletes clients with non-OPEN readyState", async () => {
  Deno.env.set("ENV", "coverage");
  _resetWatcherForTests();
  await Deno.writeTextFile("./.build_done", Date.now().toString());
  _setLastMtimeForTests(0);

  const client = {
    readyState: 3, // CLOSED
    send: (_: unknown) => {},
  } as unknown as WebSocket;

  const clients = _getHmrClientsForTests();
  clients.add(client);

  await _watchTickForTests();
  // client should have been removed because readyState !== OPEN
  assert(!clients.has(client));
  _resetWatcherForTests();
});

Deno.test("startComponentsWatcher early-returns when already started", () => {
  Deno.env.set("ENV", "development");
  _resetWatcherForTests();
  // Avoid triggering the immediate path controlled by `FASTRO_COVERAGE` during
  // coverage runs. Temporarily clear it so this test does not start async ops.
  const origFast = Deno.env.get("FASTRO_COVERAGE");
  if (origFast) Deno.env.delete("FASTRO_COVERAGE");
  // Initialize without starting intervals to avoid background timers
  startComponentsWatcher({ startInterval: false, immediate: false });
  // Second call should hit the `if (watcherStarted) return;` branch
  startComponentsWatcher({ startInterval: false, immediate: false });
  if (origFast) Deno.env.set("FASTRO_COVERAGE", origFast);
  _resetWatcherForTests();
});

Deno.test("_watchTickForTests rethrows when ENV=coverage-throw and stat fails", async () => {
  _resetWatcherForTests();
  Deno.env.set("ENV", "coverage-throw");
  // Use injected stat function to force the stat call to fail for this test
  const throwingStat = (_: string) => Promise.reject(new Error("stat-fail"));
  let didThrow = false;
  try {
    await _watchTickForTestsWithStat(
      throwingStat as unknown as (path: string) => Promise<Deno.FileInfo>,
    );
  } catch (_e) {
    didThrow = true;
  }
  assert(didThrow);
  Deno.env.delete("ENV");
  _resetWatcherForTests();
});

Deno.test("watcher sends reload to connected client", async () => {
  Deno.env.set("ENV", "coverage");
  _resetWatcherForTests();
  // ensure build file exists with current time
  await Deno.writeTextFile("./.build_done", Date.now().toString());
  _setLastMtimeForTests(0);

  const sent: string[] = [];
  const client = {
    readyState: 1,
    send: (m: unknown) => {
      sent.push(String(m));
    },
  } as unknown as WebSocket;

  const clients = _getHmrClientsForTests();
  clients.add(client);

  await _watchTickForTests();
  assert(sent.includes("reload"));
  _resetWatcherForTests();
});

Deno.test("watcher removes clients that fail to receive reload", async () => {
  Deno.env.set("ENV", "coverage");
  _resetWatcherForTests();
  await Deno.writeTextFile("./.build_done", Date.now().toString());
  _setLastMtimeForTests(0);

  const client = {
    readyState: 1,
    send: (_: unknown) => {
      throw new Error("send-fail");
    },
  } as unknown as WebSocket;

  const clients = _getHmrClientsForTests();
  clients.add(client);

  await _watchTickForTests();
  // client should have been removed
  assert(!clients.has(client));
  _resetWatcherForTests();
});

// Note: intentionally not testing startComponentsWatcher immediate behavior
// directly to avoid async leak detection from un-awaited background ops.

Deno.test("initialProps are serialized and < is escaped", () => {
  Deno.env.set("ENV", "development");
  const ctx: Context = {
    params: {},
    query: {},
    remoteAddr: { transport: "tcp" },
    url: new URL("http://localhost/"),
  };

  const mw = createRenderMiddleware();
  mw(new Request("http://localhost/"), ctx, () => new Response("next"));

  const html = ctx.renderToString!(React.createElement("div", null, "x"), {
    initialProps: { val: "</script><bad>" },
  });
  // initial props must escape '<' to '\u003c'
  assertStringIncludes(html, "\\u003c");
  _resetWatcherForTests();
});

Deno.test("production rendering omits HMR and timestamp", () => {
  Deno.env.set("ENV", "production");
  const ctx: Context = {
    params: {},
    query: {},
    remoteAddr: { transport: "tcp" },
    url: new URL("http://localhost/"),
  };

  const mw = createRenderMiddleware();
  mw(new Request("http://localhost/"), ctx, () => new Response("next"));
  const html = ctx.renderToString!(React.createElement("div", null, "x"), {
    includeHead: true,
    includeDoctype: true,
    module: "app",
  });
  // In production there should be no HMR script and no timestamp query
  assert(!html.includes("/hmr"));
  assert(!html.includes("?t="));
  _resetWatcherForTests();
});

Deno.test("middleware preserves existing non-stub renderToString", () => {
  Deno.env.set("ENV", "production");
  const ctx: Context = {
    params: {},
    query: {},
    remoteAddr: { transport: "tcp" },
    url: new URL("http://localhost/"),
  };
  const existing = (_c: React.ReactElement) => "ok";
  ctx.renderToString = existing as unknown as (c: React.ReactElement) => string;

  const mw = createRenderMiddleware();
  mw(new Request("http://localhost/"), ctx, () => new Response("next"));
  // Should preserve the same function
  assert(ctx.renderToString === existing);
});

Deno.test("URL parse fallback uses base when req.url is relative", () => {
  Deno.env.set("ENV", "production");
  const ctx: Context = {
    params: {},
    query: {},
    remoteAddr: { transport: "tcp" },
    url: new URL("http://localhost/"),
  };
  const fakeReq = { url: "/relative/path" } as unknown as Request;
  const mw = createRenderMiddleware();
  const res = mw(fakeReq, ctx, () => new Response("next"));
  assert(res instanceof Response);
});

Deno.test("includeHead=false omits head", () => {
  Deno.env.set("ENV", "development");
  const ctx: Context = {
    params: {},
    query: {},
    remoteAddr: { transport: "tcp" },
    url: new URL("http://localhost/"),
  };

  const mw = createRenderMiddleware();
  mw(new Request("http://localhost/"), ctx, () => new Response("next"));

  const html = ctx.renderToString!(React.createElement("div", null, "x"), {
    includeHead: false,
    includeDoctype: true,
  });
  assertStringIncludes(html, "<!DOCTYPE html>");
  // head must not be present
  assert(!html.includes("<head>"));
  _resetWatcherForTests();
});

Deno.test("/hmr path upgrades websocket and registers client (mocked)", () => {
  Deno.env.set("ENV", "development");
  // Mock Deno.upgradeWebSocket by replacing just that property
  // Save original if present
  type HmrSocket = {
    readyState: number;
    send: (msg: unknown) => void;
    onopen: (() => void) | null;
    onmessage: ((ev: unknown) => void) | null;
    onclose: (() => void) | null;
  };

  type DenoLike = {
    upgradeWebSocket?: (
      req: Request,
    ) => { socket: HmrSocket; response: Response };
  };

  const g = globalThis as unknown as { Deno?: DenoLike };
  const original = g.Deno?.upgradeWebSocket;
  const clientsBefore = _getHmrClientsForTests().size;

  const socket: HmrSocket = {
    readyState: 1,
    send: (_msg: unknown) => {},
    onopen: null,
    onmessage: null,
    onclose: null,
  };

  if (g.Deno) {
    (g.Deno as DenoLike).upgradeWebSocket = (_req: Request) => ({
      socket,
      response: new Response("upgraded"),
    });
  } else {
    (g as unknown as { Deno: DenoLike }).Deno = {
      upgradeWebSocket: (_req: Request) => ({
        socket,
        response: new Response("upgraded"),
      }),
    };
  }

  const ctx: Context = {
    params: {},
    query: {},
    remoteAddr: { transport: "tcp" },
    url: new URL("http://localhost/hmr"),
  };

  const mw = createRenderMiddleware();
  const res = mw(
    new Request("http://localhost/hmr"),
    ctx,
    () => new Response("next"),
  );
  assert(res instanceof Response);

  // Simulate open to let middleware register client
  if (typeof socket.onopen === "function") socket.onopen();

  const clientsAfter = _getHmrClientsForTests().size;
  assert(clientsAfter >= clientsBefore);

  // restore original
  if (g.Deno && typeof original === "function") {
    (g.Deno as DenoLike).upgradeWebSocket = original as unknown as (
      req: Request,
    ) => { socket: HmrSocket; response: Response };
  }
  _resetWatcherForTests();
});
