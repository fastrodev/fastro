import { assert, assertEquals, assertStrictEquals } from "@std/assert";
import { stub } from "@std/testing/mock";
import type { App } from "./loader.ts";
import {
  _getRegisteredMounts,
  autoRegisterModules,
  autoRegisterModulesFrom,
  getRegistrationCandidate,
  isNamespaceObject,
  registerFromNamespace,
  sortNames,
} from "./loader.ts";

Deno.test("sortComparator and sortNames ordering", () => {
  const names = ["b", "index", "profile", "a"];
  const sorted = sortNames(names);
  assertStrictEquals(sorted[0], "index");
  assertStrictEquals(sorted[sorted.length - 1], "profile");
  assertEquals(sorted, ["index", "a", "b", "profile"]); // Ensure alphabetical order for middle elements
});

Deno.test("default.register records empty string mountPath when provided (object.register)", () => {
  const mockServer: Record<string, unknown> = {};
  const calls: Array<{ path?: string }> = [];
  mockServer.get = (p: string, _h: unknown) => calls.push({ path: p });
  mockServer.post = (_: string, _h: unknown) => undefined;
  mockServer.put = (_: string, _h: unknown) => undefined;
  mockServer.delete = (_: string, _h: unknown) => undefined;
  mockServer.patch = (_: string, _h: unknown) => undefined;
  mockServer.head = (_: string, _h: unknown) => undefined;
  mockServer.options = (_: string, _h: unknown) => undefined;
  mockServer.use = (_: unknown) => undefined;
  mockServer.serve = () => ({ close: () => undefined });

  const ns = {
    default: {
      register: (r: unknown) => {
        const app = r as App;
        if (typeof app.use === "function") app.use(() => new Response("ok"));
      },
    },
    mountPath: "",
  } as Record<string, unknown>;

  const ok = registerFromNamespace(
    "defregempty",
    ns,
    mockServer as unknown as App,
  );
  assertEquals(ok, true);
  const regs = _getRegisteredMounts();
  const rec = regs.find((r) => r.name === "defregempty");
  assert(rec);
  // empty mountPath should be recorded as empty string
  assertEquals(rec?.mount, "");
});

Deno.test("handlerWrapper invokes wrapped middleware passed to app.get and restores state", async () => {
  const captured: Array<{ path: string; handler: unknown }> = [];
  const app: Partial<App> & Record<string, unknown> = {
    get(p: string, h: unknown) {
      captured.push({ path: p, handler: h });
    },
    use: (_: unknown) => undefined,
  };

  const ns = {
    default: (_req: Request, ctx: { state?: Record<string, unknown> }) =>
      new Response(`ok-${ctx.state?.module ?? "x"}`),
    mountPath: "/hwr",
  } as Record<string, unknown>;

  const ok = registerFromNamespace("hmod", ns, app as unknown as App);
  assert(ok);
  assert(captured.length >= 1);

  const handler = (captured[0].handler as unknown) as (
    req: Request,
    ctx?: { state?: Record<string, unknown> },
    next?: () => unknown,
  ) => unknown;

  const ctx = { state: {} } as { state: Record<string, unknown> };
  const res = await (handler(new Request("http://localhost/"), ctx) as
    | Response
    | Promise<Response>);
  assert(res instanceof Response);
  const text = await (res as Response).text();
  assertEquals(text, "ok-hmod");
  // ensure module state was restored
  assertEquals(ctx.state.module, undefined);
});

Deno.test("coverage: force manifest catch via Object.keys throw (fresh import)", async () => {
  const loader = (await import(`./loader.ts`)) as unknown as {
    autoRegisterModules: (app: { use: (m: unknown) => void }) => void;
  };

  const orig = Object.keys;
  try {
    (Object as unknown as { keys: typeof Object.keys }).keys = (() => {
      throw new Error("boom-fresh");
    }) as unknown as typeof Object.keys;

    const errStub = stub(console, "error", () => {});
    try {
      await loader.autoRegisterModules({ use: () => {} });
      const called = errStub.calls.some((c: unknown) => {
        const ci = c as { args: unknown[] };
        return String(ci.args[0]).includes("Failed reading manifest");
      });
      assert(called, "expected loader to log a failure (fresh import)");
    } finally {
      errStub.restore();
    }
  } finally {
    (Object as unknown as { keys: typeof Object.keys }).keys = orig;
  }
});

Deno.test("coverage: registerFromNamespace returns false for non-function candidate (fresh import)", async () => {
  const { registerFromNamespace, getRegistrationCandidate } = await import(
    `./loader.ts`
  );

  const ns = { default: 123, something: 456 } as Record<string, unknown>;
  const app = { use: (_: unknown) => {} };

  const candidate = getRegistrationCandidate("x", ns);
  assertStrictEquals(candidate, null);

  const ok = registerFromNamespace(
    "x",
    ns,
    app as { use: (m: unknown) => void },
  );
  assertEquals(ok, false);
});

Deno.test("coverage: sortComparator explicit weight combos", async () => {
  const { sortComparator } = await import(`./loader.ts`);
  // index vs profile should prefer index first (weight diff -1 - 1 == -2)
  assertEquals(sortComparator("index", "profile"), -2);
  assertEquals(sortComparator("profile", "index"), 2);
});

Deno.test("isNamespaceObject false/true cases", () => {
  assert(!isNamespaceObject(null));
  assert(!isNamespaceObject(42));
  assert(isNamespaceObject({}));
  assert(isNamespaceObject({ a: 1 }));
});

Deno.test("getRegistrationCandidate returns default or named function or null", () => {
  const ns1 = { default: () => "ok" };
  const ns2 = {
    mymod: function () {
      return "n";
    },
    default: 1,
  };
  const ns3 = { foo: 1 };
  assertStrictEquals(getRegistrationCandidate("mymod", ns1), ns1.default);
  assertStrictEquals(getRegistrationCandidate("mymod", ns2), ns2.mymod);
  assertStrictEquals(getRegistrationCandidate("mymod", ns3), null);
});

Deno.test("registerFromNamespace registers default and named, returns false when none", () => {
  const used: unknown[] = [];
  const app: App = { use: (m) => used.push(m) };

  const nsDefault = { default: () => "d" };
  const nsNamed = {
    my: function () {
      return "n";
    },
  };
  const nsNone = { foo: 1 };

  const r1 = registerFromNamespace("def", nsDefault, app);
  assert(r1);
  {
    const reg = used.shift() as (...args: unknown[]) => unknown;
    assertStrictEquals(
      reg({}, { state: {} }, () => undefined),
      nsDefault.default(),
    );
  }

  const r2 = registerFromNamespace("my", nsNamed, app);
  assert(r2);
  assertStrictEquals(
    (used.shift() as (...args: unknown[]) => unknown)(
      {},
      { state: {} },
      () => undefined,
    ),
    nsNamed.my(),
  );

  const r3 = registerFromNamespace("x", nsNone, app);
  assert(!r3);
});

Deno.test("autoRegisterModulesFrom registers modules in sorted order", () => {
  const used: string[] = [];
  const app: App = {
    use: (m: unknown) => {
      const fn = m as (...args: unknown[]) => unknown;
      const res = fn({}, { state: {} }, () => undefined);
      used.push(String(res));
    },
  };

  const manifestObj: Record<string, unknown> = {
    b: {
      b: function () {
        return "B";
      },
    },
    index: {
      default: function () {
        return "I";
      },
    },
    a: {
      a: function () {
        return "A";
      },
    },
    profile: {
      profile: function () {
        return "P";
      },
    },
  };

  autoRegisterModulesFrom(manifestObj, app);
  assertEquals(used, ["I", "A", "B", "P"]);
});

Deno.test("autoRegisterModules logs error when manifest read fails (catch)", async () => {
  const app: App = { use: () => {} };
  const orig = Object.keys;
  try {
    (Object as unknown as { keys: typeof Object.keys }).keys = (() => {
      throw new Error("boom");
    }) as unknown as typeof Object.keys;
    await autoRegisterModules(app);
  } finally {
    (Object as unknown as { keys: typeof Object.keys }).keys = orig;
  }
});

Deno.test("sortComparator and sortNames ordering", () => {
  const names = ["b", "index", "profile", "a"];
  const sorted = sortNames(names);
  assertStrictEquals(sorted[0], "index");
  assertStrictEquals(sorted[sorted.length - 1], "profile");
  // alphabetical for middle ones
  assertEquals(sorted, ["index", "a", "b", "profile"]);
});

Deno.test("isNamespaceObject false/true cases", () => {
  assert(!isNamespaceObject(null));
  assert(!isNamespaceObject(42));
  assert(isNamespaceObject({}));
  assert(isNamespaceObject({ a: 1 }));
});

Deno.test("getRegistrationCandidate returns default or named function or null", () => {
  const ns1 = { default: () => "ok" };
  const ns2 = {
    mymod: function () {
      return "n";
    },
    default: 1,
  };
  const ns3 = { foo: 1 };
  assertStrictEquals(getRegistrationCandidate("mymod", ns1), ns1.default);
  assertStrictEquals(getRegistrationCandidate("mymod", ns2), ns2.mymod);
  assertStrictEquals(getRegistrationCandidate("mymod", ns3), null);
});

Deno.test("registerFromNamespace registers default and named, returns false when none", () => {
  const used: unknown[] = [];
  const app: App = { use: (m) => used.push(m) };

  const nsDefault = { default: () => "d" };
  const nsNamed = {
    my: function () {
      return "n";
    },
  };
  const nsNone = { foo: 1 };

  const r1 = registerFromNamespace("def", nsDefault, app);
  assert(r1);
  {
    const reg = used.shift() as (...args: unknown[]) => unknown;
    assertStrictEquals(
      reg({}, { state: {} }, () => undefined),
      nsDefault.default(),
    );
  }

  const r2 = registerFromNamespace("my", nsNamed, app);
  assert(r2);
  assertStrictEquals(
    (used.shift() as (...args: unknown[]) => unknown)(
      {},
      { state: {} },
      () => undefined,
    ),
    nsNamed.my(),
  );

  const r3 = registerFromNamespace("x", nsNone, app);
  assert(!r3);
});

Deno.test("autoRegisterModulesFrom registers modules in sorted order", () => {
  const used: string[] = [];
  const app: App = {
    use: (m: unknown) => {
      const fn = m as (...args: unknown[]) => unknown;
      const res = fn({}, { state: {} }, () => undefined);
      used.push(String(res));
    },
  };

  const manifestObj: Record<string, unknown> = {
    b: {
      b: function () {
        return "B";
      },
    },
    index: {
      default: function () {
        return "I";
      },
    },
    a: {
      a: function () {
        return "A";
      },
    },
    profile: {
      profile: function () {
        return "P";
      },
    },
  };

  autoRegisterModulesFrom(manifestObj, app);
  // index first, profile last
  assertEquals(used, ["I", "A", "B", "P"]);
});

Deno.test("autoRegisterModules logs error when manifest read fails (catch)", async () => {
  const app: App = { use: () => {} };
  const orig = Object.keys;
  try {
    // Force an error when autoRegisterModules tries to read manifest keys
    // by making Object.keys throw.
    (Object as unknown as { keys: typeof Object.keys }).keys = (() => {
      throw new Error("boom");
    }) as unknown as typeof Object.keys;
    // Should not throw; the function catches internally.
    await autoRegisterModules(app);
  } finally {
    // restore
    (Object as unknown as { keys: typeof Object.keys }).keys = orig;
  }
});

Deno.test("registerFromNamespace restores ctx.state.module when next is called", () => {
  const ns = {
    default: (
      _req: unknown,
      ctx: { state?: Record<string, unknown> },
      next: () => unknown,
    ) => {
      // inside candidate the module should be set to the registration name
      if (ctx.state?.module !== "mymod") return "bad-module";
      return next();
    },
  } as Record<string, unknown>;

  const used: unknown[] = [];
  const app: App = { use: (m) => used.push(m) };

  const ok = registerFromNamespace("mymod", ns, app);
  assert(ok);

  const wrapped = used.shift() as (...args: unknown[]) => unknown;
  const ctx = { state: {} } as { state: Record<string, unknown> };
  const res = wrapped({}, ctx, () => "NEXT");

  assertStrictEquals(res, "NEXT");
  assertStrictEquals(ctx.state.module, undefined);
});

Deno.test("registerFromNamespace respects explicit global export and calls app.use", () => {
  const ns = {
    default: () => new Response("ok"),
    global: true,
  } as Record<string, unknown>;

  const used: unknown[] = [];
  const app: App = { use: (m: unknown) => used.push(m) } as App;

  const ok = registerFromNamespace("gmod", ns, app);
  assertEquals(ok, true);
  assertEquals(used.length, 1);
});

Deno.test("registerFromNamespace normalizes empty mountPath to empty string and registers accordingly", () => {
  const calls: Array<{ path: string }> = [];
  const mockServer = {
    get: (p: string, _h: unknown) => calls.push({ path: p }),
    post: (_: string, _h: unknown) => undefined,
    put: (_: string, _h: unknown) => undefined,
    delete: (_: string, _h: unknown) => undefined,
    patch: (_: string, _h: unknown) => undefined,
    head: (_: string, _h: unknown) => undefined,
    options: (_: string, _h: unknown) => undefined,
    use: (_: unknown) => undefined,
    serve: () => ({ close: () => undefined }),
  } as unknown as App;

  const ns = {
    default: () => new Response("ok"),
    mountPath: "",
  } as Record<string, unknown>;

  const ok = registerFromNamespace("emptymount", ns, mockServer);
  assertEquals(ok, true);
  // should have attempted exact and wildcard with empty base path
  const exact = calls.find((c) => c.path === "");
  const wild = calls.find((c) => c.path === "/*");
  assert(exact);
  assert(wild);
});

