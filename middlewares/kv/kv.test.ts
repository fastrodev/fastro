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
