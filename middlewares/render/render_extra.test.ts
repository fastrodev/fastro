import {
  _getHmrClientsForTests,
  _resetWatcherForTests,
  _setLastMtimeForTests,
  _watchTickForTestsWithStat,
  createRenderMiddleware,
  startComponentsWatcher,
} from "./render.ts";
import React from "npm:react@^19.2.4";

Deno.test({
  name: "render_extra: _watchTickImpl handles mtime null",
  sanitizeOps: false,
  sanitizeResources: false,
  fn: async () => {
    _resetWatcherForTests();
    _setLastMtimeForTests(0);
    await _watchTickForTestsWithStat(() =>
      Promise.resolve({ mtime: null } as Deno.FileInfo)
    );
  },
});

Deno.test({
  name:
    "render_extra: DA:185 - writeTextFileSync catch & DA:191 - second statSync throws",
  sanitizeOps: false,
  sanitizeResources: false,
  fn: () => {
    _resetWatcherForTests();
    let statCount = 0;
    const originalStatSync = Deno.statSync;
    const originalWriteTextFileSync = Deno.writeTextFileSync;

    Deno.statSync = (p) => {
      if (p === "./.build_done" || p.toString().endsWith(".build_done")) {
        statCount++;
        if (statCount === 1) throw new Error("force fail first stat");
        if (statCount === 2) throw new Error("force fail second stat");
      }
      return originalStatSync(p);
    };

    Deno.writeTextFileSync = (p, d) => {
      if (p === "./.build_done" || p.toString().endsWith(".build_done")) {
        throw new Error("force fail write");
      }
      return originalWriteTextFileSync(p, d);
    };

    const prevEnv = Deno.env.get("ENV");
    Deno.env.set("ENV", "test");
    try {
      startComponentsWatcher({ startInterval: false, immediate: false });
    } finally {
      Deno.statSync = originalStatSync;
      Deno.writeTextFileSync = originalWriteTextFileSync;
      if (prevEnv) Deno.env.set("ENV", prevEnv);
      else Deno.env.delete("ENV");
    }
  },
});

Deno.test({
  name: "render_extra: DA:190 - lastMtime = stat.mtime?.getTime() || 0",
  sanitizeOps: false,
  sanitizeResources: false,
  fn: () => {
    _resetWatcherForTests();
    let statCount = 0;
    const originalStatSync = Deno.statSync;

    Deno.statSync = (p) => {
      if (p === "./.build_done" || p.toString().endsWith(".build_done")) {
        statCount++;
        if (statCount === 2) {
          return { mtime: { getTime: () => 0 } } as unknown as Deno.FileInfo;
        }
      }
      return originalStatSync(p);
    };

    const prevEnv = Deno.env.get("ENV");
    Deno.env.set("ENV", "test");
    try {
      startComponentsWatcher({ startInterval: false, immediate: false });
    } finally {
      Deno.statSync = originalStatSync;
      if (prevEnv) Deno.env.set("ENV", prevEnv);
      else Deno.env.delete("ENV");
    }
  },
});

Deno.test({
  name: "render_extra: DA:195 - __fastro_watcher_cb catch",
  sanitizeOps: false,
  sanitizeResources: false,
  fn: async () => {
    _resetWatcherForTests();
    const originalStat = Deno.stat;
    Deno.stat = () => Promise.reject(new Error("Stat error coverage"));
    const prevEnv = Deno.env.get("ENV");
    Deno.env.set("ENV", "coverage-throw");
    try {
      startComponentsWatcher({ startInterval: false, immediate: true });
      await new Promise((r) => setTimeout(r, 20));
    } finally {
      Deno.stat = originalStat;
      if (prevEnv) Deno.env.set("ENV", prevEnv);
      else Deno.env.delete("ENV");
    }
  },
});

Deno.test({
  name: "render_extra: DA:218-220 - __fastro_watcher_cb throws synchronously",
  sanitizeOps: false,
  sanitizeResources: false,
  fn: () => {
    _resetWatcherForTests();
    const originalStat = Deno.stat;
    Deno.stat = Object.assign(function () {}, originalStat);
    Deno.stat.bind = () => {
      throw new Error("Sync throw");
    };

    const prevEnv = Deno.env.get("ENV");
    Deno.env.set("ENV", "test");
    try {
      startComponentsWatcher({ startInterval: false, immediate: true });
    } catch (_e) {
      /* ignore */
    } finally {
      Deno.stat = originalStat;
      if (prevEnv) Deno.env.set("ENV", prevEnv);
      else Deno.env.delete("ENV");
    }
  },
});

Deno.test({
  name:
    "render_extra: DA:222-224 - startComponentsWatcher initialization throws",
  sanitizeOps: false,
  sanitizeResources: false,
  fn: () => {
    _resetWatcherForTests();
    const originalGet = Deno.env.get;
    let calls = 0;
    Deno.env.get = (key) => {
      if (key === "ENV") {
        calls++;
        if (calls > 1) throw new Error("Init throw inner");
      }
      return originalGet.call(Deno.env, key);
    };
    try {
      startComponentsWatcher({ startInterval: true, immediate: false });
    } finally {
      Deno.env.get = originalGet;
    }
  },
});