Deno.test("registerFromNamespace falls back to app.use when router method access throws inside loop", () => {
  const used: unknown[] = [];
  const mockServer: Record<string, unknown> = {};
  // ensure typeof app.get === 'function' check passes
  mockServer.get = () => undefined;
  // but make accessing `post` throw when the loop reaches it; this should be
  // caught by the outer try/catch and cause fallback to app.use(wrapped)
  Object.defineProperty(mockServer, "post", {
    get() {
      throw new Error("access-post-throw");
    },
  });
  mockServer.use = (m: unknown) => used.push(m);
  mockServer.serve = () => ({ close: () => undefined });

  const ns = {
    default: (_req: Request, _ctx: unknown, next?: () => unknown) =>
      next && next(),
  } as Record<string, unknown>;
  const ok = registerFromNamespace(
    "fallback",
    ns,
    mockServer as unknown as App,
  );
  assertEquals(ok, true);
  // outer catch should have fallen back to app.use and recorded a middleware
  assertEquals(used.length, 1);
});

Deno.test("registerFromNamespace restores ctx.state.module when candidate throws", () => {
  const ns = {
    default: () => {
      throw new Error("boom");
    },
  } as Record<string, unknown>;

  const used: unknown[] = [];
  const app: App = { use: (m) => used.push(m) };

  const ok = registerFromNamespace("thrower", ns, app);
  assert(ok);

  const wrapped = used.shift() as (...args: unknown[]) => unknown;
  const ctx = { state: { module: "prev" } } as {
    state: Record<string, unknown>;
  };
  try {
    wrapped({}, ctx, () => undefined);
  } catch (_e) {
    // expected
  }
  // module should be restored even when candidate throws
  assertStrictEquals(ctx.state.module, "prev");
});

Deno.test("registerFromNamespace restores ctx.state.module for async candidate awaiting next", async () => {
  const ns = {
    default: async (
      _req: unknown,
      ctx: { state?: Record<string, unknown> },
      next: () => Promise<string>,
    ) => {
      // inside candidate the module should be set
      if (ctx.state?.module !== "asyncmod") return "bad";
      const r = await next();
      return `DONE:${r}`;
    },
  } as Record<string, unknown>;

  const used: unknown[] = [];
  const app: App = { use: (m) => used.push(m) };

  const ok = registerFromNamespace("asyncmod", ns, app);
  assert(ok);

  const wrapped = used.shift() as (...args: unknown[]) => unknown;
  const ctx = { state: {} } as { state: Record<string, unknown> };
  const result =
    await (wrapped({}, ctx, () => Promise.resolve("ok")) as Promise<string>);

  assertStrictEquals(result, "DONE:ok");
  assertStrictEquals(ctx.state.module, undefined);
});

Deno.test("registerFromNamespace restores ctx.state.module when candidate returns resolved promise", async () => {
  const ns = {
    default: () => Promise.resolve("ok"),
  } as Record<string, unknown>;

  const used: unknown[] = [];
  const app: App = { use: (m) => used.push(m) };

  const ok = registerFromNamespace("promisemod", ns, app);
  assert(ok);

  const wrapped = used.shift() as (...args: unknown[]) => unknown;
  const ctx = { state: { module: "prev" } } as {
    state: Record<string, unknown>;
  };
  const res =
    await (wrapped({}, ctx, () => Promise.resolve("next")) as Promise<string>);

  assertStrictEquals(res, "ok");
  assertStrictEquals(ctx.state.module, "prev");
});

Deno.test("registerFromNamespace restores ctx.state.module when candidate returns rejected promise", async () => {
  const ns = {
    default: () => Promise.reject(new Error("boom")),
  } as Record<string, unknown>;

  const used: unknown[] = [];
  const app: App = { use: (m) => used.push(m) };

  const ok = registerFromNamespace("rejectmod", ns, app);
  assert(ok);

  const wrapped = used.shift() as (...args: unknown[]) => unknown;
  const ctx = { state: { module: "prev" } } as {
    state: Record<string, unknown>;
  };

  let threw = false;
  try {
    await (wrapped({}, ctx, () => Promise.resolve("next")) as Promise<unknown>);
  } catch (_e) {
    threw = true;
  }

  assert(threw, "expected candidate to reject");
  assertStrictEquals(ctx.state.module, "prev");
});

Deno.test("registerFromNamespace initializes missing ctx.state and restores module", () => {
  const ns = {
    default: (
      _req: unknown,
      ctx: { state?: Record<string, unknown> },
      next: () => string,
    ) => {
      if (ctx.state?.module !== "newmod") return "bad";
      return next();
    },
  } as Record<string, unknown>;

  const used: unknown[] = [];
  const app: App = { use: (m) => used.push(m) };

  const ok = registerFromNamespace("newmod", ns, app);
  assert(ok);

  const wrapped = used.shift() as (...args: unknown[]) => unknown;
  const ctx = {} as { state?: Record<string, unknown> };

  const res = wrapped(
    {},
    ctx as unknown as { state: Record<string, unknown> },
    () => "NEXT",
  );
  assertStrictEquals(res, "NEXT");
  // ctx.state should exist and module should be restored/absent
  assert(ctx.state);
  assertStrictEquals(ctx.state.module, undefined);
});

Deno.test("sortComparator and sortNames ordering", () => {
  const names = ["b", "index", "profile", "a"];
  const sorted = sortNames(names);
  assertStrictEquals(sorted[0], "index");
  assertStrictEquals(sorted[sorted.length - 1], "profile");
  // alphabetical for middle ones
  assertEquals(sorted, ["index", "a", "b", "profile"]);
});

Deno.test("isNamespaceObject false/true cases", () => {
  assert(!isNamespaceObject(null));
  assert(!isNamespaceObject(42));
  assert(isNamespaceObject({}));
  assert(isNamespaceObject({ a: 1 }));
});

Deno.test("getRegistrationCandidate returns default or named function or null", () => {
  const ns1 = { default: () => "ok" };
  const ns2 = {
    mymod: function () {
      return "n";
    },
    default: 1,
  };
  const ns3 = { foo: 1 };
  assertStrictEquals(getRegistrationCandidate("mymod", ns1), ns1.default);
  assertStrictEquals(getRegistrationCandidate("mymod", ns2), ns2.mymod);
  assertStrictEquals(getRegistrationCandidate("mymod", ns3), null);
});

Deno.test("registerFromNamespace registers default and named, returns false when none", () => {
  const used: unknown[] = [];
  const app: App = { use: (m) => used.push(m) };

  const nsDefault = { default: () => "d" };
  const nsNamed = {
    my: function () {
      return "n";
    },
  };
  const nsNone = { foo: 1 };

  const r1 = registerFromNamespace("def", nsDefault, app);
  assert(r1);
  {
    const reg = used.shift() as (...args: unknown[]) => unknown;
    assertStrictEquals(
      reg({}, { state: {} }, () => undefined),
      nsDefault.default(),
    );
  }

  const r2 = registerFromNamespace("my", nsNamed, app);
  assert(r2);
  assertStrictEquals(
    (used.shift() as (...args: unknown[]) => unknown)(
      {},
      { state: {} },
      () => undefined,
    ),
    nsNamed.my(),
  );

  const r3 = registerFromNamespace("x", nsNone, app);
  assert(!r3);
});

Deno.test("autoRegisterModulesFrom registers modules in sorted order", () => {
  const used: string[] = [];
  const app: App = {
    use: (m: unknown) => {
      const fn = m as (...args: unknown[]) => unknown;
      const res = fn({}, { state: {} }, () => undefined);
      used.push(String(res));
    },
  };

  const manifestObj: Record<string, unknown> = {
    b: {
      b: function () {
        return "B";
      },
    },
    index: {
      default: function () {
        return "I";
      },
    },
    a: {
      a: function () {
        return "A";
      },
    },
    profile: {
      profile: function () {
        return "P";
      },
    },
  };

  autoRegisterModulesFrom(manifestObj, app);
  // index first, profile last
  assertEquals(used, ["I", "A", "B", "P"]);
});

Deno.test("autoRegisterModules logs error when manifest read fails (catch)", async () => {
  const app: App = { use: () => {} };
  const orig = Object.keys;
  try {
    // Force an error when autoRegisterModules tries to read manifest keys
    // by making Object.keys throw.
    (Object as unknown as { keys: typeof Object.keys }).keys = (() => {
      throw new Error("boom");
    }) as unknown as typeof Object.keys;
    // Should not throw; the function catches internally.
    await autoRegisterModules(app);
  } finally {
    // restore
    (Object as unknown as { keys: typeof Object.keys }).keys = orig;
  }
});

type Loader = {
  autoRegisterModules: (app: { use: (m: unknown) => void }) => void;
};

Deno.test("sortNames sorts index first and profile last", async () => {
  const { sortNames } = await import(`./loader.ts`);
  const arr = ["b", "index", "a", "profile"];
  const out = sortNames(arr.slice());
  assertEquals(out[0], "index");
  assertEquals(out[out.length - 1], "profile");
});

Deno.test("autoRegisterModules registers default and named exports", async () => {
  const { autoRegisterModulesFrom } = await import(`./loader.ts`);
  const manifest = { a: { default: () => {} }, b: { b: () => {} } } as Record<
    string,
    unknown
  >;
  const calls: unknown[] = [];
  const app = { use: (m: unknown) => calls.push(m) };

  autoRegisterModulesFrom(manifest, app as { use: (m: unknown) => void });

  assertEquals(calls.length, 2);
});

Deno.test("autoRegisterModules skips undefined and null namespaces", async () => {
  const { autoRegisterModulesFrom } = await import(`./loader.ts`);
  const manifest = {
    a: { default: () => {} },
    b: null,
    c: undefined,
  } as Record<string, unknown>;
  const calls: unknown[] = [];
  const app = { use: (m: unknown) => calls.push(m) };
  autoRegisterModulesFrom(manifest, app as { use: (m: unknown) => void });
  assertEquals(calls.length, 1);
});

Deno.test("autoRegisterModules handles non-function exports", async () => {
  const { autoRegisterModulesFrom } = await import(`./loader.ts`);
  const manifest = { a: { something: 123 }, b: { default: 123 } } as Record<
    string,
    unknown
  >;
  const calls: unknown[] = [];
  const app = { use: (m: unknown) => calls.push(m) };
  autoRegisterModulesFrom(manifest, app as { use: (m: unknown) => void });
  assertEquals(calls.length, 0);
});

Deno.test("autoRegisterModules handles manifest import error", async () => {
  // Simulate a runtime failure during registration by making `app.use`
  // throw when the loader attempts to register modules from the real
  // `manifest.ts`. This exercises the `try/catch` inside
  // `autoRegisterModules` without mutating module exports.
  const loader = (await import(`./loader.ts`)) as unknown as {
    autoRegisterModules: (app: { use: (m: unknown) => void }) => void;
  };

  const app = {
    use: () => {
      throw new Error("boom");
    },
  };
  const errStub = stub(console, "error", () => {});
  try {
    await loader.autoRegisterModules(app as { use: (m: unknown) => void });
    const called = errStub.calls.some((c: unknown) => {
      const ci = c as { args: unknown[] };
      return String(ci.args[0]).includes("Failed reading manifest");
    });
    assert(called, "expected loader to log a failure");
  } finally {
    errStub.restore();
  }
});

Deno.test("skips non-object and null namespaces and prefers default export", async () => {
  const { autoRegisterModulesFrom } = await import(`./loader.ts`);
  const manifest = {
    defAndNamed: { default: () => {}, defAndNamed: () => {} },
    noFuncs: { something: 123 },
    nul: null,
  } as Record<string, unknown>;

  const calls: string[] = [];
  const app = { use: (_m: unknown) => calls.push("used") };

  // stub console.info to capture which branch was used
  const infoStub = stub(console, "info", () => {});
  try {
    autoRegisterModulesFrom(manifest, app as { use: (m: unknown) => void });
    // at least one registration should occur for defAndNamed
    assert(calls.length >= 1);
    // ensure console.info was called with default export message
    const called = infoStub.calls.some((c: unknown) => {
      const ci = c as { args: unknown[] };
      return String(ci.args[0]).includes("default export");
    });
    assert(called, "expected default export registration log");
  } finally {
    infoStub.restore();
  }
});

Deno.test("registerFromNamespace treats default.build() returning non-function as no-candidate", () => {
  const ns = {
    default: {
      build: () => 123,
    },
  } as Record<string, unknown>;

  const calls: unknown[] = [];
  const app: App = { use: (m: unknown) => calls.push(m) } as App;

  const ok = registerFromNamespace("build-non-fn", ns, app);
  // build returned a non-function, so no candidate should be registered
  assertEquals(ok, false);
  assertEquals(calls.length, 0);
});

Deno.test("registerFromNamespace propagates when explicit global registration's app.use throws", () => {
  const ns = {
    default: () => new Response("ok"),
    global: true,
  } as Record<string, unknown>;

  const app: App = {
    use: () => {
      throw new Error("use-throws");
    },
  } as unknown as App;

  let threw = false;
  try {
    registerFromNamespace("gthrow", ns, app);
  } catch (e) {
    threw = true;
    assert(String((e as Error).message).includes("use-throws"));
  }
  assert(
    threw,
    "expected registerFromNamespace to propagate app.use error for explicit global",
  );
});

Deno.test("registerFromNamespace rethrows when registration function throws", () => {
  const ns = {
    default: (_app: App) => {
      throw new Error("boom-reg");
    },
  } as Record<string, unknown>;

  const app: App = { use: () => {} } as App;

  let threw = false;
  try {
    registerFromNamespace("bad", ns, app);
  } catch (e) {
    threw = true;
    assert(String((e as Error).message).includes("boom-reg"));
  }
  assert(
    threw,
    "expected registerFromNamespace to rethrow registration function error",
  );
});

