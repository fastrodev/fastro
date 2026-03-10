import { assertEquals } from "jsr:@std/assert@^1.0.19";
import { rebuild, run, startWatcher } from "./watcher.ts";
import { esbuild, stdPath } from "./deps.ts";
const { join } = stdPath;

const cwd = Deno.cwd();
const modulesDir = join(cwd, "modules");

function createWatcher(
  events: Deno.FsEvent[],
): AsyncIterable<Deno.FsEvent> {
  return {
    async *[Symbol.asyncIterator]() {
      for (const event of events) {
        yield event;
      }
    },
  };
}

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

// run() is a no-op when imported (import.meta.main is false)
Deno.test({
  name: "watcher: run() is no-op when not import.meta.main",
  fn: async () => {
    await run();
  },
});

Deno.test({
  name: "watcher: startWatcher ignores non-relevant events",
  fn: async () => {
    const events: Deno.FsEvent[] = [
      { kind: "access", paths: ["/tmp/ignore"] },
      { kind: "modify", paths: [join(cwd, ".build_tmp", "x.tmp")] },
    ];
    const watcher = createWatcher(events);
    const calls = { rebuild: 0, manifest: 0, timeouts: 0 };

    await startWatcher(
      { watcher },
      {
        setTimeout: (cb: TimerHandler) => {
          calls.timeouts++;
          if (typeof cb === "function") {
            // we don't actually run it here
          }
          return 1;
        },
        clearTimeout: (_id: number | undefined) => {},
        rebuild: (_mods?: string[]) => {
          calls.rebuild++;
          return Promise.resolve();
        },
        generateManifest: () => {
          calls.manifest++;
          return Promise.resolve();
        },
        stat: (_path: string | URL) => {
          return Promise.reject(new Deno.errors.NotFound());
        },
      },
    );

    assertEquals(calls.timeouts, 0);
    assertEquals(calls.rebuild, 0);
    assertEquals(calls.manifest, 0);
  },
});

Deno.test({
  name: "watcher: startWatcher triggers full rebuild when modules lack App/spa",
  fn: async () => {
    const events: Deno.FsEvent[] = [
      {
        kind: "modify",
        paths: [
          join(cwd, "modules", "noapp", "file.ts"),
          join(cwd, "public", "asset.txt"),
        ],
      },
    ];
    const watcher = createWatcher(events);
    const rebuildCalls: Array<string[] | undefined> = [];
    const pending: Promise<void>[] = [];
    let manifestCalls = 0;

    await startWatcher(
      { watcher },
      {
        setTimeout: (cb: TimerHandler) => {
          if (typeof cb === "function") {
            const p = Promise.resolve(cb());
            pending.push(p);
          }
          return 1;
        },
        clearTimeout: (_id: number | undefined) => {},
        rebuild: (mods?: string[]) => {
          rebuildCalls.push(mods);
          return Promise.resolve();
        },
        generateManifest: () => {
          manifestCalls++;
          return Promise.reject(new Error("boom"));
        },
        stat: (_path: string | URL) => {
          return Promise.reject(new Deno.errors.NotFound());
        },
      },
    );

    await Promise.all(pending);
    assertEquals(manifestCalls, 1);
    assertEquals(rebuildCalls.length, 1);
    assertEquals(rebuildCalls[0], undefined);
  },
});

Deno.test({
  name:
    "watcher: startWatcher rebuilds affected modules and skips while rebuilding",
  fn: async () => {
    const mod = "watcher_sw_mod";
    await Deno.mkdir(join(modulesDir, mod), { recursive: true });
    await Deno.writeTextFile(
      join(modulesDir, mod, "App.tsx"),
      "export const App = () => null;",
    );
    const events: Deno.FsEvent[] = [
      { kind: "modify", paths: [join(cwd, "modules", mod, "App.tsx")] },
      { kind: "modify", paths: [join(cwd, "modules", mod, "App.tsx")] },
    ];
    const watcher = createWatcher(events);
    const deferred = createDeferred<void>();
    const rebuildCalls: Array<string[] | undefined> = [];
    const pending: Promise<void>[] = [];

    await startWatcher(
      { watcher },
      {
        setTimeout: (cb: TimerHandler) => {
          if (typeof cb === "function") {
            const p = Promise.resolve(cb());
            pending.push(p);
          }
          return 1;
        },
        clearTimeout: (_id: number | undefined) => {},
        rebuild: async (mods?: string[]) => {
          rebuildCalls.push(mods);
          await deferred.promise;
        },
        generateManifest: () => Promise.resolve(),
        stat: (p: string | URL) => Deno.stat(p),
      },
    );

    assertEquals(rebuildCalls.length, 1);
    const mods = rebuildCalls[0] ?? [];
    assertEquals(mods.includes(mod), true);
    assertEquals(mods.includes("index"), true);

    deferred.resolve();
    await Promise.all(pending);
    await Deno.remove(join(modulesDir, mod), { recursive: true }).catch(
      () => {},
    );
  },
});

