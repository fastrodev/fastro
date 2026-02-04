import { assertEquals } from "@std/assert";
import { getVersion } from "./utils.ts";

Deno.test("utils - getVersion cached and fallback", async () => {
  // First call might hit file or fallback
  const v1 = await getVersion();

  // Second call should definitely hit cache
  const v2 = await getVersion();
  assertEquals(v1, v2);
});
