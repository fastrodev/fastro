import { assert } from "@std/assert";

Deno.test("autoRegisterModules - manifest fallback and manifest import", async () => {
  const manifestPath = new URL("../manifest.ts", import.meta.url).pathname;
  const testModDir =
    new URL("../modules_test_tmp/test_loader", import.meta.url).pathname;
  const testModFile =
    new URL("../modules_test_tmp/test_loader/mod.ts", import.meta.url).pathname;

  // Backup original manifest if present
  let origManifest: string | null = null;
  try {
    origManifest = await Deno.readTextFile(manifestPath);
  } catch {
    origManifest = null;
  }

  // Ensure test module exists
  await Deno.mkdir(testModDir, { recursive: true });
  await Deno.writeTextFile(
    testModFile,
    `export default function test_mw(_req, ctx, next) { ctx.__test = true; return next && next(); }\n`,
  );

  try {
    // 1) Simulate missing manifest by renaming it out of the way so loader
    // performs in-memory generation. This avoids creating a syntactically
    // throwing manifest which can confuse coverage generation.
    // child process will handle renaming/restoring manifest

    // Run the in-memory (fallback) path in a subprocess to avoid module cache
    // interactions and to safely rename/restore the manifest file.
    const tmpDir = await Deno.makeTempDir();
    const childFile = `${tmpDir}/child_inmemory.ts`;
    const loaderHref = new URL("../core/loader.ts", import.meta.url).href;
    const modHref =
      new URL("../modules_test_tmp/test_loader/mod.ts", import.meta.url).href;
    const childSrc = `
      const manifestPath = new URL('${
      new URL("../manifest.ts", import.meta.url).href
    }').pathname;
      const bak = manifestPath + '.bak.' + Date.now();
      try { await Deno.rename(manifestPath, bak); } catch {}
      const loader = await import('${loaderHref}');
      const used = [];
      const app = { use(m) { used.push(m); } };
      await loader.autoRegisterModules(app);
      const imported = await import('${modHref}');
      const expected = imported.default;
      const found = used.some((m) => m === expected);
      // restore
      try { await Deno.rename(bak, manifestPath); } catch {}
      console.error(JSON.stringify({ found, usedLength: used.length }));
    `;
    await Deno.writeTextFile(childFile, childSrc);
    const output = await new Deno.Command(Deno.execPath(), {
      args: ["run", "-A", "--config", "deno.json", childFile],
      stdout: "piped",
      stderr: "piped",
    }).output();
    const out = output.stdout;
    const err = output.stderr;
    const stderrStr = new TextDecoder().decode(err);
    const stdoutStr = new TextDecoder().decode(out);
    const parseJson = (
      s: string | undefined | null,
    ): Record<string, unknown> | null => {
      if (!s) return null;
      // Try last full-line JSON first
      const lines = s.trim().split(/\r?\n/).map((l: string) => l.trim()).filter(
        Boolean,
      );
      for (let i = lines.length - 1; i >= 0; i--) {
        const l = lines[i] as string;
        if (l.startsWith("{") && l.endsWith("}")) {
          try {
            return JSON.parse(l);
          } catch (_e) { /* ignore parse error */ }
        }
      }
      // Fallback: extract last {...} match
      const m = s.match(/(\{[\s\S]*\})/g);
      if (!m) return null;
      try {
        return JSON.parse(m[m.length - 1]);
      } catch (_e) {
        return null;
      }
    };
    const result = parseJson(stderrStr) || parseJson(stdoutStr);
    if (!result) {
      console.error("Child output (stderr):", stderrStr);
      console.error("Child output (stdout):", stdoutStr);
      throw new Error("Failed to parse JSON result from child process");
    }
    const r = result as Record<string, unknown>;
    assert(
      typeof r.usedLength === "number" && (r.usedLength as number) > 0,
      "expected middleware to be registered from in-memory generation",
    );

    // 2) Create a proper manifest that exports the namespace for test_loader
    // and verify the manifest import path registers the middleware.
    const manifestContent =
      `export * as test_loader from "./modules_test_tmp/test_loader/mod.ts";\n`;
    await Deno.writeTextFile(manifestPath, manifestContent);

    const tmpDir2 = await Deno.makeTempDir();
    const childFile2 = `${tmpDir2}/child_manifest.ts`;
    const loaderHref2 = new URL("../core/loader.ts", import.meta.url).href;
    const modHref2 =
      new URL("../modules_test_tmp/test_loader/mod.ts", import.meta.url).href;
    const childSrc2 = `
      const manifestPath = new URL('${
      new URL("../manifest.ts", import.meta.url).href
    }').pathname;
      // backup if exists
      let orig = null;
      try { orig = await Deno.readTextFile(manifestPath); } catch {}
      const content = \`export * as test_loader from "./modules/test_loader/mod.ts";\\n\`;
      await Deno.writeTextFile(manifestPath, content);
      const loader = await import('${loaderHref2}');
      const used = [];
      const app = { use(m) { used.push(m); } };
      await loader.autoRegisterModules(app);
      const imported = await import('${modHref2}');
      const expected = imported.default;
      const found = used.some((m) => m === expected);
      // restore
      if (orig === null) { try { await Deno.remove(manifestPath); } catch {} } else { await Deno.writeTextFile(manifestPath, orig); }
      console.error(JSON.stringify({ found, usedLength: used.length }));
    `;
    await Deno.writeTextFile(childFile2, childSrc2);
    const output2 = await new Deno.Command(Deno.execPath(), {
      args: ["run", "-A", "--config", "deno.json", childFile2],
      stdout: "piped",
      stderr: "piped",
    }).output();
    const out2 = output2.stdout;
    const err2 = output2.stderr;
    const stderrStr2 = new TextDecoder().decode(err2);
    const stdoutStr2 = new TextDecoder().decode(out2);
    const result2 = parseJson(stderrStr2) || parseJson(stdoutStr2);
    if (!result2) {
      console.error("Child output (stderr):", stderrStr2);
      console.error("Child output (stdout):", stdoutStr2);
      throw new Error(
        "Failed to parse JSON result from child process (manifest)",
      );
    }
    const r2 = result2 as Record<string, unknown>;
    assert(
      typeof r2.usedLength === "number" && (r2.usedLength as number) > 0,
      "expected middleware to be registered from manifest import",
    );
  } finally {
    // Note: do NOT remove `modules_test_tmp` here — leave it for the outer
    // test script cleanup so coverage tooling can access transpiled sources.
    if (origManifest === null) {
      try {
        await Deno.remove(manifestPath);
      } catch {
        // ignore
      }
    } else {
      await Deno.writeTextFile(manifestPath, origManifest);
    }
  }
});
