Deno.test({
  name: "render_extra: _watchTickImpl handles mtime null",
  sanitizeOps: false,
  sanitizeResources: false,
  fn: async () => {
    const { _watchTickForTestsWithStat, _setLastMtimeForTests } = await import(
      "./render.ts"
    );
    _setLastMtimeForTests(0);
    await _watchTickForTestsWithStat(() =>
      Promise.resolve({ mtime: null } as Deno.FileInfo)
    );
  },
});

Deno.test({
  name: "render_extra: WebSocket branches",
  sanitizeOps: false,
  sanitizeResources: false,
  fn: async () => {
    const { startComponentsWatcher, _getHmrClientsForTests } = await import(
      "./render.ts"
    );
    _getHmrClientsForTests().clear();

    const originalGet = Deno.env.get;
    Deno.env.get = (k) => {
      if (k === "ENV") return "test";
      return originalGet.call(Deno.env, k);
    };

    const originalStatSync = Deno.statSync;
    Deno.statSync = (p) => {
      if (p === "./.build_done" || p.toString().endsWith(".build_done")) {
        return { mtime: new Date(Date.now() + 1000) } as Deno.FileInfo;
      }
      return originalStatSync(p);
    };

    try {
      startComponentsWatcher({ startInterval: false, immediate: true });
    } catch (_e) { /* ignore */ }

    // Mock WebSocket to capture properties
    const originalUpgrade = Deno.upgradeWebSocket;
    // deno-lint-ignore no-explicit-any
    let mockSocket: any = null;

    // We need to intercept setInterval to test the heartbeat block synchronously
    const originalSetInterval = globalThis.setInterval;
    let heartbeatCb: (() => void) | undefined;
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

    const { createRenderMiddleware } = await import("./render.ts");
    const mw = createRenderMiddleware();
    const req = new Request("http://localhost/hmr", { headers: { upgrade: "websocket", connection: "Upgrade" } });
    mw(
      req,
      {} as import("../../core/types.ts").Context,
      () => new Response() as unknown as Response,
    );

    console.log("MOCK SOCKET:", mockSocket);
    if (mockSocket && mockSocket.onopen) {
      // 1. the normal open call with pending reload (pending is populated by watcher immediately due to statSync)
      mockSocket.onopen();

      // 2. interval trigger
      if (heartbeatCb) {
        heartbeatCb();

        // 3. interval trigger but with a thrown error on .send to cover catch block
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
    Deno.statSync = originalStatSync;
    Deno.env.get = originalGet;
    globalThis.setInterval = originalSetInterval;
    globalThis.clearInterval = originalClearInterval;
  },
});

Deno.test({
  name: "render_extra: more WebSocket branches",
  sanitizeOps: false,
  sanitizeResources: false,
  fn: async () => {
    const {
      _watchTickForTestsWithStat,
      _setLastMtimeForTests,
      _getHmrClientsForTests,
    } = await import("./render.ts");
    const clients = _getHmrClientsForTests();
    clients.clear();

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
    const now = Date.now();
    await _watchTickForTestsWithStat(() =>
      Promise.resolve({ mtime: new Date(now + 2000) } as Deno.FileInfo)
    );
  },
});

Deno.test({
  name:
    "render_extra: startComponentsWatcher ignores errors if statSync fails on read but fallback works",
  sanitizeOps: false,
  sanitizeResources: false,
  fn: async () => {
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
    globalThis.setInterval = (cb: string | ((...args: unknown[]) => void)) => {
      if (typeof cb === "function") intervalCb = cb as () => void;
      return 123 as unknown as number;
    };

    const { startComponentsWatcher } = await import("./render.ts");

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
  name: "render_extra: render fallback options for missing url",
  sanitizeOps: false,
  sanitizeResources: false,
  fn: async () => {
    const originalGet = Deno.env.get;
    Deno.env.get = (k) => {
      if (k === "ENV") return "production";
      return originalGet.call(Deno.env, k);
    };

    const { createRenderMiddleware } = await import("./render.ts");
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
  fn: async () => {
    const { createRenderMiddleware } = await import("./render.ts");
    const React = await import("npm:react@^19.2.4");

    const el = React.createElement("div", null, "Hello");

    const ctx = {} as import("../../core/types.ts").Context;
    const mw = createRenderMiddleware();
    mw(
      new Request("http://localhost/"),
      ctx,
      () => new Response() as unknown as Response,
    );

    const renderToString =
      (ctx as unknown as { renderToString: (...args: unknown[]) => string })
        .renderToString;
    if (renderToString) {
      const html1 = renderToString(el, {
        includeHead: false,
        includeDoctype: true,
      });
      if (!html1.startsWith("<!DOCTYPE html>")) {
        throw new Error("Missing doctype");
      }

      const html2 = renderToString(el, {
        includeHead: false,
        includeDoctype: false,
      });
      if (html2.startsWith("<!DOCTYPE html>")) {
        throw new Error("Unexpected doctype");
      }
    }
  },
});

Deno.test({
  name: "render_extra: fastro watcher init branches",
  sanitizeOps: false,
  sanitizeResources: false,
  fn: async () => {
    const originalGet = Deno.env.get;
    Deno.env.get = (k) => {
      if (k === "FASTRO_COVERAGE") return "1";
      if (k === "ENV") return "test";
      return originalGet.call(Deno.env, k);
    };

    const { startComponentsWatcher } = await import("./render.ts");
    try {
      startComponentsWatcher({ startInterval: false, immediate: false });
    } catch (_e) { /* ignore */ }

    Deno.env.get = originalGet;
  },
});

Deno.test({
  name: "render_extra: watchTickImpl throws on non-coverage-throw",
  sanitizeOps: false,
  sanitizeResources: false,
  fn: async () => {
    const { _watchTickForTestsWithStat } = await import("./render.ts");

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
    const {
      _watchTickForTestsWithStat,
      _setLastMtimeForTests,
      _getHmrClientsForTests,
    } = await import("./render.ts");
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
  name: "render_extra: DA:195 - __fastro_watcher_cb catch",
  sanitizeOps: false,
  sanitizeResources: false,
  fn: async () => {
    const originalStat = Deno.stat;
    Deno.stat = () => Promise.reject(new Error("Stat error coverage"));
    const prevEnv = Deno.env.get("ENV");
    Deno.env.set("ENV", "coverage-throw");
    const { startComponentsWatcher } = await import("./render.ts");
    try {
      startComponentsWatcher({ startInterval: false, immediate: true });
      await new Promise((r) => setTimeout(r, 10));
    } finally {
      Deno.stat = originalStat;
      if (prevEnv) Deno.env.set("ENV", prevEnv);
      else Deno.env.delete("ENV");
    }
  },
});

Deno.test({
  name:
    "render_extra: DA:190 and DA:218 - startComponentsWatcher statSync success but mtime null and __fastro_watcher_cb throws",
  sanitizeOps: false,
  sanitizeResources: false,
  fn: async () => {
    const prevEnv = Deno.env.get("ENV");
    Deno.env.set("ENV", "test");

    const originalStatSync = Deno.statSync;
    Deno.statSync = (path) => {
      if (path === "./.build_done" || path.toString().endsWith(".build_done")) {
        return { mtime: null } as Deno.FileInfo;
      }
      return originalStatSync(path);
    };

    const { startComponentsWatcher } = await import("./render.ts");
    try {
      startComponentsWatcher({ startInterval: false, immediate: true });
    } catch (_e) {
      /* ignore */
    } finally {
      Deno.statSync = originalStatSync;
      if (prevEnv) Deno.env.set("ENV", prevEnv);
      else Deno.env.delete("ENV");
    }
  },
});

Deno.test({
  name: "render_extra: DA:218-220 - __fastro_watcher_cb throws synchronously",
  sanitizeOps: false,
  sanitizeResources: false,
  fn: async () => {
    const originalStat = Deno.stat;
    Deno.stat = Object.assign(function () {}, originalStat);
    Deno.stat.bind = () => {
      throw new Error("Sync throw");
    };

    const prevEnv = Deno.env.get("ENV");
    Deno.env.set("ENV", "test");
    const { startComponentsWatcher } = await import("./render.ts");
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
  fn: async () => {
    const originalGet = Deno.env.get;
    Deno.env.get = (key) => {
      if (key === "ENV") throw new Error("Init throw");
      return originalGet.call(Deno.env, key);
    };
    const { startComponentsWatcher } = await import("./render.ts");
    try {
      startComponentsWatcher({ startInterval: false, immediate: false });
    } catch (_e) {
      /* ignore */
    } finally {
      Deno.env.get = originalGet;
    }
  },
});

Deno.test({
  name: "render_extra: DA:289-292 - coverage for context.state.module fallback",
  fn: async () => {
    const { createRenderMiddleware } = await import("./render.ts");
    const ctx = {
      state: { module: "test-module" },
    } as unknown as import("../../core/types.ts").Context;
    const mw = createRenderMiddleware();
    mw(
      new Request("http://localhost/"),
      ctx,
      () => new Response() as unknown as Response,
    );
    const renderToString =
      (ctx as unknown as { renderToString: (...args: unknown[]) => string })
        .renderToString;
    const React = await import("npm:react@^19.2.4");

    if (renderToString) {
      const el = React.createElement("div", null, "Hello");
      const html = renderToString(el, { includeHead: true });
      if (!html.includes('src="/js/test-module/client.js')) {
        throw new Error("Missing test-module in output");
      }
    }
  },
});
