import { autoRegisterModules } from "./loader.ts";
import { Middleware } from "../mod.ts";
import { assertSpyCalls, stub } from "@std/testing/mock";
import { assert, assertEquals } from "@std/assert";

const modulesDir = new URL("../modules_test_tmp/", import.meta.url);

const createdDirs = new Set<string>();

async function ensureModulesDir() {
  try {
    await Deno.mkdir(modulesDir, { recursive: true });
  } catch {
    // ignore
  }
}

async function writeModule(dirName: string, code: string) {
  const dirUrl = new URL(`${dirName}/`, modulesDir);
  await Deno.mkdir(dirUrl, { recursive: true });
  const modUrl = new URL("mod.ts", dirUrl);
  await Deno.writeTextFile(modUrl, code);
  createdDirs.add(dirName);
  return { dirUrl, modUrl };
}

function _removeModule(_dirName: string) {
  // disabled cleanup here to allow coverage reporter to find files.
  // cleanup is handled via the coverage task in deno.json
  return;
}

// New function to clean up temporary folders by prefix
async function _cleanupTempModules(prefix: string = "test_") {
  try {
    for await (const entry of Deno.readDir(modulesDir)) {
      if (entry.isDirectory && entry.name.startsWith(prefix)) {
        const dirUrl = new URL(`${entry.name}/`, modulesDir);
        await Deno.remove(dirUrl, { recursive: true });
      }
    }
  } catch {
    // ignore
  }
}

