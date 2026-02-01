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