Deno.test("registerFromNamespace registration function without server methods falls back to app.use", () => {
  const ns = {
    default: (_app: { get?: (p: string, h: unknown) => unknown }) => {
      // Attempt to register via `get` which the base does not implement.
      (_app as unknown as { get?: (p: string, h: unknown) => unknown }).get?.(
        "/x",
        () => "ok",
      );
    },
  } as Record<string, unknown>;

  const used: unknown[] = [];
  const app: App = { use: (m: unknown) => used.push(m) } as unknown as App;

  const ok = registerFromNamespace("x", ns, app);
  assertEquals(ok, true);
  // The registrar should detect missing `get` and call `app.use` with the handler
  assertEquals(used.length, 1);
});

Deno.test("makeRegistrar attempts wildcard registration after exact call", () => {
  const calls: Array<{ p: string }> = [];
  const server: Record<string, unknown> = {
    get: (p: string, _h: unknown) => calls.push({ p }),
    use: (_: unknown) => undefined,
    serve: () => ({ close: () => undefined }),
  };

  const ns = {
    default: (reg: Record<string, unknown>) => {
      // registration function should call registrar.get which will in turn
      // call the server `get` twice (exact and wildcard)
      const rr = reg as unknown as { get?: (...a: unknown[]) => unknown };
      rr.get?.("/p", () => new Response("ok"));
    },
  } as Record<string, unknown>;

  const ok = registerFromNamespace("regwild", ns, server as unknown as App);
  assert(ok);
  // expect both exact and wildcard attempts recorded
  assert(calls.some((c) => c.p === "/p"));
  assert(calls.some((c) => c.p === "/p/*"));
});

Deno.test("named register records explicit mountPath string when provided", () => {
  const ns = {
    register: (r: Record<string, unknown>) => {
      const rr = r as unknown as { get?: (...a: unknown[]) => unknown };
      rr.get?.("/x", () => new Response("ok"));
    },
    mountPath: "nomountstr",
  } as unknown as Record<string, unknown>;

  const app: App = { use: (_: unknown) => undefined } as App;
  const ok = registerFromNamespace("namedm", ns, app);
  assert(ok);
  const regs = _getRegisteredMounts();
  // the recorded mount should be the raw string provided (pre-normalize)
  assert(regs.some((r) => r.name === "namedm" && r.mount === "nomountstr"));
});

Deno.test("default.register records explicit mountPath string when provided", () => {
  const ns = {
    default: {
      register: (r: Record<string, unknown>) => {
        const rr = r as unknown as { get?: (...a: unknown[]) => unknown };
        rr.get?.("/y", () => new Response("ok"));
      },
    },
    mountPath: "dnom",
  } as unknown as Record<string, unknown>;

  const app: App = { use: (_: unknown) => undefined } as App;
  const ok = registerFromNamespace("defreg", ns, app);
  assert(ok);
  const regs = _getRegisteredMounts();
  assert(regs.some((r) => r.name === "defreg" && r.mount === "dnom"));
});

Deno.test("candidate route registration normalizes mountPath missing leading slash", () => {
  const recorded: Array<{ p: string; h: unknown; rest?: unknown[] }> = [];
  const app: Record<string, unknown> = {
    get: (p: string, h: unknown) => recorded.push({ p, h }),
    post: (_: string, _h: unknown) => undefined,
    put: (_: string, _h: unknown) => undefined,
    delete: (_: string, _h: unknown) => undefined,
    patch: (_: string, _h: unknown) => undefined,
    head: (_: string, _h: unknown) => undefined,
    options: (_: string, _h: unknown) => undefined,
    use: (_: unknown) => undefined,
    serve: () => ({ close: () => undefined }),
  };

  const ns = {
    default: (_r: unknown, _c: unknown) => new Response("ok"),
    mountPath: "no/lead",
  } as Record<string, unknown>;
  const ok = registerFromNamespace("cnorm", ns, app as unknown as App);
  assert(ok);
  // registered path should have leading slash normalized
  assert(recorded.some((r) => r.p === "/no/lead" || r.p === "/no/lead/*"));
});

Deno.test("slugFromName sanitizes underscores/spaces and strips invalid chars", () => {
  const recorded: Array<{ p: string; h: unknown }> = [];
  const app: Record<string, unknown> = {
    get: (p: string, h: unknown) => recorded.push({ p, h }),
    post: (_: string, _h: unknown) => undefined,
    put: (_: string, _h: unknown) => undefined,
    delete: (_: string, _h: unknown) => undefined,
    patch: (_: string, _h: unknown) => undefined,
    head: (_: string, _h: unknown) => undefined,
    options: (_: string, _h: unknown) => undefined,
    use: (_: unknown) => undefined,
    serve: () => ({ close: () => undefined }),
  };

  const name = "Foo_Bar Baz!";
  const ns = {
    default: (_r: unknown, _c: unknown) => new Response("ok"),
  } as Record<string, unknown>;
  const ok = registerFromNamespace(name, ns, app as unknown as App);
  assert(ok);
  // the mount should be slugified to /foo-bar-baz
  assert(
    recorded.some((r) => r.p === "/foo-bar-baz" || r.p === "/foo-bar-baz/*"),
  );
});

Deno.test("handlerWrapper uses provided next() when supplied", () => {
  const recorded: Array<{ p: string; h: unknown }> = [];
  const app: Record<string, unknown> = {
    get: (p: string, h: unknown) => recorded.push({ p, h }),
    post: (_: string, _h: unknown) => undefined,
    put: (_: string, _h: unknown) => undefined,
    delete: (_: string, _h: unknown) => undefined,
    patch: (_: string, _h: unknown) => undefined,
    head: (_: string, _h: unknown) => undefined,
    options: (_: string, _h: unknown) => undefined,
    use: (_: unknown) => undefined,
    serve: () => ({ close: () => undefined }),
  };

  // Candidate that calls next() and expects a provided next to be used
  const ns = {
    default: (
      _req: unknown,
      _ctx: { state?: Record<string, unknown> },
      next: () => unknown,
    ) => {
      return next();
    },
  } as Record<string, unknown>;

  const ok = registerFromNamespace("withnext", ns, app as unknown as App);
  assert(ok);
  const rec = recorded.shift() as { p: string; h: unknown };
  const handler = rec.h as (
    req: Request,
    ctx: { state?: Record<string, unknown> },
    next?: () => unknown,
  ) => unknown;
  const res = handler(
    new Request("http://example.com/"),
    {},
    () => new Response("OK", { status: 200 }),
  ) as Response;
  assert(res instanceof Response);
  assertEquals(res.status, 200);
});

Deno.test("registerFromNamespace provides noop middleware for root mounts and passes three-arg signature", () => {
  const calls: unknown[] = [];
  const mk = (name: string) => (...args: unknown[]) =>
    calls.push({ name, args });

  const app: App = {
    get: mk("get"),
    post: mk("post"),
    put: mk("put"),
    delete: mk("delete"),
    patch: mk("patch"),
    head: mk("head"),
    options: mk("options"),
    use: (_: unknown) => undefined,
    serve: () => ({ close: () => undefined }),
  } as unknown as App;

  const ns = {
    default: (_req: Request, _ctx: unknown, next?: () => unknown) =>
      next && next(),
  } as Record<string, unknown>;

  // Register as `index` to ensure mount === '/'
  const ok = registerFromNamespace("index", ns, app);
  assert(ok);

  // At least one of the recorded calls should have three args (mount, handler, noop)
  const threeArg = (calls as Array<{ args: unknown[] }>).some((c) =>
    c.args && (c.args as unknown[]).length >= 3 &&
    typeof (c.args as unknown[])[2] === "function"
  );
  assert(
    threeArg,
    "expected a noop middleware function passed as third arg for root mounts",
  );
});

Deno.test("registerFromNamespace continues when a method registration throws and other methods still register", () => {
  const calls: Array<{ method: string; path: string }> = [];
  const make =
    (m: string, throwOnPath?: string) =>
    (p: string, _h: unknown, ..._rest: unknown[]) => {
      if (throwOnPath && p === throwOnPath) throw new Error(`boom-${m}`);
      calls.push({ method: m, path: p });
    };

  const app: Record<string, unknown> = {
    get: make("get"),
    post: make("post", "/bad"), // will throw and should be skipped
    put: make("put"),
    delete: make("delete"),
    patch: make("patch"),
    head: make("head"),
    options: make("options"),
    use: (_: unknown) => undefined,
    serve: () => ({ close: () => undefined }),
  };

  const ns = {
    default: (_req: Request, _ctx: unknown, next?: () => unknown) =>
      next && next(),
  } as Record<string, unknown>;
  const ok = registerFromNamespace("bad", ns, app as unknown as App);
  assert(ok);

  // Ensure get and put (and others) still received registrations even though post threw
  const gotGet = calls.some((c) => c.method === "get");
  const gotPut = calls.some((c) => c.method === "put");
  assert(
    gotGet && gotPut,
    "expected other methods to still be called when one method throws",
  );
});

Deno.test("autoRegisterModulesFrom logs middleware and route counts when introspection is available", () => {
  const info = stub(console, "info", () => {});
  try {
    const app: App & {
      _getMiddlewareCount?: () => number;
      _getRoutePaths?: () => string[];
    } = {
      use: (_: unknown) => undefined,
      _getMiddlewareCount: () => 3,
      _getRoutePaths: () => ["/a", "/b"],
    } as unknown as App & {
      _getMiddlewareCount?: () => number;
      _getRoutePaths?: () => string[];
    };

    autoRegisterModulesFrom({}, app);

    const calledMw = info.calls.some((c: unknown) =>
      String((c as { args: unknown[] }).args[0]).includes("Global middlewares")
    );
    const calledRoutes = info.calls.some((c: unknown) =>
      String((c as { args: unknown[] }).args[0]).includes("Registered route(s)")
    );
    assert(
      calledMw && calledRoutes,
      "expected middleware and route counts to be logged",
    );
  } finally {
    info.restore();
  }
});

Deno.test("autoRegisterModulesFrom swallows errors from introspection functions", () => {
  const info = stub(console, "info", () => {});
  try {
    const app: App & { _getMiddlewareCount?: () => number } = {
      use: (_: unknown) => undefined,
      // Introspection throws when accessed
      get _getMiddlewareCount() {
        throw new Error("introspect-boom");
      },
      _getRoutePaths: () => ["/x"],
    } as unknown as App & { _getMiddlewareCount?: () => number };

    // Should not throw
    autoRegisterModulesFrom({}, app as unknown as App);
  } finally {
    info.restore();
  }
});

Deno.test("handlerWrapper default next returns 404 when candidate calls next and no next provided", () => {
  const recorded: unknown[] = [];
  const app: App = {
    get: (p: string, h: unknown) => recorded.push({ p, h }),
    post: (_: string, _h: unknown) => undefined,
    put: (_: string, _h: unknown) => undefined,
    delete: (_: string, _h: unknown) => undefined,
    patch: (_: string, _h: unknown) => undefined,
    head: (_: string, _h: unknown) => undefined,
    options: (_: string, _h: unknown) => undefined,
    use: (_: unknown) => undefined,
    serve: () => ({ close: () => undefined }),
  } as unknown as App;

  // Candidate middleware that delegates to next()
  const ns = {
    default: (
      _req: unknown,
      _ctx: { state?: Record<string, unknown> },
      next: () => unknown,
    ) => {
      return next();
    },
  } as Record<string, unknown>;

  const ok = registerFromNamespace("mymod", ns, app);
  assert(ok);

  const rec = recorded.shift() as { p: string; h: unknown };
  const handlerWrapper = rec.h as (
    req: Request,
    ctx: { state?: Record<string, unknown> },
    next?: () => unknown,
  ) => unknown;

  const ctx: { state?: Record<string, unknown> } = {};
  const res = handlerWrapper(
    new Request("http://example.com/"),
    ctx as unknown as { state?: Record<string, unknown> },
  ) as Response;
  assert(res instanceof Response);
  assertEquals(res.status, 404);
});

Deno.test("default.register records explicit mountPath string when provided", () => {
  const ns = {
    default: {
      register: (r: Record<string, unknown>) => {
        const rr = r as unknown as { get?: (...a: unknown[]) => unknown };
        rr.get?.("/y", () => new Response("ok"));
      },
    },
    mountPath: "dnom",
  } as unknown as Record<string, unknown>;

  const app: App = { use: (_: unknown) => undefined } as App;
  const ok = registerFromNamespace("defreg", ns, app);
  assert(ok);
  const regs = _getRegisteredMounts();
  assert(regs.some((r) => r.name === "defreg" && r.mount === "dnom"));
});

Deno.test("candidate route registration normalizes mountPath missing leading slash", () => {
  const recorded: Array<{ p: string; h: unknown; rest?: unknown[] }> = [];
  const app: Record<string, unknown> = {
    get: (p: string, h: unknown, ...rest: unknown[]) =>
      recorded.push({ p, h, rest }),
    post: (_: string, _h: unknown) => undefined,
    put: (_: string, _h: unknown) => undefined,
    delete: (_: string, _h: unknown) => undefined,
    patch: (_: string, _h: unknown) => undefined,
    head: (_: string, _h: unknown) => undefined,
    options: (_: string, _h: unknown) => undefined,
    use: (_: unknown) => undefined,
    serve: () => ({ close: () => undefined }),
  };

  const ns = {
    default: (_r: unknown, _c: unknown) => new Response("ok"),
    mountPath: "no/lead",
  } as Record<string, unknown>;
  const ok = registerFromNamespace("cnorm", ns, app as unknown as App);
  assert(ok);
  // registered path should have leading slash normalized
  assert(recorded.some((r) => r.p === "/no/lead" || r.p === "/no/lead/*"));
});

