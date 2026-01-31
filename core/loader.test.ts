import { autoRegisterModules } from "./loader.ts";
import type { Middleware } from "./server.ts";
import { assertEquals } from "@std/assert";
import { stub, assertSpyCalls } from "@std/testing/mock";

const modulesDir = new URL("../modules/", import.meta.url);

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

async function _removeModule(dirName: string) {
    // only remove directories that this test created
    if (!createdDirs.has(dirName)) return;
    const dirUrl = new URL(`${dirName}/`, modulesDir);
    try {
        await Deno.remove(dirUrl, { recursive: true });
        createdDirs.delete(dirName);
    } catch {
        // ignore
    }
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
        const app: App = { use(mw: unknown) { used.push(mw); } };

        const readDirStub = stubReadDirWith([dirName]);
        const logStub = stub(console, "log", () => { });
        const warnStub = stub(console, "warn", () => { });

        try {
            await autoRegisterModules(app);

            assertEquals(used.length, 1);
            assertEquals(typeof used[0], "function");
            assertSpyCalls(logStub, 1);
            assertSpyCalls(warnStub, 0);
            const msg = logStub.calls[0].args[0] as string;
            assertEquals(msg, `Registered default export from ${dirName}/mod.ts`);
        } finally {
            readDirStub.restore();
            logStub.restore();
            warnStub.restore();
            // await removeModule(dirName); // commented out to avoid deleting files for coverage
        }
    });

    await t.step("registers named export that matches directory name", async () => {
        const dirName = randName("test_mod_named");
        await writeModule(
            dirName,
            `
        export const ${dirName} = () => {};
      `,
        );

        const used: unknown[] = [];
        const app: App = { use(mw: unknown) { used.push(mw); } };

        const readDirStub = stubReadDirWith([dirName]);
        const logStub = stub(console, "log", () => { });
        const warnStub = stub(console, "warn", () => { });

        try {
            await autoRegisterModules(app);

            assertEquals(used.length, 1);
            assertEquals(typeof used[0], "function");
            assertSpyCalls(logStub, 1);
            assertSpyCalls(warnStub, 0);
            const msg = logStub.calls[0].args[0] as string;
            assertEquals(msg, `Registered ${dirName} export from ${dirName}/mod.ts`);
        } finally {
            readDirStub.restore();
            logStub.restore();
            warnStub.restore();
            // await removeModule(dirName); // commented out to avoid deleting files for coverage
        }
    });

    await t.step("warns when no valid export is found", async () => {
        const dirName = randName("test_mod_invalid");
        await writeModule(
            dirName,
            `
        export const somethingElse = () => {};
      `,
        );

        const used: unknown[] = [];
        const app: App = { use(_mw: unknown) { used.push(_mw); } };

        const readDirStub = stubReadDirWith([dirName]);
        const logStub = stub(console, "log", () => { });
        const warnStub = stub(console, "warn", () => { });

        try {
            await autoRegisterModules(app);

            assertEquals(used.length, 0);
            assertSpyCalls(logStub, 0);
            assertSpyCalls(warnStub, 1);
            const msg = warnStub.calls[0].args[0] as string;
            assertEquals(msg, `No valid export found in ${dirName}/mod.ts`);
        } finally {
            readDirStub.restore();
            logStub.restore();
            warnStub.restore();
            // await removeModule(dirName); // commented out to avoid deleting files for coverage
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
        const app: App = { use(_mw: unknown) { used.push(_mw); } };

        const readDirStub = stubReadDirWith([dirName]);
        const logStub = stub(console, "log", () => { });
        const warnStub = stub(console, "warn", () => { });

        try {
            await autoRegisterModules(app);

            assertEquals(used.length, 0);
            // No log or warn is expected for import errors
            assertSpyCalls(logStub, 0);
            assertSpyCalls(warnStub, 0);
        } finally {
            readDirStub.restore();
            logStub.restore();
            warnStub.restore();
            // await removeModule(dirName); // commented out to avoid deleting files for coverage
        }
    });

    await t.step("registers multiple modules from directory", async () => {
        const a = randName("test_multi_a");
        const b = randName("test_multi_b");
        await writeModule(a, `export default function a() {}`);
        await writeModule(b, `export const ${b} = () => {};`);

        const used: unknown[] = [];
        const app: App = { use(mw: unknown) { used.push(mw); } };

        const readDirStub = stubReadDirWith([a, b]);
        const logStub = stub(console, "log", () => { });
        const warnStub = stub(console, "warn", () => { });

        try {
            await autoRegisterModules(app);

            assertEquals(used.length, 2);
            assertSpyCalls(logStub, 2);
            assertSpyCalls(warnStub, 0);
        } finally {
            readDirStub.restore();
            logStub.restore();
            warnStub.restore();
            // await removeModule(a); // commented out to avoid deleting files for coverage
            // await removeModule(b); // commented out to avoid deleting files for coverage
        }
    });
});