import { assert, assertEquals } from "@std/assert";

import { autoRegisterModules } from "./loader.ts";

Deno.test("loader registers default and named exports from manifest", async () => {
  const manifestPath = new URL("../manifest.ts", import.meta.url).pathname;
  const tmpDir = new URL("../modules_test_tmp", import.meta.url).pathname;
  const defDir = `${tmpDir}/def`;
  const namedDir = `${tmpDir}/named`;
  const badDir = `${tmpDir}/bad`;

  // Backup original manifest
  let orig: string | null = null;
  try {
    orig = await Deno.readTextFile(manifestPath);
  } catch {
    orig = null;
  }

  // Prepare test modules
  await Deno.mkdir(defDir, { recursive: true });
  await Deno.mkdir(namedDir, { recursive: true });
  await Deno.mkdir(badDir, { recursive: true });

  await Deno.writeTextFile(
    `${defDir}/mod.ts`,
    `export default function def_mw(_req, ctx, next) { ctx.__def = true; return next && next(); }\n`,
  );

  // named export (named same as folder)
  await Deno.writeTextFile(
    `${namedDir}/mod.ts`,
    `export function named(_req, ctx, next) { ctx.__named = true; return next && next(); }\n`,
  );

  // bad module: no callable exports
  await Deno.writeTextFile(`${badDir}/mod.ts`, `export const x = 1;\n`);

  try {
    const manifestContent = [];
    manifestContent.push(
      `export * as def from "./modules_test_tmp/def/mod.ts";`,
    );
    manifestContent.push(
      `export * as named from "./modules_test_tmp/named/mod.ts";`,
    );
    manifestContent.push(
      `export * as bad from "./modules_test_tmp/bad/mod.ts";`,
    );
    await Deno.writeTextFile(manifestPath, manifestContent.join("\n") + "\n");

    // Import manifest with cache-bust so we exercise fresh content
    const manifestHref =
      new URL(`../manifest.ts?cb=${Date.now()}`, import.meta.url).href;
    const manifest = await import(manifestHref);
    // Ensure keys exist
    assertEquals(Object.keys(manifest).sort(), ["bad", "def", "named"].sort());

    // Run loader to register middlewares
    const used: unknown[] = [];
    const app = {
      use(m: unknown) {
        used.push(m);
      },
    };
    await autoRegisterModules(app);

    // Expect that def (default) and named (named export) were registered.
    assert(used.length >= 2);
  } finally {
    // restore original manifest
    if (orig === null) {
      try {
        await Deno.remove(manifestPath);
      } catch { /* ignore */ }
    } else {
      await Deno.writeTextFile(manifestPath, orig);
    }
  }
});

Deno.test("loader handles empty manifest export and fallback errors", async () => {
  const manifestPath = new URL("../manifest.ts", import.meta.url).pathname;
  // backup
  let orig: string | null = null;
  try {
    orig = await Deno.readTextFile(manifestPath);
  } catch {
    orig = null;
  }

  // write manifest with an `empty` export that is undefined
  await Deno.writeTextFile(manifestPath, `export const empty = undefined;\n`);

  try {
    // call loader to exercise `!ns` branch (empty/invalid export)
    await autoRegisterModules({ use(_m: unknown) {} });
  } finally {
    if (orig === null) {
      try {
        await Deno.remove(manifestPath);
      } catch { /* ignore */ }
    } else await Deno.writeTextFile(manifestPath, orig);
  }
});

Deno.test("loader fallback: readDir failure and module import failure", async () => {
  // 1) Non-existent modules dir -> readDir throws and loader returns
  await autoRegisterModules(
    { use(_m: unknown) {} },
    "/no/such/modules/dir",
    true,
  );

  // 2) Module import failure: create a temp modules dir with a module that throws
  const tmpDir = new URL("../modules_test_tmp", import.meta.url).pathname;
  const failDir = `${tmpDir}/broken`;
  await Deno.mkdir(failDir, { recursive: true });
  await Deno.writeTextFile(
    `${failDir}/mod.ts`,
    `throw new Error('module import fail (test)');\n`,
  );

  const used: unknown[] = [];
  await autoRegisterModules(
    {
      use(m: unknown) {
        used.push(m);
      },
    },
    tmpDir,
    true,
  );
  // broken module should not have registered a middleware
  assert(used.length === 0);
});

Deno.test("loader debug logs when FASTRO_LOG_LOADER=true", async () => {
  const orig = Deno.env.get("FASTRO_LOG_LOADER");
  Deno.env.set("FASTRO_LOG_LOADER", "true");
  try {
    await autoRegisterModules(
      { use(_m: unknown) {} },
      "/no/such/modules/dir",
      true,
    );
  } finally {
    if (orig === undefined) Deno.env.delete("FASTRO_LOG_LOADER");
    else Deno.env.set("FASTRO_LOG_LOADER", orig);
  }
});

Deno.test("loader throws in production when manifest missing", async () => {
  const manifestPath = new URL("../manifest.ts", import.meta.url).pathname;
  // backup and write a manifest that throws at import time so the import fails
  let origManifest: string | null = null;
  try {
    origManifest = await Deno.readTextFile(manifestPath);
  } catch {
    // ignore if manifest did not exist
    origManifest = null;
  }
  await Deno.writeTextFile(
    manifestPath,
    `throw new Error('manifest import fail (test)');\n`,
  );

  // set production env
  const origEnv = Deno.env.get("FASTRO_ENV");
  Deno.env.set("FASTRO_ENV", "production");

  try {
    let threw = false;
    try {
      // Force the loader to skip static manifest import so the code
      // path that handles a missing manifest is exercised in-process.
      await autoRegisterModules({ use(_m: unknown) {} }, undefined, true);
    } catch (e) {
      threw = true;
      assert(e instanceof Error);
    }
    assert(
      threw,
      "expected autoRegisterModules to throw when manifest import fails in production",
    );
  } finally {
    // restore env
    if (origEnv === undefined) Deno.env.delete("FASTRO_ENV");
    else Deno.env.set("FASTRO_ENV", origEnv);
    // restore manifest
    if (origManifest === null) {
      try {
        await Deno.remove(manifestPath);
      } catch { /* ignore */ }
    } else {
      await Deno.writeTextFile(manifestPath, origManifest);
    }
  }
});