Deno.test({
  name: "watcher: startWatcher clears pending timeout on rapid events",
  fn: async () => {
    const mod = "watcher_sw_timeout";
    await Deno.mkdir(join(modulesDir, mod), { recursive: true });
    await Deno.writeTextFile(
      join(modulesDir, mod, "App.tsx"),
      "export const App = () => null;",
    );
    const events: Deno.FsEvent[] = [
      { kind: "modify", paths: [join(cwd, "modules", mod, "App.tsx")] },
      { kind: "modify", paths: [join(cwd, "modules", mod, "App.tsx")] },
    ];
    const watcher = createWatcher(events);
    const callbacks: Array<() => void | Promise<void>> = [];
    const cleared: number[] = [];

    await startWatcher(
      { watcher },
      {
        setTimeout: (cb: TimerHandler) => {
          if (typeof cb === "function") {
            callbacks.push(cb as () => void | Promise<void>);
          }
          return callbacks.length;
        },
        clearTimeout: (id: number | undefined) => {
          if (id) cleared.push(id);
        },
        rebuild: () => Promise.resolve(),
        generateManifest: () => Promise.resolve(),
        stat: (p: string | URL) => Deno.stat(p),
      },
    );

    assertEquals(cleared.length, 1);
    await Promise.resolve(callbacks[callbacks.length - 1]());
    await Deno.remove(join(modulesDir, mod), { recursive: true }).catch(
      () => {},
    );
  },
});

// rebuild with non-existent module: no valid modules -> early return
Deno.test({
  name: "watcher: rebuild(['nonexistent']) skips module with no App/spa",
  fn: async () => {
    await rebuild(["watcher_test_no_such_module_xyz"]);
    const done = join(cwd, ".build_done");
    const exists = await Deno.stat(done).then(() => true).catch(() => false);
    assertEquals(exists, false);
  },
});

// rebuild() all modules: none qualify (only 'blocker' file in modules/) -> writes .build_done
Deno.test({
  name: "watcher: rebuild() all - no qualifying modules, writes .build_done",
  fn: async () => {
    const done = join(cwd, ".build_done");
    await Deno.remove(done).catch(() => {});
    await rebuild();
    const exists = await Deno.stat(done).then(() => true).catch(() => false);
    assertEquals(exists, true);
    await Deno.remove(done).catch(() => {});
  },
});

// rebuild(['mod']) where module has App.tsx -> full build pipeline
Deno.test({
  name: "watcher: rebuild(['mod']) with App.tsx runs full build",
  sanitizeResources: false,
  sanitizeOps: false,
  fn: async () => {
    const mod = "watcher_rebuild_appmod";
    await Deno.mkdir(join(modulesDir, mod), { recursive: true });
    await Deno.writeTextFile(
      join(modulesDir, mod, "App.tsx"),
      "export const App = () => null;",
    );
    const done = join(cwd, ".build_done");
    await Deno.remove(done).catch(() => {});
    try {
      await rebuild([mod]);
      const exists = await Deno.stat(done).then(() => true).catch(() => false);
      assertEquals(exists, true);
    } finally {
      await Deno.remove(done).catch(() => {});
      await Deno.remove(join(modulesDir, mod), { recursive: true }).catch(
        () => {},
      );
      await esbuild.stop();
    }
  },
});

// rebuild(['mod']) where module has spa.tsx (no App.tsx) uses spa stat branch
Deno.test({
  name: "watcher: rebuild(['mod']) with spa.tsx uses spa.tsx branch",
  sanitizeResources: false,
  sanitizeOps: false,
  fn: async () => {
    const mod = "watcher_rebuild_spamod";
    await Deno.mkdir(join(modulesDir, mod), { recursive: true });
    await Deno.writeTextFile(
      join(modulesDir, mod, "spa.tsx"),
      "export default () => null;",
    );
    const done = join(cwd, ".build_done");
    await Deno.remove(done).catch(() => {});
    try {
      await rebuild([mod]);
      const exists = await Deno.stat(done).then(() => true).catch(() => false);
      assertEquals(exists, true);
    } finally {
      await Deno.remove(done).catch(() => {});
      await Deno.remove(join(modulesDir, mod), { recursive: true }).catch(
        () => {},
      );
      await esbuild.stop();
    }
  },
});