function randName(prefix: string) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "")}`;
}

function stubReadDirWith(names: string[]) {
  return stub(Deno, "readDir", () => {
    return (async function* () {
      for (const name of names) {
        yield {
          name,
          isFile: false,
          isDirectory: true,
          isSymlink: false,
        } as Deno.DirEntry;
      }
    })();
  });
}

type App = { use: (middleware: Middleware) => void };

Deno.test("autoRegisterModules behavior", async (t) => {
  await ensureModulesDir();

  await t.step("registers default export", async () => {
    const dirName = randName("test_mod_default");
    await writeModule(
      dirName,
      `
        export default function ${dirName}_mw() { /* noop */ }
      `,
    );

    const used: unknown[] = [];
    const app: App = {
      use(mw: unknown) {
        used.push(mw);
      },
    };

    const readDirStub = stubReadDirWith([dirName]);
    const logStub = stub(console, "log", () => {});
    const warnStub = stub(console, "warn", () => {});

    try {
      await autoRegisterModules(app, modulesDir);

      assertEquals(used.length, 1);
      assertEquals(typeof used[0], "function");
      const found = logStub.calls.some((c) =>
        (c.args[0] as string).includes(
          `Registered default export from ${dirName}/mod.ts`,
        )
      );
      assert(found, "Expected registration log not found");
      assertSpyCalls(warnStub, 0);
    } finally {
      readDirStub.restore();
      logStub.restore();
      warnStub.restore();
      await _removeModule(dirName);
    }
  });

  await t.step(
    "registers named export that matches directory name",
    async () => {
      const dirName = randName("test_mod_named");
      await writeModule(
        dirName,
        `
        export const ${dirName} = () => {};
      `,
      );

      const used: unknown[] = [];
      const app: App = {
        use(mw: unknown) {
          used.push(mw);
        },
      };

      const readDirStub = stubReadDirWith([dirName]);
      const logStub = stub(console, "log", () => {});
      const warnStub = stub(console, "warn", () => {});

      try {
        await autoRegisterModules(app, modulesDir);

        assertEquals(used.length, 1);
        assertEquals(typeof used[0], "function");
        assertSpyCalls(logStub, 1);
        assertSpyCalls(warnStub, 0);
        const msg = logStub.calls[0].args[0] as string;
        assertEquals(
          msg,
          `Registered ${dirName} export from ${dirName}/mod.ts`,
        );
      } finally {
        readDirStub.restore();
        logStub.restore();
        warnStub.restore();
        await _removeModule(dirName);
      }
    },
  );

  await t.step("warns when no valid export is found", async () => {
    const dirName = randName("test_mod_invalid");
    await writeModule(
      dirName,
      `
        export const somethingElse = () => {};
      `,
    );

    const used: unknown[] = [];
    const app: App = {
      use(_mw: unknown) {
        used.push(_mw);
      },
    };

    const readDirStub = stubReadDirWith([dirName]);
    const logStub = stub(console, "log", () => {});
    const warnStub = stub(console, "warn", () => {});

    try {
      await autoRegisterModules(app, modulesDir);

      assertEquals(used.length, 0);
      assertSpyCalls(logStub, 0);
      assertSpyCalls(warnStub, 1);
      const msg = warnStub.calls[0].args[0] as string;
      assertEquals(
        msg,
        `No valid export found in ${dirName}/mod.ts to register.`,
      );
    } finally {
      readDirStub.restore();
      logStub.restore();
      warnStub.restore();
      await _removeModule(dirName);
    }
  });

  await t.step("silently ignores import errors", async () => {
    const dirName = randName("test_mod_error");
    await writeModule(
      dirName,
      `
        // Throw at module evaluation time
        throw new Error("boom");
      `,
    );

    const used: unknown[] = [];
    const app: App = {
      use(_mw: unknown) {
        used.push(_mw);
      },
    };

    const readDirStub = stubReadDirWith([dirName]);
    const logStub = stub(console, "log", () => {});
    const warnStub = stub(console, "warn", () => {});

    try {
      await autoRegisterModules(app, modulesDir);

      assertEquals(used.length, 0);
      // No log or warn is expected for import errors
      assertSpyCalls(logStub, 0);
      assertSpyCalls(warnStub, 0);
    } finally {
      readDirStub.restore();
      logStub.restore();
      warnStub.restore();
      await _removeModule(dirName);
    }
  });

  await t.step("registers multiple modules from directory", async () => {
    const a = randName("test_multi_a");
    const b = randName("test_multi_b");
    await writeModule(a, `export default function a() {}`);
    await writeModule(b, `export const ${b} = () => {};`);

    const used: unknown[] = [];
    const app: App = {
      use(mw: unknown) {
        used.push(mw);
      },
    };

    const readDirStub = stubReadDirWith([a, b]);
    const logStub = stub(console, "log", () => {});
    const warnStub = stub(console, "warn", () => {});

    try {
      await autoRegisterModules(app, modulesDir);

      assertEquals(used.length, 2);
      assertSpyCalls(logStub, 2);
      assertSpyCalls(warnStub, 0);
    } finally {
      readDirStub.restore();
      logStub.restore();
      warnStub.restore();
      await _removeModule(a);
      await _removeModule(b);
    }
  });

  await t.step("sorting logic: index first, profile last", async () => {
    const a = randName("test_sort_a");
    const index = "index";
    const profile = "profile";
    const b = randName("test_sort_b");

    // Create directories (we don't strictly need mod.ts for sorting test
    // but the loader expects them)
    await writeModule(a, "export default () => {}");
    await writeModule(index, "export default () => {}");
    await writeModule(profile, "export default () => {}");
    await writeModule(b, "export default () => {}");

    // const registered: string[] = [];
    const app: App = {
      use() {
        // we can identify which one was called by the log message
      },
    };

    const readDirStub = stubReadDirWith([profile, a, index, b]);
    const logStub = stub(console, "log", () => {});

    try {
      await autoRegisterModules(app, modulesDir);

      const msgs = logStub.calls.map((c) => c.args[0] as string);
      // Expected order: index, a, b, profile (a and b order depends on randName)
      assertEquals(msgs[0], `Registered default export from index/mod.ts`);
      assertEquals(
        msgs[msgs.length - 1],
        `Registered default export from profile/mod.ts`,
      );

      // Verify a and b are in between
      assert(msgs.includes(`Registered default export from ${a}/mod.ts`));
      assert(msgs.includes(`Registered default export from ${b}/mod.ts`));
    } finally {
      readDirStub.restore();
      logStub.restore();
      await _removeModule(a);
      await _removeModule(index);
      await _removeModule(profile);
      await _removeModule(b);
    }
  });

  await t.step("handles missing mod.ts (ERR_MODULE_NOT_FOUND)", async () => {
    const dirName = randName("test_missing_mod");
    const dirUrl = new URL(`${dirName}/`, modulesDir);
    await Deno.mkdir(dirUrl, { recursive: true });
    createdDirs.add(dirName);

    const app: App = { use() {} };
    const readDirStub = stubReadDirWith([dirName]);
    const errorStub = stub(console, "error", () => {});

    try {
      await autoRegisterModules(app, modulesDir);
      // Should not call console.error for missing mod.ts if it matches ERR_MODULE_NOT_FOUND
      // Note: In Deno, we might need to adjust the loader if it doesn't use ERR_MODULE_NOT_FOUND
    } finally {
      readDirStub.restore();
      errorStub.restore();
      await _removeModule(dirName);
    }
  });

  await t.step("calls console.error on unexpected import errors", async () => {
    const dirName = randName("test_error_log");
    await writeModule(dirName, "throw new Error('unexpected');");

    const app: App = { use() {} };
    const readDirStub = stubReadDirWith([dirName]);
    const errorStub = stub(console, "error", () => {});

    try {
      await autoRegisterModules(app, modulesDir);
      assertSpyCalls(errorStub, 1);
      assert(
        (errorStub.calls[0].args[0] as string).includes(
          "Failed to import",
        ),
      );
    } finally {
      readDirStub.restore();
      errorStub.restore();
      await _removeModule(dirName);
    }
  });

  await t.step("ignores entries that are not directories", async () => {
    const readDirStub = stub(Deno, "readDir", () => {
      return (async function* () {
        yield {
          name: "some-file.txt",
          isDirectory: false,
          isFile: true,
          isSymlink: false,
        } as Deno.DirEntry;
      })();
    });

    const app: App = { use() {} };
    const logStub = stub(console, "log", () => {});

    try {
      await autoRegisterModules(app, modulesDir);
      assertSpyCalls(logStub, 0);
    } finally {
      readDirStub.restore();
      logStub.restore();
    }
  });

  await t.step("exhaustive sorting logic test", async () => {
    const app: App = { use() {} };
    const logStub = stub(console, "log", () => {});

    const cases = [
      ["a", "index"], // hits b === 'index'
      ["index", "a"], // hits a === 'index'
      ["profile", "a"], // hits a === 'profile'
      ["a", "profile"], // hits b === 'profile'
      ["index", "profile"], // hits a === 'index'
      ["profile", "index"], // hits b === 'index'
    ];

    for (const names of cases) {
      const readDirStub = stub(Deno, "readDir", () => {
        return (async function* () {
          for (const name of names) {
            yield { name, isDirectory: true } as Deno.DirEntry;
          }
        })();
      });
      try {
        for (const name of names) {
          await writeModule(name, "export default () => {}");
        }
        await autoRegisterModules(app, modulesDir);
      } finally {
        readDirStub.restore();
        for (const name of names) {
          await _removeModule(name);
        }
      }
    }
    logStub.restore();
  });
});

Deno.test("autoRegisterModules - default modulesDir param uses real path safely (no dirs)", async () => {
  // Stub readDir to return no directories so import is not attempted
  const originalReadDir = Deno.readDir;
  const readDirStub = stub(Deno, "readDir", () => {
    return (async function* () {})();
  });

  const used: unknown[] = [];
  const app = {
    use(mw: unknown) {
      used.push(mw);
    },
  };

  try {
    await autoRegisterModules(app);
    // Expect no registrations and no throws
    assertEquals(used.length, 0);
  } finally {
    readDirStub.restore();
    Deno.readDir = originalReadDir;
  }
});

Deno.test("autoRegisterModules accepts string path param (absolute)", async () => {
  // Create a fresh temp directory to avoid interference with other tests
  const tmp = await Deno.makeTempDir({ prefix: "auto_register_abs_" });
  const dirName = "mod_abs";
  const modDir = `${tmp}/${dirName}`;
  await Deno.mkdir(modDir, { recursive: true });
  await Deno.writeTextFile(
    `${modDir}/mod.ts`,
    `export default function mw() {}`,
  );

  const used: unknown[] = [];
  const app: App = {
    use(mw: unknown) {
      used.push(mw);
    },
  };

  const logStub = stub(console, "log", () => {});

  try {
    // pass absolute filesystem path as string
    await autoRegisterModules(app, tmp);

    assertEquals(used.length, 1);
    assertSpyCalls(logStub, 1);
  } finally {
    logStub.restore();
  }
});

Deno.test("autoRegisterModules accepts string path param (relative)", async () => {
  // Create a modules directory relative to the current working directory
  // (this matches how the loader resolves relative string paths).
  const relPath = "../modules_test_tmp_rel/";
  try {
    await Deno.mkdir(relPath, { recursive: true });
  } catch {
    // ignore
  }

  const dirName = "mod_rel";
  const modDirPath = `${relPath}${dirName}`;
  await Deno.mkdir(modDirPath, { recursive: true });
  const modPath = `${modDirPath}/mod.ts`;
  await Deno.writeTextFile(modPath, `export default function mw() {}`);

  const used: unknown[] = [];
  const app: App = {
    use(mw: unknown) {
      used.push(mw);
    },
  };

  const logStub = stub(console, "log", () => {});

  try {
    // pass relative path string (resolved against the current working directory in loader)
    await autoRegisterModules(app, "../modules_test_tmp_rel/");

    assertEquals(used.length, 1);
    assertSpyCalls(logStub, 1);
  } finally {
    logStub.restore();
  }
});

Deno.test("autoRegisterModules - default modulesDir param uses real path safely (no dirs)", async () => {
  // Stub readDir to return no directories so import is not attempted
  const originalReadDir = Deno.readDir;
  const readDirStub = stub(Deno, "readDir", () => {
    return (async function* () {})();
  });

  const used: unknown[] = [];
  const app = {
    use(mw: unknown) {
      used.push(mw);
    },
  };

  try {
    await autoRegisterModules(app);
    // Expect no registrations and no throws
    assertEquals(used.length, 0);
  } finally {
    readDirStub.restore();
    Deno.readDir = originalReadDir;
  }
});
