import { assertEquals } from "@std/assert";
import { index } from "./mod.ts";
import type { Context, Next } from "../../core/types.ts";

Deno.test("index middleware returns greeting on root", async () => {
  const req = new Request("http://example.com/");
  const ctx = {} as unknown as Context;
  const next: Next = () => new Response("next");

  const res =
    await (index as unknown as (
      req: Request,
      ctx: Context,
      next: Next,
    ) => Response)(req, ctx, next);
  const body = await res.text();
  assertEquals(body, "Hello from modules/index");
});

Deno.test("index middleware delegates to next for non-root paths", async () => {
  const req = new Request("http://example.com/foo");
  const ctx = {} as unknown as Context;
  const next: Next = () => new Response("delegated");

  const res =
    await (index as unknown as (
      req: Request,
      ctx: Context,
      next: Next,
    ) => Response)(req, ctx, next);
  const body = await res.text();
  assertEquals(body, "delegated");
});
