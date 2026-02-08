import { assert, assertEquals } from "https://deno.land/std@0.203.0/testing/asserts.ts";
import { stub } from "https://deno.land/std@0.203.0/testing/mock.ts";

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