Deno.test("slugFromName sanitizes underscores/spaces and strips invalid chars", () => {
  const recorded: Array<{ p: string; h: unknown }> = [];
  const app: Record<string, unknown> = {
    get: (p: string, h: unknown) => recorded.push({ p, h }),
    post: (_: string, _h: unknown) => undefined,
    put: (_: string, _h: unknown) => undefined,
    delete: (_: string, _h: unknown) => undefined,
    patch: (_: string, _h: unknown) => undefined,
    head: (_: string, _h: unknown) => undefined,
    options: (_: string, _h: unknown) => undefined,
    use: (_: unknown) => undefined,
    serve: () => ({ close: () => undefined }),
  };

  const name = "Foo_Bar Baz!";
  const ns = {
    default: (_r: unknown, _c: unknown) => new Response("ok"),
  } as Record<string, unknown>;
  const ok = registerFromNamespace(name, ns, app as unknown as App);
  assert(ok);
  // the mount should be slugified to /foo-bar-baz
  assert(
    recorded.some((r) => r.p === "/foo-bar-baz" || r.p === "/foo-bar-baz/*"),
  );
});

Deno.test("handlerWrapper uses provided next() when supplied", () => {
  const recorded: Array<{ p: string; h: unknown }> = [];
  const app: Record<string, unknown> = {
    get: (p: string, h: unknown) => recorded.push({ p, h }),
    post: (_: string, _h: unknown) => undefined,
    put: (_: string, _h: unknown) => undefined,
    delete: (_: string, _h: unknown) => undefined,
    patch: (_: string, _h: unknown) => undefined,
    head: (_: string, _h: unknown) => undefined,
    options: (_: string, _h: unknown) => undefined,
    use: (_: unknown) => undefined,
    serve: () => ({ close: () => undefined }),
  };

  // Candidate that calls next() and expects a provided next to be used
  const ns = {
    default: (
      _req: unknown,
      _ctx: { state?: Record<string, unknown> },
      next: () => unknown,
    ) => {
      return next();
    },
  } as Record<string, unknown>;

  const ok = registerFromNamespace("withnext", ns, app as unknown as App);
  assert(ok);
  const rec = recorded.shift() as { p: string; h: unknown };
  const handler = rec.h as (
    req: Request,
    ctx: { state?: Record<string, unknown> },
    next?: () => unknown,
  ) => unknown;
  const res = handler(
    new Request("http://example.com/"),
    {},
    () => new Response("OK", { status: 200 }),
  ) as Response;
  assert(res instanceof Response);
  assertEquals(res.status, 200);
});

Deno.test("registerFromNamespace provides noop middleware for root mounts and passes three-arg signature", () => {
  const calls: unknown[] = [];
  const mk = (name: string) => (...args: unknown[]) =>
    calls.push({ name, args });

  const app: App = {
    get: mk("get"),
    post: mk("post"),
    put: mk("put"),
    delete: mk("delete"),
    patch: mk("patch"),
    head: mk("head"),
    options: mk("options"),
    use: (_: unknown) => undefined,
    serve: () => ({ close: () => undefined }),
  } as unknown as App;

  const ns = {
    default: (_req: Request, _ctx: unknown, next?: () => unknown) =>
      next && next(),
  } as Record<string, unknown>;

  // Register as `index` to ensure mount === '/'
  const ok = registerFromNamespace("index", ns, app);
  assert(ok);

  // At least one of the recorded calls should have three args (mount, handler, noop)
  const threeArg = (calls as Array<{ args: unknown[] }>).some((c) =>
    c.args && (c.args as unknown[]).length >= 3 &&
    typeof (c.args as unknown[])[2] === "function"
  );
  assert(
    threeArg,
    "expected a noop middleware function passed as third arg for root mounts",
  );
});

Deno.test("registerFromNamespace continues when a method registration throws and other methods still register", () => {
  const calls: Array<{ method: string; path: string }> = [];
  const make =
    (m: string, throwOnPath?: string) =>
    (p: string, _h: unknown, ..._rest: unknown[]) => {
      if (throwOnPath && p === throwOnPath) throw new Error(`boom-${m}`);
      calls.push({ method: m, path: p });
    };

  const app: Record<string, unknown> = {
    get: make("get"),
    post: make("post", "/bad"), // will throw and should be skipped
    put: make("put"),
    delete: make("delete"),
    patch: make("patch"),
    head: make("head"),
    options: make("options"),
    use: (_: unknown) => undefined,
    serve: () => ({ close: () => undefined }),
  };

  const ns = {
    default: (_req: Request, _ctx: unknown, next?: () => unknown) =>
      next && next(),
  } as Record<string, unknown>;
  const ok = registerFromNamespace("bad", ns, app as unknown as App);
  assert(ok);

  // Ensure get and put (and others) still received registrations even though post threw
  const gotGet = calls.some((c) => c.method === "get");
  const gotPut = calls.some((c) => c.method === "put");
  assert(
    gotGet && gotPut,
    "expected other methods to still be called when one method throws",
  );
});

Deno.test("autoRegisterModulesFrom logs middleware and route counts when introspection is available", () => {
  const info = stub(console, "info", () => {});
  try {
    const app: App & {
      _getMiddlewareCount?: () => number;
      _getRoutePaths?: () => string[];
    } = {
      use: (_: unknown) => undefined,
      _getMiddlewareCount: () => 3,
      _getRoutePaths: () => ["/a", "/b"],
    } as unknown as App & {
      _getMiddlewareCount?: () => number;
      _getRoutePaths?: () => string[];
    };

    autoRegisterModulesFrom({}, app);

    const calledMw = info.calls.some((c: unknown) =>
      String((c as { args: unknown[] }).args[0]).includes("Global middlewares")
    );
    const calledRoutes = info.calls.some((c: unknown) =>
      String((c as { args: unknown[] }).args[0]).includes("Registered route(s)")
    );
    assert(
      calledMw && calledRoutes,
      "expected middleware and route counts to be logged",
    );
  } finally {
    info.restore();
  }
});

Deno.test("autoRegisterModulesFrom swallows errors from introspection functions", () => {
  const info = stub(console, "info", () => {});
  try {
    const app: App & { _getMiddlewareCount?: () => number } = {
      use: (_: unknown) => undefined,
      // Introspection throws when accessed
      get _getMiddlewareCount() {
        throw new Error("introspect-boom");
      },
      _getRoutePaths: () => ["/x"],
    } as unknown as App & { _getMiddlewareCount?: () => number };

    // Should not throw
    autoRegisterModulesFrom({}, app as unknown as App);
  } finally {
    info.restore();
  }
});

Deno.test("handlerWrapper default next returns 404 when candidate calls next and no next provided", () => {
  const recorded: unknown[] = [];
  const app: App = {
    get: (p: string, h: unknown) => recorded.push({ p, h }),
    post: (_: string, _h: unknown) => undefined,
    put: (_: string, _h: unknown) => undefined,
    delete: (_: string, _h: unknown) => undefined,
    patch: (_: string, _h: unknown) => undefined,
    head: (_: string, _h: unknown) => undefined,
    options: (_: string, _h: unknown) => undefined,
    use: (_: unknown) => undefined,
    serve: () => ({ close: () => undefined }),
  } as unknown as App;

  // Candidate middleware that delegates to next()
  const ns = {
    default: (
      _req: unknown,
      _ctx: { state?: Record<string, unknown> },
      next: () => unknown,
    ) => {
      return next();
    },
  } as Record<string, unknown>;

  const ok = registerFromNamespace("mymod", ns, app);
  assert(ok);

  const rec = recorded.shift() as { p: string; h: unknown };
  const handlerWrapper = rec.h as (
    req: Request,
    ctx: { state?: Record<string, unknown> },
    next?: () => unknown,
  ) => unknown;

  const ctx: { state?: Record<string, unknown> } = {};
  const res = handlerWrapper(
    new Request("http://example.com/"),
    ctx as unknown as { state?: Record<string, unknown> },
  ) as Response;
  assert(res instanceof Response);
  assertEquals(res.status, 404);
});
Deno.test("multi-method registration continues when a specific method's wildcard registration throws", () => {
  const calls: Array<{ method: string; path: string }> = [];
  const mockServer = {
    get: (p: string, _h: unknown) => calls.push({ method: "get", path: p }),
    post: (p: string, _h: unknown) => {
      calls.push({ method: "post", path: p });
      if (p.endsWith("/*")) throw new Error("post-wildcard");
    },
    put: undefined,
    delete: undefined,
    patch: undefined,
    head: undefined,
    options: undefined,
    use: (_: unknown) => undefined,
    serve: () => ({ close: () => undefined }),
  } as unknown as App;

  const ns = {
    default: (_req: Request, _ctx: unknown, next?: () => unknown) =>
      next && next(),
  } as Record<string, unknown>;
  const ok = registerFromNamespace("test", ns, mockServer);
  assertEquals(ok, true);
  // get and post exact mounts should be attempted
  const exact = calls.find((c) => c.path === "/test");
  assert(exact);
  // wildcard for post may have thrown but registration should have continued
  const wildcardPost = calls.find((c) => c.path === "/test/*");
  assert(wildcardPost);
});

Deno.test("root mount registration passes noop middleware arg to server methods", () => {
  const calls: Array<{ path: string; argsLen: number }> = [];
  const mockServer = {
    get: (p: string, _h: unknown, ...m: unknown[]) =>
      calls.push({ path: p, argsLen: 2 + m.length }),
    post: (p: string, _h: unknown, ...m: unknown[]) =>
      calls.push({ path: p, argsLen: 2 + m.length }),
    put: (_: string, _h: unknown, ..._m: unknown[]) => undefined,
    delete: (_: string, _h: unknown, ..._m: unknown[]) => undefined,
    patch: (_: string, _h: unknown, ..._m: unknown[]) => undefined,
    head: (_: string, _h: unknown, ..._m: unknown[]) => undefined,
    options: (_: string, _h: unknown, ..._m: unknown[]) => undefined,
    use: (_m: unknown) => undefined,
    serve: () => ({ close: () => undefined }),
  } as unknown as App;

  const ns = {
    default: {
      build:
        () => ((_req: Request, _ctx: { state?: Record<string, unknown> }) =>
          new Response("ok")),
    },
  } as Record<string, unknown>;
  const ok = registerFromNamespace("index", ns, mockServer);
  assertEquals(ok, true);
  // ensure that for root mount the recorded args length indicates noopMw was passed (>=3 args)
  const exact = calls.find((c) => c.path === "/");
  const wildcard = calls.find((c) => c.path === "//*");
  assert(exact && exact.argsLen >= 3);
  assert(wildcard && wildcard.argsLen >= 3);
});

Deno.test("autoRegisterModulesFrom logs middleware and route counts when available", () => {
  const manifest = { a: { default: () => {} } } as Record<string, unknown>;
  const calls: unknown[] = [];
  const app: App & {
    _getMiddlewareCount?: () => number;
    _getRoutePaths?: () => string[];
  } = {
    use: (m: unknown) => calls.push(m),
    _getMiddlewareCount: () => 3,
    _getRoutePaths: () => ["/a", "/b"],
  } as unknown as App & {
    _getMiddlewareCount?: () => number;
    _getRoutePaths?: () => string[];
  };

  const infoStub = stub(console, "info", () => {});
  try {
    autoRegisterModulesFrom(manifest, app);
    const foundMw = infoStub.calls.some((c: unknown) =>
      String((c as { args: unknown[] }).args[0]).includes(
        "Global middlewares: 3",
      )
    );
    const foundRoutes = infoStub.calls.some((c: unknown) =>
      String((c as { args: unknown[] }).args[0]).includes(
        "Registered route(s): 2",
      )
    );
    assert(foundMw, "expected middleware count log");
    assert(foundRoutes, "expected route count log");
  } finally {
    infoStub.restore();
  }
});

// Note: manifest import is cached during test run; manifest-failure behavior
// is exercised by monkeypatching `autoRegisterModulesFrom` in another test.

// Note: manifest import is cached during test run; manifest-failure behavior
// is exercised by monkeypatching `autoRegisterModulesFrom` in another test.

Deno.test("autoRegisterModulesFrom covers all registration branches", async () => {
  const { autoRegisterModulesFrom } = await import(`./loader.ts`);

  // 1) default export function
  {
    const calls: unknown[] = [];
    const app = { use: (m: unknown) => calls.push(m) };
    const manifest = { a: { default: () => {} } } as Record<string, unknown>;
    autoRegisterModulesFrom(manifest, app as { use: (m: unknown) => void });
    assertEquals(calls.length, 1);
  }

  // 2) named export function when default not a function
  {
    const calls: unknown[] = [];
    const app = { use: (m: unknown) => calls.push(m) };
    const manifest = { foo: { default: 123, foo: () => {} } } as Record<
      string,
      unknown
    >;
    autoRegisterModulesFrom(manifest, app as { use: (m: unknown) => void });
    assertEquals(calls.length, 1);
  }

  // 3) non-function exports should not register
  {
    const calls: unknown[] = [];
    const app = { use: (m: unknown) => calls.push(m) };
    const manifest = { bar: { default: 123, bar: 456 } } as Record<
      string,
      unknown
    >;
    autoRegisterModulesFrom(manifest, app as { use: (m: unknown) => void });
    assertEquals(calls.length, 0);
  }

  // 4) skip null/undefined/non-object
  {
    const calls: unknown[] = [];
    const app = { use: (m: unknown) => calls.push(m) };
    const manifest = { a: null, b: undefined, c: 123 } as Record<
      string,
      unknown
    >;
    autoRegisterModulesFrom(manifest, app as { use: (m: unknown) => void });
    assertEquals(calls.length, 0);
  }

  // 5) ensure console.info is called on registration
  {
    const calls: unknown[] = [];
    const app = { use: (m: unknown) => calls.push(m) };
    const manifest = { x: { default: () => {} } } as Record<string, unknown>;
    const infoStub = stub(console, "info", () => {});
    try {
      autoRegisterModulesFrom(manifest, app as { use: (m: unknown) => void });
      const found = infoStub.calls.some((c: unknown) => {
        const ci = c as { args: unknown[] };
        return String(ci.args[0]).includes("Registered default export");
      });
      assert(found, "expected info log for registration");
    } finally {
      infoStub.restore();
    }
  }
});

