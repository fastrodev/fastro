import { assertEquals } from "@std/assert";
import { createKvMiddleware } from "./kv.ts";
import { Context } from "../../core/types.ts";

Deno.test("kvMiddleware - sets kv in context", async () => {
  const middleware = createKvMiddleware(":memory:");
  const req = new Request("http://localhost");
  const ctx = {} as Context;
  let nextCalled = false;
  const next = () => {
    nextCalled = true;
    return Promise.resolve(new Response());
  };

  await middleware(req, ctx, next);

  assertEquals(nextCalled, true);
  const kv = ctx.kv as Deno.Kv;
  assertEquals(typeof kv.get, "function");
  // Exercise set/get/delete for in-memory KV
  // @ts-ignore: memory KV may be a partial implementation
  await kv.set(["test-key"], { hello: "world" });
  // @ts-ignore: mem KV implementation is partial and not fully typed
  const res = await kv.get(["test-key"]);
  // @ts-ignore: res.value typing is unknown for in-memory KV
  assertEquals(
    res.value && (res.value as Record<string, unknown>).hello,
    "world",
  );
  // @ts-ignore: mem KV implementation is partial and not fully typed
  await kv.delete(["test-key"]);
  // @ts-ignore: mem KV implementation is partial and not fully typed
  const res2 = await kv.get(["test-key"]);
  // @ts-ignore: res2.value typing is unknown for in-memory KV
  assertEquals(res2.value, null);

  // Clean up
  await kv.close();
});

Deno.test("kvMiddleware - reuses cached kv promise", async () => {
  const middleware = createKvMiddleware(":memory:");
  const req = new Request("http://localhost");
  const ctx1 = {} as Context;
  const ctx2 = {} as Context;
  const next = () => Promise.resolve(new Response());

  await middleware(req, ctx1, next);
  const kv1 = ctx1.kv as Deno.Kv;

  await middleware(req, ctx2, next);
  const kv2 = ctx2.kv as Deno.Kv;

  assertEquals(kv1 === kv2, true);
  // Exercise methods on reused kv
  // @ts-ignore: mem KV is Partial<Deno.Kv> for tests
  await kv1.set(["reused"], 123);
  // @ts-ignore: mem KV is Partial<Deno.Kv> for tests
  const r = await kv2.get(["reused"]);
  // @ts-ignore: returned value typing is not strict for in-memory KV
  assertEquals(r.value, 123);

  // Clean up
  await kv1.close();
});

Deno.test("kvMiddleware - handles missing Deno.openKv", async () => {
  const originalOpenKv = Deno.openKv;
  const originalConsoleWarn = console.warn;
  let warnCalled = false;
  console.warn = () => {
    warnCalled = true;
  };

  try {
    // @ts-ignore: mocking global
    Deno.openKv = undefined;

    const middleware = createKvMiddleware();
    const req = new Request("http://localhost");
    const ctx = {} as Context;
    let nextCalled = false;
    const next = () => {
      nextCalled = true;
      return Promise.resolve(new Response());
    };

    await middleware(req, ctx, next);

    assertEquals(nextCalled, true);
    assertEquals(warnCalled, true);
    assertEquals(ctx.kv, undefined);
  } finally {
    Deno.openKv = originalOpenKv;
    console.warn = originalConsoleWarn;
  }
});

Deno.test("kvMiddleware - uses Deno.openKv when available", async () => {
  const originalOpenKv = Deno.openKv;
  try {
    let calledWith: string | undefined = undefined;
    const mockKv: Deno.Kv = {
      get: (k: unknown) => Promise.resolve({ key: k, value: null }),
      set: (k: unknown, _v: unknown) => Promise.resolve({ key: k }),
      delete: (k: unknown) => Promise.resolve({ key: k }),
      close: () => Promise.resolve(),
    } as unknown as Deno.Kv;
    Deno.openKv = ((p?: string) => {
      calledWith = p;
      return Promise.resolve(mockKv);
    }) as typeof Deno.openKv;

    const middleware = createKvMiddleware("my-db");
    const req = new Request("http://localhost");
    const ctx = {} as Context;
    const next = () => Promise.resolve(new Response());

    await middleware(req, ctx, next);
    const kv = ctx.kv as Deno.Kv;
    assertEquals(kv, mockKv);
    assertEquals(calledWith, "my-db");

    // Ensure cached promise is reused
    const ctx2 = {} as Context;
    await middleware(req, ctx2, next);
    assertEquals(ctx2.kv, mockKv);
  } finally {
    Deno.openKv = originalOpenKv;
  }
});
