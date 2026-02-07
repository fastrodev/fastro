import { assert, assertEquals } from "@std/assert";
import { stub } from "@std/testing/mock";
import { logger } from "./logger.ts";
import { Context } from "../../core/types.ts";

Deno.test("logger middleware - should call next and attach startTime", async () => {
  const req = new Request("http://localhost/test-path", { method: "GET" });

  // Mock context
  const ctx = {
    url: new URL(req.url),
  } as unknown as Context;

  let nextCalled = false;
  const mockResponse = new Response("ok");
  const next = () => {
    nextCalled = true;
    return Promise.resolve(mockResponse);
  };

  const result = await logger(req, ctx, next);

  assertEquals(nextCalled, true);
  assertEquals(result, mockResponse);

  // Verify state and startTime
  const state = ctx.state as Record<string, unknown>;
  assertEquals(typeof state.startTime, "number");
});

Deno.test("logger middleware - should preserve existing state", async () => {
  const req = new Request("http://localhost/test", { method: "POST" });
  const ctx = {
    url: new URL(req.url),
    state: { existing: "data" },
  } as unknown as Context;

  const next = () => Promise.resolve(new Response("ok"));

  await logger(req, ctx, next);

  const state = ctx.state as Record<string, unknown>;
  assertEquals(state.existing, "data");
  assertEquals(typeof state.startTime, "number");
});

Deno.test("logger middleware - should log WARN for 4xx errors", async () => {
  const req = new Request("http://localhost/404", { method: "GET" });
  const ctx = {
    url: new URL(req.url),
    remoteAddr: { hostname: "1.2.3.4" },
  } as unknown as Context;
  const next = () =>
    Promise.resolve(new Response("Not Found", { status: 404 }));

  const logStub = stub(console, "log", () => {});
  try {
    await logger(req, ctx, next);
    const msg = logStub.calls.at(-1)?.args[0] as string;
    assert(msg.includes("\x1b[33mWARN"), "Expected WARN color to appear");
    assert(msg.includes("\x1b[90m"), "Timestamp should be dimmed");
  } finally {
    logStub.restore();
  }
});

Deno.test("logger middleware - should log ERROR for 5xx errors", async () => {
  const req = new Request("http://localhost/500", { method: "GET" });
  const ctx = {
    url: new URL(req.url),
  } as unknown as Context;
  const next = () => Promise.resolve(new Response("Error", { status: 500 }));

  const logStub = stub(console, "log", () => {});
  try {
    await logger(req, ctx, next);
    const msg = logStub.calls.at(-1)?.args[0] as string;
    assert(msg.includes("\x1b[31mERROR"));
  } finally {
    logStub.restore();
  }
});

Deno.test("logger middleware - colors PUT/DELETE as blue", async () => {
  const req = new Request("http://localhost/patch", { method: "PATCH" });
  const ctx = { url: new URL(req.url) } as unknown as Context;
  const logStub = stub(console, "log", () => {});
  try {
    await logger(req, ctx, () => Promise.resolve(new Response("ok")));
    const msg = logStub.calls.at(-1)?.args[0] as string;
    assert(msg.includes("\x1b[34mPATCH"));
  } finally {
    logStub.restore();
  }
});