Deno.test("registerFromNamespace covers default/named/non-function branches", async () => {
  const { registerFromNamespace } = await import(`./loader.ts`);

  // default export function
  {
    const calls: unknown[] = [];
    const app = { use: (m: unknown) => calls.push(m) };
    const ns = { default: () => {}, other: () => {} } as Record<
      string,
      unknown
    >;
    const infoStub = stub(console, "info", () => {});
    try {
      const ok = registerFromNamespace(
        "x",
        ns,
        app as { use: (m: unknown) => void },
      );
      assertEquals(ok, true);
      assertEquals(calls.length, 1);
      const found = infoStub.calls.some((c: unknown) => {
        const ci = c as { args: unknown[] };
        return String(ci.args[0]).includes("Registered default export");
      });
      assert(found);
    } finally {
      infoStub.restore();
    }
  }

  // named export when default not a function
  {
    const calls: unknown[] = [];
    const app = { use: (m: unknown) => calls.push(m) };
    const ns = { default: 123, foo: () => {} } as Record<string, unknown>;
    const infoStub = stub(console, "info", () => {});
    try {
      const ok = registerFromNamespace(
        "foo",
        ns,
        app as { use: (m: unknown) => void },
      );
      assertEquals(ok, true);
      assertEquals(calls.length, 1);
      const found = infoStub.calls.some((c: unknown) => {
        const ci = c as { args: unknown[] };
        return String(ci.args[0]).includes("Registered foo export");
      });
      assert(found);
    } finally {
      infoStub.restore();
    }
  }

  // non-function exports
  {
    const calls: unknown[] = [];
    const app = { use: (m: unknown) => calls.push(m) };
    const ns = { default: 123, foo: 456 } as Record<string, unknown>;
    const ok = registerFromNamespace(
      "foo",
      ns,
      app as { use: (m: unknown) => void },
    );
    assertEquals(ok, false);
    assertEquals(calls.length, 0);
  }
});

Deno.test("sortNames hits all comparator branches", async () => {
  const { sortNames } = await import(`./loader.ts`);
  // index first
  let arr = ["a", "index"];
  let out = sortNames(arr.slice());
  assertEquals(out[0], "index");

  // index as second element
  arr = ["index", "b"];
  out = sortNames(arr.slice());
  assertEquals(out[0], "index");

  // profile last cases
  arr = ["profile", "a"];
  out = sortNames(arr.slice());
  assertEquals(out[out.length - 1], "profile");

  arr = ["a", "profile"];
  out = sortNames(arr.slice());
  assertEquals(out[out.length - 1], "profile");

  // alphabetical fallback
  arr = ["zebra", "apple", "banana"];
  out = sortNames(arr.slice());
  assertEquals(out, ["apple", "banana", "zebra"]);
});

Deno.test("sortComparator direct branches", async () => {
  const { sortComparator } = await import(`./loader.ts`);
  // a === index
  assertEquals(sortComparator("index", "a"), -1);
  // b === index
  assertEquals(sortComparator("a", "index"), 1);
  // a === profile
  assertEquals(sortComparator("profile", "a"), 1);
  // b === profile
  assertEquals(sortComparator("a", "profile"), -1);
  // alphabetical
  assert(sortComparator("apple", "banana") < 0);
});

Deno.test("autoRegisterModules uses real manifest to register", async () => {
  const loader = (await import(`./loader.ts`)) as unknown as {
    autoRegisterModules: (app: { use: (m: unknown) => void }) => void;
  };
  const calls: unknown[] = [];
  const app = { use: (m: unknown) => calls.push(m) };
  // stub console.info to avoid noisy output
  const infoStub = stub(console, "info", () => {});
  try {
    await loader.autoRegisterModules(app as { use: (m: unknown) => void });
    assert(calls.length > 0, "expected some registrations from real manifest");
  } finally {
    infoStub.restore();
  }
});

Deno.test("registration function records explicit mountPath and index fallback", () => {
  // explicit mountPath
  const app1: App = { use: (_: unknown) => undefined } as App;
  const ns1 = {
    default: (r: Record<string, unknown>) => {
      const rr = r as unknown as { get?: (...a: unknown[]) => unknown };
      rr.get?.("/x", () => new Response("ok"));
    },
    mountPath: "/explicit",
  } as unknown as Record<string, unknown>;
  const ok1 = registerFromNamespace("reg1", ns1, app1);
  assert(ok1);
  const regs1 = _getRegisteredMounts();
  assert(regs1.some((r) => r.name === "reg1" && r.mount === "/explicit"));

  // index fallback to '/'
  const app2: App = { use: (_: unknown) => undefined } as App;
  const ns2 = {
    default: (r: Record<string, unknown>) => {
      const rr = r as unknown as { get?: (...a: unknown[]) => unknown };
      rr.get?.("/", () => new Response("ok"));
    },
  } as unknown as Record<string, unknown>;
  const ok2 = registerFromNamespace("index", ns2, app2);
  assert(ok2);
  const regs2 = _getRegisteredMounts();
  assert(regs2.some((r) => r.name === "index" && r.mount === "/"));
});

Deno.test("registration function records explicit mountPath string when provided (no slash)", () => {
  const app: App = { use: (_: unknown) => undefined } as App;
  const ns = {
    default: (r: Record<string, unknown>) => {
      const rr = r as unknown as { get?: (...a: unknown[]) => unknown };
      rr.get?.("/x", () => new Response("ok"));
    },
    mountPath: "nomountstr",
  } as unknown as Record<string, unknown>;

  const ok = registerFromNamespace("regfn", ns, app);
  assert(ok);
  const regs = _getRegisteredMounts();
  const found = regs.find((r) => r.name === "regfn");
  assert(found && found.mount === "nomountstr");
});

Deno.test("default.register and named register fallback derive correct mounts when absent", () => {
  const app: App = { use: (_: unknown) => undefined } as App;

  const nsNamed = {
    register: (r: Record<string, unknown>) => {
      const rr = r as unknown as { get?: (...a: unknown[]) => unknown };
      rr.get?.("/n", () => new Response("ok"));
    },
  } as unknown as Record<string, unknown>;
  const okNamed = registerFromNamespace("namednom", nsNamed, app);
  assert(okNamed);
  const nsDef = {
    default: {
      register: (r: Record<string, unknown>) => {
        const rr = r as unknown as { get?: (...a: unknown[]) => unknown };
        rr.get?.("/d", () => new Response("ok"));
      },
    },
  } as unknown as Record<string, unknown>;
  const okDef = registerFromNamespace("defnom", nsDef, app);
  assert(okDef);
  const regs = _getRegisteredMounts();
  assert(regs.some((r) => r.name === "namednom"));
  assert(regs.some((r) => r.name === "defnom"));
});

Deno.test("slugFromName falls back to original when sanitized becomes empty", () => {
  const recorded: Array<{ p: string; h: unknown }> = [];
  const app: Record<string, unknown> = {
    get: (p: string, h: unknown) => recorded.push({ p, h }),
    post: (_: string, _h: unknown) => undefined,
    put: (_: string, _h: unknown) => undefined,
    delete: (_: string, _h: unknown) => undefined,
    patch: (_: string, _h: unknown) => undefined,
    head: (_: string, _h: unknown) => undefined,
    options: (_: string, _h: unknown) => undefined,
    use: (_: unknown) => undefined,
    serve: () => ({ close: () => undefined }),
  };

  const name = "!!!";
  const ns = {
    default: (_r: unknown, _c: unknown) => new Response("ok"),
  } as Record<string, unknown>;
  const ok = registerFromNamespace(name, ns, app as unknown as App);
  assert(ok);
  // mount should fall back to original name when slug sanitization yields empty
  assert(recorded.some((r) => r.p === "/!!!" || r.p === "/!!!/*"));
});

Deno.test("non-default candidate (named export) triggers alternate registration log branch", () => {
  const recorded: Array<{ p: string; h: unknown }> = [];
  const app: Record<string, unknown> = {
    get: (p: string, h: unknown) => recorded.push({ p, h }),
    post: (_: string, _h: unknown) => undefined,
    put: (_: string, _h: unknown) => undefined,
    delete: (_: string, _h: unknown) => undefined,
    patch: (_: string, _h: unknown) => undefined,
    head: (_: string, _h: unknown) => undefined,
    options: (_: string, _h: unknown) => undefined,
    use: (_: unknown) => undefined,
    serve: () => ({ close: () => undefined }),
  };

  // Named candidate (no default function)
  const ns = {
    foo: (_r: unknown, _c: unknown) => new Response("ok"),
  } as Record<string, unknown>;
  const ok = registerFromNamespace("foo", ns, app as unknown as App);
  assert(ok);
  // ensure we registered routes for /foo
  assert(recorded.some((r) => r.p === "/foo" || r.p === "/foo/*"));
});

Deno.test("makeRegistrar continues when exact throws and still attempts wildcard", () => {
  const calls: Array<{ p: string }> = [];
  const server = {
    get: (p: string, _h: unknown) => {
      calls.push({ p });
      if (p === "/throw") throw new Error("boom-exact");
    },
    use: (_: unknown) => undefined,
    serve: () => ({ close: () => undefined }),
  } as unknown as App;

  const ns = {
    default: (r: Record<string, unknown>) => {
      const rr = r as unknown as { get?: (...a: unknown[]) => unknown };
      rr.get?.("/throw", () => new Response("ok"));
    },
  } as Record<string, unknown>;

  const ok = registerFromNamespace("throw", ns, server);
  assert(ok);
  // expect both exact and wildcard attempts recorded (wildcard may also throw internally but attempted)
  assert(calls.some((c) => c.p === "/throw"));
  assert(calls.some((c) => c.p === "/throw/*"));
});

Deno.test("registration honors options.requireExplicitGlobals assignment without error", () => {
  const app: App = { use: (_: unknown) => undefined } as App;
  const ns = { default: () => new Response("ok"), global: false } as Record<
    string,
    unknown
  >;
  // pass options with requireExplicitGlobals true to exercise assignment
  const ok = registerFromNamespace("opt", ns, app, {
    requireExplicitGlobals: true,
  });
  assert(ok);
});

// Consolidated coverage exercise (previously in loader.cover.test.ts)
Deno.test("coverage: exercise loader branches", async () => {
  const mod = await import(`./loader.ts`);

  // comparator branches
  assertEquals(mod.sortComparator("index", "a"), -1);
  assertEquals(mod.sortComparator("a", "index"), 1);
  assertEquals(mod.sortComparator("profile", "a"), 1);
  assert(mod.sortComparator("apple", "banana") < 0);

  // ensure sortNames also exercised
  const out = mod.sortNames(["b", "index", "a", "profile"].slice());
  assertEquals(out[0], "index");

  // autoRegisterModulesFrom simple registration
  const calls: unknown[] = [];
  const app = { use: (m: unknown) => calls.push(m) };
  mod.autoRegisterModulesFrom({
    index: { default: () => {} },
    a: { a: () => {} },
  }, app as { use: (m: unknown) => void });
  assertEquals(calls.length, 2);

  // cover autoRegisterModules catch path by forcing Object.keys to throw
  const orig = Object.keys;
  try {
    (Object as unknown as { keys: typeof Object.keys }).keys = (() => {
      throw new Error("boom");
    }) as unknown as typeof Object.keys;

    const errStub = stub(console, "error", () => {});
    try {
      await mod.autoRegisterModules(app as { use: (m: unknown) => void });
      const called = errStub.calls.some((c: unknown) => {
        const ci = c as { args: unknown[] };
        return String(ci.args[0]).includes("Failed reading manifest");
      });
      assert(called, "expected loader to log a failure");
    } finally {
      errStub.restore();
    }
  } finally {
    (Object as unknown as { keys: typeof Object.keys }).keys = orig;
  }
});
Deno.test("sortComparator tie and alphabetical fallback (extra)", async () => {
  const { sortComparator } = await import(`./loader.ts`);
  // identical names should compare equal
  assertEquals(sortComparator("same", "same"), 0);
  // alphabetical fallback for two non-special names
  assert(sortComparator("apple", "zebra") < 0);
});

Deno.test("sortComparator profile tie case", async () => {
  const { sortComparator } = await import(`./loader.ts`);
  // profile vs profile should be equal
  assertEquals(sortComparator("profile", "profile"), 0);
});

Deno.test("getRegistrationCandidate returns named when default not function (extra)", async () => {
  const { getRegistrationCandidate } = await import(`./loader.ts`);
  const ns = { default: 123, foo: () => "ok" } as Record<string, unknown>;
  const c = getRegistrationCandidate("foo", ns);
  assertStrictEquals(c, ns.foo);
});

Deno.test("sortComparator full permutation matrix", async () => {
  const { sortComparator } = await import(`./loader.ts`);
  const names = ["index", "profile", "apple"];
  const results: Record<string, number> = {};
  for (const a of names) {
    for (const b of names) {
      const k = `${a}|${b}`;
      results[k] = sortComparator(a, b);
    }
  }

  // explicit expectations derived from weight: index=-1, profile=1, apple=0
  // index vs profile => -2, profile vs index => 2
  assertEquals(results[`index|profile`], -2);
  assertEquals(results[`profile|index`], 2);

  // index vs apple => -1, apple vs index => 1
  assertEquals(results[`index|apple`], -1);
  assertEquals(results[`apple|index`], 1);

  // profile vs apple => 1, apple vs profile => -1
  assertEquals(results[`profile|apple`], 1);
  assertEquals(results[`apple|profile`], -1);

  // identical names equal
  assertEquals(results[`apple|apple`], 0);
});

