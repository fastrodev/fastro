import { assertEquals, assertRejects } from "jsr:@std/assert@^1.0.19";
import { generateManifest } from "./generator.ts";
import { stdPath } from "./deps.ts";
const { join } = stdPath;

const cwd = Deno.cwd();
const modulesPath = join(cwd, "modules");

async function setupModules() {
  try {
    await Deno.mkdir(modulesPath, { recursive: true });
  } catch (_) {
    // ignore
  }
}

async function addMod(name: string, withModTs = true) {
  await Deno.mkdir(join(modulesPath, name), { recursive: true });
  if (withModTs) {
    await Deno.writeTextFile(
      join(modulesPath, name, "mod.ts"),
      "export const x = 1;",
    );
  }
}

async function removeMod(name: string) {
  try {
    await Deno.remove(join(modulesPath, name), { recursive: true });
  } catch (_) { // ignore
  }
}

Deno.test("generator: toIdentifier numeric branch (line 13)", async () => {
  await setupModules();
  await addMod("1abc"); // starts with digit = triggers `m_` prefix
  await generateManifest();
  const content = await Deno.readTextFile(join(cwd, "manifest.ts"));
  assertEquals(content.includes("export * as m_1abc"), true);
  await removeMod("1abc");
});

Deno.test("generator: all filter branches in loop (lines 26-28)", async () => {
  await setupModules();

  // Line 26: n === "manifest.ts" -> continue
  await Deno.mkdir(join(modulesPath, "manifest.ts"), { recursive: true });

  // Line 27: n.startsWith("test_") -> continue
  await addMod("test_thing", false);

  // Line 28: IGNORE_RE matches (module\d+) -> continue
  await addMod("module1", false);

  // Normal module that should appear
  await addMod("users");

  await generateManifest();
  const content = await Deno.readTextFile(join(cwd, "manifest.ts"));
  assertEquals(content.includes("export * as users"), true);
  assertEquals(content.includes("module1"), false);
  assertEquals(content.includes("test_thing"), false);

  await removeMod("manifest.ts");
  await removeMod("test_thing");
  await removeMod("module1");
  await removeMod("users");
});

Deno.test("generator: mod.ts not a file (line 32 continue)", async () => {
  await setupModules();
  // Create mod.ts as a directory instead of a file
  await Deno.mkdir(join(modulesPath, "dir_mod", "mod.ts"), { recursive: true });
  await generateManifest();
  const content = await Deno.readTextFile(join(cwd, "manifest.ts"));
  assertEquals(content.includes("dir_mod"), false);
  await removeMod("dir_mod");
});

Deno.test("generator: missing mod.ts (catch continue on line 33-34)", async () => {
  await setupModules();
  await addMod("no_modts", false); // no mod.ts
  await generateManifest();
  const content = await Deno.readTextFile(join(cwd, "manifest.ts"));
  assertEquals(content.includes("no_modts"), false);
  await removeMod("no_modts");
});

Deno.test("generator: sort callback with index and multiple modules (lines 44-47)", async () => {
  await setupModules();
  await addMod("index");
  await addMod("alpha");
  await addMod("zebra");
  await generateManifest();
  const content = await Deno.readTextFile(join(cwd, "manifest.ts"));
  // "index" should sort first
  const indexPos = content.indexOf("export * as index");
  const alphaPos = content.indexOf("export * as alpha");
  assertEquals(indexPos < alphaPos, true);
  await removeMod("index");
  await removeMod("alpha");
  await removeMod("zebra");
});

Deno.test("generator: NotFound error path (inner catch, line 39)", async () => {
  // Rename modules away - Deno.readDir throws NotFound -> caught silently, manifest written empty
  const backup = join(cwd, "modules_bak_notfound");
  try {
    await Deno.remove(backup, { recursive: true });
  } catch (_) { // ignore
  }
  await Deno.rename(modulesPath, backup);
  try {
    await generateManifest(); // should NOT throw
  } finally {
    await Deno.rename(backup, modulesPath);
  }
});

Deno.test("generator: non-NotFound error triggers re-throw (lines 39-41 + outer catch 72-75)", async () => {
  // Replace modules dir with a FILE to cause ENOTDIR (not NotFound) -> inner catch re-throws -> outer catch fires
  const backup = join(cwd, "modules_bak_enotdir");
  try {
    await Deno.remove(backup, { recursive: true });
  } catch (_) { // ignore
  }
  await Deno.rename(modulesPath, backup);
  await Deno.writeTextFile(modulesPath, "not_a_dir");
  try {
    await assertRejects(() => generateManifest(), Error);
  } finally {
    await Deno.remove(modulesPath).catch(() => {});
    await Deno.rename(backup, modulesPath);
  }
});
