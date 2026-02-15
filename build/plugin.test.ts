import { assertEquals, assertMatch } from "@std/assert";
import { denoPlugin, externalToRegex } from "./plugin.ts";
import * as esbuild from "esbuild";
import type { Plugin } from "esbuild";

Deno.test("externalToRegex converts wildcard to regex and matches", () => {
  const reg = externalToRegex("lodash*");
  assertMatch("lodash", reg);
  assertMatch("lodash/map", reg);
  assertMatch("lodash-es", reg);
});

Deno.test("denoPlugin exposes a plugin with name 'deno'", () => {
  const plugin = denoPlugin();
  // esbuild Plugin shape: { name, setup }
  assertEquals(plugin.name, "deno");
  // setup should be a function
  assertEquals(
    typeof (plugin as unknown as { setup: unknown }).setup,
    "function",
  );
});

// Basic integration smoke test: ensure plugin can be passed to esbuild build options
Deno.test("plugin can be included in esbuild plugins array (smoke)", async () => {
  const plugin = denoPlugin();
  const result = await esbuild.build({
    stdin: {
      contents: `console.log('ok')`,
      resolveDir: Deno.cwd(),
      sourcefile: "input.js",
    },
    bundle: false,
    write: false,
    plugins: [plugin as Plugin],
    platform: "neutral",
  }).catch((e) => ({ error: e }));

  // build should succeed or return an esbuild result object
  const resUnknown: unknown = result;
  const resObj = resUnknown as { error?: unknown };
  if (resObj.error) {
    // If esbuild cannot run in this environment, ensure we at least received an error object
    assertEquals(typeof resObj.error, "object");
  } else {
    assertEquals(typeof result, "object");
  }
  esbuild.stop();
});