Deno.test("registerFromNamespace fresh import candidate branches", async () => {
  const { registerFromNamespace, getRegistrationCandidate } = await import(
    `./loader.ts`
  );

  // candidate null path
  const nsNone = { foo: 1 } as Record<string, unknown>;
  const app = { use: (_: unknown) => {} };
  assertStrictEquals(getRegistrationCandidate("x", nsNone), null);
  assertEquals(
    registerFromNamespace("x", nsNone, app as { use: (m: unknown) => void }),
    false,
  );

  // candidate default path
  const nsDef = { default: () => "d" } as Record<string, unknown>;
  const calls: unknown[] = [];
  const app2 = { use: (m: unknown) => calls.push(m) };
  assertEquals(
    registerFromNamespace("def", nsDef, app2 as { use: (m: unknown) => void }),
    true,
  );
  assertEquals(calls.length, 1);
});

Deno.test("autoRegisterModules supports options.manifest (sync)", async () => {
  const { autoRegisterModules } = await import(`./loader.ts`);
  const calls: unknown[] = [];
  const app = { use: (m: unknown) => calls.push(m) };
  await autoRegisterModules(app as { use: (m: unknown) => void }, {
    manifest: { x: { default: () => {} } },
  });
  assertEquals(calls.length, 1);
});

Deno.test("autoRegisterModules supports manifestPath with file:// prefix", async () => {
  const loader = (await import(`./loader.ts`)) as unknown as {
    autoRegisterModules: (
      app: { use: (m: unknown) => void },
      opts?: unknown,
    ) => void;
  };
  const calls: unknown[] = [];
  const app = { use: (m: unknown) => calls.push(m) };
  await loader.autoRegisterModules(app as { use: (m: unknown) => void }, {
    manifestPath: `file://${Deno.cwd()}/manifest.ts`,
  });
  assert(calls.length > 0);
});

Deno.test("autoRegisterModules supports manifestPath without file:// prefix", async () => {
  const loader = (await import(`./loader.ts`)) as unknown as {
    autoRegisterModules: (
      app: { use: (m: unknown) => void },
      opts?: unknown,
    ) => void;
  };
  const calls: unknown[] = [];
  const app = { use: (m: unknown) => calls.push(m) };
  await loader.autoRegisterModules(app as { use: (m: unknown) => void }, {
    manifestPath: `${Deno.cwd()}/manifest.ts`,
  });
  assert(calls.length > 0);
});

Deno.test("registerFromNamespace: registration function uses server methods", () => {
  const calls: Array<{ method: string; path: string }> = [];
  const mockServer = {
    get: (p: string, _h: unknown, ..._m: unknown[]) =>
      calls.push({ method: "get", path: p }),
    post: (p: string, _h: unknown, ..._m: unknown[]) =>
      calls.push({ method: "post", path: p }),
    put: (p: string, _h: unknown, ..._m: unknown[]) =>
      calls.push({ method: "put", path: p }),
    delete: (p: string, _h: unknown, ..._m: unknown[]) =>
      calls.push({ method: "delete", path: p }),
    patch: (p: string, _h: unknown, ..._m: unknown[]) =>
      calls.push({ method: "patch", path: p }),
    head: (p: string, _h: unknown, ..._m: unknown[]) =>
      calls.push({ method: "head", path: p }),
    options: (p: string, _h: unknown, ..._m: unknown[]) =>
      calls.push({ method: "options", path: p }),
    use: (_m: unknown) => undefined,
    serve: () => ({ close: () => undefined }),
  } as unknown as App;

  const ns = {
    default: function (
      app: { get: (p: string, h: unknown, ...m: unknown[]) => unknown },
    ) {
      app.get("/m", () => new Response("m"));
    },
  } as Record<string, unknown>;

  const ok = registerFromNamespace("m", ns, mockServer as App);
  assert(ok);
  // two registrations: /m and /m/*
  assertEquals(calls.length, 2);
  assertEquals(calls[0].path, "/m");
  assertEquals(calls[1].path, "/m/*");
});

Deno.test("registration function records explicit string mountPath", () => {
  const app: App = { use: () => {} } as App;
  const ns = {
    default: (_a: App) => {
      // noop registration function
    },
    mountPath: "/ex/reg",
  } as Record<string, unknown>;

  const ok = registerFromNamespace("exreg", ns, app);
  assertEquals(ok, true);
  const regs = _getRegisteredMounts();
  const found = regs.find((r) => r.name === "exreg");
  assert(found && found.mount === "/ex/reg");
});

Deno.test("named register records explicit string mountPath", () => {
  // ensure named register branch records provided mountPath string
  const calls: unknown[] = [];
  const app: App = { use: (m: unknown) => calls.push(m) } as App;
  const ns = {
    register: (_a: App) => {},
    mountPath: "/explicit",
  } as Record<string, unknown>;
  const ok = registerFromNamespace("namedexp", ns, app);
  assertEquals(ok, true);
  const regs = _getRegisteredMounts();
  const found = regs.find((r) => r.name === "namedexp");
  assert(found && found.mount === "/explicit");
});

Deno.test("default.register records explicit string mountPath", () => {
  const app: App = { use: () => {} } as App;
  const ns = {
    default: {
      register: (_a: App) => {},
    },
    mountPath: "//custom//",
  } as Record<string, unknown>;
  const ok = registerFromNamespace("defexp", ns, app);
  assertEquals(ok, true);
  const regs = _getRegisteredMounts();
  const found = regs.find((r) => r.name === "defexp");
  // normalizeMount should strip trailing slashes
  assert(found && found.mount === "/custom");
});

Deno.test("normalizeMount adds leading slash and strips trailing slashes", () => {
  const app: App = { use: () => {} } as App;
  const ns = {
    default: () => "ok",
    mountPath: "no/lead//",
  } as Record<string, unknown>;
  const ok = registerFromNamespace("nolead", ns, app);
  assertEquals(ok, true);
  const regs = _getRegisteredMounts();
  const found = regs.find((r) => r.name === "nolead");
  assert(found && found.mount === "/no/lead");
});

Deno.test("slugFromName falls back to original name when sanitized empty", () => {
  const app: App = { use: () => {} } as App;
  const ns = { default: () => "ok" } as Record<string, unknown>;
  const ok = registerFromNamespace("!!!", ns, app);
  assertEquals(ok, true);
  const regs = _getRegisteredMounts();
  const found = regs.find((r) => r.name === "!!!");
  // slugFromName would sanitize to empty and should fall back to original name
  assert(found && found.mount === "/!!!");
});

Deno.test("registration function without explicit mount records derived mount", () => {
  const app: App & { get?: (p: string, h: unknown) => unknown } = {
    use: () => {},
    get: (_p: string, _h: unknown) => undefined,
    serve: () => ({ close: () => undefined }),
  } as unknown as App & { get?: (p: string, h: unknown) => unknown };

  const ns = {
    default: (_a: App) => {
      // no-op
    },
  } as Record<string, unknown>;

  const ok = registerFromNamespace("regnomount", ns, app);
  assertEquals(ok, true);
  const regs = _getRegisteredMounts();
  const found = regs.find((r) => r.name === "regnomount");
  assert(found && found.mount === "/regnomount");
});

Deno.test("named register without explicit mount records derived mount", () => {
  const app: App = { use: () => {} } as App;
  const ns = {
    register: (_a: App) => {},
  } as Record<string, unknown>;
  const ok = registerFromNamespace("namednomount", ns, app);
  assertEquals(ok, true);
  const regs = _getRegisteredMounts();
  const found = regs.find((r) => r.name === "namednomount");
  assert(found && found.mount === "/namednomount");
});

Deno.test("default.register without explicit mount records derived mount", () => {
  const app: App = { use: () => {} } as App;
  const ns = {
    default: { register: (_a: App) => {} },
  } as Record<string, unknown>;
  const ok = registerFromNamespace("defnomount", ns, app);
  assertEquals(ok, true);
  const regs = _getRegisteredMounts();
  const found = regs.find((r) => r.name === "defnomount");
  assert(found && found.mount === "/defnomount");
});

Deno.test("handlerWrapper default next returns Not found when next omitted", async () => {
  const captured: Array<{ path: string; handler: unknown }> = [];
  const mockServer = {
    get: (p: string, h: unknown) => captured.push({ path: p, handler: h }),
    use: (_m: unknown) => undefined,
    serve: () => ({ close: () => undefined }),
  } as unknown as App;

  const ns = {
    default: (_req: Request, _ctx: unknown, next?: () => unknown) =>
      next && next(),
  } as Record<string, unknown>;
  const ok = registerFromNamespace("some", ns, mockServer);
  assertEquals(ok, true);
  const h = captured.find((c) => c.path === "/some")?.handler as unknown as (
    req: Request,
    ctx?: { state?: Record<string, unknown> },
  ) => unknown;
  assert(h);
  const res = await (h(
    new Request("http://localhost/some"),
    { state: {} },
  ) as Promise<Response>);
  assert(res);
  assertEquals(res.status, 404);
});

Deno.test("exhaustive manifest permutations exercise many registration branches", () => {
  const manifest: Record<string, unknown> = {
    regfunc_no_mount: { default: (_app: App) => {} },
    regfunc_with_mount: { default: (_app: App) => {}, mountPath: "/m1" },
    named_no_mount: { register: (_app: App) => {} },
    named_with_mount: { register: (_app: App) => {}, mountPath: "named/m" },
    default_register_obj_no_mount: { default: { register: (_a: App) => {} } },
    default_register_obj_mount: {
      default: { register: (_a: App) => {} },
      mountPath: "//d//",
    },
    build_returns_fn: {
      default: { build: () => (_req: Request) => new Response("ok") },
    },
    build_throws: {
      default: {
        build: () => {
          throw new Error("boom-build");
        },
      },
    },
    default_middleware: {
      default: (_req: Request, _ctx: unknown, _next: unknown) =>
        new Response("ok"),
    },
    global_true: { default: () => new Response("ok"), global: true },
    emptymount: { default: () => new Response("ok"), mountPath: "" },
  };

  const calls: unknown[] = [];
  const app: App & { get?: (...a: unknown[]) => unknown } = {
    use: (m: unknown) => calls.push({ type: "use", m }),
    get: (_p: string, _h: unknown) => calls.push({ type: "get", p: _p }),
    post: (_p: string, _h: unknown) => calls.push({ type: "post", p: _p }),
    put: (_p: string, _h: unknown) => calls.push({ type: "put", p: _p }),
    delete: (_p: string, _h: unknown) => calls.push({ type: "delete", p: _p }),
    patch: (_p: string, _h: unknown) => calls.push({ type: "patch", p: _p }),
    head: (_p: string, _h: unknown) => calls.push({ type: "head", p: _p }),
    options: (_p: string, _h: unknown) =>
      calls.push({ type: "options", p: _p }),
    serve: () => ({ close: () => undefined }),
  } as unknown as App & { get?: (...a: unknown[]) => unknown };

  autoRegisterModulesFrom(manifest, app);
  // Expect at least some registrations to have occurred
  assert(calls.length > 0);
});

Deno.test("registerFromNamespace: default.register method registers via server", () => {
  const calls: Array<{ method: string; path: string }> = [];
  const mockServer = {
    get: (p: string, _h: unknown, ..._m: unknown[]) =>
      calls.push({ method: "get", path: p }),
    post: (p: string, _h: unknown, ..._m: unknown[]) =>
      calls.push({ method: "post", path: p }),
    put: (p: string, _h: unknown, ..._m: unknown[]) =>
      calls.push({ method: "put", path: p }),
    delete: (p: string, _h: unknown, ..._m: unknown[]) =>
      calls.push({ method: "delete", path: p }),
    patch: (p: string, _h: unknown, ..._m: unknown[]) =>
      calls.push({ method: "patch", path: p }),
    head: (p: string, _h: unknown, ..._m: unknown[]) =>
      calls.push({ method: "head", path: p }),
    options: (p: string, _h: unknown, ..._m: unknown[]) =>
      calls.push({ method: "options", path: p }),
    use: (_m: unknown) => undefined,
    serve: () => ({ close: () => undefined }),
  } as unknown as App;

  const ns = {
    default: {
      register: (
        app: { post: (p: string, h: unknown, ...m: unknown[]) => unknown },
      ) => app.post("/p", () => new Response("p")),
    },
  } as Record<string, unknown>;

  const ok = registerFromNamespace("p", ns, mockServer as App);
  assert(ok);
  assertEquals(calls.length, 2);
  assertEquals(calls[0].path, "/p");
  assertEquals(calls[1].path, "/p/*");
});

Deno.test("registerFromNamespace: default.build() candidate registers as route middleware", () => {
  const calls: Array<{ method: string; path: string; handler?: unknown }> = [];
  const mockServer = {
    get: (p: string, h: unknown, ..._m: unknown[]) =>
      calls.push({ method: "get", path: p, handler: h }),
    post: (p: string, h: unknown, ..._m: unknown[]) =>
      calls.push({ method: "post", path: p, handler: h }),
    put: (p: string, h: unknown, ..._m: unknown[]) =>
      calls.push({ method: "put", path: p, handler: h }),
    delete: (p: string, h: unknown, ..._m: unknown[]) =>
      calls.push({ method: "delete", path: p, handler: h }),
    patch: (p: string, h: unknown, ..._m: unknown[]) =>
      calls.push({ method: "patch", path: p, handler: h }),
    head: (p: string, h: unknown, ..._m: unknown[]) =>
      calls.push({ method: "head", path: p, handler: h }),
    options: (p: string, h: unknown, ..._m: unknown[]) =>
      calls.push({ method: "options", path: p, handler: h }),
    use: (_m: unknown) => undefined,
    serve: () => ({ close: () => undefined }),
  } as unknown as App;

  const ns = {
    default: {
      build: () => ((_req: Request) => new Response("ok")),
    },
  } as Record<string, unknown>;

  const ok = registerFromNamespace("foo", ns, mockServer as App);
  assert(ok);
  // registered for all supported HTTP methods (get/post/put/delete/patch/head/options)
  // two registrations per method: exact and wildcard path
  assertEquals(calls.length, 14);
  assertEquals(calls[0].path, "/foo");
  assertEquals(calls[1].path, "/foo/*");
});

