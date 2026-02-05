import { build, createClient, deleteClient, getModulesWithApp } from "./mod.ts";
import { rebuild, startWatcher } from "./watch.ts";
import { performBuild } from "./build.ts";
import { buildSpa } from "./spa.ts";
import { assert } from "@std/assert";

Deno.test(
  {
    permissions: { env: true, read: true, write: true, run: true },
    name: "mod.ts - hit missing branches",
    sanitizeResources: false,
    sanitizeOps: false,
    sanitizeExit: false,
  },
  async (t) => {
    await t.step("getModulesWithApp with spa", async () => {
      const testModule = "spa_mod_test";
      await Deno.mkdir(`./modules/${testModule}`, { recursive: true });
      await Deno.writeTextFile(
        `./modules/${testModule}/spa.tsx`,
        "export const App = () => <div>SPA</div>;",
      );

      const modules = await getModulesWithApp();
      // spa.tsx should now be included
      assert(modules.includes(testModule));

      await Deno.remove(`./modules/${testModule}`, { recursive: true });
    });

    await t.step("build error coverage", async () => {
      // Force an error in esbuild by passing invalid config path maybe?
      // Actually, just calling build with non-existent module already hits catch via plugin
      const res = await build("non_existent_module_for_coverage");
      assert(res === undefined);
    });

    await t.step("catch block coverage", async () => {
      const originalMkdir = Deno.mkdir;
      // @ts-ignore: testing catch block
      Deno.mkdir = () => Promise.reject(new Error("fail"));
      await createClient("fail_client");
      Deno.mkdir = originalMkdir;

      const originalRemove = Deno.remove;
      // @ts-ignore: testing catch block
      Deno.remove = () => Promise.reject(new Error("fail"));
      await deleteClient("fail_delete");
      Deno.remove = originalRemove;
    });

    await t.step("deleteClient with missing file", async () => {
      // Should not throw
      await deleteClient("non_existent_file_to_delete");
    });
  },
);

Deno.test(
  {
    permissions: { env: true, read: true, write: true, run: true },
    name: "scripts coverage",
    sanitizeResources: false,
    sanitizeOps: false,
    sanitizeExit: false,
  },
  async (t) => {
    await t.step("performBuild", async () => {
      await performBuild();
    });

    await t.step("buildSpa", async () => {
      const spaModule = "spa_test_module";
      await Deno.mkdir(`./modules/${spaModule}`, { recursive: true });
      await Deno.writeTextFile(
        `./modules/${spaModule}/spa.tsx`,
        "export const App = () => <div>SPA</div>;",
      );
      await buildSpa();
      await Deno.remove(`./modules/${spaModule}`, { recursive: true });
    });
  },
);

Deno.test(
  {
    permissions: { env: true, read: true, write: true, run: true },
    name: "watch.ts - coverage",
    sanitizeResources: false,
    sanitizeOps: false,
    sanitizeExit: false,
  },
  async (t) => {
    const testModule = "watch_test_module";
    await t.step("setup", async () => {
      await Deno.mkdir(`./modules/${testModule}`, { recursive: true });
      await Deno.writeTextFile(
        `./modules/${testModule}/App.tsx`,
        "export const App = () => <div>Watch</div>;",
      );
    });

    await t.step("rebuild specified module", async () => {
      await rebuild([testModule]);
    });

    await t.step("rebuild all modules", async () => {
      await rebuild();
    });

    await t.step("rebuild empty or invalid", async () => {
      await rebuild([]);
      await rebuild(["invalid_module_no_app"]);
    });

    await t.step("rebuild with spa", async () => {
      const spaModule = "watch_spa_module";
      await Deno.mkdir(`./modules/${spaModule}`, { recursive: true });
      await Deno.writeTextFile(
        `./modules/${spaModule}/spa.tsx`,
        "export const App = () => <div>SPA</div>;",
      );
      await rebuild([spaModule]);
      await Deno.remove(`./modules/${spaModule}`, { recursive: true });
    });

    await t.step("skip recently built", async () => {
      // First build
      await rebuild([testModule]);
      // Second build within cooldown should skip
      await rebuild([testModule]);
    });

    await t.step("catch block coverage in watch", async () => {
      const originalWrite = Deno.writeTextFile;
      // @ts-ignore: testing catch block
      Deno.writeTextFile = (
        p: string,
        data: string,
        options?: Deno.WriteFileOptions,
      ) => {
        if (p === ".build_done") return Promise.reject(new Error("fail"));
        return originalWrite(p, data, options);
      };
      await rebuild([testModule]);
      Deno.writeTextFile = originalWrite;
    });

    await t.step("startWatcher mock", async () => {
      const originalWatchFs = Deno.watchFs;
      // @ts-ignore: mock watcher
      Deno.watchFs = () => {
        return {
          async *[Symbol.asyncIterator]() {
            // Case 1: Module change
            yield {
              kind: "modify",
              paths: [Deno.cwd() + "/modules/" + testModule + "/App.tsx"],
            };
            // Case 2: Component change (triggers full rebuild)
            yield {
              kind: "create",
              paths: [Deno.cwd() + "/core/server.ts"],
            };
            // Case 3: Ignored path
            yield {
              kind: "modify",
              paths: [Deno.cwd() + "/modules/" + testModule + "/Client.tsx"],
            };
            // Case 4: Non-relevant event
            yield {
              kind: "access",
              paths: [Deno.cwd() + "/modules/test/App.tsx"],
            };
          },
          close() {},
        };
      };

      // We also need to mock setTimeout or wait for it
      const originalSetTimeout = setTimeout;
      // @ts-ignore: mock setTimeout to run immediately
      globalThis.setTimeout = (fn: () => void) => {
        fn();
        return 0;
      };

      await startWatcher();

      Deno.watchFs = originalWatchFs;
      // @ts-ignore: restore setTimeout
      globalThis.setTimeout = originalSetTimeout;
    });

    await t.step("cleanup", async () => {
      await Deno.remove(`./modules/${testModule}`, { recursive: true });
      try {
        await Deno.remove(".build_done");
      } catch (_) {
        // ignore
      }
    });
  },
);
