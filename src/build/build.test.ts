import { build } from "./build.ts";
import { assertEquals } from "std/assert/assert_equals.ts";

Deno.test(
  {
    permissions: { env: true, read: true, write: true, run: true },
    name: "build",
    async fn() {
      const r = await build("");
      assertEquals(r, undefined);
    },
    sanitizeResources: false,
    sanitizeOps: false,
    sanitizeExit: false,
  },
);