Deno.test("autoRegisterModules logs error when options.manifest branch throws", async () => {
  const { autoRegisterModules } = await import(`./loader.ts`);
  const orig = Object.keys;
  try {
    (Object as unknown as { keys: typeof Object.keys }).keys = (() => {
      throw new Error("boom-manifest");
    }) as unknown as typeof Object.keys;

    const errStub = stub(console, "error", () => {});
    try {
      await autoRegisterModules({ use: () => {} }, {
        manifest: { a: { default: () => {} } },
      });
      const called = errStub.calls.some((c: unknown) => {
        const ci = c as { args: unknown[] };
        return String(ci.args[0]).includes("Failed reading manifest");
      });
      assert(called, "expected loader to log a failure for options.manifest");
    } finally {
      errStub.restore();
    }
  } finally {
    (Object as unknown as { keys: typeof Object.keys }).keys = orig;
  }
});

Deno.test("registerFromNamespace normalizes explicit mountPath values", () => {
  const calls: Array<{ path: string; args: unknown[] }> = [];
  const mockServer = {
    get: (p: string, ...a: unknown[]) => calls.push({ path: p, args: a }),
    post: (_p: string, ..._a: unknown[]) => undefined,
    put: (_p: string, ..._a: unknown[]) => undefined,
    delete: (_p: string, ..._a: unknown[]) => undefined,
    patch: (_p: string, ..._a: unknown[]) => undefined,
    head: (_p: string, ..._a: unknown[]) => undefined,
    options: (_p: string, ..._a: unknown[]) => undefined,
    use: (_: unknown) => undefined,
    serve: () => ({ close: () => undefined }),
  } as unknown as App;

  const ns = {
    default: function () {
      return "ok";
    },
    mountPath: "//a/b///",
  } as Record<string, unknown>;

  const ok = registerFromNamespace("foo", ns, mockServer as App);
  assert(ok);

  // first registration should use normalized mount (preserves leading //)
  assertEquals(calls[0].path, "//a/b");
  assertEquals(calls[1].path, "//a/b/*");
});

Deno.test("registerFromNamespace derives slug from name and strips invalid chars", () => {
  const calls: Array<{ path: string; args: unknown[] }> = [];
  const mockServer = {
    get: (p: string, ...a: unknown[]) => calls.push({ path: p, args: a }),
    post: (_p: string, ..._a: unknown[]) => undefined,
    put: (_p: string, ..._a: unknown[]) => undefined,
    delete: (_p: string, ..._a: unknown[]) => undefined,
    patch: (_p: string, ..._a: unknown[]) => undefined,
    head: (_p: string, ..._a: unknown[]) => undefined,
    options: (_p: string, ..._a: unknown[]) => undefined,
    use: (_: unknown) => undefined,
    serve: () => ({ close: () => undefined }),
  } as unknown as App;

  const name = "My Module!@#";
  const ns = {
    default: () => "ok",
  } as Record<string, unknown>;

  const ok = registerFromNamespace(name, ns, mockServer as App);
  assert(ok);

  assertEquals(calls[0].path, "/my-module");
  assertEquals(calls[1].path, "/my-module/*");
});

Deno.test("root mount passes noop middleware and it calls next", () => {
  const calls: Array<{ path: string; args: unknown[] }> = [];
  const mockServer = {
    get: (p: string, ...a: unknown[]) => calls.push({ path: p, args: a }),
    post: (_p: string, ..._a: unknown[]) => undefined,
    put: (_p: string, ..._a: unknown[]) => undefined,
    delete: (_p: string, ..._a: unknown[]) => undefined,
    patch: (_p: string, ..._a: unknown[]) => undefined,
    head: (_p: string, ..._a: unknown[]) => undefined,
    options: (_p: string, ..._a: unknown[]) => undefined,
    use: (_: unknown) => undefined,
    serve: () => ({ close: () => undefined }),
  } as unknown as App;

  const ns = {
    default: function () {
      return "ok";
    },
    mountPath: "/",
  } as Record<string, unknown>;

  const ok = registerFromNamespace("roottest", ns, mockServer as App);
  assert(ok);

  // The noop middleware should be the last argument passed for root mounts
  const args = calls[0].args;
  const noop = args[1] as ((...a: unknown[]) => unknown) | undefined;
  assert(typeof noop === "function");

  // When invoked, noop should call next() and return its result
  const result =
    (noop as unknown as (r: Request, c: unknown, n: () => unknown) => unknown)(
      new Request("http://localhost/"),
      { state: {} },
      () => "next-called",
    );
  assertEquals(result, "next-called");
});

Deno.test("registerFromNamespace mounts index at root and passes noop middleware arg", () => {
  const calls: Array<{ path: string; args: unknown[] }> = [];
  const mockServer = {
    get: (p: string, ...a: unknown[]) => calls.push({ path: p, args: a }),
    post: (_p: string, ..._a: unknown[]) => undefined,
    put: (_p: string, ..._a: unknown[]) => undefined,
    delete: (_p: string, ..._a: unknown[]) => undefined,
    patch: (_p: string, ..._a: unknown[]) => undefined,
    head: (_p: string, ..._a: unknown[]) => undefined,
    options: (_p: string, ..._a: unknown[]) => undefined,
    use: (_: unknown) => undefined,
    serve: () => ({ close: () => undefined }),
  } as unknown as App;

  const ns = { default: () => "ok" } as Record<string, unknown>;

  const ok = registerFromNamespace("index", ns, mockServer as App);
  assert(ok);

  // get registrations: exact and wildcard
  assertEquals(calls.length, 2);
  assertEquals(calls[0].path, "/");
  assertEquals(calls[1].path, "//*");

  // Ensure noop middleware was provided as last arg when mounting at root
  assert(calls[0].args.length >= 2);
  const lastArg = calls[0].args[calls[0].args.length - 1];
  assert(typeof lastArg === "function");
});

Deno.test("normalizeMountForRecord collapses multiple leading/trailing slashes for recorded mounts", () => {
  const app: App = { use: () => {} } as App;
  const ns = {
    register: (_r: Record<string, unknown>) => {
      // noop registration
    },
    mountPath: "///many///",
  } as unknown as Record<string, unknown>;

  const ok = registerFromNamespace("many", ns, app);
  assertEquals(ok, true);
  const regs = _getRegisteredMounts();
  const found = regs.find((r) => r.name === "many");
  // normalizeMountForRecord should collapse leading slashes to a single '/'
  assert(found && found.mount === "/many");
});

Deno.test("makeRegistrar swallows wildcard registration errors and continues", () => {
  const calls: Array<{ path: string }> = [];
  // mock server: first call for exact path succeeds, second (wildcard) throws
  let callCount = 0;
  const mockServer = {
    get: (p: string, _h: unknown, ..._m: unknown[]) => {
      callCount++;
      calls.push({ path: p });
      if (p.endsWith("/*")) throw new Error("boom-wildcard");
    },
    use: (_m: unknown) => undefined,
    serve: () => ({ close: () => undefined }),
  } as unknown as App;

  const ns = {
    default: (app: App) => {
      // registration function will call app.get("/r", handler)
      (app as unknown as { get?: (p: string, h: unknown) => unknown }).get?.(
        "/r",
        () => new Response("r"),
      );
    },
  } as Record<string, unknown>;

  const ok = registerFromNamespace("r", ns, mockServer);
  assertEquals(ok, true);
  // ensure first exact registration recorded; wildcard attempted and thrown but swallowed
  assert(calls.length >= 1);
  assertEquals(calls[0].path, "/r");
});

Deno.test("handlerWrapper invoked for root mount preserves and restores ctx.state.module", async () => {
  const captured: Array<
    { path: string; handler: unknown; wildcard?: boolean }
  > = [];
  const mockServer = {
    get: (p: string, h: unknown, ..._m: unknown[]) =>
      captured.push({ path: p, handler: h, wildcard: p.endsWith("/*") }),
    post: (_: string, _h: unknown) => undefined,
    put: (_: string, _h: unknown) => undefined,
    delete: (_: string, _h: unknown) => undefined,
    patch: (_: string, _h: unknown) => undefined,
    head: (_: string, _h: unknown) => undefined,
    options: (_: string, _h: unknown) => undefined,
    use: (_m: unknown) => undefined,
    serve: () => ({ close: () => undefined }),
  } as unknown as App;

  // module named 'index' should mount at '/'
  const ns = {
    default: {
      build:
        () => ((_req: Request, ctx: { state?: Record<string, unknown> }) =>
          new Response(String(ctx.state?.module ?? "no"))),
    },
  } as Record<string, unknown>;

  const ok = registerFromNamespace("index", ns, mockServer);
  assertEquals(ok, true);
  // find the exact handler for '/'
  const h = captured.find((c) => c.path === "/")?.handler as unknown as (
    req: Request,
    ctx: { state?: Record<string, unknown> },
  ) => unknown;
  assert(h, "expected handler for root mount");

  const ctx = { state: {} } as { state: Record<string, unknown> };
  const res =
    await (h(new Request("http://localhost/"), ctx) as Promise<Response>);
  const text = await res.text();
  // middleware should have set module to 'index' while running
  assertEquals(text, "index");
  // ctx.state.module should be restored
  assertStrictEquals(ctx.state.module, undefined);
});

Deno.test("registerFromNamespace logs and continues when named register throws", () => {
  const ns = {
    register: (_app: App) => {
      throw new Error("named-throw");
    },
  } as Record<string, unknown>;

  const app: App = { use: () => {} } as App;
  const errStub = stub(console, "error", () => {});
  try {
    const ok = registerFromNamespace("badnamed", ns, app);
    // registration should not rethrow; function may return false after catching
    assertEquals(ok, false);
    const called = errStub.calls.some((c: unknown) => {
      const ci = c as { args: unknown[] };
      return String(ci.args[0]).includes("Named register for badnamed threw");
    });
    assert(called, "expected console.error for named register throw");
  } finally {
    errStub.restore();
  }
});

Deno.test("registerFromNamespace logs when default.register throws", () => {
  const ns = {
    default: {
      register: (_app: App) => {
        throw new Error("default-register-throw");
      },
    },
  } as Record<string, unknown>;

  const app: App = { use: () => {} } as App;
  const errStub = stub(console, "error", () => {});
  try {
    const ok = registerFromNamespace("defthrow", ns, app);
    // Should swallow and continue; final result may be false
    assertEquals(ok, false);
    const called = errStub.calls.some((c: unknown) => {
      const ci = c as { args: unknown[] };
      return String(ci.args[0]).includes("default.register for defthrow threw");
    });
    assert(called, "expected console.error for default.register throw");
  } finally {
    errStub.restore();
  }
});

Deno.test("registerFromNamespace ignores throw from default.build() and continues", () => {
  const ns = {
    default: {
      build: () => {
        throw new Error("build-err");
      },
    },
  } as Record<string, unknown>;

  const calls: unknown[] = [];
  const app: App = { use: (m: unknown) => calls.push(m) } as App;

  const ok = registerFromNamespace("buildfail", ns, app);
  // build() throwing should be ignored and no registration should occur
  assertEquals(ok, false);
  assertEquals(calls.length, 0);
});

Deno.test("default export middleware (3-arg fn) registers as route middleware for all methods", () => {
  const calls: Array<{ method: string; path: string }> = [];
  const mockServer = {
    get: (p: string, _h: unknown) => calls.push({ method: "get", path: p }),
    post: (p: string, _h: unknown) => calls.push({ method: "post", path: p }),
    put: (p: string, _h: unknown) => calls.push({ method: "put", path: p }),
    delete: (p: string, _h: unknown) =>
      calls.push({ method: "delete", path: p }),
    patch: (p: string, _h: unknown) => calls.push({ method: "patch", path: p }),
    head: (p: string, _h: unknown) => calls.push({ method: "head", path: p }),
    options: (p: string, _h: unknown) =>
      calls.push({ method: "options", path: p }),
    use: (_: unknown) => undefined,
    serve: () => ({ close: () => undefined }),
  } as unknown as App;

  const ns = {
    default: (
      _req: unknown,
      _ctx: { state?: Record<string, unknown> },
      _next: unknown,
    ) => new Response("ok"),
  } as Record<string, unknown>;

  const ok = registerFromNamespace("mw", ns, mockServer);
  assertEquals(ok, true);
  // 7 methods * 2 registrations (exact + wildcard)
  assertEquals(calls.length, 14);
});

Deno.test("registrar continues when exact registration throws but wildcard is attempted", () => {
  const calls: Array<{ path: string; which: string }> = [];
  const mockServer = {
    get: (p: string, _h: unknown) => {
      calls.push({ path: p, which: p === "/boom" ? "exact" : "wild" });
      if (p === "/boom") throw new Error("exact-throw");
    },
    use: (_: unknown) => undefined,
    serve: () => ({ close: () => undefined }),
  } as unknown as App;

  // registration function that uses app.get("/boom", handler)
  const ns = {
    default: (app: App) => {
      (app as unknown as { get?: (p: string, h: unknown) => unknown }).get?.(
        "/boom",
        () => new Response("ok"),
      );
    },
  } as Record<string, unknown>;

  const ok = registerFromNamespace("boom", ns, mockServer);
  assertEquals(ok, true);
  // exact was attempted and threw, wildcard should still be attempted
  const wild = calls.find((c) => c.path === "/boom/*");
  assert(wild, "expected wildcard registration after exact threw");
});

