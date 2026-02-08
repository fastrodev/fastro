import { assert, assertEquals } from "@std/assert";
import { stub } from "@std/testing/mock";

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
