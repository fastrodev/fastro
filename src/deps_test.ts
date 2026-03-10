import { assertEquals } from "jsr:@std/assert@^1.0.19";
import * as deps from "./deps.ts";

Deno.test("deps test - exports", () => {
  assertEquals(typeof deps.esbuild, "object");
  assertEquals(typeof deps.denoEsbuildPlugin, "object");
  assertEquals(typeof deps.stdPath, "object");
});