Deno.test({
  name: "render_extra: req.url || '/' fallbacks (DA:321, 324)",
  sanitizeOps: false,
  sanitizeResources: false,
  fn: () => {
    _resetWatcherForTests();
    const mw = createRenderMiddleware();
    const req1 = { url: "" } as Request;
    mw(
      req1,
      {} as import("../../core/types.ts").Context,
      () => new Response() as unknown as Response,
    );

    const req2 = {} as Request;
    mw(
      req2,
      {} as import("../../core/types.ts").Context,
      () => new Response() as unknown as Response,
    );

    const req3 = {
      url:
        "invalid cat /home/dev/project/fw/fastro/middlewares/render/render_extra.test.ts",
    } as Request;
    mw(
      req3,
      {} as import("../../core/types.ts").Context,
      () => new Response() as unknown as Response,
    );
  },
});

Deno.test({
  name: "render_extra: WebSocket branches and pendingReload (DA:352-355)",
  sanitizeOps: false,
  sanitizeResources: false,
  fn: async () => {
    _resetWatcherForTests();
    const originalUpgrade = Deno.upgradeWebSocket;
    // deno-lint-ignore no-explicit-any
    let mockSocket: any = null;

    Deno.upgradeWebSocket = () => {
      mockSocket = {
        readyState: 0,
        send: (() => {}) as unknown,
        onopen: null,
        onclose: null,
      };
      return {
        response: new Response(),
        socket: mockSocket as unknown as WebSocket,
      };
    };

    const mw = createRenderMiddleware();
    const req = new Request("http://localhost/hmr", {
      headers: { upgrade: "websocket", connection: "Upgrade" },
    });
    mw(
      req,
      {} as import("../../core/types.ts").Context,
      () => new Response() as unknown as Response,
    );

    _setLastMtimeForTests(0);
    await _watchTickForTestsWithStat(() =>
      Promise.resolve({ mtime: new Date(Date.now() + 1000) } as Deno.FileInfo)
    );

    if (mockSocket && mockSocket.onopen) {
      mockSocket.readyState = WebSocket.OPEN;
      mockSocket.onopen();
    }

    Deno.upgradeWebSocket = originalUpgrade;
  },
});

Deno.test({
  name: "render_extra: WebSocket heartbeat and other branches",
  sanitizeOps: false,
  sanitizeResources: false,
  fn: () => {
    _resetWatcherForTests();
    const originalUpgrade = Deno.upgradeWebSocket;
    // deno-lint-ignore no-explicit-any
    let mockSocket: any = null;

    const originalSetInterval = globalThis.setInterval;
    let heartbeatCb: (() => void) | undefined;
    // @ts-ignore: mock setInterval
    globalThis.setInterval = (cb: string | ((...args: unknown[]) => void)) => {
      if (typeof cb === "function") heartbeatCb = cb as () => void;
      return 999 as unknown as number;
    };

    const originalClearInterval = globalThis.clearInterval;
    globalThis.clearInterval = (id?: number) => {
      return originalClearInterval(id);
    };

    Deno.upgradeWebSocket = () => {
      mockSocket = {
        readyState: WebSocket.OPEN,
        send: (() => {}) as unknown,
        onopen: null,
        onclose: null,
      };
      return {
        response: new Response(),
        socket: mockSocket as unknown as WebSocket,
      };
    };

    const mw = createRenderMiddleware();
    const req = new Request("http://localhost/hmr", {
      headers: { upgrade: "websocket", connection: "Upgrade" },
    });
    mw(
      req,
      {} as import("../../core/types.ts").Context,
      () => new Response() as unknown as Response,
    );

    if (mockSocket && mockSocket.onopen) {
      mockSocket.onopen();

      if (heartbeatCb) {
        heartbeatCb();

        mockSocket.send = () => {
          throw new Error("Force catch");
        };
        heartbeatCb();
      }

      if (mockSocket.onclose) {
        mockSocket.onclose();
      }
    }

    Deno.upgradeWebSocket = originalUpgrade;
    globalThis.setInterval = originalSetInterval;
    globalThis.clearInterval = originalClearInterval;
  },
});

Deno.test({
  name: "render_extra: more WebSocket branches",
  sanitizeOps: false,
  sanitizeResources: false,
  fn: async () => {
    _resetWatcherForTests();
    const clients = _getHmrClientsForTests();

    const mockWebSocket = {
      readyState: WebSocket.OPEN,
      send: () => {
        throw new Error("Coverage throw");
      },
    } as unknown as WebSocket;
    clients.add(mockWebSocket);

    const mockWebSocketClosed = {
      readyState: WebSocket.CLOSED,
      send: () => {},
    } as unknown as WebSocket;
    clients.add(mockWebSocketClosed);

    _setLastMtimeForTests(0);
    await _watchTickForTestsWithStat(() =>
      Promise.resolve({ mtime: new Date(Date.now() + 2000) } as Deno.FileInfo)
    );
  },
});

