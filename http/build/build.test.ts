import { assertEquals } from "jsr:@std/assert@0.225.3/assert-equals";
import { build } from "./build.ts";

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
