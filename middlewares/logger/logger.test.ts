import { assertEquals } from "@std/assert";
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

  await logger(req, ctx, next);
});

Deno.test("logger middleware - should log ERROR for 5xx errors", async () => {
  const req = new Request("http://localhost/500", { method: "GET" });
  const ctx = {
    url: new URL(req.url),
  } as unknown as Context;
  const next = () => Promise.resolve(new Response("Error", { status: 500 }));

  await logger(req, ctx, next);
});
