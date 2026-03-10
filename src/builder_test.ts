import { assertEquals } from "jsr:@std/assert@^1.0.19";
import {
  build,
  createClient,
  deleteClient,
  getModulesWithApp,
  run,
} from "./builder.ts";
import { esbuild, stdPath } from "./deps.ts";
const { join } = stdPath;

const cwd = Deno.cwd();
const modulesDir = join(cwd, "modules");

async function ensureModules() {
  try {
    await Deno.mkdir(modulesDir, { recursive: true });
  } catch (_) { // ignore 
  }
}

Deno.test({
  name: "builder: createClient writes file, deleteClient removes it",
  sanitizeResources: false,
  sanitizeOps: false,
  fn: async () => {
    await createClient("test_client_rw");
    const p = join(cwd, ".build_tmp", "test_client_rw_Client.tsx");
    const stat = await Deno.stat(p);
    assertEquals(stat.isFile, true);
    await deleteClient("test_client_rw");
    const exists = await Deno.stat(p).then(() => true).catch(() => false);
    assertEquals(exists, false);
    await esbuild.stop();
  },
});

Deno.test({
  name: "builder: deleteClient with non-existent file (catch branch)",
  sanitizeResources: false,
  sanitizeOps: false,
  fn: async () => {
    // Should not throw even if file doesn't exist
    await deleteClient("totally_missing_file");
    await esbuild.stop();
  },
});

Deno.test({
  name: "builder: build success path (normal module)",
  sanitizeResources: false,
  sanitizeOps: false,
  fn: async () => {
    await ensureModules();
    const mod = "bld_success";
    await Deno.mkdir(join(modulesDir, mod), { recursive: true });
    await Deno.writeTextFile(
      join(modulesDir, mod, "App.tsx"),
      "export const App = () => null;",
    );
    await createClient(mod);
    const result = await build(mod);
    assertEquals(typeof result, "object");
    await deleteClient(mod);
    await Deno.remove(join(modulesDir, mod), { recursive: true });
    await esbuild.stop();
  },
});

Deno.test({
  name: "builder: build SPA path (line 9-11)",
  sanitizeResources: false,
  sanitizeOps: false,
  fn: async () => {
    await ensureModules();
    const mod = "bld_spa";
    await Deno.mkdir(join(modulesDir, mod), { recursive: true });
    await Deno.writeTextFile(
      join(modulesDir, mod, "spa.tsx"),
      "export default () => null;",
    );
    const result = await build(mod, true);
    assertEquals(typeof result, "object");
    await Deno.remove(join(modulesDir, mod), { recursive: true });
    await esbuild.stop();
  },
});

Deno.test({
  name: "builder: build error path – no entry file (catch on line 55-57)",
  sanitizeResources: false,
  sanitizeOps: false,
  fn: async () => {
    const result = await build("missing_client_xyz");
    assertEquals(result, undefined);
    await esbuild.stop();
  },
});

Deno.test({
  name: "builder: getModulesWithApp – App.tsx, spa.tsx, and no match",
  sanitizeResources: false,
  sanitizeOps: false,
  fn: async () => {
    await ensureModules();
    await Deno.mkdir(join(modulesDir, "gma_app"), { recursive: true });
    await Deno.writeTextFile(join(modulesDir, "gma_app", "App.tsx"), "");

    await Deno.mkdir(join(modulesDir, "gma_spa"), { recursive: true });
    await Deno.writeTextFile(join(modulesDir, "gma_spa", "spa.tsx"), "");

    await Deno.mkdir(join(modulesDir, "gma_none"), { recursive: true });
    await Deno.writeTextFile(join(modulesDir, "gma_none", "other.ts"), "");

    const modules = await getModulesWithApp();
    assertEquals(modules.includes("gma_app"), true);
    assertEquals(modules.includes("gma_spa"), true);
    assertEquals(modules.includes("gma_none"), false);

    await Deno.remove(join(modulesDir, "gma_app"), { recursive: true });
    await Deno.remove(join(modulesDir, "gma_spa"), { recursive: true });
    await Deno.remove(join(modulesDir, "gma_none"), { recursive: true });
    await esbuild.stop();
  },
});

Deno.test({
  name: "builder: getModulesWithApp – NotFound (modules missing)",
  sanitizeResources: false,
  sanitizeOps: false,
  fn: async () => {
    const backup = join(cwd, "modules_bak_gma");
    try {
      await Deno.remove(backup, { recursive: true });
    } catch (_) { // ignore 
  }
    await Deno.rename(modulesDir, backup);
    try {
      const modules = await getModulesWithApp();
      assertEquals(Array.isArray(modules), true);
      assertEquals(modules.length, 0);
    } finally {
      await Deno.rename(backup, modulesDir);
    }
    await esbuild.stop();
  },
});

Deno.test({
  name: "builder: run() full pipeline – module with App.tsx",
  sanitizeResources: false,
  sanitizeOps: false,
  fn: async () => {
    await ensureModules();
    const mod = "run_modtest";
    await Deno.mkdir(join(modulesDir, mod), { recursive: true });
    await Deno.writeTextFile(
      join(modulesDir, mod, "App.tsx"),
      "export const App = () => null;",
    );
    await Deno.writeTextFile(
      join(modulesDir, mod, "mod.ts"),
      "export const a = 1;",
    );
    await run(); // may log build errors, but should not throw
    await Deno.remove(join(modulesDir, mod), { recursive: true });
    await esbuild.stop();
  },
});