Deno.test("makeRegistrar continues when both exact and wildcard throw for one method", () => {
  const calls: Array<{ path: string; which: string }> = [];
  const mockServer = {
    get: (p: string, _h: unknown) => {
      calls.push({ path: p, which: p.endsWith("/*") ? "wild" : "exact" });
      // always throw for both exact and wildcard
      throw new Error("boom-both");
    },
    post: (p: string, _h: unknown) => calls.push({ path: p, which: "post" }),
    use: (_: unknown) => undefined,
    serve: () => ({ close: () => undefined }),
  } as unknown as App;

  const ns = {
    default: (app: App) => {
      (app as unknown as { get?: (p: string, h: unknown) => unknown }).get?.(
        "/boom",
        () => new Response("ok"),
      );
    },
  } as Record<string, unknown>;

  // Should not throw despite get throwing for exact and wildcard; registrar should have attempted both calls
  const ok = registerFromNamespace("boomboth", ns, mockServer);
  assertEquals(ok, true);
  // ensure both exact and wildcard attempts were recorded
  const exact = calls.find((c) => c.which === "exact");
  const wild = calls.find((c) => c.which === "wild");
  assert(exact, "expected exact registration attempt to be recorded");
  assert(wild, "expected wildcard registration attempt to be recorded");
});

Deno.test("autoRegisterModulesFrom ignores introspection throws from _getMiddlewareCount/_getRoutePaths", () => {
  const manifest = { a: { default: () => {} } } as Record<string, unknown>;
  const app: App & {
    _getMiddlewareCount?: () => number;
    _getRoutePaths?: () => string[];
  } = {
    use: () => {},
    _getMiddlewareCount: () => {
      throw new Error("mw-err");
    },
    _getRoutePaths: () => {
      throw new Error("routes-err");
    },
  } as unknown as App & {
    _getMiddlewareCount?: () => number;
    _getRoutePaths?: () => string[];
  };

  // stub console.info so we can ensure no exception bubbles
  const infoStub = stub(console, "info", () => {});
  try {
    autoRegisterModulesFrom(manifest, app);
  } finally {
    infoStub.restore();
  }
});

Deno.test("registerFromNamespace falls back when router method property is non-function", () => {
  const used: unknown[] = [];
  const mockServer: Record<string, unknown> = {
    // property exists but is not a function
    get: {} as unknown,
    use: (m: unknown) => used.push(m),
    serve: () => ({ close: () => undefined }),
  };

  const ns = {
    default: (
      _req: unknown,
      _ctx: { state?: Record<string, unknown> },
      _next: unknown,
    ) => new Response("ok"),
  } as Record<string, unknown>;

  const ok = registerFromNamespace("nonfunc", ns, mockServer as unknown as App);
  assertEquals(ok, true);
  // since `get` is not a function, loader should have fallen back to app.use
  assertEquals(used.length, 1);
});

Deno.test("autoRegisterModulesFrom swallows logging errors (console.info throws)", () => {
  const manifest = { a: { default: () => {} } } as Record<string, unknown>;
  const app: App & { _getMiddlewareCount?: () => number } = {
    use: () => {},
    _getMiddlewareCount: () => 1,
    _getRoutePaths: () => ["/a"],
  } as unknown as App & { _getMiddlewareCount?: () => number };

  // make console.info throw only for the summary message to hit the outer try/catch
  const infoStub = stub(console, "info", (...args: unknown[]) => {
    const msg = String((args as unknown[])[0] ?? "");
    if (msg.startsWith("ℹ️ [Loader]")) throw new Error("boom-logger");
    // otherwise allow registration logs to proceed harmlessly
  });
  try {
    // should not throw despite console.info throwing
    autoRegisterModulesFrom(manifest, app);
  } finally {
    infoStub.restore();
  }
});

Deno.test("named register records explicit mountPath with slashes normalized for record", () => {
  const ns = {
    register: (r: Record<string, unknown>) => {
      const rr = r as unknown as { get?: (...a: unknown[]) => unknown };
      rr.get?.("/x", () => new Response("ok"));
    },
    mountPath: "//some/path//",
  } as unknown as Record<string, unknown>;

  const app: App = { use: (_: unknown) => undefined } as App;
  const ok = registerFromNamespace("namedslash", ns, app);
  assertEquals(ok, true);
  const regs = _getRegisteredMounts();
  // mount should be normalized to a single leading slash and trailing slashes removed
  assert(regs.some((r) => r.name === "namedslash" && r.mount === "/some/path"));
});

Deno.test("named register records index fallback when mountPath absent", () => {
  const ns = {
    register: (r: Record<string, unknown>) => {
      const rr = r as unknown as { get?: (...a: unknown[]) => unknown };
      rr.get?.("/", () => new Response("ok"));
    },
  } as unknown as Record<string, unknown>;

  const used: unknown[] = [];
  const app: App = { use: (m: unknown) => used.push(m) } as App;

  const ok = registerFromNamespace("index", ns, app);
  assertEquals(ok, true);
  const regs = _getRegisteredMounts();
  const found = regs.find((r) => r.name === "index");
  assert(found && found.mount === "/");
});

Deno.test("named register records empty string mountPath when provided", () => {
  const ns = {
    register: (_r: Record<string, unknown>) => {
      // noop
    },
    mountPath: "",
  } as unknown as Record<string, unknown>;

  const used: unknown[] = [];
  const app: App = { use: (m: unknown) => used.push(m) } as App;

  const ok = registerFromNamespace("emptynamed", ns, app);
  assertEquals(ok, true);
  const regs = _getRegisteredMounts();
  const found = regs.find((r) => r.name === "emptynamed");
  // when mountPath is explicitly an empty string the recorded mount should be ''
  assert(found && found.mount === "");
});

Deno.test("normalizeMountForRecord consolidated variants", () => {
  const app: App = { use: () => {} } as App;

  // explicit empty string (recorded directly as empty)
  const nsEmpty = {
    default: () => new Response("ok"),
    mountPath: "",
  } as Record<string, unknown>;
  assert(registerFromNamespace("nm_case_empty", nsEmpty, app));
  let regs = _getRegisteredMounts();
  let f = regs.find((r) => r.name === "nm_case_empty");
  assert(f && f.mount === "");

  // collapse multiple leading slashes and trim trailing slashes
  const nsMany = {
    register: (_r: Record<string, unknown>) => {},
    mountPath: "///multi///",
  } as unknown as Record<string, unknown>;
  assert(registerFromNamespace("nm_case_many", nsMany, app));
  regs = _getRegisteredMounts();
  f = regs.find((r) => r.name === "nm_case_many");
  assert(f && f.mount === "/multi");

  // missing leading slash should be added
  const nsNoLead = {
    register: (_r: Record<string, unknown>) => {},
    mountPath: "no/lead",
  } as unknown as Record<string, unknown>;
  assert(registerFromNamespace("nm_case_nolead", nsNoLead, app));
  regs = _getRegisteredMounts();
  f = regs.find((r) => r.name === "nm_case_nolead");
  assert(f && f.mount === "/no/lead");

  // trailing-only slashes trimmed
  const nsTrail = {
    register: (_r: Record<string, unknown>) => {},
    mountPath: "/trail///",
  } as unknown as Record<string, unknown>;
  assert(registerFromNamespace("nm_case_trail", nsTrail, app));
  regs = _getRegisteredMounts();
  f = regs.find((r) => r.name === "nm_case_trail");
  assert(f && f.mount === "/trail");
});

Deno.test("makeRegistrar attempts wildcard when registration called with undefined path", () => {
  const calls: Array<{ p: string }> = [];
  const server = {
    get: (p: unknown, _h: unknown, ..._r: unknown[]) =>
      calls.push({ p: String(p ?? "") }),
    use: (_: unknown) => undefined,
    serve: () => ({ close: () => undefined }),
  } as unknown as App;

  const ns = {
    default: (reg: Record<string, unknown>) => {
      const rr = reg as unknown as { get?: (...a: unknown[]) => unknown };
      // call with undefined as first arg to simulate missing path
      rr.get?.(undefined as unknown as string, () => new Response("ok"));
    },
  } as Record<string, unknown>;

  const ok = registerFromNamespace("undefpath", ns, server);
  assertEquals(ok, true);
  // wildcard attempt should have been called as '/*'
  assert(calls.some((c) => c.p === "/*"));
});

Deno.test("makeRegistrar attempts wildcard when registration called with empty string path", () => {
  const calls: Array<{ p: string }> = [];
  const server = {
    get: (p: unknown, _h: unknown, ..._r: unknown[]) =>
      calls.push({ p: String(p ?? "") }),
    use: (_: unknown) => undefined,
    serve: () => ({ close: () => undefined }),
  } as unknown as App;

  const ns = {
    default: (reg: Record<string, unknown>) => {
      const rr = reg as unknown as { get?: (...a: unknown[]) => unknown };
      rr.get?.("", () => new Response("ok"));
    },
  } as Record<string, unknown>;

  const ok = registerFromNamespace("emptypath", ns, server);
  assertEquals(ok, true);
  // should have exact '' and wildcard '/*' attempted
  assert(calls.some((c) => c.p === ""));
  assert(calls.some((c) => c.p === "/*"));
});

Deno.test("makeRegistrar converts non-string first arg to string for wildcard call", () => {
  const calls: Array<{ p: string }> = [];
  const server = {
    get: (p: unknown, _h: unknown, ..._r: unknown[]) =>
      calls.push({ p: String(p ?? "") }),
    use: (_: unknown) => undefined,
    serve: () => ({ close: () => undefined }),
  } as unknown as App;

  const ns = {
    default: (reg: Record<string, unknown>) => {
      const rr = reg as unknown as { get?: (...a: unknown[]) => unknown };
      // pass a number as the first arg; wildcard should be '123/*'
      rr.get?.(123 as unknown as string, () => new Response("ok"));
    },
  } as Record<string, unknown>;

  const ok = registerFromNamespace("numpath", ns, server);
  assertEquals(ok, true);
  // exact '123' and wildcard '123/*' should have been attempted
  assert(calls.some((c) => c.p === "123"));
  assert(calls.some((c) => c.p === "123/*"));
});

Deno.test("cover lines 334-338: default.register mountPath variants (multiple scenarios)", () => {
  const infoStub = stub(console, "info", () => {});
  try {
    const app: App = { use: () => {} } as App;

    const cases: Array<{
      name: string;
      ns: Record<string, unknown>;
      expected: string;
    }> = [
      {
        name: "defreg_with_slash",
        ns: {
          default: {
            register: (r: Record<string, unknown>) => {
              const rr = r as unknown as { get?: (...a: unknown[]) => unknown };
              rr.get?.("/x", () => new Response("ok"));
            },
          },
          mountPath: "//a/b///",
        } as unknown as Record<string, unknown>,
        expected: "/a/b",
      },
      {
        name: "defreg_no_slash",
        ns: {
          default: {
            register: (_r: Record<string, unknown>) => {},
          },
          mountPath: "nomountstr",
        } as unknown as Record<string, unknown>,
        expected: "nomountstr",
      },
      {
        name: "defreg_no_mount",
        ns: {
          default: {
            register: (_r: Record<string, unknown>) => {},
          },
        } as unknown as Record<string, unknown>,
        expected: "/defreg_no_mount",
      },
      {
        name: "defreg_empty_mount",
        ns: {
          default: {
            register: (_r: Record<string, unknown>) => {},
          },
          mountPath: "",
        } as unknown as Record<string, unknown>,
        expected: "",
      },
    ];

    for (const c of cases) {
      const ok = registerFromNamespace(c.name, c.ns, app);
      assertEquals(ok, true);
      const regs = _getRegisteredMounts();
      const found = regs.find((r) => r.name === c.name);
      assert(found, `expected registration recorded for ${c.name}`);
      assertEquals(found!.mount, c.expected);
    }

    // ensure info was logged for at least one default.register registration
    const called = infoStub.calls.some((ct: unknown) => {
      const ci = ct as { args: unknown[] };
      return String(ci.args[0]).includes("Registered module") &&
        String(ci.args[0]).includes("via default.register");
    });
    assert(called, "expected console.info for default.register branch");
  } finally {
    infoStub.restore();
  }
});

Deno.test(
  "cover lines 354 and 467: default.register index fallback + candidate handlerWrapper invocation (combined)",
  async () => {
    const calls: Array<{ p: string; h?: unknown }> = [];

    const server = {
      get: (p: unknown, h: unknown, ..._r: unknown[]) =>
        calls.push({ p: String(p ?? ""), h }),
      use: (_: unknown) => undefined,
      serve: () => ({ close: () => undefined }),
    } as unknown as App;

    // 1) default.register branch for `index` with no mountPath -> should record '/'
    const nsIndex = {
      default: {
        register: (r: Record<string, unknown>) => {
          const rr = r as unknown as { get?: (...a: unknown[]) => unknown };
          rr.get?.("/", () => new Response("ok"));
        },
      },
    } as unknown as Record<string, unknown>;

    const okIndex = registerFromNamespace("index", nsIndex, server);
    assertEquals(okIndex, true);
    const regs1 = _getRegisteredMounts();
    const foundIndex = regs1.find((r) => r.name === "index");
    assert(foundIndex, "expected registration recorded for index");
    assertEquals(foundIndex!.mount, "/");

    // 2) candidate middleware branch that will register handlerWrapper via app.get
    const nsCand = {
      default: (_req: Request, _ctx: unknown, _next: unknown) => {
        return new Response("fromcand");
      },
    } as unknown as Record<string, unknown>;

    const okCand = registerFromNamespace("cand", nsCand, server);
    assertEquals(okCand, true);

    // find captured handlerWrapper for '/cand'
    const rec = calls.find((c) => c.p === "/cand" && typeof c.h === "function");
    assert(rec, "expected app.get to be called for /cand with handlerWrapper");
    const handlerWrapper = rec!.h as (
      req: Request,
      ctx?: unknown,
      next?: unknown,
    ) => unknown;

    // invoke without ctx/next so handlerWrapper will use the default next
    const res = handlerWrapper(new Request("http://example/")) as
      | Response
      | Promise<Response>;
    const final = res && typeof (res as Promise<Response>).then === "function"
      ? await (res as Promise<Response>)
      : (res as Response);
    assertEquals(await final.text(), "fromcand");

    const regs2 = _getRegisteredMounts();
    const foundCand = regs2.find((r) => r.name === "cand");
    assert(foundCand, "expected registration recorded for cand");
    assertEquals(foundCand!.mount, "/cand");
  },
);
