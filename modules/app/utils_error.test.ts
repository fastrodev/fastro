import { assertEquals } from "https://deno.land/std@0.210.0/assert/mod.ts";
import { _resetVersionCacheForTests, getVersion } from "./utils.ts";

Deno.test("utils - getVersion error fallback", async () => {
  _resetVersionCacheForTests();
  // Move version.json temporarily to trigger catch
  const versionPath = new URL("../../version.json", import.meta.url).pathname;
  const tempPath = versionPath + ".bak";

  try {
    await Deno.rename(versionPath, tempPath);
    // Use a fresh call, but wait, it might be cached?
    // Actually the version is not cached in a variable in utils.ts,
    // it's read every time (unless I missed it).
    const version = await getVersion();
    assertEquals(version, "v1.0.0");
  } finally {
    try {
      await Deno.rename(tempPath, versionPath);
    } catch (_e) {
      // already restored or failed
    }
  }
});
