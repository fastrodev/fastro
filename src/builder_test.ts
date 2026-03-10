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

Deno.test({
  name: "builder test",
  sanitizeResources: false,
  sanitizeOps: false,
  fn: async (t) => {
    const cwd = Deno.cwd();

    await t.step("getModulesWithApp - create mock modules", async () => {
      await Deno.mkdir(join(cwd, "modules", "app_mod"), { recursive: true });
      await Deno.writeTextFile(
        join(cwd, "modules", "app_mod", "App.tsx"),
        "export const App = () => <div>App</div>;",
      );

      await Deno.mkdir(join(cwd, "modules", "spa_mod"), { recursive: true });
      await Deno.writeTextFile(
        join(cwd, "modules", "spa_mod", "spa.tsx"),
        "export const Spa = () => <div>Spa</div>;",
      );

      const modules = await getModulesWithApp();
      assertEquals(modules.includes("app_mod"), true);
      assertEquals(modules.includes("spa_mod"), true);

      // Cleanup
      await Deno.remove(join(cwd, "modules", "app_mod"), { recursive: true });
      await Deno.remove(join(cwd, "modules", "spa_mod"), { recursive: true });
    });

    await t.step("createClient and deleteClient", async () => {
      await createClient("app_mod");
      const clientPath = join(cwd, ".build_tmp", "app_mod_Client.tsx");
      const stat = await Deno.stat(clientPath);
      assertEquals(stat.isFile, true);

      await deleteClient("app_mod");
      try {
        await Deno.stat(clientPath);
        assertEquals(false, true, "File should have been deleted");
      } catch (e) {
        assertEquals(e instanceof Deno.errors.NotFound, true);
      }
    });

    await t.step("build handles error gracefully", async () => {
      // Should not throw even if file doesn't exist
      const res = await build("non_existent_module");
      assertEquals(res, undefined);
    });

    await t.step("run function coverage", async () => {
      // Setup minimal modules for run()
      await Deno.mkdir(join(cwd, "modules", "run_mod"), { recursive: true });
      await Deno.writeTextFile(
        join(cwd, "modules", "run_mod", "App.tsx"),
        "export const App = () => <div>Run</div>;",
      );
      await Deno.writeTextFile(
        join(cwd, "modules", "run_mod", "mod.ts"),
        "export const a = 1;",
      );

      // Mock build to avoid actual compilation if possible, but here we just run it and let build() error out safely
      await run();

      // Cleanup
      await Deno.remove(join(cwd, "modules", "run_mod"), { recursive: true });
    });

    // Stop esbuild
    await esbuild.stop();
  },
});