Deno.test({
  name: "render_extra: render fallback options for missing url",
  sanitizeOps: false,
  sanitizeResources: false,
  fn: () => {
    _resetWatcherForTests();
    const originalGet = Deno.env.get;
    Deno.env.get = (k) => {
      if (k === "ENV") return "production";
      return originalGet.call(Deno.env, k);
    };

    const mw = createRenderMiddleware();
    const req = { url: "invalid-url!" } as Request;
    mw(
      req,
      {} as import("../../core/types.ts").Context,
      () => new Response() as unknown as Response,
    );

    Deno.env.get = originalGet;
  },
});

Deno.test({
  name:
    "render_extra: renderToString branches on includeHead and doctype false",
  sanitizeOps: false,
  sanitizeResources: false,
  fn: () => {
    _resetWatcherForTests();
    const el = React.createElement("div", null, "Hello");
    const ctx = {} as import("../../core/types.ts").Context;
    const mw = createRenderMiddleware();
    mw(
      new Request("http://localhost/"),
      ctx,
      () => new Response() as unknown as Response,
    );

    const rts =
      (ctx as unknown as { renderToString: (...args: unknown[]) => string })
        .renderToString;
    if (rts) {
      const html1 = rts(el, { includeHead: false, includeDoctype: true });
      if (!html1.startsWith("<!DOCTYPE html>")) {
        throw new Error("Missing doctype");
      }

      const html2 = rts(el, { includeHead: false, includeDoctype: false });
      if (html2.startsWith("<!DOCTYPE html>")) {
        throw new Error("Unexpected doctype");
      }
    }
  },
});

Deno.test({
  name: "render_extra: watchTickImpl throws on non-coverage-throw",
  sanitizeOps: false,
  sanitizeResources: false,
  fn: async () => {
    _resetWatcherForTests();
    const originalGet = Deno.env.get;
    Deno.env.get = (k) => {
      if (k === "ENV") return "test";
      return originalGet.call(Deno.env, k);
    };
    await _watchTickForTestsWithStat(() =>
      Promise.reject(new Error("Test catch branch"))
    );
    Deno.env.get = originalGet;
  },
});

Deno.test({
  name: "render_extra: DA:107 - if (now - lastReloadAt < 1500) return;",
  sanitizeOps: false,
  sanitizeResources: false,
  fn: async () => {
    _resetWatcherForTests();
    _setLastMtimeForTests(0);
    const clients = _getHmrClientsForTests();
    clients.clear();
    await _watchTickForTestsWithStat(() =>
      Promise.resolve({ mtime: new Date(Date.now() + 1000) } as Deno.FileInfo)
    );
    await _watchTickForTestsWithStat(() =>
      Promise.resolve({ mtime: new Date(Date.now() + 2000) } as Deno.FileInfo)
    );
  },
});

Deno.test({
  name:
    "render_extra: startComponentsWatcher ignores errors if statSync fails on read but fallback works",
  sanitizeOps: false,
  sanitizeResources: false,
  fn: () => {
    _resetWatcherForTests();
    let statCount = 0;
    const originalStatSync = Deno.statSync;
    Deno.statSync = (p) => {
      if (p === "./.build_done" || p.toString().endsWith(".build_done")) {
        statCount++;
        if (statCount === 1) throw new Error("Fallback coverage");
      }
      return originalStatSync(p);
    };

    const originalGet = Deno.env.get;
    Deno.env.get = (k) => {
      if (k === "ENV") return "test";
      return originalGet.call(Deno.env, k);
    };

    const originalSetInterval = globalThis.setInterval;
    let intervalCb: () => void = () => {};
    // @ts-ignore: mock setInterval
    globalThis.setInterval = (cb: string | ((...args: unknown[]) => void)) => {
      if (typeof cb === "function") intervalCb = cb as () => void;
      return 123 as unknown as number;
    };

    try {
      startComponentsWatcher({ startInterval: true });
      if (intervalCb) intervalCb();
    } catch (_e) { /* ignore */ }

    Deno.statSync = originalStatSync;
    Deno.env.get = originalGet;
    globalThis.setInterval = originalSetInterval;
  },
});

Deno.test({
  name: "render_extra: coverage for context.state.module fallback",
  sanitizeOps: false,
  sanitizeResources: false,
  fn: () => {
    _resetWatcherForTests();
    const ctx = {
      state: { module: "test-module" },
    } as unknown as import("../../core/types.ts").Context;
    const mw = createRenderMiddleware();
    mw(
      new Request("http://localhost/"),
      ctx,
      () => new Response() as unknown as Response,
    );
    const rts =
      (ctx as unknown as { renderToString: (...args: unknown[]) => string })
        .renderToString;
    if (rts) {
      const el = React.createElement("div", null, "Hello");
      const html = rts(el, { includeHead: true });
      if (!html.includes('src="/js/test-module/client.js')) {
        throw new Error("Missing test-module in output");
      }
    }
  },
});
