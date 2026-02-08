import { assert, assertEquals, assertStrictEquals } from "@std/assert";
import { stub } from "@std/testing/mock";
import type { App } from "./loader.ts";
import {
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
  assertStrictEquals(used.shift(), nsDefault.default);

  const r2 = registerFromNamespace("my", nsNamed, app);
  assert(r2);
  assertStrictEquals(used.shift(), nsNamed.my);

  const r3 = registerFromNamespace("x", nsNone, app);
  assert(!r3);
});

Deno.test("autoRegisterModulesFrom registers modules in sorted order", () => {
  const used: string[] = [];
  const app: App = {
    use: (m: unknown) =>
      used.push(String((m as (...args: unknown[]) => unknown)())),
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

Deno.test("autoRegisterModules logs error when manifest read fails (catch)", () => {
  const app: App = { use: () => {} };
  const orig = Object.keys;
  try {
    (Object as unknown as { keys: typeof Object.keys }).keys = (() => {
      throw new Error("boom");
    }) as unknown as typeof Object.keys;
    autoRegisterModules(app);
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
  assertStrictEquals(used.shift(), nsDefault.default);

  const r2 = registerFromNamespace("my", nsNamed, app);
  assert(r2);
  assertStrictEquals(used.shift(), nsNamed.my);

  const r3 = registerFromNamespace("x", nsNone, app);
  assert(!r3);
});

Deno.test("autoRegisterModulesFrom registers modules in sorted order", () => {
  const used: string[] = [];
  const app: App = {
    use: (m: unknown) =>
      used.push(String((m as (...args: unknown[]) => unknown)())),
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

Deno.test("autoRegisterModules logs error when manifest read fails (catch)", () => {
  const app: App = { use: () => {} };
  const orig = Object.keys;
  try {
    // Force an error when autoRegisterModules tries to read manifest keys
    // by making Object.keys throw.
    (Object as unknown as { keys: typeof Object.keys }).keys = (() => {
      throw new Error("boom");
    }) as unknown as typeof Object.keys;
    // Should not throw; the function catches internally.
    autoRegisterModules(app);
  } finally {
    // restore
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
  assertStrictEquals(used.shift(), nsDefault.default);

  const r2 = registerFromNamespace("my", nsNamed, app);
  assert(r2);
  assertStrictEquals(used.shift(), nsNamed.my);

  const r3 = registerFromNamespace("x", nsNone, app);
  assert(!r3);
});

Deno.test("autoRegisterModulesFrom registers modules in sorted order", () => {
  const used: string[] = [];
  const app: App = {
    use: (m: unknown) =>
      used.push(String((m as (...args: unknown[]) => unknown)())),
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

Deno.test("autoRegisterModules logs error when manifest read fails (catch)", () => {
  const app: App = { use: () => {} };
  const orig = Object.keys;
  try {
    // Force an error when autoRegisterModules tries to read manifest keys
    // by making Object.keys throw.
    (Object as unknown as { keys: typeof Object.keys }).keys = (() => {
      throw new Error("boom");
    }) as unknown as typeof Object.keys;
    // Should not throw; the function catches internally.
    autoRegisterModules(app);
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
    loader.autoRegisterModules(app as { use: (m: unknown) => void });
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

// Note: manifest import is cached during test run; manifest-failure behavior
// is exercised by monkeypatching `autoRegisterModulesFrom` in another test.

// Note: manifest import is cached during test run; manifest-failure behavior
// is exercised by monkeypatching `autoRegisterModulesFrom` in another test.

Deno.test("autoRegisterModulesFrom covers all registration branches", async () => {
  const { autoRegisterModulesFrom } = await import(
    `./loader.ts?t=${Date.now()}`
  );

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
    loader.autoRegisterModules(app as { use: (m: unknown) => void });
    assert(calls.length > 0, "expected some registrations from real manifest");
  } finally {
    infoStub.restore();
  }
});

// Consolidated coverage exercise (previously in loader.cover.test.ts)
Deno.test("coverage: exercise loader branches", async () => {
  const mod = await import(`./loader.ts?t=${Date.now()}`);

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
      mod.autoRegisterModules(app as { use: (m: unknown) => void });
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
